// Standalone validation script for DESI GYM workout engine V3
import { generateWorkoutPlanLocal } from './lib/planGenerator.js';
import { getExerciseById } from './lib/exercises.js';

const runTest = (name, profile) => {
  console.log(`\n======================================================================`);
  console.log(`RUNNING ${name}...`);
  console.log(`Goal: ${profile.fitnessGoal}, Experience: ${profile.fitnessLevel || 'Not specified'}, Days: ${profile.trainingDays}, Location: ${profile.trainingLocation}`);
  console.log(`Equipment Available: ${JSON.stringify(profile.equipmentAvailable)}`);
  console.log(`Priority Muscle: ${profile.priorityMuscle || 'overall'}`);
  console.log(`======================================================================`);

  const plan = generateWorkoutPlanLocal(profile);
  console.log(`Plan Name: ${plan.plan_name}`);
  console.log(`Overview: ${plan.overview}`);
  console.log(`Rationale: ${plan.why_this_workout}`);

  let duplicatesFound = false;
  let equipmentViolations = false;
  let experienceViolations = false;
  let totalExercisesCount = 0;

  const weeklySchedule = plan.weekly_schedule.week1;
  const weekdayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  for (const day of weekdayKeys) {
    const dayData = weeklySchedule[day];
    if (!dayData) continue;
    
    if (dayData.type === 'rest') {
      console.log(`  - ${day.toUpperCase()}: REST DAY (${dayData.activities.join(', ')})`);
      continue;
    }

    console.log(`  - ${day.toUpperCase()} (${dayData.muscle_group}):`);
    const exercises = dayData.exercises || [];
    const seenIds = new Set();
    const seenNames = new Set();

    exercises.forEach((ex, idx) => {
      totalExercisesCount++;
      const hasDup = seenIds.has(ex.id) || seenNames.has(ex.name);
      if (hasDup) {
        duplicatesFound = true;
      }
      seenIds.add(ex.id);
      seenNames.add(ex.name);

      // Verify equipment and difficulty from database definition
      const dbEx = getExerciseById(ex.id);
      let equipmentMatch = true;
      let experienceMatch = true;

      if (dbEx) {
        if (dbEx.equipment !== 'Bodyweight' && !profile.equipmentAvailable.includes(dbEx.equipment)) {
          equipmentMatch = false;
          equipmentViolations = true;
        }
        if (profile.fitnessLevel === 'beginner' && dbEx.difficulty === 'Advanced') {
          experienceMatch = false;
          experienceViolations = true;
        }
      } else {
        equipmentMatch = false; // missing database definition
        equipmentViolations = true;
      }

      console.log(`    [${idx + 1}] ${ex.name} (${ex.primary_muscle}) | ${ex.sets}x${ex.reps} | Rest: ${ex.rest} | Effort: ${ex.target_effort} | ${equipmentMatch ? '✅ Equip Match' : '❌ Equip Mismatch'} | ${experienceMatch ? '✅ Exp Match' : '❌ Exp Mismatch'}`);
      console.log(`        Target: ${ex.todays_target}`);
      console.log(`        Coach Note: ${ex.coach_note}`);
    });
  }

  console.log(`----------------------------------------------------------------------`);
  console.log(`STATUS FOR ${name}:`);
  console.log(`Duplicates: ${duplicatesFound ? '❌ FAILED (Duplicates found)' : '✅ PASSED (No duplicates)'}`);
  console.log(`Equipment: ${equipmentViolations ? '❌ FAILED (Equipment mismatch)' : '✅ PASSED (Equipment matches)'}`);
  console.log(`Experience Level: ${experienceViolations ? '❌ FAILED (Beginner was prescribed Advanced exercise)' : '✅ PASSED (Experience levels match)'}`);
  console.log(`Total Exercises Scheduled: ${totalExercisesCount}`);
};

const fullGymEquip = ["Barbell", "Dumbbell", "Cables", "Machines", "Bodyweight"];
const homeDumbbellEquip = ["Dumbbell", "Bodyweight"];

// TEST 1: Beginner, 3 days, Hypertrophy, Full gym
runTest("TEST 1", {
  fitnessGoal: "build_muscle",
  fitnessLevel: "beginner",
  trainingDays: "3",
  sessionDuration: "60 min",
  trainingLocation: "Gym",
  equipmentAvailable: fullGymEquip,
  priorityMuscle: "overall"
});

// TEST 2: Intermediate, 4 days, Hypertrophy, Full gym
runTest("TEST 2", {
  fitnessGoal: "build_muscle",
  fitnessLevel: "intermediate",
  trainingDays: "4",
  sessionDuration: "60 min",
  trainingLocation: "Gym",
  equipmentAvailable: fullGymEquip,
  priorityMuscle: "overall"
});

// TEST 3: Advanced, 5 days, Hypertrophy, Full gym
runTest("TEST 3", {
  fitnessGoal: "build_muscle",
  fitnessLevel: "advanced",
  trainingDays: "5",
  sessionDuration: "60 min",
  trainingLocation: "Gym",
  equipmentAvailable: fullGymEquip,
  priorityMuscle: "overall"
});

// TEST 4: Intermediate, 4 days, Strength, Full gym
runTest("TEST 4", {
  fitnessGoal: "strength",
  fitnessLevel: "intermediate",
  trainingDays: "4",
  sessionDuration: "75 min",
  trainingLocation: "Gym",
  equipmentAvailable: fullGymEquip,
  priorityMuscle: "overall"
});

// TEST 5: Beginner, 3 days, Home, Dumbbells only
runTest("TEST 5", {
  fitnessGoal: "build_muscle",
  fitnessLevel: "beginner",
  trainingDays: "3",
  sessionDuration: "45 min",
  trainingLocation: "Home",
  equipmentAvailable: homeDumbbellEquip,
  priorityMuscle: "overall"
});

// TEST 6: Intermediate, 4 days, Chest priority
runTest("TEST 6", {
  fitnessGoal: "build_muscle",
  fitnessLevel: "intermediate",
  trainingDays: "4",
  sessionDuration: "60 min",
  trainingLocation: "Gym",
  equipmentAvailable: fullGymEquip,
  priorityMuscle: "chest"
});

// TEST 7: Intermediate, 4 days, Back priority
runTest("TEST 7", {
  fitnessGoal: "build_muscle",
  fitnessLevel: "intermediate",
  trainingDays: "4",
  sessionDuration: "60 min",
  trainingLocation: "Gym",
  equipmentAvailable: fullGymEquip,
  priorityMuscle: "lats"
});

// TEST 8: Intermediate, 4 days, Shoulder priority
runTest("TEST 8", {
  fitnessGoal: "build_muscle",
  fitnessLevel: "intermediate",
  trainingDays: "4",
  sessionDuration: "60 min",
  trainingLocation: "Gym",
  equipmentAvailable: fullGymEquip,
  priorityMuscle: "lateral_delts"
});
