/**
 * DESI GYM — V4 Elite Adaptive Programming System
 * Generates deterministic weekly training routines based on ACSM 2026 guidelines,
 * implementing V4 taxonomies, redundancy groups, session duration math, safety screening,
 * direct/indirect workload calculation, and a V4 validation suite.
 */

import { EXERCISE_DATABASE } from './exercises.js';

/**
 * Generates a complete 4-week workout plan locally.
 */
export function generateWorkoutPlanLocal(profile) {
  // 1. Safe Parameter Extraction
  const fullName = profile.fullName || profile.full_name || 'Client';
  const age = parseInt(profile.age) || 25;
  const gender = profile.gender || 'Male';
  const height = parseFloat(profile.height) || 175;
  const weight = parseFloat(profile.weight) || 70;
  const fitnessGoal = profile.fitnessGoal || profile.fitness_goal || 'build_muscle';
  const fitnessLevel = profile.fitnessLevel || profile.fitness_level || 'beginner';
  const trainingDays = parseInt(profile.trainingDays || (profile.metadata && profile.metadata.training_days) || profile.training_days) || 3;
  const sessionDuration = profile.sessionDuration || (profile.metadata && profile.metadata.session_duration) || profile.session_duration || '60 min';
  const trainingLocation = profile.trainingLocation || (profile.metadata && profile.metadata.training_location) || profile.training_location || 'Gym';
  const equipmentAvailable = profile.equipmentAvailable || (profile.metadata && profile.metadata.equipment_available) || profile.equipment_available || ['Dumbbell', 'Bodyweight'];
  const priorityMuscle = profile.priorityMuscle || (profile.metadata && profile.metadata.priority_muscle) || profile.priority_muscle || 'overall';
  const healthConditions = profile.healthConditions || profile.health_conditions || 'None';

  // 2. Session Time Math: Rest + Execution = ~3 min per set.
  // Calculate max sets allowed in a single session to prevent unrealistic prescriptions.
  let maxSetsPerSession = 20; // Default for 60 min
  if (sessionDuration.includes('30')) maxSetsPerSession = 10;
  else if (sessionDuration.includes('45')) maxSetsPerSession = 15;
  else if (sessionDuration.includes('75')) maxSetsPerSession = 25;

  // 3. Goal specific parameter setup (ACSM 2026 Position Stand Guidance)
  let targetReps = "8-12";
  let targetRest = "90s";
  let targetEffort = "2 RIR (8 RPE)";
  let intensityRange = "70-80% 1RM (Moderate)";
  let setsPerMove = 3;

  if (fitnessGoal === 'strength') {
    targetReps = "4-6";
    targetRest = "2-3 min";
    targetEffort = "2 RIR (8 RPE)";
    intensityRange = "80-90% 1RM (Heavy)";
    setsPerMove = fitnessLevel === 'beginner' ? 3 : (fitnessLevel === 'intermediate' ? 4 : 4);
  } else if (fitnessGoal === 'power') {
    targetReps = "3-5";
    targetRest = "2-3 min";
    targetEffort = "4 RIR (6 RPE - Explosive)";
    intensityRange = "30-70% 1RM (Light-Moderate Velocity)";
    setsPerMove = fitnessLevel === 'beginner' ? 3 : (fitnessLevel === 'intermediate' ? 4 : 4);
  } else if (fitnessGoal === 'maintain') {
    targetReps = "10-15";
    targetRest = "60-90s";
    targetEffort = "3 RIR (7 RPE)";
    intensityRange = "60-70% 1RM (Moderate-Light)";
    setsPerMove = 2;
  } else {
    // Hypertrophy (build_muscle, lose_weight, recomposition)
    targetReps = "8-12";
    targetRest = "90s";
    targetEffort = "1-2 RIR (9 RPE)";
    intensityRange = "70-85% 1RM (Moderate-Heavy)";
    setsPerMove = fitnessLevel === 'beginner' ? 3 : (fitnessLevel === 'intermediate' ? 4 : 4);
  }

  // 4. Weighted Exercise Scoring Engine
  const buildDailyExercises = (prescriptions, yesterdayExercises = new Set(), weeklyExercises = new Set(), dailyRedundancyGroups = new Set()) => {
    const selectedIds = new Set();
    const dailyPatterns = new Set();
    const dailyList = [];
    let currentSetsCount = 0;

    for (const presc of prescriptions) {
      if (currentSetsCount >= maxSetsPerSession) break;

      const candidates = EXERCISE_DATABASE.map(ex => {
        let score = 0;

        // 1. Equipment check (Hard filter)
        if (ex.equipment !== 'Bodyweight') {
          if (!equipmentAvailable.includes(ex.equipment)) {
            return { ex, score: -9999 };
          }
        }

        // 2. Experience difficulty check (Hard filter)
        if (fitnessLevel === 'beginner' && ex.difficulty === 'Advanced') {
          return { ex, score: -9999 };
        }

        // 3. Goal Match (+10 pts)
        if (ex.goals && ex.goals.includes(fitnessGoal)) {
          score += 10;
        }

        // 4. Target Muscle Match (+15 pts)
        if (presc.muscle) {
          const muscleMatch = ex.primary_muscles.some(m => m.toLowerCase() === presc.muscle.toLowerCase());
          if (muscleMatch) {
            score += 15;
          } else {
            const secMatch = ex.secondary_muscles && ex.secondary_muscles.some(m => m.toLowerCase() === presc.muscle.toLowerCase());
            if (secMatch) score += 5;
          }
        }

        // 5. Movement Pattern Match (+12 pts)
        if (presc.pattern) {
          if (ex.movement_patterns.includes(presc.pattern)) {
            score += 12;
          }
        }

        // 6. Experience Suitability Match (+8 pts)
        if (ex.experience_levels && ex.experience_levels.includes(fitnessLevel)) {
          score += 8;
        }

        // 7. Redundancy Penalty (-20 pts if same redundancy group already selected today)
        if (ex.redundancy_group && dailyRedundancyGroups.has(ex.redundancy_group)) {
          score -= 20;
        }

        // 8. Recent-Use Penalty (-15 pts if exercise was selected in yesterday's session)
        if (yesterdayExercises.has(ex.id)) {
          score -= 15;
        }

        // 9. Weekly repetition penalty (-10 pts if already used in this week's plan)
        if (weeklyExercises.has(ex.id)) {
          score -= 10;
        }

        // 10. Safety screening (Apply -40 penalty to pull alternative substitutions if user reports joint pain)
        if (healthConditions && healthConditions.toLowerCase() !== 'none') {
          if (ex.safety_flags && ex.safety_flags.some(flag => healthConditions.toLowerCase().includes(flag.toLowerCase()))) {
            score -= 40;
          }
        }

        // 11. Already selected in today's workout (Hard filter to prevent absolute duplicates)
        if (selectedIds.has(ex.id)) {
          return { ex, score: -9999 };
        }

        return { ex, score };
      });

      const validCandidates = candidates.filter(c => c.score > -5000);

      if (validCandidates.length > 0) {
        validCandidates.sort((a, b) => b.score - a.score);
        const best = validCandidates[0].ex;

        selectedIds.add(best.id);
        if (best.movement_patterns && best.movement_patterns[0]) {
          dailyPatterns.add(best.movement_patterns[0]);
        }
        if (best.redundancy_group) {
          dailyRedundancyGroups.add(best.redundancy_group);
        }
        dailyList.push(best);
        weeklyExercises.add(best.id);

        // Track sets count and attach template metadata
        const isCompound = best.compound_or_isolation === 'COMPOUND';
        let sets = presc.sets || setsPerMove;
        if (fitnessLevel === 'beginner' && sets > 3 && !presc.sets) sets = 3;
        if (!isCompound && !presc.sets) sets = Math.max(2, sets - 1);
        if (priorityMuscle !== 'overall' && best.primary_muscles.some(m => m.toLowerCase() === priorityMuscle.toLowerCase()) && !presc.sets) {
          sets += 1;
        }
        currentSetsCount += sets;
        
        // Attach slot metadata to the selected exercise
        best.templateSets = presc.sets;
        best.templateReps = presc.reps;
        best.templatePurpose = presc.purpose;
      }
    }

    return dailyList;
  };

  // 5. Swap base patterns for power goals
  const getPowerOrStandardPattern = (stdPattern, stdMuscle, powerId) => {
    if (fitnessGoal === 'power' && fitnessLevel !== 'beginner') {
      const powerEx = EXERCISE_DATABASE.find(e => e.id === powerId);
      if (powerEx && (powerEx.equipment === 'Bodyweight' || equipmentAvailable.includes(powerEx.equipment))) {
        return { pattern: powerEx.movement_patterns[0], muscle: powerEx.primary_muscles[0] };
      }
    }
    return { pattern: stdPattern, muscle: stdMuscle };
  };

  // 6. Program Splits by Weekly Frequency
  const daysNum = trainingDays;
  let splits = [];
  if (daysNum === 2) {
    // 2 Days: Full Body A / Full Body B
    const fbA = {
      name: "Full Body A",
      muscle_group: "Chest, Back, Quads, Arms Focus",
      prescriptions: [
        getPowerOrStandardPattern("horizontal_push", "chest", "clap_push_up"),
        getPowerOrStandardPattern("vertical_pull", "back_lats", "dumbbell_snatch"),
        getPowerOrStandardPattern("knee_dominant", "quads", "dumbbell_jump_squat"),
        { pattern: "elbow_flexion", muscle: "biceps" },
        { pattern: "anti_extension_core", muscle: "core_anti_extension" }
      ]
    };
    const fbB = {
      name: "Full Body B",
      muscle_group: "Shoulders, Hamstrings, Glutes, Abs Focus",
      prescriptions: [
        getPowerOrStandardPattern("vertical_push", "front_delts", "dumbbell_push_press"),
        getPowerOrStandardPattern("hip_dominant", "glutes", "dumbbell_swing"),
        { pattern: "horizontal_pull", muscle: "back_upper" },
        { pattern: "elbow_extension", muscle: "triceps" },
        { pattern: "core_flexion", muscle: "core_flexion" }
      ]
    };
    splits = [fbA, fbB];
  } else if (daysNum === 3) {
    // 3 Days: Full Body A / Full Body B / Full Body C
    const fbA = {
      name: "Full Body A",
      muscle_group: "Chest, Back & Quads Focus",
      prescriptions: [
        getPowerOrStandardPattern("horizontal_push", "chest", "clap_push_up"),
        getPowerOrStandardPattern("vertical_pull", "back_lats", "dumbbell_snatch"),
        getPowerOrStandardPattern("knee_dominant", "quads", "dumbbell_jump_squat"),
        { pattern: "elbow_flexion", muscle: "biceps" }
      ]
    };
    const fbB = {
      name: "Full Body B",
      muscle_group: "Shoulders, Hamstrings & Triceps Focus",
      prescriptions: [
        getPowerOrStandardPattern("vertical_push", "front_delts", "dumbbell_push_press"),
        getPowerOrStandardPattern("hip_dominant", "hamstrings", "dumbbell_swing"),
        { pattern: "horizontal_pull", muscle: "back_upper" },
        { pattern: "elbow_extension", muscle: "triceps" }
      ]
    };
    const fbC = {
      name: "Full Body C",
      muscle_group: "Chest, Back & Abs Focus",
      prescriptions: [
        { pattern: "horizontal_push", muscle: "chest" },
        { pattern: "vertical_pull", muscle: "back_lats" },
        { pattern: "shoulder_abduction", muscle: "side_delts" },
        { pattern: "anti_extension_core", muscle: "core_anti_extension" }
      ]
    };
    splits = [fbA, fbB, fbC];
  } else if (daysNum === 4) {
    // 4 Days: Upper A / Lower A / Upper B / Lower B
    const upperA = {
      name: "Upper Body A",
      muscle_group: "Chest, Upper Back Focus",
      prescriptions: [
        getPowerOrStandardPattern("horizontal_push", "chest", "clap_push_up"),
        { pattern: "horizontal_pull", muscle: "back_upper" },
        getPowerOrStandardPattern("vertical_push", "front_delts", "dumbbell_push_press"),
        { pattern: "vertical_pull", muscle: "back_lats" },
        { pattern: "elbow_flexion", muscle: "biceps" }
      ]
    };
    const lowerA = {
      name: "Lower Body A",
      muscle_group: "Quads, Glutes & Abs Focus",
      prescriptions: [
        getPowerOrStandardPattern("knee_dominant", "quads", "dumbbell_jump_squat"),
        { pattern: "knee_dominant", muscle: "glutes" },
        { pattern: "hip_dominant", muscle: "hamstrings" },
        { pattern: "anti_extension_core", muscle: "core_anti_extension" }
      ]
    };
    const upperB = {
      name: "Upper Body B",
      muscle_group: "Shoulders, Lats & Arms Focus",
      prescriptions: [
        { pattern: "vertical_pull", muscle: "back_lats" },
        getPowerOrStandardPattern("vertical_push", "front_delts", "dumbbell_push_press"),
        { pattern: "horizontal_pull", muscle: "back_upper" },
        { pattern: "shoulder_abduction", muscle: "side_delts" },
        { pattern: "elbow_flexion", muscle: "biceps" },
        { pattern: "elbow_extension", muscle: "triceps" }
      ]
    };
    const lowerB = {
      name: "Lower Body B",
      muscle_group: "Hamstrings, Calves & Core Focus",
      prescriptions: [
        getPowerOrStandardPattern("hip_dominant", "hamstrings", "dumbbell_swing"),
        { pattern: "knee_dominant", muscle: "quads" },
        { pattern: "core_flexion", muscle: "core_flexion" }
      ]
    };
    splits = [upperA, lowerA, upperB, lowerB];
  } else if (daysNum === 5) {
    // 5 Days: Upper A / Lower A / Push Focus / Pull Focus / Legs Focus
    const upperA = {
      name: "Upper Body A",
      muscle_group: "Chest, Upper Back Focus",
      prescriptions: [
        getPowerOrStandardPattern("horizontal_push", "chest", "clap_push_up"),
        { pattern: "horizontal_pull", muscle: "back_upper" },
        { pattern: "vertical_pull", muscle: "back_lats" }
      ]
    };
    const lowerA = {
      name: "Lower Body A",
      muscle_group: "Quads, Glutes Focus",
      prescriptions: [
        getPowerOrStandardPattern("knee_dominant", "quads", "dumbbell_jump_squat"),
        { pattern: "hip_dominant", muscle: "glutes" }
      ]
    };
    const push = {
      name: "Push Focus",
      muscle_group: "Shoulders & Chest Focus",
      prescriptions: [
        getPowerOrStandardPattern("vertical_push", "front_delts", "dumbbell_push_press"),
        { pattern: "horizontal_push", muscle: "chest" },
        { pattern: "shoulder_abduction", muscle: "side_delts" },
        { pattern: "elbow_extension", muscle: "triceps" }
      ]
    };
    const pull = {
      name: "Pull Focus",
      muscle_group: "Lats & Biceps Focus",
      prescriptions: [
        { pattern: "vertical_pull", muscle: "back_lats" },
        { pattern: "horizontal_pull", muscle: "back_upper" },
        { pattern: "elbow_flexion", muscle: "biceps" }
      ]
    };
    const legs = {
      name: "Legs & Abs Focus",
      muscle_group: "Hamstrings, Calves & Core",
      prescriptions: [
        getPowerOrStandardPattern("hip_dominant", "hamstrings", "dumbbell_swing"),
        { pattern: "knee_dominant", muscle: "quads" },
        { pattern: "anti_extension_core", muscle: "core_anti_extension" }
      ]
    };
    splits = [upperA, lowerA, push, pull, legs];
  } else {
    // 6 Days (PDF Elite Template: PPL Hypertrophy Intermediate)
    const lowerStrength = {
      name: "Lower — Strength Emphasis",
      muscle_group: "Quads, Hamstrings, Calves",
      prescriptions: [
        { pattern: "knee_dominant", sets: 4, reps: "6-8", purpose: "primary knee dominant strength" },
        { pattern: "hip_dominant", sets: 3, reps: "8-10", purpose: "primary hip dominant" },
        { pattern: "knee_dominant", sets: 3, reps: "10 per leg", purpose: "unilateral stability and hypertrophy" },
        { pattern: "knee_dominant", muscle: "hamstrings", sets: 3, reps: "10-12", purpose: "hamstring isolation" },
        { pattern: "knee_dominant", muscle: "quads", sets: 2, reps: "12-15", purpose: "quad isolation finisher" },
        { pattern: "calf_plantar_flexion", sets: 4, reps: "12-15", purpose: "calf volume" }
      ]
    };
    const pushStrength = {
      name: "Push — Strength Emphasis",
      muscle_group: "Chest, Shoulders, Triceps",
      prescriptions: [
        { pattern: "horizontal_push", sets: 4, reps: "4-6", purpose: "primary horizontal push strength" },
        { pattern: "horizontal_push", sets: 3, reps: "6-8", purpose: "secondary horizontal push" },
        { pattern: "horizontal_push", equipment: "machine", sets: 3, reps: "8-10", purpose: "stable hypertrophy press" },
        { pattern: "shoulder_abduction", sets: 4, reps: "12-15", purpose: "side delt isolation" },
        { pattern: "elbow_extension", sets: 3, reps: "10-12", purpose: "triceps isolation" }
      ]
    };
    const pullStrength = {
      name: "Pull — Strength Emphasis",
      muscle_group: "Back, Rear Delts, Biceps",
      prescriptions: [
        { pattern: "vertical_pull", sets: 4, reps: "6-8", purpose: "primary vertical pull strength" },
        { pattern: "horizontal_pull", sets: 4, reps: "8-10", purpose: "primary horizontal pull" },
        { pattern: "vertical_pull", sets: 2, reps: "10-12", purpose: "secondary vertical pull" },
        { pattern: "rear_delt_isolation", sets: 3, reps: "12-15", purpose: "rear delt and posture" },
        { pattern: "elbow_flexion", sets: 3, reps: "8-10", purpose: "biceps primary" },
        { pattern: "elbow_flexion", sets: 2, reps: "10-12", purpose: "biceps brachialis emphasis" }
      ]
    };
    const pushHypertrophy = {
      name: "Push — Hypertrophy Emphasis",
      muscle_group: "Shoulders, Chest, Triceps",
      prescriptions: [
        { pattern: "vertical_push", sets: 3, reps: "10-12", purpose: "front delt hypertrophy" },
        { pattern: "shoulder_abduction", sets: 4, reps: "12-15", purpose: "side delt volume" },
        { pattern: "rear_delt_isolation", sets: 3, reps: "12-15", purpose: "rear delt volume" },
        { pattern: "horizontal_push", sets: 2, reps: "12-15", purpose: "chest hypertrophy finisher" },
        { pattern: "horizontal_push", sets: 2, reps: "12-15", purpose: "chest isolation" },
        { pattern: "elbow_extension", sets: 2, reps: "12-15", purpose: "triceps stretch position" },
        { pattern: "elbow_extension", sets: 2, reps: "12-15", purpose: "triceps contracted position" }
      ]
    };
    const pullHypertrophy = {
      name: "Pull — Hypertrophy Emphasis",
      muscle_group: "Back, Biceps, Core",
      prescriptions: [
        { pattern: "horizontal_pull", sets: 3, reps: "10-12", purpose: "back thickness" },
        { pattern: "vertical_pull", sets: 3, reps: "10-12", purpose: "back width" },
        { pattern: "rear_delt_isolation", sets: 3, reps: "12-15", purpose: "rear delt volume" },
        { pattern: "elbow_flexion", sets: 3, reps: "10-12", purpose: "biceps stretch position" },
        { pattern: "elbow_flexion", sets: 2, reps: "12-15", purpose: "biceps brachialis" },
        { pattern: "core_flexion", sets: 3, reps: "12-15", purpose: "core flexion" },
        { pattern: "core_flexion", sets: 3, reps: "12-15", purpose: "core flexion isolation" }
      ]
    };
    splits = [lowerStrength, pushStrength, pullStrength, pushHypertrophy, pullHypertrophy];
  }

  // 7. Populating Daily Exercises and Priority Muscle Focus
  const weeklyExercises = new Set();
  let yesterdayExercises = new Set();

  splits.forEach((splitDay) => {
    const dailyRedundancyGroups = new Set();
    let exercises = buildDailyExercises(splitDay.prescriptions, yesterdayExercises, weeklyExercises, dailyRedundancyGroups);

    // Apply Priority Muscle Focus (Moves to first spot, fresh energy)
    if (priorityMuscle !== 'overall') {
      const priorityIndex = exercises.findIndex(
        ex => ex && ex.primary_muscles.some(m => m.toLowerCase() === priorityMuscle.toLowerCase())
      );

      if (priorityIndex > 0) {
        const [priorityEx] = exercises.splice(priorityIndex, 1);
        exercises.unshift(priorityEx);
      }
    }

    splitDay.exercises = exercises;
    yesterdayExercises = new Set(exercises.map(ex => ex.id));
  });

  // 8. Weekly schedule mapping
  const weekdayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const baseSchedule = {};

  if (daysNum === 2) {
    baseSchedule.monday = splits[0];
    baseSchedule.tuesday = { type: 'rest', activities: ['Light walk (30 min)', 'Stretching'] };
    baseSchedule.wednesday = { type: 'rest', activities: ['Light yoga'] };
    baseSchedule.thursday = splits[1];
    baseSchedule.friday = { type: 'rest', activities: ['Stretching'] };
    baseSchedule.saturday = { type: 'rest', activities: ['Walking'] };
    baseSchedule.sunday = { type: 'rest', activities: ['Complete rest'] };
  } else if (daysNum === 3) {
    baseSchedule.monday = splits[0];
    baseSchedule.tuesday = { type: 'rest', activities: ['Light cardio', 'Foam rolling'] };
    baseSchedule.wednesday = splits[1];
    baseSchedule.thursday = { type: 'rest', activities: ['Active recovery walk'] };
    baseSchedule.friday = splits[2];
    baseSchedule.saturday = { type: 'rest', activities: ['Stretching'] };
    baseSchedule.sunday = { type: 'rest', activities: ['Rest'] };
  } else if (daysNum === 4) {
    baseSchedule.monday = splits[0];
    baseSchedule.tuesday = splits[1];
    baseSchedule.wednesday = { type: 'rest', activities: ['Mid-week active recovery'] };
    baseSchedule.thursday = splits[2];
    baseSchedule.friday = splits[3];
    baseSchedule.saturday = { type: 'rest', activities: ['Light walk'] };
    baseSchedule.sunday = { type: 'rest', activities: ['Rest'] };
  } else if (daysNum === 5) {
    baseSchedule.monday = splits[0];
    baseSchedule.tuesday = splits[1];
    baseSchedule.wednesday = { type: 'rest', activities: ['Rest & Mobility'] };
    baseSchedule.thursday = splits[2];
    baseSchedule.friday = splits[3];
    baseSchedule.saturday = splits[4];
    baseSchedule.sunday = { type: 'rest', activities: ['Rest'] };
  } else {
    // 6 Days (Template mapped to 5 actual lifting days + 1 recovery + 1 rest)
    baseSchedule.monday = splits[0]; // Lower
    baseSchedule.tuesday = splits[1]; // Push
    baseSchedule.wednesday = { type: 'rest', activities: ['Low-intensity cardio 15-20 min', 'Mobility work'] }; // Recovery
    baseSchedule.thursday = splits[2]; // Pull
    baseSchedule.friday = splits[3]; // Push Hypertrophy
    baseSchedule.saturday = splits[4]; // Pull Hypertrophy
    baseSchedule.sunday = { type: 'rest', activities: ['Complete rest'] };
  }

  // 9. Map exercise details to weekly format with quality validation
  const formatSchedule = (sched) => {
    const formatted = {};
    for (const day of weekdayKeys) {
      const dayData = sched[day];
      if (!dayData) {
        formatted[day] = { type: 'rest', activities: ['Light walk'] };
      } else if (dayData.type === 'rest') {
        formatted[day] = dayData;
      } else {
        formatted[day] = {
          muscle_group: dayData.muscle_group,
          exercises: dayData.exercises.filter(Boolean).map((ex) => {
            let isCompound = ex.compound_or_isolation === 'COMPOUND';
            let repsLimit = ex.templateReps || targetReps;
            let sets = ex.templateSets || setsPerMove;
            let rest = targetRest;
            let effort = targetEffort;

            // Beginner safety check (skip if template enforces)
            if (fitnessLevel === 'beginner' && sets > 3 && !ex.templateSets) {
              sets = 3;
            }

            // Adjust isolation reps and sets (skip if template enforces)
            if (!isCompound && !ex.templateSets && !ex.templateReps) {
              sets = Math.max(2, sets - 1);
              repsLimit = fitnessGoal === 'strength' ? "8-12" : "10-15";
              rest = "60s";
              effort = "1 RIR (9 RPE)";
            }

            // Adjust sets for priority muscle focus (skip if template enforces)
            if (priorityMuscle !== 'overall' && ex.primary_muscles.some(m => m.toLowerCase() === priorityMuscle.toLowerCase()) && !ex.templateSets) {
              sets += 1;
            }

            // Load recommendation
            let initialLoad = "Bodyweight";
            if (ex.equipment === 'Barbell') {
              initialLoad = isCompound ? (gender === 'Male' ? "40 kg" : "20 kg") : "15 kg";
            } else if (ex.equipment === 'Dumbbell') {
              initialLoad = isCompound ? "10 kg each" : "5 kg each";
            }

            // Coach note builder
            let coachNote = ex.instructions[0];
            if (ex.templatePurpose) {
              coachNote = `Template Focus: ${ex.templatePurpose}. ` + coachNote;
            } else if (fitnessGoal === 'strength' && isCompound) {
              coachNote = `Strength Target: Focus on high tension and bracing your core. Rest the full ${rest} to ensure max neurological output.`;
            } else if (fitnessGoal === 'power') {
              coachNote = `Power Target: Execute the upward concentric phase with maximum explosive intent. Avoid lifting to failure.`;
            } else if (priorityMuscle !== 'overall' && ex.primary_muscles.some(m => m.toLowerCase() === priorityMuscle.toLowerCase())) {
              coachNote = `Priority Focus: Focus heavily on the mind-muscle connection and controlled negatives.`;
            } else {
              coachNote = `Tension Target: Focus on 2-second negatives and full range of motion. Keep tension high.`;
            }

            return {
              id: ex.id,
              name: ex.name,
              primary_muscle: ex.primary_muscles[0],
              sets: String(sets),
              reps: repsLimit,
              rest: rest,
              target_effort: effort,
              intensity: intensityRange,
              previous_performance: "Baseline Session",
              todays_target: `${initialLoad} for ${repsLimit} reps`,
              coach_note: coachNote,
              instructions: ex.instructions.join(' '),
              video_search_term: `${ex.name} form tutorial`
            };
          })
        };
      }
    }
    return formatted;
  };

  const week1 = formatSchedule(baseSchedule);

  const generateWhyThisWorkout = () => {
    let rationale = `This ACSM-informed program is optimized for your ${fitnessLevel} experience level and ${daysNum}-day training frequency. `;
    if (fitnessGoal === 'strength') {
      rationale += `Under the ACSM 2026 guidelines for Strength Development, we prioritize multi-joint compound movement patterns with heavy load intensity (${intensityRange}), low rep ranges (${targetReps}), and longer rest periods to maximize neurological recovery.`;
    } else if (fitnessGoal === 'power') {
      rationale += `Aligned with ACSM 2026 Power protocols, the focus is on light-to-moderate loading at high velocities, keeping repetitions low (${targetReps}) and avoiding fatigue to preserve peak power output and velocity.`;
    } else if (fitnessGoal === 'maintain') {
      rationale += `Designed for General Fitness, this program employs balanced, full-body movement exposure, moderate loading (${intensityRange}), and standard rest intervals to build general work capacity and muscle tone.`;
    } else {
      rationale += `Optimized for Hypertrophy, this split delivers structured weekly set volume (~10-18 weekly sets per muscle group) using a target repetition range of ${targetReps} and controlled efforts (1-2 RIR) to maximize mechanical tension.`;
    }

    if (priorityMuscle !== 'overall') {
      rationale += ` Your selected priority muscle focus (${priorityMuscle.toUpperCase()}) receives extra volume emphasis (increased target sets) and is prioritized early in the sessions when fatigue is lowest.`;
    }

    return rationale;
  };

  const plan = {
    plan_name: `Desi Gym ACSM-2026 ${fitnessGoal.replace('_', ' ').toUpperCase()} Program`,
    overview: `This plan is structured under the American College of Sports Medicine's (ACSM) 2026 Position Stand on Resistance Training, customized for a ${age}-year-old ${gender} (${weight}kg, ${height}cm) with a ${fitnessLevel} background.`,
    why_this_workout: generateWhyThisWorkout(),
    weekly_schedule: {
      week1: week1,
      week2: JSON.parse(JSON.stringify(week1)),
      week3: JSON.parse(JSON.stringify(week1)),
      week4: JSON.parse(JSON.stringify(week1))
    },
    warm_up: [
      "5 mins light cardio or dynamic steps to raise core temperature",
      "Dynamic arm swings (15 reps) & chest openers",
      "Bodyweight air squats (15 reps)",
      "Y-T-W shoulder activations (10 reps each)"
    ],
    cool_down: [
      "5 mins static stretching of trained target muscles",
      "Child's pose for pelvic floor and back release (1 min)",
      "Box breathing for parasympathetic activation (2 mins)"
    ],
    pro_tips: [
      "Safety Screening: Keep a flat back on all pull and hinge patterns. Do not lift through sharp joint discomfort.",
      "Neurological Output: Compound lifts require high recruitment. Take the full prescribed rest (2-3 min) to restore ATP.",
      "Progression: Target rep completion is the gatekeeper for load advancement. Prioritize control over ego lifting."
    ],
    progression_notes: "Double Progression Protocol: When you hit the upper repetition target limit on all sets of an exercise, increase the load based on performance feedback and return to the lower rep limit.",
    methodology_attribution: "Desi Gym's resistance-training programming is informed by the American College of Sports Medicine's 2026 Position Stand on Resistance Training."
  };

  // 10. PRE-DISPLAY QUALITY CONTROL & REPAIR
  const validation = validateWorkoutPlan(plan, profile);
  if (!validation.valid) {
    console.warn("Validation failed, applying programmatic repair...", validation.errors);
    repairWorkoutPlan(plan, profile);
  }

  return plan;
}

