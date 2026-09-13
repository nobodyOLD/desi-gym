// lib/workoutAnalyzer.js

/**
 * Analyzes a custom workout array and returns an evaluation object.
 * @param {Array} exercises - The array of custom exercises built by the user.
 * @returns {Object} Analysis results including muscle coverage, redundancy, duration, and recommendations.
 */
export function analyzeWorkout(exercises) {
  if (!exercises || exercises.length === 0) {
    return { empty: true };
  }

  const muscleVolume = {};
  const patternCount = {};
  let totalSets = 0;
  const warnings = [];
  const recommendations = [];

  exercises.forEach((ex, index) => {
    const sets = parseInt(ex.sets) || 3;
    totalSets += sets;

    // Track Patterns
    if (ex.movement_patterns) {
      ex.movement_patterns.forEach(pattern => {
        patternCount[pattern] = (patternCount[pattern] || 0) + 1;
      });
    }

    // Track Muscles
    const primary = ex.primary_muscle || (ex.primary_muscles && ex.primary_muscles[0]);
    if (primary) {
      const pLower = primary.toLowerCase();
      muscleVolume[pLower] = (muscleVolume[pLower] || 0) + sets;
    }
  });

  // Calculate Duration
  // Avg 45s work + 90s rest = 135s (2.25 mins) per set, plus 5 min warm-up/transitions
  const estimatedDurationMinutes = Math.round(totalSets * 2.25) + 5;
  if (estimatedDurationMinutes > 75) {
    warnings.push("Your session may exceed 75 minutes, which can decrease intensity and focus.");
  }

  // Analyze Redundancy
  const highlyRedundantPatterns = [];
  for (const [pattern, count] of Object.entries(patternCount)) {
    if (count > 2 && !['elbow_flexion', 'elbow_extension', 'shoulder_abduction', 'core_flexion'].includes(pattern)) {
      highlyRedundantPatterns.push(pattern);
      warnings.push(`High redundancy detected: ${count} exercises use the "${pattern.replace('_', ' ')}" movement pattern.`);
      recommendations.push(`Consider replacing one "${pattern.replace('_', ' ')}" movement with an isolation exercise to balance fatigue.`);
    }
  }

  // Analyze Muscle Coverage
  const coverage = Object.keys(muscleVolume).map(muscle => {
    const sets = muscleVolume[muscle];
    let level = 'Low';
    if (sets >= 10) level = 'High';
    else if (sets >= 5) level = 'Moderate';
    return { muscle, sets, level };
  });

  // Check Exercise Order (Compound vs Isolation)
  // Simple heuristic: If isolation is performed before compound for the same muscle, warn.
  let isolationFound = false;
  exercises.forEach((ex, index) => {
    const isCompound = ex.compound_or_isolation === 'COMPOUND' || (ex.movement_patterns && !ex.movement_patterns.some(p => p.includes('isolation') || p.includes('flexion') || p.includes('extension')));
    const isIsolation = !isCompound;
    
    if (isIsolation && index < exercises.length / 2) {
      isolationFound = true;
    } else if (isCompound && isolationFound && index > exercises.length / 2) {
      warnings.push(`Suboptimal Order: You have a primary compound movement (${ex.name}) placed late in the session after isolation work.`);
      recommendations.push(`Consider moving your heaviest compound movements to the start of the workout when you are fresh.`);
    }
  });

  // Overall Score
  let score = 'GOOD';
  if (warnings.length >= 3) score = 'HIGH REDUNDANCY';
  else if (warnings.length > 0) score = 'NEEDS ATTENTION';
  else if (totalSets > 30) score = 'HIGH VOLUME';

  return {
    score,
    estimatedDurationMinutes,
    coverage,
    warnings: [...new Set(warnings)], // unique
    recommendations: [...new Set(recommendations)],
    totalSets
  };
}
