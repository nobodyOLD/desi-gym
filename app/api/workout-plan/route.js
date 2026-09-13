import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { generateWorkoutPlan } from '@/lib/gemini';
import { getCached, setCached } from '@/lib/redis';

export const dynamic = 'force-dynamic';

/**
 * API Route handler to get/generate customized workout plans
 */
export async function POST(req) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    // 1. Authenticate user session
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

    const { body_type, fitness_goal } = profile;

    // 2. Check Upstash Redis cache first
    const cacheKey = `workout_${userId}_${body_type}_${fitness_goal}`;
    const cachedPlan = await getCached(cacheKey);

    if (cachedPlan) {
      return NextResponse.json({
        success: true,
        plan: cachedPlan,
        fromCache: true,
      });
    }

    // 3. Cache Miss: Query Gemini to build the plan
    const aiPlan = await generateWorkoutPlan(profile);

    if (!aiPlan) {
      return NextResponse.json({ error: 'AI generation returned blank plan' }, { status: 502 });
    }

    // 4. Save to Supabase workout_plans table (deactivating past splits)
    // First, deactivate any active workouts
    await supabase
      .from('workout_plans')
      .update({ is_active: false })
      .eq('user_id', userId);

    // Save the new active workout plan
    const { error: dbError } = await supabase.from('workout_plans').insert({
      user_id: userId,
      plan_name: aiPlan.plan_name || 'My Gemini Hypertrophy Plan',
      plan_data: aiPlan,
      difficulty: profile.fitness_level || 'Intermediate',
      is_active: true,
    });

    if (dbError) {
      console.error('Supabase DB Insert Error:', dbError);
      // Proceed to cache and return even if db saving failed slightly
    }

    // 5. Save in Redis for 7 days (604800 seconds)
    await setCached(cacheKey, aiPlan, 604800);

    return NextResponse.json({
      success: true,
      plan: aiPlan,
      fromCache: false,
    });
  } catch (error) {
    console.error('API /api/workout-plan error:', error);
    return NextResponse.json(
      { error: error.message || 'Server error generating workout split' },
      { status: 500 }
    );
  }
}
