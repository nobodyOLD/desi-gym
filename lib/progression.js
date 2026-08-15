/**
 * DESI GYM — Sports Science Progression Engine
 * Applies double progression, linear overload, volume reduction, and plateau detection.
 */

import { getExerciseById } from './exercises.js';

/**
 * Calculates suggested load and reps for the next session of an exercise
 * based on the user's logged history for that specific exercise.
 * 
 * @param {object} exercise - The exercise definition from exercises.js
 * @param {array} previousSets - Array of logged sets in the last session, e.g. [{ reps: 10, weight: 60, rpe: 8 }]
 * @param {array} exerciseHistory - Optional array of previous sessions for this exercise to detect plateaus
 * @returns {object} Suggestions including recommended weight, reps, action taken, and coaching comments.
 */
export function calculateProgression(exercise, previousSets = [], exerciseHistory = []) {
  if (!exercise) return null;

  // 1. Check for Plateaus (3 consecutive sessions with no progress in weight or reps)
  const plateauSub = checkPlateau(exercise, exerciseHistory);
  if (plateauSub.plateau) {
    return {
      action: 'substitute',
      message: `Plateau detected! You've hit a strength ceiling on ${exercise.name} for 3 workouts. We recommend substituting it with ${plateauSub.substituteName} to stimulate new hypertrophy pathways.`,
      suggestedSets: Array.from({ length: previousSets.length || 3 }).map((_, i) => ({
        set_index: i,
        weight: null, // Establish new weight on new exercise
        reps: plateauSub.substituteRepRange || '8-12',
      })),
      substitution: plateauSub.substituteId,
      substitutionName: plateauSub.substituteName
    };
  }

  // Baseline if no previous logs
  if (!previousSets || previousSets.length === 0) {
    return {
      action: 'baseline',
      message: 'Establish your baseline weight for this movement today. Choose a weight that leaves 2-3 reps in reserve.',
      suggestedSets: Array.from({ length: parseInt(exercise.sets) || 3 }).map((_, i) => ({
        set_index: i,
        weight: null,
        reps: exercise.recommended_rep_ranges || exercise.rep_range || '8-12'
      }))
    };
  }

  // Parse rep ranges
  let minReps = 8;
  let maxReps = 12;
  const repRangeStr = exercise.recommended_rep_ranges || exercise.rep_range || '8-12';
  const rangeMatch = repRangeStr.match(/(\d+)-(\d+)/);
  if (rangeMatch) {
    minReps = parseInt(rangeMatch[1]);
    maxReps = parseInt(rangeMatch[2]);
  } else {
    // Check if it is a time based range like 45-60s
    const timeMatch = repRangeStr.match(/(\d+)-(\d+)s/);
    if (timeMatch) {
      minReps = parseInt(timeMatch[1]);
      maxReps = parseInt(timeMatch[2]);
    }
  }

  const numSets = previousSets.length;
  const weights = previousSets.map(s => parseFloat(s.weight) || 0).filter(w => w > 0);
  const reps = previousSets.map(s => parseInt(s.reps) || 0).filter(r => r > 0);
  
  if (weights.length === 0 || reps.length === 0) {
    return {
      action: 'baseline',
      message: 'Log your baseline performance today.',
      suggestedSets: Array.from({ length: numSets || 3 }).map((_, i) => ({
        set_index: i,
        weight: null,
        reps: exercise.recommended_rep_ranges || exercise.rep_range || '8-12'
      }))
    };
  }

  const maxWeight = Math.max(...weights);
  
  // 2. Double Progression Overload Logic
  // Rule A: If user completed all sets hitting or exceeding the upper rep target (maxReps)
  const hitMaxRepsAllSets = reps.every(r => r >= maxReps);
  if (hitMaxRepsAllSets) {
    const isCompound = exercise.compound_or_isolation === 'COMPOUND';
    
    // Determine target percentage based on exercise rep range (surrogate for goal intensity)
    let pct = 0.025; // baseline 2.5%
    if (maxReps <= 6) {
      pct = isCompound ? 0.05 : 0.025; // Strength: 5% compounds, 2.5% isolation
    } else if (maxReps <= 8 && ['Dumbbell Jump Squat', 'Dumbbell Snatch', 'Clap Push-up', 'Dumbbell Swing'].includes(exercise.name)) {
      pct = isCompound ? 0.03 : 0.015; // Power: 3% compounds, 1.5% isolation
    } else if (maxReps >= 12) {
      pct = isCompound ? 0.02 : 0.01;   // General Fitness: 2% compounds, 1% isolation
    } else {
      pct = isCompound ? 0.04 : 0.02;   // Hypertrophy: 4% compounds, 2% isolation
    }

    // Scale percentage based on effort feedback (RPE)
    const avgRpe = previousSets.map(s => parseFloat(s.rpe) || 8).reduce((a, b) => a + b, 0) / previousSets.length;
    if (avgRpe <= 7) {
      pct += 0.01; // Easy effort: accelerate load
    } else if (avgRpe >= 9.5) {
      pct -= 0.01; // Hard effort: slow progression rate
    }

    // Round weight increase to nearest 0.5kg for fine-grained steps
    let rawIncrement = maxWeight * pct;
    let increment = Math.max(1.0, Math.round(rawIncrement * 2) / 2);

    // Caps to prevent excessive jumps on heavy exercises
    if (isCompound) {
      increment = Math.min(10.0, increment);
    } else {
      increment = Math.min(2.5, increment);
    }

    const recommendedWeight = maxWeight + increment;

    return {
      action: 'increase_load',
      message: `Excellent performance! You reached the upper rep target of ${maxReps} reps on all sets. Increase weight by +${increment}kg to ${recommendedWeight}kg. Drop reps to ${minReps} and build back up.`,
      suggestedSets: Array.from({ length: numSets }).map((_, i) => ({
        set_index: i,
        weight: recommendedWeight,
        reps: `${minReps}-${maxReps}`
      }))
    };
  }

  // Rule B: If they hit within the target range but didn't max out all sets (e.g. 10, 9, 8 reps)
  const hitMinRepsAllSets = reps.every(r => r >= minReps);
  if (hitMinRepsAllSets) {
    return {
      action: 'increase_reps',
      message: `Solid volume. You hit the rep zone (${minReps}-${maxReps}). Maintain your current weight of ${maxWeight}kg and focus on increasing the reps in subsequent sets.`,
      suggestedSets: Array.from({ length: numSets }).map((_, i) => ({
        set_index: i,
        weight: maxWeight,
        reps: `${minReps}-${maxReps}`
      }))
    };
  }

  // Rule C: Underperforming / Missed the range (e.g. hitting 7, 6, 5 reps when target is 8-12)
  const avgReps = reps.reduce((a, b) => a + b, 0) / reps.length;
  if (avgReps < minReps - 2) {
    // Deload to prevent fatigue damage and form breakdown
    const decrement = maxWeight >= 15 ? (maxWeight >= 40 ? 5.0 : 2.5) : 1.0;
    const recommendedWeight = Math.max(decrement, maxWeight - decrement);

    return {
      action: 'reduce_load',
      message: `Fatigue alert: You averaged ${avgReps.toFixed(1)} reps, which fell short of your ${minReps} rep minimum. Reduce load slightly to ${recommendedWeight}kg to prioritize range of motion and form.`,
      suggestedSets: Array.from({ length: numSets }).map((_, i) => ({
        set_index: i,
        weight: recommendedWeight,
        reps: `${minReps}-${maxReps}`
      }))
    };
  }

  // Rule D: Neutral maintain state (just missed the minimum target slightly)
  return {
    action: 'maintain',
    message: `Keep pushing. Retain your current weight of ${maxWeight}kg. Focus on hitting at least ${minReps} reps in your first 2 sets next time.`,
    suggestedSets: Array.from({ length: numSets }).map((_, i) => ({
      set_index: i,
      weight: maxWeight,
      reps: `${minReps}-${maxReps}`
    }))
  };
}