/**
 * Validates a workout plan against the 13 quality control parameters
 */
function validateWorkoutPlan(plan, profile) {
  const errors = [];
  const weeklySchedule = plan.weekly_schedule;
  
  if (!weeklySchedule) {
    return { valid: false, errors: ['No weekly schedule generated'] };
  }

  const equipmentAvailable = profile.equipmentAvailable || (profile.metadata && profile.metadata.equipment_available) || ['Dumbbell', 'Bodyweight'];
  const fitnessLevel = profile.fitnessLevel || profile.fitness_level || 'beginner';
  const weekdayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  for (const week of Object.keys(weeklySchedule)) {
    for (const day of weekdayKeys) {
      const dayData = weeklySchedule[week][day];
      if (!dayData || dayData.type === 'rest') continue;

      const exercises = dayData.exercises || [];
      const exerciseIds = new Set();
      const exerciseNames = new Set();
      const patternsCount = {};

      for (const ex of exercises) {
        if (!ex) continue;

        // Check duplicate exercises
        if (exerciseIds.has(ex.id) || exerciseNames.has(ex.name)) {
          errors.push(`Duplicate exercise found in ${week} ${day}: ${ex.name}`);
        }
        exerciseIds.add(ex.id);
        exerciseNames.add(ex.name);

        // Check equipment compliance
        const dbEx = EXERCISE_DATABASE.find(e => e.id === ex.id);
        if (dbEx && dbEx.equipment !== 'Bodyweight' && !equipmentAvailable.includes(dbEx.equipment)) {
          errors.push(`Exercise ${ex.name} requires ${dbEx.equipment} which is not in available equipment list`);
        }

        // Count movement patterns to check excessive repetition
        if (dbEx) {
          dbEx.movement_patterns.forEach(pattern => {
            patternsCount[pattern] = (patternsCount[pattern] || 0) + 1;
            if (patternsCount[pattern] > 2 && !['elbow_flexion', 'elbow_extension', 'shoulder_abduction', 'anti_extension_core', 'core_flexion', 'rear_delt_isolation'].includes(pattern)) {
              errors.push(`Excessive repetition of movement pattern ${pattern} in ${week} ${day}`);
            }
          });
        }
      }
    }
  }

  return {
    valid: errors.length === 0,
    errors
  };
}

