import { EXERCISE_DATABASE } from './exercises.js';

/**
 * Finds replacement candidates for a given exercise.
 * Prioritizes direct valid_substitutions, then matching muscle and movement patterns.
 * Filters by user equipment and exclusions.
 */
export function findReplacements(targetExerciseId, profile, currentSessionExercises) {
  const target = EXERCISE_DATABASE.find(ex => ex.id === targetExerciseId);
  if (!target) return { recommended: [], others: [] };

  const userEquipment = Array.isArray(profile?.equipment_available) 
    ? profile.equipment_available.map(e => e.toLowerCase()) 
    : ['bodyweight', 'barbell', 'dumbbell', 'cables', 'machines'];
  
  // Ensure we don't return equipment the user doesn't have, unless it's bodyweight
  const hasEquipment = (eq) => {
    if (!eq || eq.toLowerCase() === 'bodyweight') return true;
    // Map exercise DB equipment strings to user profile equipment
    const eqLower = eq.toLowerCase();
    if (eqLower.includes('barbell') && (userEquipment.includes('barbell') || userEquipment.includes('barbells'))) return true;
    if (eqLower.includes('dumbbell') && (userEquipment.includes('dumbbell') || userEquipment.includes('dumbbells'))) return true;
    if (eqLower.includes('cable') && (userEquipment.includes('cable') || userEquipment.includes('cables'))) return true;
    if (eqLower.includes('machine') && (userEquipment.includes('machine') || userEquipment.includes('machines'))) return true;
    if (eqLower.includes('kettlebell') && (userEquipment.includes('kettlebell') || userEquipment.includes('kettlebells'))) return true;
    if (eqLower.includes('band') && (userEquipment.includes('band') || userEquipment.includes('bands'))) return true;
    return false;
  };

  const prefs = profile?.exercise_preferences || { favorites: [], excluded: [] };
  const excluded = Array.isArray(prefs.excluded) ? prefs.excluded : [];
  const favorites = Array.isArray(prefs.favorites) ? prefs.favorites : [];

  const currentIds = currentSessionExercises.map(ex => ex.id);

  let recommended = [];
  let others = [];

  // 1. Recommended = valid_substitutions
  if (target.valid_substitutions && target.valid_substitutions.length > 0) {
    recommended = EXERCISE_DATABASE.filter(ex => 
      target.valid_substitutions.includes(ex.id) &&
      !currentIds.includes(ex.id) &&
      !excluded.includes(ex.id) &&
      hasEquipment(ex.equipment)
    );
  }

  // 2. Others = same primary muscle and compound/isolation type
  const recommendedIds = recommended.map(r => r.id);
  others = EXERCISE_DATABASE.filter(ex => 
    ex.id !== target.id &&
    !recommendedIds.includes(ex.id) &&
    !currentIds.includes(ex.id) &&
    !excluded.includes(ex.id) &&
    ex.primary_muscles.some(m => target.primary_muscles.includes(m)) &&
    ex.compound_or_isolation === target.compound_or_isolation &&
    hasEquipment(ex.equipment)
  );

  // Sort favorites to the top
  const sortByFavorite = (a, b) => {
    const aFav = favorites.includes(a.id) ? 1 : 0;
    const bFav = favorites.includes(b.id) ? 1 : 0;
    return bFav - aFav;
  };

  recommended.sort(sortByFavorite);
  others.sort(sortByFavorite);

  return { recommended, others };
}

/**
 * Validates a proposed customized session.
 * @param {Array} newExercises - The array of proposed exercise objects.
 * @param {Array} originalExercises - The array of original exercise objects.
 * @returns {Array} List of warning string messages.
 */
export function validateWorkoutChange(newExercises, originalExercises) {
  const warnings = [];
  
  // 1. Check redundancy (movement patterns)
  const patternCounts = {};
  newExercises.forEach(ex => {
    ex.movement_patterns?.forEach(pattern => {
      patternCounts[pattern] = (patternCounts[pattern] || 0) + 1;
    });
  });

  for (const [pattern, count] of Object.entries(patternCounts)) {
    if (count > 2 && !pattern.includes('core') && !pattern.includes('calf')) {
      warnings.push(`Excessive Redundancy: You have ${count} exercises using the ${pattern.replace('_', ' ')} movement pattern in this session. Consider choosing a different movement.`);
    }
  }

  // 2. Check total session volume (sets)
  let totalSets = 0;
  newExercises.forEach(ex => {
    totalSets += parseInt(ex.sets || 3);
  });

  if (totalSets > 24) {
    warnings.push(`Excessive Volume: Your total set count is ${totalSets}. Training over 24 sets in a single session may exceed a 60-minute duration and impact recovery.`);
  }

  // 3. Muscle group shifts (compare to original)
  const getMuscleSets = (exercises) => {
    const counts = {};
    exercises.forEach(ex => {
      const sets = parseInt(ex.sets || 3);
      if (ex.primary_muscle) {
        counts[ex.primary_muscle] = (counts[ex.primary_muscle] || 0) + sets;
      }
    });
    return counts;
  };

  const oldMuscles = getMuscleSets(originalExercises);
  const newMuscles = getMuscleSets(newExercises);

  for (const [muscle, newSets] of Object.entries(newMuscles)) {
    const oldSets = oldMuscles[muscle] || 0;
    if (newSets > oldSets + 3) {
      warnings.push(`Volume Shift: You've significantly increased the workload for ${muscle.replace('_', ' ')} compared to the original coach plan.`);
    }
  }

  return warnings;
}
