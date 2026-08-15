import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generateNutritionPlan } from '@/lib/gemini';
import { getCached, setCached } from '@/lib/redis';

export const dynamic = 'force-dynamic';

/**
 * Calculates BMR and daily calorie targets using Mifflin-St Jeor
 * and activity level multipliers, then queries Gemini for meal plans.
 */
export async function POST(req) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // 1. Session verification
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized session' }, { status: 401 });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { profile } = body;

    if (!profile) {
      return NextResponse.json({ error: 'Missing user profile data' }, { status: 400 });
    }

    const {
      age,
      gender,
      height,
      weight,
      body_type,
      fitness_goal,
      activity_level,
    } = profile;

    // 2. Compute BMR using Mifflin-St Jeor
    let bmr = 0;
    if (gender?.toLowerCase() === 'female') {
      bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    } else {
      // Default to male or neutral calculation
      bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    }

    // 3. Compute TDEE (Total Daily Energy Expenditure) based on activity multiplier
    let multiplier = 1.2; // default sedentary
    if (activity_level === 'moderate') multiplier = 1.375;
    else if (activity_level === 'active') multiplier = 1.55;
    else if (activity_level === 'very_active') multiplier = 1.725;

    const tdee = Math.round(bmr * multiplier);

    // 4. Adjust daily target calories based on goal
    let targetCalories = tdee;
    if (fitness_goal === 'lose_weight') {
      targetCalories = Math.round(tdee * 0.8); // 20% deficit
    } else if (fitness_goal === 'build_muscle') {
      targetCalories = Math.round(tdee * 1.1); // 10% surplus
    }

    // Ensure target calories are within safe metabolic parameters (minimum 1200 kcal)
    targetCalories = Math.max(1200, targetCalories);

    // 5. Query Redis cache first
    const cacheKey = `nutrition_${userId}_${body_type}_${fitness_goal}`;
    const cachedPlan = await getCached(cacheKey);

    if (cachedPlan) {
      return NextResponse.json({
        success: true,
        plan: cachedPlan,
        targetCalories,
        bmr,
        tdee,
        fromCache: true,
      });
    }

    // 6. Cache Miss: generate plan from Gemini
    const aiPlan = await generateNutritionPlan(profile, targetCalories);

    if (!aiPlan) {
      return NextResponse.json({ error: 'AI generation returned blank meal plan' }, { status: 502 });
    }

    // 7. Save to Supabase nutrition_plans table (deactivating past plans)
    // Deactivate previous active plans
    await supabase
      .from('nutrition_plans')
      .update({ is_active: false })
      .eq('user_id', userId);

    // Parse macros or fallback
    const protein = aiPlan.macros?.protein || Math.round((targetCalories * 0.3) / 4);
    const carbs = aiPlan.macros?.carbs || Math.round((targetCalories * 0.4) / 4);
    const fat = aiPlan.macros?.fat || Math.round((targetCalories * 0.3) / 9);

    // Insert new active plan
    const { error: dbError } = await supabase.from('nutrition_plans').insert({
      user_id: userId,
      plan_name: aiPlan.plan_name || 'My Customized Nutrition Plan',
      daily_calories: targetCalories,
      protein_grams: protein,
      carbs_grams: carbs,
      fat_grams: fat,
      meal_plan: aiPlan,
      is_active: true,
    });

    if (dbError) {
      console.error('Supabase Nutrition DB Insert Error:', dbError);
    }

    // 8. Cache in Redis for 7 days (604800 seconds)
    await setCached(cacheKey, aiPlan, 604800);

    return NextResponse.json({
      success: true,
      plan: aiPlan,
      targetCalories,
      bmr,
      tdee,
      fromCache: false,
    });
  } catch (error) {
    console.error('API /api/nutrition-plan error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error generating calorie menu' },
      { status: 500 }
    );
  }
}
