// Standalone test script for progression and plateaus
import { calculateProgression } from '../lib/progression.js';
import { getExerciseById } from '../lib/exercises.js';

console.log("======================================================================");
console.log("RUNNING WEEK-OVER-WEEK PROGRESSION OVERLOAD SIMULATION");
console.log("======================================================================\n");

const dbEx = getExerciseById("barbell_bench_press");

// --- SIMULATION 1: Normal Overload Progression ---
console.log("--- SIMULATION 1: Progressive Overload ---");
const week1Sets = [
  { set_index: 0, weight: 60, reps: 8, rpe: 8 },
  { set_index: 1, weight: 60, reps: 8, rpe: 8 },
  { set_index: 2, weight: 60, reps: 8, rpe: 9 }
];

console.log("Week 1 Performance: 60kg for 3 sets of 8 reps (Target Rep Range: 6-10)");
let result = calculateProgression(dbEx, week1Sets, []);
console.log(`Action recommendation: ${result.action}`);
console.log(`Recommendation details: ${result.message}`);

console.log("\nWeek 2: User completes max reps (10, 10, 10) at 60kg");
const week2Sets = [
  { set_index: 0, weight: 60, reps: 10, rpe: 8 },
  { set_index: 1, weight: 60, reps: 10, rpe: 8 },
  { set_index: 2, weight: 60, reps: 10, rpe: 9 }
];
result = calculateProgression(dbEx, week2Sets, []);
console.log(`Action recommendation: ${result.action}`);
console.log(`Recommendation details: ${result.message}`);
console.log(`Suggested weights for next week:`, result.suggestedSets.map(s => `${s.weight}kg x ${s.reps} reps`));


// --- SIMULATION 2: Plateau & Substitution ---
console.log("\n--- SIMULATION 2: Plateau & Substitution ---");
// Simulate 3 stagnant workouts
const history = [
  {
    exercise_name: "Barbell Bench Press",
    date: "2026-08-01",
    sets: [
      { weight: 60, reps: 8 },
      { weight: 60, reps: 8 },
      { weight: 60, reps: 7 }
    ]
  },
  {
    exercise_name: "Barbell Bench Press",
    date: "2026-08-04",
    sets: [
      { weight: 60, reps: 8 },
      { weight: 60, reps: 8 },
      { weight: 60, reps: 7 }
    ]
  },
  {
    exercise_name: "Barbell Bench Press",
    date: "2026-08-07",
    sets: [
      { weight: 60, reps: 8 },
      { weight: 60, reps: 8 },
      { weight: 60, reps: 7 }
    ]
  }
];

const currentSets = [
  { set_index: 0, weight: 60, reps: 8, rpe: 9.5 },
  { set_index: 1, weight: 60, reps: 8, rpe: 9.5 },
  { set_index: 2, weight: 60, reps: 7, rpe: 10 }
];

result = calculateProgression(dbEx, currentSets, history);
console.log(`Action recommendation: ${result.action}`);
console.log(`Recommendation details: ${result.message}`);
if (result.action === 'substitute' || result.plateau) {
  console.log(`Plateau detected! Swap suggested to: ${result.substitutionName} (ID: ${result.substitution})`);
} else {
  console.log("No plateau detected - check output states.");
}
