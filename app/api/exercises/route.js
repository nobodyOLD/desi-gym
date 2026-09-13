import { NextResponse } from 'next/server';
import { EXERCISE_DATABASE } from '@/lib/exercises';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search')?.toLowerCase();
    const muscle = searchParams.get('muscle')?.toLowerCase();
    const equipment = searchParams.get('equipment')?.toLowerCase();
    const pattern = searchParams.get('pattern')?.toLowerCase();
    
    let filtered = [...EXERCISE_DATABASE];

    if (search) {
      filtered = filtered.filter(ex => 
        ex.name.toLowerCase().includes(search) || 
        (ex.aliases && ex.aliases.some(a => a.toLowerCase().includes(search)))
      );
    }

    if (muscle && muscle !== 'all') {
      filtered = filtered.filter(ex => 
        ex.primary_muscles.some(m => m.toLowerCase() === muscle) ||
        (ex.secondary_muscles && ex.secondary_muscles.some(m => m.toLowerCase() === muscle))
      );
    }

    if (equipment && equipment !== 'all') {
      filtered = filtered.filter(ex => ex.equipment.toLowerCase() === equipment);
    }

    if (pattern && pattern !== 'all') {
      filtered = filtered.filter(ex => ex.movement_patterns.includes(pattern));
    }

    return NextResponse.json({ success: true, exercises: filtered });
  } catch (error) {
    console.error('Error in /api/exercises:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
