import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req) {
  const cookieStore = await cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const body = await req.json();
    const { action, exerciseId } = body;

    // Fetch current preferences
    const { data: profile, error: fetchError } = await supabase
      .from('profiles')
      .select('exercise_preferences')
      .eq('id', session.user.id)
      .single();

    if (fetchError) throw fetchError;

    let prefs = profile.exercise_preferences || { favorites: [], excluded: [] };
    if (!Array.isArray(prefs.favorites)) prefs.favorites = [];
    if (!Array.isArray(prefs.excluded)) prefs.excluded = [];

    if (action === 'toggle_favorite') {
      if (prefs.favorites.includes(exerciseId)) {
        prefs.favorites = prefs.favorites.filter(id => id !== exerciseId);
      } else {
        prefs.favorites.push(exerciseId);
        // Remove from excluded if they favorited it
        prefs.excluded = prefs.excluded.filter(id => id !== exerciseId);
      }
    } else if (action === 'toggle_exclude') {
      if (prefs.excluded.includes(exerciseId)) {
        prefs.excluded = prefs.excluded.filter(id => id !== exerciseId);
      } else {
        prefs.excluded.push(exerciseId);
        // Remove from favorites if they excluded it
        prefs.favorites = prefs.favorites.filter(id => id !== exerciseId);
      }
    } else {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    const { error: updateError } = await supabase
      .from('profiles')
      .update({ exercise_preferences: prefs })
      .eq('id', session.user.id);

    if (updateError) throw updateError;

    return NextResponse.json({ success: true, exercise_preferences: prefs });

  } catch (error) {
    console.error('API /api/profile/preferences error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