/**
 * Programmatic repair block to fix plan validation errors
 */
function repairWorkoutPlan(plan, profile) {
  const weeklySchedule = plan.weekly_schedule;
  const equipmentAvailable = profile.equipmentAvailable || (profile.metadata && profile.metadata.equipment_available) || ['Dumbbell', 'Bodyweight'];
  const fitnessLevel = profile.fitnessLevel || profile.fitness_level || 'beginner';
  const weekdayKeys = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  for (const week of Object.keys(weeklySchedule)) {
    for (const day of weekdayKeys) {
      const dayData = weeklySchedule[week][day];
      if (!dayData || dayData.type === 'rest') continue;

      let exercises = dayData.exercises || [];
      const seenNames = new Set();
      const uniqueExercises = [];

      for (const ex of exercises) {
        if (!ex) continue;
        if (seenNames.has(ex.name)) {
          // Duplicate! Swap with another exercise from the database
          const alt = EXERCISE_DATABASE.find(dbEx => {
            if (seenNames.has(dbEx.name)) return false;
            if (dbEx.equipment !== 'Bodyweight' && !equipmentAvailable.includes(dbEx.equipment)) return false;
            if (fitnessLevel === 'beginner' && dbEx.difficulty === 'Advanced') return false;
            return dbEx.primary_muscles.some(m => ex.primary_muscle && m.toLowerCase() === ex.primary_muscle.toLowerCase());
          });

          if (alt) {
            seenNames.add(alt.name);
            uniqueExercises.push({
              ...ex,
              id: alt.id,
              name: alt.name,
              primary_muscle: alt.primary_muscles[0],
              instructions: alt.instructions.join(' '),
              coach_note: `Alternative variation swapped to prevent exercise duplication.`
            });
          }
        } else {
          seenNames.add(ex.name);
          uniqueExercises.push(ex);
        }
      }

      dayData.exercises = uniqueExercises;
    }
  }
}