/**
 * Checks for a plateau in the exercise history.
 * A plateau is identified if the user has performed the exercise in at least 3 distinct sessions,
 * and the average weight and total reps did not increase.
 */
function checkPlateau(exercise, history = []) {
  const subs = exercise.valid_substitutions || exercise.substitutions;
  if (!history || history.length < 3 || !subs || subs.length === 0) {
    return { plateau: false };
  }

  // Filter history for this exercise, sort descending by date (recent first)
  const exHistory = history
    .filter(h => h.exercise_name === exercise.name || h.exercise_id === exercise.id)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  if (exHistory.length < 3) {
    return { plateau: false };
  }

  // Compare the last 3 sessions
  const last3 = exHistory.slice(0, 3);
  
  // Extract average weights and reps for the last 3 workouts
  const performances = last3.map(session => {
    const sets = session.sets || [];
    if (sets.length === 0) return { avgWeight: 0, totalReps: 0 };
    const avgW = sets.reduce((s, x) => s + (parseFloat(x.weight) || 0), 0) / sets.length;
    const totR = sets.reduce((s, x) => s + (parseInt(x.reps) || 0), 0);
    return { avgWeight: avgW, totalReps: totR };
  });

  const [p1, p2, p3] = performances;

  // If weights and reps did not go up (p1 <= p2 <= p3 or very minor fluctuation)
  const weightStagnant = p1.avgWeight <= p2.avgWeight + 0.5 && p2.avgWeight <= p3.avgWeight + 0.5;
  const repsStagnant = p1.totalReps <= p2.totalReps && p2.totalReps <= p3.totalReps;

  if (weightStagnant && repsStagnant) {
    const subId = (exercise.valid_substitutions && exercise.valid_substitutions[0]) || (exercise.substitutions && exercise.substitutions[0]);
    if (subId) {
      const subObj = getExerciseById(subId);
      return {
        plateau: true,
        substituteId: subObj ? subObj.id : subId,
        substituteName: subObj ? subObj.name : subId,
        substituteRepRange: subObj ? (subObj.recommended_rep_ranges || subObj.rep_range) : '8-12'
      };
    }
  }

  return { plateau: false };
}
