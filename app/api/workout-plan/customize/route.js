import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { findReplacements, validateWorkoutChange } from '@/lib/customizer';
import { EXERCISE_DATABASE } from '@/lib/exercises';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action, targetExerciseId, currentSessionExercises, newExercises, originalExercises, updatedPlan, profile } = body;

    // Action 1: Get Replacement Candidates
    if (action === 'get_replacements') {
      const { recommended, others } = findReplacements(targetExerciseId, profile, currentSessionExercises);
      return NextResponse.json({ success: true, recommended, others });
    }

    // Action 2: Validate a Change
    if (action === 'validate_change') {
      const warnings = validateWorkoutChange(newExercises, originalExercises);
      return NextResponse.json({ success: true, warnings });
    }

    // Action 3: Save Customized Plan
    if (action === 'save_workout') {
      if (!updatedPlan) return NextResponse.json({ error: 'Missing plan data' }, { status: 400 });
      
      const { error: updateError } = await supabase
        .from('workout_plans')
        .update({ 
          plan_data: updatedPlan,
          // We don't overwrite plan_name, but we could mark it as customized
        })
        .eq('user_id', session.user.id)
        .eq('is_active', true);

      if (updateError) throw updateError;
      
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });

  } catch (error) {
    console.error('API /api/workout-plan/customize error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