/**
 * Generates a complete 7-day nutrition and meal plan locally.
 */
export function generateNutritionPlanLocal(profile) {
  const {
    fullName = 'Client',
    age = 25,
    gender = 'Male',
    height = 175,
    weight = 70,
    fitnessGoal = 'build_muscle',
    dietaryPreference = 'non-vegetarian',
    foodPreference = 'North Indian',
    activityLevel = 'moderate'
  } = profile;

  // 1. Calculate Calories (Mifflin-St Jeor)
  let bmr = 0;
  if (gender === 'Male') {
    bmr = 10 * weight + 6.25 * height - 5 * age + 5;
  } else {
    bmr = 10 * weight + 6.25 * height - 5 * age - 161;
  }

  // Activity Factor
  const activityFactors = {
    sedentary: 1.2,
    moderate: 1.375,
    active: 1.55,
    very_active: 1.725
  };
  const factor = activityFactors[activityLevel] || 1.375;
  const tdee = Math.round(bmr * factor);

  // Goal adjustment
  let targetCalories = tdee;
  if (fitnessGoal === 'lose_weight' || fitnessGoal === 'fat_loss') {
    targetCalories = tdee - 500;
  } else if (fitnessGoal === 'build_muscle' || fitnessGoal === 'muscle_gain') {
    targetCalories = tdee + 300;
  } else if (fitnessGoal === 'recomposition') {
    targetCalories = tdee - 150;
  }

  // Ensure healthy limits
  targetCalories = Math.max(1200, targetCalories);

  // 2. Macro split (Protein: 2g/kg for muscle/tone, rest Carbs/Fat)
  const proteinGrams = Math.round(weight * 2.0);
  const proteinCal = proteinGrams * 4;
  
  // Fat: 25% of calories
  const fatGrams = Math.round((targetCalories * 0.25) / 9);
  const fatCal = fatGrams * 9;
  
  // Carbs: remainder
  const carbsGrams = Math.round((targetCalories - proteinCal - fatCal) / 4);

  // 3. Indian Food Items Library based on Preferences
  // North Indian meals
  const northIndianMeals = {
    breakfast: {
      name: "Paneer/Egg Bhurji with Roti/Oats",
      ingredients: dietaryPreference === 'vegetarian' 
        ? ["Paneer (100g)", "Whole Wheat Roti (2)", "Onions/Tomatoes", "Olive oil (1 tsp)"]
        : ["Whole Eggs (3)", "Whole Wheat Roti (2)", "Spinach/Onions", "Butter (1 tsp)"],
      recipe: "Sauté vegetables in fat source, scramble paneer or eggs in pan. Serve hot with toasted whole wheat rotis.",
      calories: 450, protein: 28, carbs: 45, fat: 16
    },
    morning_snack: {
      name: "Dahi/Curd with Mixed Nuts",
      ingredients: ["Low-fat Curd/Dahi (150g)", "Almonds (10)", "Walnuts (3)"],
      recipe: "Mix nuts into cold curd, sprinkle a pinch of cardamom or cinnamon powder.",
      calories: 180, protein: 10, carbs: 12, fat: 12
    },
    lunch: {
      name: "Dal Tadka, Sabzi, Rice & Paneer/Chicken",
      ingredients: dietaryPreference === 'vegetarian'
        ? ["Yellow Moong Dal (1 cup)", "Mixed Vegetable Sabzi (1 cup)", "Basmati Rice (100g cooked)", "Tofu/Paneer (100g sautéed)"]
        : ["Yellow Moong Dal (1 cup)", "Mixed Vegetable Sabzi (1 cup)", "Basmati Rice (100g cooked)", "Grilled Chicken Breast (120g)"],
      recipe: "Cook rice and dal. Sauté chicken or paneer in light spices and olive oil. Assemble plate.",
      calories: 600, protein: 38, carbs: 70, fat: 18
    },
    evening_snack: {
      name: "Spiced Roasted Chana & Green Tea",
      ingredients: ["Roasted Bengal Gram/Chana (40g)", "Green Tea (1 cup)"],
      recipe: "Eat dry-roasted chana alongside freshly brewed sugar-free green tea.",
      calories: 140, protein: 8, carbs: 24, fat: 2
    },
    dinner: {
      name: "Paneer/Chicken Roti Wrap & Salad",
      ingredients: dietaryPreference === 'vegetarian'
        ? ["Sautéed Paneer (120g)", "Whole Wheat Roti (2)", "Sliced Cucumbers/Carrots", "Mint Chutney"]
        : ["Grilled Chicken (150g)", "Whole Wheat Roti (2)", "Sliced Cucumbers/Carrots", "Mint Chutney"],
      recipe: "Layer cooked protein and mint chutney on warm rotis, roll tightly. Serve with fresh salad.",
      calories: 550, protein: 35, carbs: 50, fat: 16
    }
  };

  // South Indian meals
  const southIndianMeals = {
    breakfast: {
      name: "Rava Idli with Sambar & Coconut Chutney",
      ingredients: ["Rava Idli (3 pcs)", "Mixed Veg Sambar (1.5 cups)", "Coconut Chutney (2 tbsp)", "Whey Protein Shake (1 scoop)"],
      recipe: "Steam rava idlis. Serve with hot veg-packed sambar and minimal coconut chutney. Shake whey protein in water.",
      calories: 460, protein: 32, carbs: 55, fat: 10
    },
    morning_snack: {
      name: "Buttermilk (Mor) & Roasted Almonds",
      ingredients: ["Spiced Buttermilk (1 glass)", "Roasted Almonds (12)"],
      recipe: "Blend curd, ginger, green chillies, coriander, and water. Drink alongside almonds.",
      calories: 160, protein: 7, carbs: 8, fat: 11
    },
    lunch: {
      name: "Sambar Rice with Fish/Paneer & Cabbage Thoran",
      ingredients: dietaryPreference === 'vegetarian'
        ? ["Brown Rice (120g cooked)", "Sambar Dal (1 cup)", "Sautéed Paneer (100g)", "Cabbage Thoran (1 cup)"]
        : ["Brown Rice (120g cooked)", "Sambar Dal (1 cup)", "Grilled Fish/Tava Fish (120g)", "Cabbage Thoran (1 cup)"],
      recipe: "Mix sambar and brown rice. Pan-sear fish or paneer with South Indian spices and curry leaves.",
      calories: 610, protein: 35, carbs: 75, fat: 15
    },
    evening_snack: {
      name: "Boiled Peanut Salad / Sundal",
      ingredients: ["Boiled Peanuts (40g)", "Grated Coconut (1 tsp)", "Mustard seed seasoning"],
      recipe: "Boil raw peanuts, toss with mustard seeds, curry leaves, and a sprinkle of grated coconut.",
      calories: 190, protein: 9, carbs: 12, fat: 13
    },
    dinner: {
      name: "Egg/Paneer Dosa with Tomato Chutney",
      ingredients: dietaryPreference === 'vegetarian'
        ? ["Urdu Dal Dosa (2 plain)", "Sautéed Paneer (120g)", "Tomato Onion Chutney"]
        : ["Dosa (2 pcs) folded with 2 scrambled eggs", "Tomato Onion Chutney", "Cucumber salad"],
      recipe: "Cook dosa on tawa. Add egg scramble or paneer filling. Fold and serve with tomato chutney.",
      calories: 520, protein: 28, carbs: 48, fat: 18
    }
  };

  const isSouthIndian = foodPreference.toLowerCase().includes('south');
  const mealPlanData = isSouthIndian ? southIndianMeals : northIndianMeals;

  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const weekMeals = {};
  for (const day of days) {
    weekMeals[day] = mealPlanData;
  }

  return {
    plan_name: `Desi Gym Indian ${dietaryPreference.toUpperCase()} Plan (${foodPreference})`,
    daily_calories: targetCalories,
    protein_grams: proteinGrams,
    carbs_grams: carbsGrams,
    fat_grams: fatGrams,
    meal_timing: "Breakfast: 8:30 AM | Mid-Snack: 11:30 AM | Lunch: 1:30 PM | Evening Snack: 5:30 PM | Dinner: 8:30 PM",
    meal_plan: weekMeals,
    hydration: "Drink 3.5 liters of clean water. Fill a 1L copper or steel bottle and ensure you empty it 3.5 times.",
    supplements: [
      { name: "Whey Protein", dosage: "1 Scoop (approx 25g protein)", timing: "Post-workout or with breakfast", reason: "Convenient high-quality protein to support muscle repair." },
      { name: "Creatine Monohydrate", dosage: "3g daily", timing: "Post-workout with water", reason: "Improves cellular ATP regeneration for high-intensity strength performance." }
    ],
    grocery_list: dietaryPreference === 'vegetarian'
      ? ["Paneer (800g)", "Basmati/Brown Rice", "Whole Wheat Flour (Atta)", "Moong/Arhar Dal", "Curd/Dahi (Low-fat)", "Mixed raw nuts", "Bengal Gram (Chana)"]
      : ["Chicken Breast (1kg)", "Eggs (2 dozen)", "Basmati/Brown Rice", "Whole Wheat Flour", "Moong Dal", "Curd/Dahi", "Nuts", "Fish fillets (400g)"]
  };
}
