import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const libPath = path.join(__dirname, 'lib', 'exercises.js');

async function run() {
  const { EXERCISE_DATABASE } = await import( 'file://' + libPath );
  
  const rawData = `
Barbell Bench Press | horizontal push | compound | barbell, bench, rack | 6-10 | 120s | Dumbbell Bench Press, Smith Machine Bench Press, Machine Chest Press
Cable Fly | horizontal push | isolation | cable_machine | 10-15 | 75s | Pec Deck, Dumbbell Fly
Dumbbell Bench Press | horizontal push | compound | dumbbells, bench | 8-12 | 120s | Barbell Bench Press, Machine Chest Press, Smith Machine Bench Press
Dumbbell Fly | horizontal push | isolation | dumbbells, bench | 10-15 | 75s | Cable Fly, Pec Deck
Incline Barbell Press | horizontal push | compound | barbell, incline_bench, rack | 6-10 | 120s | Incline Dumbbell Press
Incline Dumbbell Press | horizontal push | compound | dumbbells, incline_bench | 8-12 | 120s | Incline Barbell Press
Machine Chest Press | horizontal push | compound | machine | 8-15 | 90s | Barbell Bench Press, Dumbbell Bench Press
Pec Deck | horizontal push | isolation | machine | 10-15 | 75s | Cable Fly, Dumbbell Fly
Push-up | horizontal push | compound | bodyweight | 10-20 | 90s | Dumbbell Bench Press, Machine Chest Press
Smith Machine Bench Press | horizontal push | compound | smith_machine, bench | 8-12 | 90s | Dumbbell Bench Press, Machine Chest Press
Assisted Pull-up | vertical pull | compound | assisted_pullup_machine | 8-12 | 90s | Lat Pulldown, Pull-up
Dumbbell Row | horizontal pull | compound | dumbbells, bench | 8-12 | 90s | Chest-Supported Row, Seated Cable Row
Lat Pulldown | vertical pull | compound | cable_machine | 8-12 | 90s | Pull-up, Neutral-Grip Pulldown, Assisted Pull-up
Neutral-Grip Pulldown | vertical pull | compound | cable_machine | 8-12 | 90s | Lat Pulldown
Pull-up | vertical pull | compound | pullup_bar | 6-12 | 120s | Assisted Pull-up, Lat Pulldown
Barbell Row | horizontal pull | compound | barbell | 6-10 | 120s | Chest-Supported Row, Dumbbell Row
Chest-Supported Row | horizontal pull | compound | machine_or_bench_incline, dumbbells | 8-12 | 90s | Dumbbell Row, Seated Cable Row, Machine Row
Inverted Row | horizontal pull | compound | bar_or_rings, bodyweight | 10-15 | 90s | Dumbbell Row, Chest-Supported Row
Machine Row | horizontal pull | compound | machine | 8-12 | 90s | Seated Cable Row, Chest-Supported Row
Seated Cable Row | horizontal pull | compound | cable_machine | 8-12 | 90s | Chest-Supported Row, Machine Row
T-Bar Row | horizontal pull | compound | tbar_or_landmine | 6-10 | 105s | Barbell Row, Chest-Supported Row
Arnold Press | vertical push | compound | dumbbells | 8-12 | 105s | Dumbbell Shoulder Press
Barbell Overhead Press | vertical push | compound | barbell, rack | 6-10 | 120s | Dumbbell Shoulder Press, Machine Shoulder Press
Dumbbell Shoulder Press | vertical push | compound | dumbbells | 8-12 | 105s | Barbell Overhead Press, Machine Shoulder Press, Arnold Press
Machine Shoulder Press | vertical push | compound | machine | 8-12 | 90s | Dumbbell Shoulder Press, Barbell Overhead Press
Pike Push-up | vertical push | compound | bodyweight | 8-15 | 90s | Dumbbell Shoulder Press, Machine Shoulder Press
Cable Lateral Raise | shoulder abduction | isolation | cable_machine | 12-20 | 60s | Dumbbell Lateral Raise, Machine Lateral Raise
Dumbbell Lateral Raise | shoulder abduction | isolation | dumbbells | 12-20 | 60s | Cable Lateral Raise, Machine Lateral Raise
Machine Lateral Raise | shoulder abduction | isolation | machine | 12-20 | 60s | Dumbbell Lateral Raise, Cable Lateral Raise
Cable Rear-Delt Fly | rear delt isolation | isolation | cable_machine | 12-20 | 60s | Reverse Pec Deck, Dumbbell Rear-Delt Fly
Dumbbell Rear-Delt Fly | rear delt isolation | isolation | dumbbells, bench | 12-20 | 60s | Reverse Pec Deck, Cable Rear-Delt Fly
Face Pull | rear delt isolation | isolation | cable_machine, rope_attachment | 12-20 | 60s | Cable Rear-Delt Fly, Reverse Pec Deck
Reverse Pec Deck | rear delt isolation | isolation | machine | 12-20 | 60s | Cable Rear-Delt Fly, Dumbbell Rear-Delt Fly
Barbell Shrug | vertical pull | isolation | barbell | 10-15 | 60s | Dumbbell Shrug
Dumbbell Shrug | vertical pull | isolation | dumbbells | 10-15 | 60s | Barbell Shrug
Barbell Curl | elbow flexion | isolation | barbell | 8-15 | 60s | EZ-Bar Curl, Dumbbell Curl
Cable Curl | elbow flexion | isolation | cable_machine | 10-15 | 60s | EZ-Bar Curl, Dumbbell Curl
Dumbbell Curl | elbow flexion | isolation | dumbbells | 8-15 | 60s | EZ-Bar Curl, Hammer Curl
EZ-Bar Curl | elbow flexion | isolation | ez_bar | 8-15 | 60s | Barbell Curl, Dumbbell Curl, Cable Curl
Hammer Curl | elbow flexion | isolation | dumbbells | 10-15 | 60s | Dumbbell Curl, Cable Curl
Incline Dumbbell Curl | elbow flexion | isolation | dumbbells, incline_bench | 10-15 | 60s | Dumbbell Curl
Assisted Dip | horizontal push | compound | assisted_dip_machine | 8-12 | 90s | Parallel-Bar Dip, Triceps Pushdown
Close-Grip Bench Press | horizontal push | compound | barbell, bench | 6-10 | 105s | Assisted Dip, Parallel-Bar Dip
Overhead Triceps Extension | elbow extension | isolation | dumbbells, cable_machine | 10-15 | 60s | Triceps Pushdown, Skull Crusher
Parallel-Bar Dip | horizontal push | compound | dip_bars | 6-12 | 120s | Assisted Dip, Close-Grip Bench Press
Skull Crusher | elbow extension | isolation | ez_bar, bench | 8-12 | 75s | Triceps Pushdown, Overhead Triceps Extension
Triceps Pushdown | elbow extension | isolation | cable_machine | 10-15 | 60s | Overhead Triceps Extension, Skull Crusher
Farmer's Carry | hip dominant | compound | dumbbells, kettlebells | 30-40 sec per set | 90s | 
Reverse Curl | elbow flexion | isolation | ez_bar, barbell, dumbbells | 10-15 | 60s | Hammer Curl
Reverse Wrist Curl | elbow extension | isolation | barbell, dumbbells, bench | 12-20 | 45s | Wrist Curl
Wrist Curl | elbow flexion | isolation | barbell, dumbbells, bench | 12-20 | 45s | Reverse Wrist Curl
Back Squat | knee dominant | compound | barbell, rack | 6-10 | 150s | Leg Press, Hack Squat, Front Squat
Bulgarian Split Squat | knee dominant | compound | dumbbells, bench | 8-12 per leg | 105s | Walking Lunge, Reverse Lunge
Front Squat | knee dominant | compound | barbell, rack | 6-8 | 150s | Back Squat, Hack Squat
Goblet Squat | knee dominant | compound | dumbbells, kettlebells | 10-15 | 90s | Leg Press, Back Squat
Hack Squat | knee dominant | compound | machine | 8-12 | 120s | Leg Press, Back Squat
Leg Extension | knee dominant | isolation | machine | 10-15 | 75s | 
Leg Press | knee dominant | compound | machine | 8-15 | 120s | Back Squat, Hack Squat
Reverse Lunge | knee dominant | compound | dumbbells, bodyweight | 10-12 per leg | 90s | Walking Lunge, Bulgarian Split Squat
Walking Lunge | knee dominant | compound | dumbbells, bodyweight | 10-12 per leg | 90s | Reverse Lunge, Bulgarian Split Squat
Conventional Deadlift | hip dominant | compound | barbell | 3-6 | 210s | Romanian Deadlift
Good Morning | hip dominant | compound | barbell | 8-10 | 105s | Romanian Deadlift
Lying Leg Curl | knee dominant | isolation | machine | 10-15 | 75s | Seated Leg Curl
Romanian Deadlift | hip dominant | compound | barbell, dumbbells | 6-10 | 120s | Good Morning, Lying Leg Curl
Seated Leg Curl | knee dominant | isolation | machine | 10-15 | 75s | Lying Leg Curl
Cable Glute Kickback | hip dominant | isolation | cable_machine | 12-15 per leg | 60s | Hip Thrust, Glute Bridge
Glute Bridge | hip dominant | compound | bodyweight, dumbbells | 12-15 | 75s | Hip Thrust
Hip Thrust | hip dominant | compound | barbell, bench | 8-12 | 105s | Glute Bridge
Leg Press Calf Raise | calf plantar flexion | isolation | machine | 12-20 | 60s | Standing Calf Raise, Seated Calf Raise
Seated Calf Raise | calf plantar flexion | isolation | machine | 12-20 | 60s | Standing Calf Raise
Single-Leg Calf Raise | calf plantar flexion | isolation | bodyweight | 15-20 per leg | 45s | Standing Calf Raise
Standing Calf Raise | calf plantar flexion | isolation | machine | 10-20 | 60s | Seated Calf Raise, Leg Press Calf Raise
Cable Crunch | core flexion | isolation | cable_machine | 12-15 | 60s | Hanging Knee Raise
Hanging Knee Raise | core flexion | isolation | pullup_bar | 10-15 | 60s | Hanging Leg Raise, Cable Crunch
Hanging Leg Raise | core flexion | isolation | pullup_bar | 8-12 | 60s | Hanging Knee Raise
Ab Wheel Rollout | anti extension core | isolation | ab_wheel | 8-12 | 60s | Plank, Pallof Press
Plank | anti extension core | isolation | bodyweight | 30-60 sec hold | 45s | Ab Wheel Rollout, Pallof Press
Pallof Press | anti rotation core | isolation | cable_machine | 10-12 per side | 45s | Plank
Side Plank | anti rotation core | isolation | bodyweight | 20-40 sec per side | 45s | Pallof Press
`;

  const newExercises = rawData.trim().split('\n').map(line => {
    const parts = line.split('|').map(s => s.trim());
    const [name, pattern, category, equipment, reps, rest, substitutions] = parts;
    const id = name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    const valid_substitutions = substitutions ? substitutions.split(',').map(s => s.trim().toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '')).filter(Boolean) : [];
    
    return {
      id,
      name,
      movement_patterns: [pattern.replace(/\s+/g, '_')],
      compound_or_isolation: category.toUpperCase(),
      equipment: equipment,
      recommended_rep_ranges: reps,
      recommended_rest_ranges: rest,
      valid_substitutions
    };
  });

  const mergedDb = [...EXERCISE_DATABASE];
  let updatedCount = 0;
  let addedCount = 0;

  for (const newEx of newExercises) {
    const existingIdx = mergedDb.findIndex(e => e.id === newEx.id || e.name.toLowerCase() === newEx.name.toLowerCase());
    
    if (existingIdx !== -1) {
      // Merge into existing
      const existing = mergedDb[existingIdx];
      existing.movement_patterns = [...new Set([...(existing.movement_patterns || []), ...newEx.movement_patterns])];
      existing.recommended_rep_ranges = newEx.recommended_rep_ranges;
      existing.recommended_rest_ranges = newEx.recommended_rest_ranges;
      existing.valid_substitutions = [...new Set([...(existing.valid_substitutions || []), ...newEx.valid_substitutions])];
      // Keep existing V4 metadata like fatigue_score, primary_muscles, etc.
      updatedCount++;
    } else {
      // Add new
      mergedDb.push({
        ...newEx,
        // Default some V4 fields that might be required
        primary_muscles: ['unknown'], // Will need manual fix if any are fully missing
        fatigue_score: 3,
        stability_score: 3,
        skill_score: 3
      });
      addedCount++;
    }
  }

  // Write back to lib/exercises.js
  const exportContent = `/**
 * DESI GYM — V4 Exercise Knowledge Database
 * Features 105 exercises mapped to the V4 muscle and movement taxonomies,
 * redundancy groups, fatigue/stability scores, and training suitability flags.
 * 
 * Updated with PDF templates.
 */

export const EXERCISE_DATABASE = ${JSON.stringify(mergedDb, null, 2)};

export const getExerciseById = (id) => EXERCISE_DATABASE.find(ex => ex.id === id);
`;

  fs.writeFileSync(libPath, exportContent);
  console.log(`Merge complete: ${updatedCount} updated, ${addedCount} added. Total exercises: ${mergedDb.length}`);
}

run().catch(console.error);
