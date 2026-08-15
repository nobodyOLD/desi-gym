/**
 * DESI GYM — V4 Exercise Knowledge Database
 * Features 105 exercises mapped to the V4 muscle and movement taxonomies,
 * redundancy groups, fatigue/stability scores, and training suitability flags.
 * 
 * Updated with PDF templates.
 */

export const EXERCISE_DATABASE = [
  {
    "id": "barbell_bench_press",
    "name": "Barbell Bench Press",
    "aliases": [
      "bench_press",
      "flat_bench_press"
    ],
    "primary_muscles": [
      "chest"
    ],
    "secondary_muscles": [
      "front_delts",
      "triceps"
    ],
    "movement_patterns": [
      "horizontal_push"
    ],
    "category": "PRIMARY_COMPOUND",
    "exercise_role": "PRIMARY_COMPOUND",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "6-10",
    "recommended_rest_ranges": "120s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_bench_press",
      "machine_chest_press",
      "smith_machine_bench_press"
    ],
    "instructions": [
      "Lie flat on the bench. Grip the barbell slightly wider than shoulder-width.",
      "Unrack the bar and lower it under control to your mid-chest, keeping elbows at a 45-degree angle.",
      "Press the bar back up forcefully to full arm extension."
    ],
    "common_technique_errors": [
      "Flaring elbows out to 90 degrees, which places excessive stress on shoulders.",
      "Bouncing the bar off the chest.",
      "Lifting hips off the bench."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "HORIZONTAL_PRESSING_1",
    "fatigue_score": 5,
    "stability_score": 3,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "dumbbell_bench_press",
    "name": "Dumbbell Bench Press",
    "aliases": [
      "db_bench_press",
      "flat_db_press"
    ],
    "primary_muscles": [
      "chest"
    ],
    "secondary_muscles": [
      "front_delts",
      "triceps"
    ],
    "movement_patterns": [
      "horizontal_push"
    ],
    "category": "SECONDARY_COMPOUND",
    "exercise_role": "SECONDARY_COMPOUND",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "120s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "barbell_bench_press",
      "machine_chest_press",
      "smith_machine_bench_press"
    ],
    "instructions": [
      "Sit on a flat bench with dumbbells on your knees. Lie back, bringing weights to your chest.",
      "Press the dumbbells straight up, rotating palms slightly inward for a neutral shoulder path.",
      "Lower under control until elbows are slightly below bench height, then press back up."
    ],
    "common_technique_errors": [
      "Clanging dumbbells together at the top (disengages chest tension).",
      "Dropping dumbbells too fast without eccentric control."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "HORIZONTAL_PRESSING_1",
    "fatigue_score": 3,
    "stability_score": 2,
    "skill_score": 2,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "incline_barbell_bench_press",
    "name": "Incline Barbell Bench Press",
    "aliases": [
      "incline_bench",
      "incline_press"
    ],
    "primary_muscles": [
      "chest"
    ],
    "secondary_muscles": [
      "front_delts",
      "triceps"
    ],
    "movement_patterns": [
      "horizontal_push"
    ],
    "category": "PRIMARY_COMPOUND",
    "exercise_role": "PRIMARY_COMPOUND",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "6-10",
    "recommended_rest_ranges": "90-120s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "incline_dumbbell_press"
    ],
    "instructions": [
      "Set an incline bench to 30-45 degrees.",
      "Grip the bar slightly wider than shoulder-width.",
      "Lower the bar control-led to your upper chest, then press back up."
    ],
    "common_technique_errors": [
      "Bouncing the bar off upper chest.",
      "Bench angle too steep (shifts work entirely to shoulders)."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "HORIZONTAL_PRESSING_INCLINE",
    "fatigue_score": 4,
    "stability_score": 3,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "incline_dumbbell_press",
    "name": "Incline Dumbbell Press",
    "aliases": [
      "incline_db_press"
    ],
    "primary_muscles": [
      "chest"
    ],
    "secondary_muscles": [
      "front_delts",
      "triceps"
    ],
    "movement_patterns": [
      "horizontal_push"
    ],
    "category": "SECONDARY_COMPOUND",
    "exercise_role": "SECONDARY_COMPOUND",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "120s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "incline_barbell_bench_press",
      "incline_barbell_press"
    ],
    "instructions": [
      "Set an incline bench to 30-45 degrees. Hold dumbbells at shoulder height.",
      "Press the weights straight up over your face, keeping elbows slightly tucked.",
      "Lower under control until chest is fully stretched, then press."
    ],
    "common_technique_errors": [
      "Lowering dumbbells too far out wide, causing shoulder hyperextension.",
      "Arching lower back off the bench excessively."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "HORIZONTAL_PRESSING_INCLINE",
    "fatigue_score": 3,
    "stability_score": 2,
    "skill_score": 2,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "machine_chest_press",
    "name": "Machine Chest Press",
    "aliases": [
      "chest_press_machine"
    ],
    "primary_muscles": [
      "chest"
    ],
    "secondary_muscles": [
      "front_delts",
      "triceps"
    ],
    "movement_patterns": [
      "horizontal_push"
    ],
    "category": "STABLE_COMPOUND",
    "exercise_role": "STABLE_COMPOUND",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-15",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "barbell_bench_press",
      "dumbbell_bench_press"
    ],
    "instructions": [
      "Adjust the seat so handles align with mid-chest. Press back flat to pad.",
      "Push handles forward explosively without locking out elbows.",
      "Return handles control-led to starting position, keeping chest under tension."
    ],
    "common_technique_errors": [
      "Letting shoulders roll forward off the pad at extension.",
      "Not using full range of motion."
    ],
    "safety_flags": [],
    "redundancy_group": "HORIZONTAL_PRESSING_1",
    "fatigue_score": 2,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "smith_machine_bench_press",
    "name": "Smith Machine Bench Press",
    "aliases": [
      "smith_bench"
    ],
    "primary_muscles": [
      "chest"
    ],
    "secondary_muscles": [
      "front_delts",
      "triceps"
    ],
    "movement_patterns": [
      "horizontal_push"
    ],
    "category": "STABLE_COMPOUND",
    "exercise_role": "STABLE_COMPOUND",
    "equipment": "Machines",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "barbell_bench_press",
      "dumbbell_bench_press",
      "machine_chest_press"
    ],
    "instructions": [
      "Position a flat bench under the Smith bar. Lie down, align bar with mid-chest.",
      "Unlock the bar and lower it under control to chest.",
      "Press up forcefully."
    ],
    "common_technique_errors": [
      "Improper alignment, forcing shoulders into unnatural rotational paths."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "HORIZONTAL_PRESSING_1",
    "fatigue_score": 3,
    "stability_score": 4,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "push_up",
    "name": "Push-up",
    "aliases": [
      "bodyweight_pushup"
    ],
    "primary_muscles": [
      "chest"
    ],
    "secondary_muscles": [
      "front_delts",
      "triceps"
    ],
    "movement_patterns": [
      "horizontal_push"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-20",
    "recommended_rest_ranges": "90s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "assisted_push_up",
      "dumbbell_bench_press",
      "machine_chest_press"
    ],
    "instructions": [
      "Get into a plank position with hands slightly wider than shoulders.",
      "Lower your body until your chest nearly touches the floor, keeping body in a straight line.",
      "Push back up to starting position."
    ],
    "common_technique_errors": [
      "Sagging hips or arching lower back.",
      "Flaring elbows out to 90 degrees."
    ],
    "safety_flags": [],
    "redundancy_group": "PUSHUP_FAMILY",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "assisted_push_up",
    "name": "Assisted Push-up",
    "aliases": [
      "knee_push_up"
    ],
    "primary_muscles": [
      "chest"
    ],
    "secondary_muscles": [
      "front_delts",
      "triceps"
    ],
    "movement_patterns": [
      "horizontal_push"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner"
    ],
    "goals": [
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "60s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "push_up"
    ],
    "instructions": [
      "Position yourself on hands and knees, hands slightly wider than shoulders.",
      "Lower chest to floor while keeping spine straight.",
      "Press back up."
    ],
    "common_technique_errors": [
      "Bending hips rather than keeping body straight from knees to head."
    ],
    "safety_flags": [],
    "redundancy_group": "PUSHUP_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "pec_deck",
    "name": "Pec Deck Fly",
    "aliases": [
      "machine_fly"
    ],
    "primary_muscles": [
      "chest"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "shoulder_abduction",
      "horizontal_push"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "75s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "cable_fly",
      "dumbbell_fly"
    ],
    "instructions": [
      "Sit back against pad. Place forearms/hands on handles, elbows slightly bent.",
      "Squeeze handles together in front of chest, concentrating on chest squeeze.",
      "Slowly return to fully stretched position."
    ],
    "common_technique_errors": [
      "Letting shoulders shrug up.",
      "Pressing with hands instead of driving with elbows."
    ],
    "safety_flags": [],
    "redundancy_group": "CHEST_FLY_FAMILY",
    "fatigue_score": 1,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "cable_fly",
    "name": "Cable Fly",
    "aliases": [
      "cable_chest_fly"
    ],
    "primary_muscles": [
      "chest"
    ],
    "secondary_muscles": [
      "front_delts"
    ],
    "movement_patterns": [
      "shoulder_abduction",
      "horizontal_push"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "75s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "pec_deck",
      "dumbbell_fly"
    ],
    "instructions": [
      "Set cables to chest height. Step forward, keeping arms slightly bent.",
      "Bring hands together in a wide arc in front of chest, squeezing inner pecs.",
      "Control weights back under tension to full stretch."
    ],
    "common_technique_errors": [
      "Bending elbows too much (turns exercise into a press)."
    ],
    "safety_flags": [],
    "redundancy_group": "CHEST_FLY_FAMILY",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "dumbbell_fly",
    "name": "Dumbbell Fly",
    "aliases": [
      "flat_db_fly"
    ],
    "primary_muscles": [
      "chest"
    ],
    "secondary_muscles": [
      "front_delts"
    ],
    "movement_patterns": [
      "shoulder_abduction",
      "horizontal_push"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "75s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "cable_fly",
      "pec_deck"
    ],
    "instructions": [
      "Lie on flat bench holding dumbbells above chest, palms facing each other.",
      "Lower weights out to sides in wide arc, keeping elbows slightly bent.",
      "Squeeze pecs to pull weights back to starting position."
    ],
    "common_technique_errors": [
      "Lowering too deep, putting excessive strain on anterior shoulder capsule."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "CHEST_FLY_FAMILY",
    "fatigue_score": 1,
    "stability_score": 1,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "decline_dumbbell_press",
    "name": "Decline Dumbbell Press",
    "aliases": [
      "decline_db_press"
    ],
    "primary_muscles": [
      "chest"
    ],
    "secondary_muscles": [
      "front_delts",
      "triceps"
    ],
    "movement_patterns": [
      "horizontal_push"
    ],
    "category": "SECONDARY_COMPOUND",
    "exercise_role": "SECONDARY_COMPOUND",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_bench_press"
    ],
    "instructions": [
      "Secure feet under pads of a decline bench. Lie back with dumbbells.",
      "Press weights up over lower chest.",
      "Lower control-led and press."
    ],
    "common_technique_errors": [
      "Dumbbells hitting ribs."
    ],
    "safety_flags": [],
    "redundancy_group": "HORIZONTAL_PRESSING_1",
    "fatigue_score": 3,
    "stability_score": 2,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "pull_up",
    "name": "Pull-up",
    "aliases": [
      "chin_up"
    ],
    "primary_muscles": [
      "back_lats"
    ],
    "secondary_muscles": [
      "back_upper",
      "biceps"
    ],
    "movement_patterns": [
      "vertical_pull"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "6-12",
    "recommended_rest_ranges": "120s",
    "progression_method": "Linear Overload",
    "valid_substitutions": [
      "assisted_pull_up",
      "lat_pulldown",
      "assisted_pullup"
    ],
    "instructions": [
      "Hang from a bar with overhand grip wider than shoulders.",
      "Pull your body up, driving elbows down until chin clears bar.",
      "Lower under control to a dead hang stretch."
    ],
    "common_technique_errors": [
      "Using leg kick or body momentum (kipping).",
      "Not locking out arms at bottom (partial range)."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "LAT_PULLDOWN_FAMILY",
    "fatigue_score": 4,
    "stability_score": 2,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "assisted_pull_up",
    "name": "Assisted Pull-up",
    "aliases": [
      "assisted_chin_up"
    ],
    "primary_muscles": [
      "back_lats"
    ],
    "secondary_muscles": [
      "back_upper",
      "biceps"
    ],
    "movement_patterns": [
      "vertical_pull"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "pull_up",
      "lat_pulldown",
      "pullup"
    ],
    "instructions": [
      "Stand/kneel on pad, grip handles wide.",
      "Pull up, chest to bar.",
      "Lower under control."
    ],
    "common_technique_errors": [
      "Swinging."
    ],
    "safety_flags": [],
    "redundancy_group": "LAT_PULLDOWN_FAMILY",
    "fatigue_score": 2,
    "stability_score": 4,
    "skill_score": 2,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "lat_pulldown",
    "name": "Lat Pulldown",
    "aliases": [
      "cable_lat_pulldown"
    ],
    "primary_muscles": [
      "back_lats"
    ],
    "secondary_muscles": [
      "back_upper",
      "biceps"
    ],
    "movement_patterns": [
      "vertical_pull"
    ],
    "category": "STABLE_COMPOUND",
    "exercise_role": "STABLE_COMPOUND",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "pull_up",
      "neutral_grip_pulldown",
      "pullup",
      "neutralgrip_pulldown",
      "assisted_pullup"
    ],
    "instructions": [
      "Sit in seat, lock knees. Grip bar wider than shoulders.",
      "Lean back slightly. Pull bar to upper chest, leading with elbows.",
      "Slowly return to full overhead arm extension."
    ],
    "common_technique_errors": [
      "Swinging torso back and forth to generate momentum.",
      "Pulling bar behind the neck (dangerous shoulder rotation)."
    ],
    "safety_flags": [],
    "redundancy_group": "LAT_PULLDOWN_FAMILY",
    "fatigue_score": 2,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "neutral_grip_pulldown",
    "name": "Neutral-Grip Pulldown",
    "aliases": [
      "close_grip_pulldown"
    ],
    "primary_muscles": [
      "back_lats"
    ],
    "secondary_muscles": [
      "back_upper",
      "biceps"
    ],
    "movement_patterns": [
      "vertical_pull"
    ],
    "category": "STABLE_COMPOUND",
    "exercise_role": "STABLE_COMPOUND",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "lat_pulldown"
    ],
    "instructions": [
      "Attach a V-bar or parallel handles to pulldown machine.",
      "Sit and pull down, keeping elbows tucked close to sides.",
      "Squeeze at bottom, then slowly extend."
    ],
    "common_technique_errors": [
      "Allowing elbows to flare outward."
    ],
    "safety_flags": [],
    "redundancy_group": "LAT_PULLDOWN_FAMILY",
    "fatigue_score": 2,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "barbell_row",
    "name": "Barbell Row",
    "aliases": [
      "bent_over_row",
      "bb_row"
    ],
    "primary_muscles": [
      "back_upper"
    ],
    "secondary_muscles": [
      "back_lats",
      "biceps",
      "core_anti_extension"
    ],
    "movement_patterns": [
      "horizontal_pull"
    ],
    "category": "PRIMARY_COMPOUND",
    "exercise_role": "PRIMARY_COMPOUND",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "6-10",
    "recommended_rest_ranges": "120s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_row",
      "t_bar_row",
      "chestsupported_row"
    ],
    "instructions": [
      "Stand holding barbell overhand. Hinge at hips to 45 degrees, keeping spine flat.",
      "Pull bar to lower sternum, squeezing shoulder blades at top.",
      "Lower bar under control."
    ],
    "common_technique_errors": [
      "Rounding spine (risks lower back injury).",
      "Standing too upright (turns exercise into shrugs)."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "ROW_FAMILY",
    "fatigue_score": 5,
    "stability_score": 2,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "dumbbell_row",
    "name": "Dumbbell Row",
    "aliases": [
      "single_arm_db_row",
      "db_row"
    ],
    "primary_muscles": [
      "back_upper"
    ],
    "secondary_muscles": [
      "back_lats",
      "biceps"
    ],
    "movement_patterns": [
      "horizontal_pull"
    ],
    "category": "SECONDARY_COMPOUND",
    "exercise_role": "SECONDARY_COMPOUND",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "UNILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "barbell_row",
      "chest_supported_row",
      "chestsupported_row",
      "seated_cable_row"
    ],
    "instructions": [
      "Support one knee and hand on bench, spine flat.",
      "Hold dumbbell in free hand. Pull weight to hip crease.",
      "Squeeze lat at top, then lower fully."
    ],
    "common_technique_errors": [
      "Twisting torso to jerk dumbbell up.",
      "Pulling up to shoulder instead of hip crease."
    ],
    "safety_flags": [],
    "redundancy_group": "ROW_FAMILY",
    "fatigue_score": 3,
    "stability_score": 3,
    "skill_score": 2,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "chest_supported_row",
    "name": "Chest-Supported Row",
    "aliases": [
      "incline_db_row"
    ],
    "primary_muscles": [
      "back_upper"
    ],
    "secondary_muscles": [
      "back_lats",
      "biceps"
    ],
    "movement_patterns": [
      "horizontal_pull"
    ],
    "category": "SECONDARY_COMPOUND",
    "exercise_role": "SECONDARY_COMPOUND",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_row",
      "seated_cable_row",
      "machine_row"
    ],
    "instructions": [
      "Lie face down on incline bench set to 30 degrees.",
      "Hold dumbbells, pull elbows up toward ceiling, pinching shoulder blades.",
      "Slowly extend to full arm hang."
    ],
    "common_technique_errors": [
      "Lifting chest off pad (forces lower back overload)."
    ],
    "safety_flags": [],
    "redundancy_group": "ROW_FAMILY",
    "fatigue_score": 2,
    "stability_score": 4,
    "skill_score": 2,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "seated_cable_row",
    "name": "Seated Cable Row",
    "aliases": [
      "cable_row"
    ],
    "primary_muscles": [
      "back_upper"
    ],
    "secondary_muscles": [
      "back_lats",
      "biceps"
    ],
    "movement_patterns": [
      "horizontal_pull"
    ],
    "category": "STABLE_COMPOUND",
    "exercise_role": "STABLE_COMPOUND",
    "equipment": "Cables",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "chest_supported_row",
      "machine_row",
      "chestsupported_row"
    ],
    "instructions": [
      "Sit at cable row machine, feet braced. Hold handles with arms extended.",
      "Pull handles to lower abdomen, squeezing upper back.",
      "Slowly return to start stretch."
    ],
    "common_technique_errors": [
      "Leaning back excessively.",
      "Shrugging shoulders up."
    ],
    "safety_flags": [],
    "redundancy_group": "ROW_FAMILY",
    "fatigue_score": 2,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "machine_row",
    "name": "Machine Row",
    "aliases": [
      "row_machine"
    ],
    "primary_muscles": [
      "back_upper"
    ],
    "secondary_muscles": [
      "biceps"
    ],
    "movement_patterns": [
      "horizontal_pull"
    ],
    "category": "STABLE_COMPOUND",
    "exercise_role": "STABLE_COMPOUND",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "seated_cable_row",
      "chestsupported_row"
    ],
    "instructions": [
      "Sit in machine, chest flat to chest pad.",
      "Pull handles back, squeezing shoulder blades.",
      "Return handles control-led."
    ],
    "common_technique_errors": [
      "Torso lifting off chest pad."
    ],
    "safety_flags": [],
    "redundancy_group": "ROW_FAMILY",
    "fatigue_score": 2,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "t_bar_row",
    "name": "T-Bar Row",
    "aliases": [
      "tbar_row"
    ],
    "primary_muscles": [
      "back_upper"
    ],
    "secondary_muscles": [
      "back_lats",
      "biceps",
      "core_anti_extension"
    ],
    "movement_patterns": [
      "horizontal_pull"
    ],
    "category": "PRIMARY_COMPOUND",
    "exercise_role": "PRIMARY_COMPOUND",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "6-10",
    "recommended_rest_ranges": "105s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "barbell_row",
      "chestsupported_row"
    ],
    "instructions": [
      "Straddle a T-bar row bar. Hold handles, spine neutral, knees bent.",
      "Pull weight to chest, elbows close.",
      "Extend control-led."
    ],
    "common_technique_errors": [
      "Hyperextending spine at top.",
      "Spine rounding."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "ROW_FAMILY",
    "fatigue_score": 4,
    "stability_score": 3,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "inverted_row",
    "name": "Inverted Row",
    "aliases": [
      "bodyweight_row"
    ],
    "primary_muscles": [
      "back_upper"
    ],
    "secondary_muscles": [
      "biceps"
    ],
    "movement_patterns": [
      "horizontal_pull"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "90s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "dumbbell_row",
      "chestsupported_row"
    ],
    "instructions": [
      "Set bar in Smith machine at waist height. Lie underneath.",
      "Grip bar overhand, lift hips. Pull chest to bar.",
      "Lower under control."
    ],
    "common_technique_errors": [
      "Sagging hips."
    ],
    "safety_flags": [],
    "redundancy_group": "ROW_FAMILY",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "single_arm_cable_row",
    "name": "Single-Arm Cable Row",
    "aliases": [
      "unilateral_cable_row"
    ],
    "primary_muscles": [
      "back_lats"
    ],
    "secondary_muscles": [
      "back_upper",
      "biceps"
    ],
    "movement_patterns": [
      "horizontal_pull"
    ],
    "category": "UNILATERAL",
    "exercise_role": "UNILATERAL",
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "UNILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "10-12",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_row"
    ],
    "instructions": [
      "Attach handle, set cable to waist height.",
      "Row unilaterally to hip crease, rotation optional.",
      "Slowly return."
    ],
    "common_technique_errors": [
      "Rotating hips."
    ],
    "safety_flags": [],
    "redundancy_group": "ROW_FAMILY",
    "fatigue_score": 2,
    "stability_score": 3,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "straight_arm_pulldown",
    "name": "Straight-Arm Pulldown",
    "aliases": [
      "straight_arm_pullover"
    ],
    "primary_muscles": [
      "back_lats"
    ],
    "secondary_muscles": [
      "triceps"
    ],
    "movement_patterns": [
      "vertical_pull"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [],
    "instructions": [
      "Stand at cable stack, hold straight bar overhand, arms extended.",
      "Pull bar down to thighs using lats, keeping arms straight.",
      "Slowly return."
    ],
    "common_technique_errors": [
      "Bending elbows (turns exercise into pressdowns)."
    ],
    "safety_flags": [],
    "redundancy_group": "LAT_PULLDOWN_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "rack_pull",
    "name": "Rack Pull",
    "aliases": [
      "rack_pulls"
    ],
    "primary_muscles": [
      "back_upper"
    ],
    "secondary_muscles": [
      "glutes",
      "hamstrings",
      "core_anti_extension"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "PRIMARY_COMPOUND",
    "exercise_role": "PRIMARY_COMPOUND",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "strength",
      "hypertrophy"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "5-8",
    "recommended_rest_ranges": "120s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "barbell_deadlift"
    ],
    "instructions": [
      "Set safety bars in rack to knee height. Place bar.",
      "Hinge and grab bar. Stand fully upright, pushing hips forward.",
      "Lower bar back control-led."
    ],
    "common_technique_errors": [
      "Rounding spine.",
      "Throwing back excessively at top."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "DEADLIFT_FAMILY",
    "fatigue_score": 5,
    "stability_score": 3,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "back_extension",
    "name": "Back Extension",
    "aliases": [
      "hyper_extension"
    ],
    "primary_muscles": [
      "core_anti_extension"
    ],
    "secondary_muscles": [
      "glutes",
      "hamstrings"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "general_fitness",
      "hypertrophy"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [],
    "instructions": [
      "Position yourself on 45-degree extension pad.",
      "Hinge forward at waist, then contract glutes and lower back to stand straight.",
      "Do not hyperextend at top."
    ],
    "common_technique_errors": [
      "Hyperextending spine."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "DEADLIFT_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "barbell_overhead_press",
    "name": "Barbell Overhead Press",
    "aliases": [
      "ohp",
      "overhead_press",
      "bb_press"
    ],
    "primary_muscles": [
      "front_delts"
    ],
    "secondary_muscles": [
      "side_delts",
      "triceps"
    ],
    "movement_patterns": [
      "vertical_push"
    ],
    "category": "PRIMARY_COMPOUND",
    "exercise_role": "PRIMARY_COMPOUND",
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "strength",
      "hypertrophy"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "6-10",
    "recommended_rest_ranges": "120s",
    "progression_method": "Linear Overload",
    "valid_substitutions": [
      "dumbbell_shoulder_press",
      "machine_shoulder_press"
    ],
    "instructions": [
      "Hold bar at shoulder level, feet shoulder-width, core tight.",
      "Press the bar straight overhead, moving your head back slightly to clear the bar path.",
      "Lock out at top, shrug shoulders up, then return control-led."
    ],
    "common_technique_errors": [
      "Excessive arching of lower back (leads to lumbar strain).",
      "Using leg drive (converts exercise into push press)."
    ],
    "safety_flags": [
      "lower_back",
      "shoulder"
    ],
    "redundancy_group": "VERTICAL_PRESSING",
    "fatigue_score": 5,
    "stability_score": 2,
    "skill_score": 4,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "dumbbell_shoulder_press",
    "name": "Dumbbell Shoulder Press",
    "aliases": [
      "db_press",
      "db_shoulder_press"
    ],
    "primary_muscles": [
      "front_delts"
    ],
    "secondary_muscles": [
      "side_delts",
      "triceps"
    ],
    "movement_patterns": [
      "vertical_push"
    ],
    "category": "SECONDARY_COMPOUND",
    "exercise_role": "SECONDARY_COMPOUND",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "105s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "barbell_overhead_press",
      "machine_shoulder_press",
      "arnold_press"
    ],
    "instructions": [
      "Sit/stand holding dumbbells at ear height, elbows forward slightly.",
      "Press weights straight overhead without touching them at top.",
      "Lower under control to ear height."
    ],
    "common_technique_errors": [
      "Elbows flared too wide (impinges shoulders).",
      "Hyperextending spine."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "VERTICAL_PRESSING",
    "fatigue_score": 3,
    "stability_score": 2,
    "skill_score": 2,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "machine_shoulder_press",
    "name": "Machine Shoulder Press",
    "aliases": [
      "shoulder_press_machine"
    ],
    "primary_muscles": [
      "front_delts"
    ],
    "secondary_muscles": [
      "triceps"
    ],
    "movement_patterns": [
      "vertical_push"
    ],
    "category": "STABLE_COMPOUND",
    "exercise_role": "STABLE_COMPOUND",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_shoulder_press",
      "barbell_overhead_press"
    ],
    "instructions": [
      "Adjust seat, hold handles.",
      "Press handles up control-led.",
      "Lower under control."
    ],
    "common_technique_errors": [
      "Shrugging shoulders."
    ],
    "safety_flags": [],
    "redundancy_group": "VERTICAL_PRESSING",
    "fatigue_score": 2,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "arnold_press",
    "name": "Arnold Press",
    "aliases": [
      "arnold_db_press"
    ],
    "primary_muscles": [
      "front_delts"
    ],
    "secondary_muscles": [
      "side_delts",
      "triceps"
    ],
    "movement_patterns": [
      "vertical_push"
    ],
    "category": "SECONDARY_COMPOUND",
    "exercise_role": "SECONDARY_COMPOUND",
    "equipment": "Dumbbell",
    "difficulty": "Advanced",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "105s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_shoulder_press"
    ],
    "instructions": [
      "Hold dumbbells in front of shoulders, palms facing you.",
      "Rotate palms outward while pressing weights overhead.",
      "Lower while reversing rotation."
    ],
    "common_technique_errors": [
      "Rushing rotation, risking shoulder strain."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "VERTICAL_PRESSING",
    "fatigue_score": 3,
    "stability_score": 2,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "dumbbell_lateral_raise",
    "name": "Dumbbell Lateral Raise",
    "aliases": [
      "lateral_raise"
    ],
    "primary_muscles": [
      "side_delts"
    ],
    "secondary_muscles": [
      "front_delts"
    ],
    "movement_patterns": [
      "shoulder_abduction"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-20",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "cable_lateral_raise",
      "machine_lateral_raise"
    ],
    "instructions": [
      "Hold dumbbells at sides, lean torso forward slightly.",
      "Raise arms to sides to shoulder level, leading with elbows.",
      "Lower control-led."
    ],
    "common_technique_errors": [
      "Using body swing to throw dumbbells.",
      "Lifting hands higher than elbows (shifts work to front delts)."
    ],
    "safety_flags": [],
    "redundancy_group": "SIDE_DELT_FAMILY",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "cable_lateral_raise",
    "name": "Cable Lateral Raise",
    "aliases": [
      "cable_raise"
    ],
    "primary_muscles": [
      "side_delts"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "shoulder_abduction"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "UNILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-20",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_lateral_raise",
      "machine_lateral_raise"
    ],
    "instructions": [
      "Stand adjacent to low cable pulley. Grip handle across body.",
      "Raise arm out to side to shoulder height, keeping tension flat.",
      "Lower control-led."
    ],
    "common_technique_errors": [
      "Bending elbow excessively."
    ],
    "safety_flags": [],
    "redundancy_group": "SIDE_DELT_FAMILY",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "machine_lateral_raise",
    "name": "Machine Lateral Raise",
    "aliases": [
      "lateral_raise_machine"
    ],
    "primary_muscles": [
      "side_delts"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "shoulder_abduction"
    ],
    "category": "STABLE_COMPOUND",
    "exercise_role": "STABLE_COMPOUND",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-20",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_lateral_raise",
      "cable_lateral_raise"
    ],
    "instructions": [
      "Sit in machine, press elbows to pads.",
      "Raise elbows out to shoulder height.",
      "Return control-led."
    ],
    "common_technique_errors": [
      "Letting shoulders shrug."
    ],
    "safety_flags": [],
    "redundancy_group": "SIDE_DELT_FAMILY",
    "fatigue_score": 1,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "reverse_pec_deck",
    "name": "Reverse Pec Deck",
    "aliases": [
      "rear_delt_deck"
    ],
    "primary_muscles": [
      "rear_delts"
    ],
    "secondary_muscles": [
      "back_upper"
    ],
    "movement_patterns": [
      "rear_delt_isolation"
    ],
    "category": "STABLE_COMPOUND",
    "exercise_role": "STABLE_COMPOUND",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-20",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "cable_rear_delt_fly",
      "dumbbell_rear_delt_fly",
      "cable_reardelt_fly",
      "dumbbell_reardelt_fly"
    ],
    "instructions": [
      "Sit facing pad, hold handles.",
      "Pull hands back in wide arc to contract rear delts.",
      "Slowly extend back."
    ],
    "common_technique_errors": [
      "Shrugging shoulders.",
      "Swinging body."
    ],
    "safety_flags": [],
    "redundancy_group": "REAR_DELT_FAMILY",
    "fatigue_score": 1,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "cable_rear_delt_fly",
    "name": "Cable Rear-Delt Fly",
    "aliases": [
      "cable_rear_delt"
    ],
    "primary_muscles": [
      "rear_delts"
    ],
    "secondary_muscles": [
      "back_upper"
    ],
    "movement_patterns": [
      "rear_delt_isolation"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-20",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "reverse_pec_deck",
      "dumbbell_reardelt_fly"
    ],
    "instructions": [
      "Stand at cable stack crossover. Cross cables (left hand on right cable).",
      "Pull hands back, keeping arms straight, squeezing rear delts.",
      "Return slowly."
    ],
    "common_technique_errors": [
      "Using torso swinging."
    ],
    "safety_flags": [],
    "redundancy_group": "REAR_DELT_FAMILY",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "dumbbell_rear_delt_fly",
    "name": "Dumbbell Rear-Delt Fly",
    "aliases": [
      "rear_db_fly"
    ],
    "primary_muscles": [
      "rear_delts"
    ],
    "secondary_muscles": [
      "back_upper"
    ],
    "movement_patterns": [
      "rear_delt_isolation"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-20",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "reverse_pec_deck",
      "cable_reardelt_fly"
    ],
    "instructions": [
      "Stand, hinge forward to 45 degrees, back flat.",
      "Hold dumbbells and raise them to sides, keeping elbows bent slightly.",
      "Return control-led."
    ],
    "common_technique_errors": [
      "Torso jerking up.",
      "Rounding spine."
    ],
    "safety_flags": [],
    "redundancy_group": "REAR_DELT_FAMILY",
    "fatigue_score": 1,
    "stability_score": 1,
    "skill_score": 2,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "dumbbell_front_raise",
    "name": "Dumbbell Front Raise",
    "aliases": [
      "front_raise"
    ],
    "primary_muscles": [
      "front_delts"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "vertical_push"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [],
    "instructions": [
      "Raise dumbbells straight forward to eye level.",
      "Lower control-led."
    ],
    "common_technique_errors": [
      "Swinging body."
    ],
    "safety_flags": [],
    "redundancy_group": "VERTICAL_PRESSING",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "cable_upright_row",
    "name": "Cable Upright Row",
    "aliases": [
      "upright_row"
    ],
    "primary_muscles": [
      "side_delts"
    ],
    "secondary_muscles": [
      "biceps"
    ],
    "movement_patterns": [
      "shoulder_abduction"
    ],
    "category": "SECONDARY_COMPOUND",
    "exercise_role": "SECONDARY_COMPOUND",
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "10-12",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [],
    "instructions": [
      "Hold cable straight bar handle. Pull handles to chest height, leading with elbows.",
      "Lower under control."
    ],
    "common_technique_errors": [
      "Pulling bar too high (shoulder impingement risk)."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "SIDE_DELT_FAMILY",
    "fatigue_score": 2,
    "stability_score": 4,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "barbell_shrug",
    "name": "Barbell Shrug",
    "aliases": [
      "shrugs"
    ],
    "primary_muscles": [
      "back_upper"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "horizontal_pull",
      "vertical_pull"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_shrug"
    ],
    "instructions": [
      "Stand holding barbell overhand. Shrug shoulders up toward ears.",
      "Hold squeeze, then lower control-led."
    ],
    "common_technique_errors": [
      "Rolling shoulders in circles (injures joint cuffs)."
    ],
    "safety_flags": [],
    "redundancy_group": "SHRUG_FAMILY",
    "fatigue_score": 2,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "dumbbell_shrug",
    "name": "Dumbbell Shrug",
    "aliases": [
      "db_shrugs"
    ],
    "primary_muscles": [
      "back_upper"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "horizontal_pull",
      "vertical_pull"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "barbell_shrug"
    ],
    "instructions": [
      "Shrug shoulders holding dumbbells at sides."
    ],
    "common_technique_errors": [
      "Shrugging too fast."
    ],
    "safety_flags": [],
    "redundancy_group": "SHRUG_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "face_pull",
    "name": "Cable Face Pull",
    "aliases": [
      "facepulls"
    ],
    "primary_muscles": [
      "rear_delts"
    ],
    "secondary_muscles": [
      "back_upper"
    ],
    "movement_patterns": [
      "rear_delt_isolation"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Cables",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-20",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "cable_reardelt_fly",
      "reverse_pec_deck"
    ],
    "instructions": [
      "Set cable high with rope attachment. Hold rope ends.",
      "Pull rope toward face, flaring elbows out, rotating wrists back.",
      "Return control-led."
    ],
    "common_technique_errors": [
      "Pulling rope with arms without shoulder rotation."
    ],
    "safety_flags": [],
    "redundancy_group": "REAR_DELT_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "back_squat",
    "name": "Barbell Back Squat",
    "aliases": [
      "squat",
      "bb_squat"
    ],
    "primary_muscles": [
      "quads"
    ],
    "secondary_muscles": [
      "glutes",
      "hamstrings",
      "calves"
    ],
    "movement_patterns": [
      "knee_dominant"
    ],
    "category": "PRIMARY_COMPOUND",
    "exercise_role": "PRIMARY_COMPOUND",
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "strength",
      "hypertrophy"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "6-10",
    "recommended_rest_ranges": "150s",
    "progression_method": "Linear Overload",
    "valid_substitutions": [
      "leg_press",
      "goblet_squat",
      "hack_squat",
      "front_squat"
    ],
    "instructions": [
      "Rack bar on upper traps. Stand shoulder-width, toes out slightly.",
      "Hinge hips and bend knees, squatting until thighs are parallel to floor or lower.",
      "Drive back up through midfoot, keeping spine neutral and knees tracking with toes."
    ],
    "common_technique_errors": [
      "Knees caving inwards (valgus collapse).",
      "Heels lifting off the floor.",
      "Rounding the lower spine at the bottom (butt wink)."
    ],
    "safety_flags": [
      "lower_back",
      "knee"
    ],
    "redundancy_group": "SQUAT_FAMILY",
    "fatigue_score": 5,
    "stability_score": 2,
    "skill_score": 5,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "front_squat",
    "name": "Barbell Front Squat",
    "aliases": [
      "front_squats"
    ],
    "primary_muscles": [
      "quads"
    ],
    "secondary_muscles": [
      "glutes",
      "core_anti_extension"
    ],
    "movement_patterns": [
      "knee_dominant"
    ],
    "category": "PRIMARY_COMPOUND",
    "exercise_role": "PRIMARY_COMPOUND",
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "strength",
      "hypertrophy"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "6-8",
    "recommended_rest_ranges": "150s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "back_squat",
      "hack_squat"
    ],
    "instructions": [
      "Rest bar on front of shoulders, cross arms or use front rack grip.",
      "Squat low keeping chest vertical.",
      "Press up."
    ],
    "common_technique_errors": [
      "Elbows dropping, causing forward lean."
    ],
    "safety_flags": [
      "knee",
      "lower_back"
    ],
    "redundancy_group": "SQUAT_FAMILY",
    "fatigue_score": 5,
    "stability_score": 2,
    "skill_score": 5,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "leg_press",
    "name": "Machine Leg Press",
    "aliases": [
      "leg_press_sled"
    ],
    "primary_muscles": [
      "quads"
    ],
    "secondary_muscles": [
      "glutes",
      "hamstrings"
    ],
    "movement_patterns": [
      "knee_dominant"
    ],
    "category": "STABLE_COMPOUND",
    "exercise_role": "STABLE_COMPOUND",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-15",
    "recommended_rest_ranges": "120s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "back_squat",
      "goblet_squat",
      "hack_squat"
    ],
    "instructions": [
      "Sit in leg press machine, feet shoulder-width on platform.",
      "Lower platform until knees reach 90 degrees.",
      "Press platform back up forcefully without locking knees."
    ],
    "common_technique_errors": [
      "Locking knees out fully at the top (extremely dangerous).",
      "Lifting tailbone off the seat at the bottom (causes back strain)."
    ],
    "safety_flags": [
      "lower_back",
      "knee"
    ],
    "redundancy_group": "SQUAT_FAMILY",
    "fatigue_score": 3,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "bulgarian_split_squat",
    "name": "Bulgarian Split Squat",
    "aliases": [
      "split_squat"
    ],
    "primary_muscles": [
      "quads"
    ],
    "secondary_muscles": [
      "glutes",
      "hamstrings"
    ],
    "movement_patterns": [
      "knee_dominant"
    ],
    "category": "UNILATERAL",
    "exercise_role": "UNILATERAL",
    "equipment": "Dumbbell",
    "difficulty": "Advanced",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "UNILATERAL",
    "stability": "LOW",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12 per leg",
    "recommended_rest_ranges": "105s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "walking_lunge",
      "reverse_lunge"
    ],
    "instructions": [
      "Place back foot on flat bench behind you. Hold dumbbells.",
      "Lower hips until front thigh is parallel to floor.",
      "Press through front heel to return to start."
    ],
    "common_technique_errors": [
      "Front knee tracking inside or excessively forward."
    ],
    "safety_flags": [
      "knee"
    ],
    "redundancy_group": "LUNGE_FAMILY",
    "fatigue_score": 3,
    "stability_score": 1,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "walking_lunge",
    "name": "Dumbbell Walking Lunge",
    "aliases": [
      "lunges",
      "db_lunge"
    ],
    "primary_muscles": [
      "quads"
    ],
    "secondary_muscles": [
      "glutes",
      "hamstrings"
    ],
    "movement_patterns": [
      "knee_dominant"
    ],
    "category": "UNILATERAL",
    "exercise_role": "UNILATERAL",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "UNILATERAL",
    "stability": "LOW",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "10-12 per leg",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "bulgarian_split_squat",
      "reverse_lunge"
    ],
    "instructions": [
      "Step forward with one leg, lowering hips until back knee nearly touches floor.",
      "Push off back foot to step forward into next lunge stride."
    ],
    "common_technique_errors": [
      "Torso collapsing forward.",
      "Step length too short, overload knee."
    ],
    "safety_flags": [
      "knee"
    ],
    "redundancy_group": "LUNGE_FAMILY",
    "fatigue_score": 3,
    "stability_score": 1,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "reverse_lunge",
    "name": "Dumbbell Reverse Lunge",
    "aliases": [
      "db_reverse_lunge"
    ],
    "primary_muscles": [
      "quads"
    ],
    "secondary_muscles": [
      "glutes",
      "hamstrings"
    ],
    "movement_patterns": [
      "knee_dominant"
    ],
    "category": "UNILATERAL",
    "exercise_role": "UNILATERAL",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "UNILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "10-12 per leg",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "walking_lunge",
      "bulgarian_split_squat"
    ],
    "instructions": [
      "Stand tall, step backward with one leg and lower hips.",
      "Push through front foot to stand back up."
    ],
    "common_technique_errors": [
      "Stepping to sides."
    ],
    "safety_flags": [
      "knee"
    ],
    "redundancy_group": "LUNGE_FAMILY",
    "fatigue_score": 2,
    "stability_score": 2,
    "skill_score": 2,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "hack_squat",
    "name": "Machine Hack Squat",
    "aliases": [
      "hack_squats"
    ],
    "primary_muscles": [
      "quads"
    ],
    "secondary_muscles": [
      "glutes",
      "hamstrings"
    ],
    "movement_patterns": [
      "knee_dominant"
    ],
    "category": "STABLE_COMPOUND",
    "exercise_role": "STABLE_COMPOUND",
    "equipment": "Machines",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "120s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "leg_press",
      "back_squat"
    ],
    "instructions": [
      "Place shoulders under pads on sled. Set feet on platform.",
      "Squat deep under control, then drive back up."
    ],
    "common_technique_errors": [
      "Heels lifting."
    ],
    "safety_flags": [
      "knee",
      "lower_back"
    ],
    "redundancy_group": "SQUAT_FAMILY",
    "fatigue_score": 4,
    "stability_score": 5,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "leg_extension",
    "name": "Leg Extension",
    "aliases": [
      "quad_extensions"
    ],
    "primary_muscles": [
      "quads"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "knee_dominant"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "75s",
    "progression_method": "Double Progression",
    "valid_substitutions": [],
    "instructions": [
      "Sit back against pad. Rest shin pad on front of ankles.",
      "Extend knees fully, contracting quads.",
      "Lower weight control-led."
    ],
    "common_technique_errors": [
      "Kicking the weight up with momentum instead of contracting."
    ],
    "safety_flags": [
      "knee"
    ],
    "redundancy_group": "SQUAT_FAMILY",
    "fatigue_score": 1,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "goblet_squat",
    "name": "Dumbbell Goblet Squat",
    "aliases": [
      "db_goblet_squat"
    ],
    "primary_muscles": [
      "quads"
    ],
    "secondary_muscles": [
      "glutes",
      "hamstrings"
    ],
    "movement_patterns": [
      "knee_dominant"
    ],
    "category": "SECONDARY_COMPOUND",
    "exercise_role": "SECONDARY_COMPOUND",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "leg_press",
      "back_squat"
    ],
    "instructions": [
      "Hold dumbbell vertically under chin, stand shoulder-width.",
      "Squat deep while keeping chest upright.",
      "Drive up, squeezing glutes."
    ],
    "common_technique_errors": [
      "Allowing heels to lift.",
      "Lower back rounding."
    ],
    "safety_flags": [
      "knee"
    ],
    "redundancy_group": "SQUAT_FAMILY",
    "fatigue_score": 3,
    "stability_score": 3,
    "skill_score": 2,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "box_squat",
    "name": "Barbell Box Squat",
    "aliases": [
      "box_squats"
    ],
    "primary_muscles": [
      "quads"
    ],
    "secondary_muscles": [
      "glutes",
      "hamstrings"
    ],
    "movement_patterns": [
      "knee_dominant"
    ],
    "category": "PRIMARY_COMPOUND",
    "exercise_role": "PRIMARY_COMPOUND",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "strength"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "5-8",
    "recommended_rest_ranges": "120s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "back_squat"
    ],
    "instructions": [
      "Position box behind you. Squat down until sitting on box.",
      "Pause, then drive back up to stand."
    ],
    "common_technique_errors": [
      "Rocking too hard."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "SQUAT_FAMILY",
    "fatigue_score": 4,
    "stability_score": 3,
    "skill_score": 4,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "step_up",
    "name": "Dumbbell Step-up",
    "aliases": [
      "stepups"
    ],
    "primary_muscles": [
      "quads"
    ],
    "secondary_muscles": [
      "glutes",
      "hamstrings"
    ],
    "movement_patterns": [
      "knee_dominant"
    ],
    "category": "UNILATERAL",
    "exercise_role": "UNILATERAL",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "UNILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "10-12",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "reverse_lunge"
    ],
    "instructions": [
      "Place one foot on box/bench. Hold dumbbells.",
      "Step up onto box, extending leg completely.",
      "Step back down control-led."
    ],
    "common_technique_errors": [
      "Pushing off back foot instead of using front leg."
    ],
    "safety_flags": [],
    "redundancy_group": "LUNGE_FAMILY",
    "fatigue_score": 2,
    "stability_score": 2,
    "skill_score": 2,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "bodyweight_squat",
    "name": "Bodyweight Squat",
    "aliases": [
      "air_squats"
    ],
    "primary_muscles": [
      "quads"
    ],
    "secondary_muscles": [
      "glutes"
    ],
    "movement_patterns": [
      "knee_dominant"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner"
    ],
    "goals": [
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-20",
    "recommended_rest_ranges": "60s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "goblet_squat"
    ],
    "instructions": [
      "Squat using only bodyweight."
    ],
    "common_technique_errors": [
      "Shallow depth."
    ],
    "safety_flags": [],
    "redundancy_group": "SQUAT_FAMILY",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "romanian_deadlift",
    "name": "Dumbbell Romanian Deadlift",
    "aliases": [
      "db_rdl",
      "romanian_deadlift"
    ],
    "primary_muscles": [
      "hamstrings"
    ],
    "secondary_muscles": [
      "glutes",
      "core_anti_extension"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "SECONDARY_COMPOUND",
    "exercise_role": "SECONDARY_COMPOUND",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "6-10",
    "recommended_rest_ranges": "120s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "conventional_deadlift",
      "good_morning",
      "lying_leg_curl"
    ],
    "instructions": [
      "Stand holding dumbbells in front of thighs, back flat.",
      "Hinge at hips, sliding weights down legs until you feel a deep stretch in hamstrings.",
      "Squeeze glutes and hamstrings to return upright."
    ],
    "common_technique_errors": [
      "Rounding lower back.",
      "Squatting down (bending knees too much) instead of hinging."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "DEADLIFT_FAMILY",
    "fatigue_score": 3,
    "stability_score": 3,
    "skill_score": 3,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "conventional_deadlift",
    "name": "Barbell Conventional Deadlift",
    "aliases": [
      "deadlift",
      "bb_deadlift"
    ],
    "primary_muscles": [
      "glutes"
    ],
    "secondary_muscles": [
      "hamstrings",
      "core_anti_extension",
      "back_upper",
      "back_lats"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "PRIMARY_COMPOUND",
    "exercise_role": "PRIMARY_COMPOUND",
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "strength",
      "hypertrophy"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "3-6",
    "recommended_rest_ranges": "210s",
    "progression_method": "Linear Overload",
    "valid_substitutions": [
      "romanian_deadlift"
    ],
    "instructions": [
      "Stand with mid-foot under bar. Hinge, grip bar.",
      "Flatten spine, pull shoulder blades back. Stand fully upright.",
      "Lower control-led, keeping bar close to body."
    ],
    "common_technique_errors": [
      "Rounding lumbar spine.",
      "Shrugging at top lockout."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "DEADLIFT_FAMILY",
    "fatigue_score": 5,
    "stability_score": 2,
    "skill_score": 5,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "hip_thrust",
    "name": "Barbell Hip Thrust",
    "aliases": [
      "hip_thrusts"
    ],
    "primary_muscles": [
      "glutes"
    ],
    "secondary_muscles": [
      "hamstrings"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "PRIMARY_COMPOUND",
    "exercise_role": "PRIMARY_COMPOUND",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "105s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "glute_bridge"
    ],
    "instructions": [
      "Sit on floor, upper back against bench. Roll loaded barbell over hips.",
      "Drive through heels to extend hips fully parallel to floor.",
      "Pause, lower control-led."
    ],
    "common_technique_errors": [
      "Arching lower back excessively at top instead of rotating pelvis."
    ],
    "safety_flags": [],
    "redundancy_group": "GLUTE_THRUST_FAMILY",
    "fatigue_score": 3,
    "stability_score": 3,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "glute_bridge",
    "name": "Bodyweight Glute Bridge",
    "aliases": [
      "glute_bridges"
    ],
    "primary_muscles": [
      "glutes"
    ],
    "secondary_muscles": [
      "hamstrings"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "general_fitness",
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-15",
    "recommended_rest_ranges": "75s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "hip_thrust"
    ],
    "instructions": [
      "Lie on back, bend knees. Press hips up, squeezing glutes.",
      "Lower control-led."
    ],
    "common_technique_errors": [
      "Hyperextending spine."
    ],
    "safety_flags": [],
    "redundancy_group": "GLUTE_THRUST_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "seated_leg_curl",
    "name": "Seated Leg Curl",
    "aliases": [
      "leg_curls"
    ],
    "primary_muscles": [
      "hamstrings"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "hip_dominant",
      "knee_dominant"
    ],
    "category": "STABLE_COMPOUND",
    "exercise_role": "STABLE_COMPOUND",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "75s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "lying_leg_curl"
    ],
    "instructions": [
      "Sit in seat, align knee joints with pivot point.",
      "Curl pad down behind ankles, squeeze hamstrings.",
      "Extend slowly."
    ],
    "common_technique_errors": [
      "Lifting hips off seat."
    ],
    "safety_flags": [],
    "redundancy_group": "LEG_CURL_FAMILY",
    "fatigue_score": 1,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "lying_leg_curl",
    "name": "Lying Leg Curl",
    "aliases": [
      "lying_curls"
    ],
    "primary_muscles": [
      "hamstrings"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "hip_dominant",
      "knee_dominant"
    ],
    "category": "STABLE_COMPOUND",
    "exercise_role": "STABLE_COMPOUND",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "75s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "seated_leg_curl"
    ],
    "instructions": [
      "Lie face down, pad against back of ankles.",
      "Curl legs up, squeezing hamstrings.",
      "Lower under control."
    ],
    "common_technique_errors": [
      "Arching lower back off pad."
    ],
    "safety_flags": [],
    "redundancy_group": "LEG_CURL_FAMILY",
    "fatigue_score": 1,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "good_morning",
    "name": "Barbell Good Morning",
    "aliases": [
      "goodmornings"
    ],
    "primary_muscles": [
      "hamstrings"
    ],
    "secondary_muscles": [
      "glutes",
      "core_anti_extension"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "PRIMARY_COMPOUND",
    "exercise_role": "PRIMARY_COMPOUND",
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "experience_levels": [
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "8-10",
    "recommended_rest_ranges": "105s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "romanian_deadlift"
    ],
    "instructions": [
      "Hold barbell on traps as in squat.",
      "Hinge hips back, lowering torso until parallel to floor.",
      "Hinge back up."
    ],
    "common_technique_errors": [
      "Rounding spine.",
      "Bending knees too much."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "DEADLIFT_FAMILY",
    "fatigue_score": 4,
    "stability_score": 2,
    "skill_score": 4,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "sumo_deadlift",
    "name": "Barbell Sumo Deadlift",
    "aliases": [
      "sumo_deadlifts"
    ],
    "primary_muscles": [
      "glutes"
    ],
    "secondary_muscles": [
      "quads",
      "hamstrings",
      "core_anti_extension"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "PRIMARY_COMPOUND",
    "exercise_role": "PRIMARY_COMPOUND",
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "strength"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "4-6",
    "recommended_rest_ranges": "120s",
    "progression_method": "Linear Overload",
    "valid_substitutions": [
      "conventional_deadlift"
    ],
    "instructions": [
      "Stand in wide stance. Grip bar inside knees.",
      "Pull up, chest tall."
    ],
    "common_technique_errors": [
      "Knees caving."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "DEADLIFT_FAMILY",
    "fatigue_score": 5,
    "stability_score": 2,
    "skill_score": 5,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "kettlebell_swing",
    "name": "Dumbbell Swing",
    "aliases": [
      "kb_swing",
      "db_swing"
    ],
    "primary_muscles": [
      "glutes"
    ],
    "secondary_muscles": [
      "hamstrings",
      "core_anti_extension"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "POWER",
    "exercise_role": "POWER",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "power",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "romanian_deadlift"
    ],
    "instructions": [
      "Hold dumbbell in hands. Hinge back, swing weight.",
      "Drive hips forward explosively, swinging dumbbell to chest height.",
      "Lower."
    ],
    "common_technique_errors": [
      "Squatting instead of hinging."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "EXPLOSIVE_POWER",
    "fatigue_score": 3,
    "stability_score": 3,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": true
  },
  {
    "id": "cable_pull_through",
    "name": "Cable Pull-Through",
    "aliases": [
      "pull_through"
    ],
    "primary_muscles": [
      "glutes"
    ],
    "secondary_muscles": [
      "hamstrings"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Cables",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-12",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "romanian_deadlift"
    ],
    "instructions": [
      "Stand facing away from cable pulley. Grip rope between legs.",
      "Hinge hips back, then squeeze glutes to stand tall."
    ],
    "common_technique_errors": [
      "Rounding back."
    ],
    "safety_flags": [],
    "redundancy_group": "GLUTE_THRUST_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "single_leg_rdl",
    "name": "Single-Leg Romanian Deadlift",
    "aliases": [
      "single_leg_rdl_db"
    ],
    "primary_muscles": [
      "hamstrings"
    ],
    "secondary_muscles": [
      "glutes"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "UNILATERAL",
    "exercise_role": "UNILATERAL",
    "equipment": "Dumbbell",
    "difficulty": "Advanced",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "UNILATERAL",
    "stability": "LOW",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-10",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "romanian_deadlift"
    ],
    "instructions": [
      "Stand on one leg holding dumbbell in opposite hand.",
      "Hinge forward keeping back leg straight behind.",
      "Stand up."
    ],
    "common_technique_errors": [
      "Losing balance.",
      "Rounding spine."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "DEADLIFT_FAMILY",
    "fatigue_score": 2,
    "stability_score": 1,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "glute_ham_raise",
    "name": "Glute-Ham Raise",
    "aliases": [
      "ghr"
    ],
    "primary_muscles": [
      "hamstrings"
    ],
    "secondary_muscles": [
      "glutes"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Machines",
    "difficulty": "Advanced",
    "experience_levels": [
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "6-10",
    "recommended_rest_ranges": "90s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "lying_leg_curl"
    ],
    "instructions": [
      "Secure ankles in GHR machine. Begin vertical.",
      "Lower torso control-led until parallel.",
      "Pull back up using glutes/hamstrings."
    ],
    "common_technique_errors": [
      "Bending hips."
    ],
    "safety_flags": [],
    "redundancy_group": "LEG_CURL_FAMILY",
    "fatigue_score": 3,
    "stability_score": 4,
    "skill_score": 4,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "ez_bar_curl",
    "name": "EZ-Bar Curl",
    "aliases": [
      "ez_bar_bicep_curl"
    ],
    "primary_muscles": [
      "biceps"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "elbow_flexion"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "8-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "barbell_curl",
      "dumbbell_curl",
      "cable_curl"
    ],
    "instructions": [
      "Hold EZ-bar on outer grip. Elbows pinned to side.",
      "Curl bar up, squeezing biceps.",
      "Lower control-led."
    ],
    "common_technique_errors": [
      "Swinging hips.",
      "Elbows flaring forward."
    ],
    "safety_flags": [],
    "redundancy_group": "CURL_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "barbell_curl",
    "name": "Barbell Curl",
    "aliases": [
      "bb_curl"
    ],
    "primary_muscles": [
      "biceps"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "elbow_flexion"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "8-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "ez_bar_curl",
      "dumbbell_curl",
      "ezbar_curl"
    ],
    "instructions": [
      "Curl straight barbell."
    ],
    "common_technique_errors": [
      "Wrist strain due to fixed barbell grip."
    ],
    "safety_flags": [],
    "redundancy_group": "CURL_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "dumbbell_curl",
    "name": "Dumbbell Bicep Curl",
    "aliases": [
      "db_curl",
      "bicep_curl"
    ],
    "primary_muscles": [
      "biceps"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "elbow_flexion"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "8-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "ez_bar_curl",
      "hammer_curl",
      "ezbar_curl"
    ],
    "instructions": [
      "Hold dumbbells at sides. Curl weights up, rotating palms up.",
      "Lower under control."
    ],
    "common_technique_errors": [
      "Torso swing."
    ],
    "safety_flags": [],
    "redundancy_group": "CURL_FAMILY",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "hammer_curl",
    "name": "Dumbbell Hammer Curl",
    "aliases": [
      "db_hammer_curl"
    ],
    "primary_muscles": [
      "biceps"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "elbow_flexion"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_curl",
      "cable_curl"
    ],
    "instructions": [
      "Hold dumbbells with neutral palms (facing each other). Curl up.",
      "Lower."
    ],
    "common_technique_errors": [
      "Flaring elbows."
    ],
    "safety_flags": [],
    "redundancy_group": "CURL_FAMILY",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "incline_dumbbell_curl",
    "name": "Incline Dumbbell Curl",
    "aliases": [
      "incline_curl"
    ],
    "primary_muscles": [
      "biceps"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "elbow_flexion"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_curl"
    ],
    "instructions": [
      "Sit on 45-degree incline bench. Let arms hang down.",
      "Curl weights up keeping elbows fixed.",
      "Lower."
    ],
    "common_technique_errors": [
      "Elbows moving forward."
    ],
    "safety_flags": [],
    "redundancy_group": "CURL_FAMILY",
    "fatigue_score": 1,
    "stability_score": 2,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "cable_curl",
    "name": "Cable Curl",
    "aliases": [
      "cable_bicep_curl"
    ],
    "primary_muscles": [
      "biceps"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "elbow_flexion"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Cables",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "ez_bar_curl",
      "ezbar_curl",
      "dumbbell_curl"
    ],
    "instructions": [
      "Curl cable bar."
    ],
    "common_technique_errors": [
      "Partial reps."
    ],
    "safety_flags": [],
    "redundancy_group": "CURL_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "preacher_curl",
    "name": "EZ-Bar Preacher Curl",
    "aliases": [
      "preacher_curls"
    ],
    "primary_muscles": [
      "biceps"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "elbow_flexion"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_curl"
    ],
    "instructions": [
      "Rest upper arms on preacher pad. Curl bar up.",
      "Lower fully control-led."
    ],
    "common_technique_errors": [
      "Not stretching fully or hyperextending elbows dynamically."
    ],
    "safety_flags": [],
    "redundancy_group": "CURL_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "concentration_curl",
    "name": "Dumbbell Concentration Curl",
    "aliases": [
      "concentration_curls"
    ],
    "primary_muscles": [
      "biceps"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "elbow_flexion"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "UNILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-12",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_curl"
    ],
    "instructions": [
      "Sit on bench. Rest elbow inside thigh. Curl dumbbell."
    ],
    "common_technique_errors": [
      "Swinging torso."
    ],
    "safety_flags": [],
    "redundancy_group": "CURL_FAMILY",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 1,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "triceps_pushdown",
    "name": "Cable Triceps Pushdown",
    "aliases": [
      "tricep_pushdown",
      "cable_pushdown"
    ],
    "primary_muscles": [
      "triceps"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "elbow_extension"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Cables",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "bench_dips",
      "cable_overhead_triceps_extension",
      "overhead_triceps_extension",
      "skull_crusher"
    ],
    "instructions": [
      "Grip rope attachment, pin elbows to sides.",
      "Press down fully, spreading rope at bottom.",
      "Return slowly."
    ],
    "common_technique_errors": [
      "Elbows flaring.",
      "Leaning over cable stack excessively."
    ],
    "safety_flags": [],
    "redundancy_group": "TRICEPS_EXTENSION_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "overhead_triceps_extension",
    "name": "Dumbbell Overhead Triceps Extension",
    "aliases": [
      "overhead_extension"
    ],
    "primary_muscles": [
      "triceps"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "elbow_extension"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "cable_overhead_triceps_extension",
      "triceps_pushdown",
      "skull_crusher"
    ],
    "instructions": [
      "Hold one dumbbell overhead with both hands.",
      "Bend elbows to lower weight behind head, then press up."
    ],
    "common_technique_errors": [
      "Elbows flaring extremely wide (places stress on elbow tendons)."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "TRICEPS_EXTENSION_FAMILY",
    "fatigue_score": 1,
    "stability_score": 2,
    "skill_score": 2,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "skull_crusher",
    "name": "EZ-Bar Skull Crusher",
    "aliases": [
      "lying_tricep_extension",
      "skullcrushers"
    ],
    "primary_muscles": [
      "triceps"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "elbow_extension"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "75s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "overhead_triceps_extension",
      "triceps_pushdown"
    ],
    "instructions": [
      "Lie on bench holding EZ-bar. Extend arms.",
      "Bend elbows to lower bar to forehead, then press."
    ],
    "common_technique_errors": [
      "Moving shoulder joint back and forth."
    ],
    "safety_flags": [],
    "redundancy_group": "TRICEPS_EXTENSION_FAMILY",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "close_grip_bench_press",
    "name": "Close-Grip Bench Press",
    "aliases": [
      "close_grip_press"
    ],
    "primary_muscles": [
      "triceps"
    ],
    "secondary_muscles": [
      "chest",
      "front_delts"
    ],
    "movement_patterns": [
      "horizontal_push"
    ],
    "category": "PRIMARY_COMPOUND",
    "exercise_role": "PRIMARY_COMPOUND",
    "equipment": "Barbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "strength",
      "hypertrophy"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "6-10",
    "recommended_rest_ranges": "105s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "barbell_bench_press",
      "parallel_bar_dip",
      "assisted_dip",
      "parallelbar_dip"
    ],
    "instructions": [
      "Lie on flat bench. Grip bar shoulder-width.",
      "Lower bar to chest keeping elbows tucked close to ribcage.",
      "Press."
    ],
    "common_technique_errors": [
      "Grip too narrow (hurts wrists and shoulders)."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "HORIZONTAL_PRESSING_1",
    "fatigue_score": 4,
    "stability_score": 3,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "assisted_dip",
    "name": "Assisted Dip",
    "aliases": [
      "assisted_dips"
    ],
    "primary_muscles": [
      "triceps"
    ],
    "secondary_muscles": [
      "chest",
      "front_delts"
    ],
    "movement_patterns": [
      "vertical_push",
      "horizontal_push"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "90s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "parallel_bar_dip",
      "bench_dips",
      "parallelbar_dip",
      "triceps_pushdown"
    ],
    "instructions": [
      "Stand on assisted platform. Lower hips bending elbows to 90 degrees.",
      "Press back up."
    ],
    "common_technique_errors": [
      "Shrugging shoulders."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "TRICEPS_EXTENSION_FAMILY",
    "fatigue_score": 2,
    "stability_score": 4,
    "skill_score": 2,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "parallel_bar_dip",
    "name": "Parallel-Bar Dip",
    "aliases": [
      "dips"
    ],
    "primary_muscles": [
      "triceps"
    ],
    "secondary_muscles": [
      "chest",
      "front_delts"
    ],
    "movement_patterns": [
      "vertical_push",
      "horizontal_push"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "strength",
      "hypertrophy"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "6-12",
    "recommended_rest_ranges": "120s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "close_grip_bench_press",
      "assisted_dip",
      "closegrip_bench_press"
    ],
    "instructions": [
      "Support weight on bars. Lower until upper arms are parallel to floor.",
      "Press up."
    ],
    "common_technique_errors": [
      "Lowering too deep (tears shoulder cuff capsule)."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "TRICEPS_EXTENSION_FAMILY",
    "fatigue_score": 4,
    "stability_score": 2,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "bench_dips",
    "name": "Tricep Bench Dips",
    "aliases": [
      "bench_dip"
    ],
    "primary_muscles": [
      "triceps"
    ],
    "secondary_muscles": [
      "chest",
      "front_delts"
    ],
    "movement_patterns": [
      "elbow_extension"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "triceps_pushdown",
      "assisted_dip"
    ],
    "instructions": [
      "Place palms on edge of bench, feet extended in front.",
      "Lower body bending elbows to 90 degrees.",
      "Press back up."
    ],
    "common_technique_errors": [
      "Letting hips drift away from bench."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "TRICEPS_EXTENSION_FAMILY",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "cable_overhead_triceps_extension",
    "name": "Cable Overhead Triceps Extension",
    "aliases": [
      "cable_overhead_extension"
    ],
    "primary_muscles": [
      "triceps"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "elbow_extension"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "triceps_pushdown"
    ],
    "instructions": [
      "Attach rope to cable pulley. Turn away from machine. Press rope overhead."
    ],
    "common_technique_errors": [
      "Torso bending."
    ],
    "safety_flags": [],
    "redundancy_group": "TRICEPS_EXTENSION_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 2,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "dumbbell_kickback",
    "name": "Dumbbell Kickback",
    "aliases": [
      "db_kickbacks"
    ],
    "primary_muscles": [
      "triceps"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "elbow_extension"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Dumbbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "triceps_pushdown"
    ],
    "instructions": [
      "Hinge over. Pin elbows. Extend weights back."
    ],
    "common_technique_errors": [
      "Elbows dropping."
    ],
    "safety_flags": [],
    "redundancy_group": "TRICEPS_EXTENSION_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "reverse_grip_ez_bar_curl",
    "name": "Reverse EZ-Bar Curl",
    "aliases": [
      "reverse_curl"
    ],
    "primary_muscles": [
      "biceps"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "elbow_flexion"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Barbell",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-12",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "hammer_curl"
    ],
    "instructions": [
      "Curl bar overhand."
    ],
    "common_technique_errors": [
      "Wrist strain."
    ],
    "safety_flags": [],
    "redundancy_group": "CURL_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "standing_calf_raise",
    "name": "Standing Calf Raise",
    "aliases": [
      "calf_raises"
    ],
    "primary_muscles": [
      "calves"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "calf_plantar_flexion"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-20",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "leg_press_calf_raise",
      "seated_calf_raise"
    ],
    "instructions": [
      "Stand on block. Contract calves rising onto toes.",
      "Lower heels slowly to stretch."
    ],
    "common_technique_errors": [
      "Bouncing weight."
    ],
    "safety_flags": [],
    "redundancy_group": "CALF_RAISE_FAMILY",
    "fatigue_score": 1,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "seated_calf_raise",
    "name": "Seated Calf Raise",
    "aliases": [
      "seated_calf"
    ],
    "primary_muscles": [
      "calves"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "calf_plantar_flexion"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-20",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "standing_calf_raise"
    ],
    "instructions": [
      "Sit, place pad on knees. Press toes."
    ],
    "common_technique_errors": [
      "Bouncing."
    ],
    "safety_flags": [],
    "redundancy_group": "CALF_RAISE_FAMILY",
    "fatigue_score": 1,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "leg_press_calf_raise",
    "name": "Leg Press Calf Raise",
    "aliases": [
      "leg_press_calf"
    ],
    "primary_muscles": [
      "calves"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "calf_plantar_flexion"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Machines",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-20",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "standing_calf_raise",
      "seated_calf_raise"
    ],
    "instructions": [
      "Place toes on edge of leg press platform. Press toes."
    ],
    "common_technique_errors": [
      "Locking knees out fully."
    ],
    "safety_flags": [],
    "redundancy_group": "CALF_RAISE_FAMILY",
    "fatigue_score": 1,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "donkey_calf_raise",
    "name": "Donkey Calf Raise",
    "aliases": [
      "donkey_calf"
    ],
    "primary_muscles": [
      "calves"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "calf_plantar_flexion"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Machines",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "standing_calf_raise"
    ],
    "instructions": [
      "Perform donkey calf raise."
    ],
    "common_technique_errors": [
      "Partial extension."
    ],
    "safety_flags": [],
    "redundancy_group": "CALF_RAISE_FAMILY",
    "fatigue_score": 1,
    "stability_score": 5,
    "skill_score": 1,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "plank",
    "name": "Core Plank",
    "aliases": [
      "core_plank",
      "plank"
    ],
    "primary_muscles": [
      "core_anti_extension"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "anti_extension_core"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "general_fitness",
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "30-60 sec hold",
    "recommended_rest_ranges": "45s",
    "progression_method": "Linear Overload",
    "valid_substitutions": [
      "hanging_knee_raise",
      "ab_wheel_rollout",
      "pallof_press"
    ],
    "instructions": [
      "Support weight on forearms and toes, body linear.",
      "Contract abs and glutes, keep hips stable."
    ],
    "common_technique_errors": [
      "Sagging hips.",
      "Looking up (strains neck)."
    ],
    "safety_flags": [],
    "redundancy_group": "CORE_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "cable_crunch",
    "name": "Cable Crunch",
    "aliases": [
      "kneeling_cable_crunch"
    ],
    "primary_muscles": [
      "core_flexion"
    ],
    "secondary_muscles": [
      "core_anti_rotation"
    ],
    "movement_patterns": [
      "core_flexion"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "hanging_leg_raise",
      "hanging_knee_raise"
    ],
    "instructions": [
      "Kneel at pulley, hold rope at neck. Flex spine downward, pulling elbows to knees.",
      "Stretch back slowly."
    ],
    "common_technique_errors": [
      "Using hip flexors (hips moving back and down) instead of flexing spine."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "CORE_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "hanging_knee_raise",
    "name": "Hanging Knee Raise",
    "aliases": [
      "knee_raise"
    ],
    "primary_muscles": [
      "core_flexion"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "core_flexion"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "hypertrophy",
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "hanging_leg_raise",
      "plank",
      "cable_crunch"
    ],
    "instructions": [
      "Hang from bar. Pull knees up to chest, tilting pelvis.",
      "Lower control-led."
    ],
    "common_technique_errors": [
      "Swinging body.",
      "Not lifting hips/pelvis (strictly hip flexor)."
    ],
    "safety_flags": [],
    "redundancy_group": "CORE_FAMILY",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 2,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "hanging_leg_raise",
    "name": "Hanging Leg Raise",
    "aliases": [
      "hanging_leg_lift"
    ],
    "primary_muscles": [
      "core_flexion"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "core_flexion"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy",
      "strength"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "60s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "hanging_knee_raise"
    ],
    "instructions": [
      "Hang from bar. Lift straight legs to 90 degrees.",
      "Lower control-led."
    ],
    "common_technique_errors": [
      "Using swing momentum.",
      "Not flexing pelvis."
    ],
    "safety_flags": [],
    "redundancy_group": "CORE_FAMILY",
    "fatigue_score": 1,
    "stability_score": 2,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "ab_wheel",
    "name": "Ab Wheel Rollout",
    "aliases": [
      "ab_wheel"
    ],
    "primary_muscles": [
      "core_anti_extension"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "anti_extension_core"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "experience_levels": [
      "advanced"
    ],
    "goals": [
      "strength",
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "8-12",
    "recommended_rest_ranges": "60s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "plank",
      "pallof_press"
    ],
    "instructions": [
      "Kneel on floor holding wheel. Roll forward keeping abs contracted, spine neutral.",
      "Pull back."
    ],
    "common_technique_errors": [
      "Hyperextending spine (lower back collapse)."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "CORE_FAMILY",
    "fatigue_score": 2,
    "stability_score": 1,
    "skill_score": 4,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": true,
    "preferred_for_power": false
  },
  {
    "id": "pallof_press",
    "name": "Cable Pallof Press",
    "aliases": [
      "pallof_press"
    ],
    "primary_muscles": [
      "core_anti_rotation"
    ],
    "secondary_muscles": [
      "core_flexion"
    ],
    "movement_patterns": [
      "anti_rotation_core"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Cables",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate",
      "advanced"
    ],
    "goals": [
      "general_fitness",
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-12 per side",
    "recommended_rest_ranges": "45s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "plank"
    ],
    "instructions": [
      "Stand sideways to cable. Hold handle at chest. Press handle straight out, resisting cable rotation.",
      "Hold, return control-led."
    ],
    "common_technique_errors": [
      "Torso turning."
    ],
    "safety_flags": [],
    "redundancy_group": "CORE_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "russian_twist",
    "name": "Russian Twist",
    "aliases": [
      "twists"
    ],
    "primary_muscles": [
      "core_anti_rotation"
    ],
    "secondary_muscles": [
      "core_flexion"
    ],
    "movement_patterns": [
      "core_flexion"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "15-20",
    "recommended_rest_ranges": "60s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "pallof_press"
    ],
    "instructions": [
      "Sit on floor, lean back, raise feet. Rotate torso side to side."
    ],
    "common_technique_errors": [
      "Rounding spine."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "CORE_FAMILY",
    "fatigue_score": 1,
    "stability_score": 3,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "decline_crunch",
    "name": "Decline Crunch",
    "aliases": [
      "decline_crunches"
    ],
    "primary_muscles": [
      "core_flexion"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "core_flexion"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "cable_crunch"
    ],
    "instructions": [
      "Perform crunch on decline bench."
    ],
    "common_technique_errors": [
      "Neck pulling."
    ],
    "safety_flags": [],
    "redundancy_group": "CORE_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "woodchopper",
    "name": "Cable Woodchopper",
    "aliases": [
      "woodchoppers"
    ],
    "primary_muscles": [
      "core_anti_rotation"
    ],
    "secondary_muscles": [
      "core_flexion"
    ],
    "movement_patterns": [
      "anti_rotation_core"
    ],
    "category": "ISOLATION",
    "exercise_role": "ISOLATION",
    "equipment": "Cables",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "hypertrophy"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "10-12",
    "recommended_rest_ranges": "60s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "pallof_press"
    ],
    "instructions": [
      "Rotate diagonally pulling cable across body."
    ],
    "common_technique_errors": [
      "Hips swinging."
    ],
    "safety_flags": [],
    "redundancy_group": "CORE_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 2,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": true,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "deadbug",
    "name": "Deadbug",
    "aliases": [
      "deadbugs"
    ],
    "primary_muscles": [
      "core_anti_extension"
    ],
    "secondary_muscles": [],
    "movement_patterns": [
      "anti_extension_core"
    ],
    "category": "BODYWEIGHT",
    "exercise_role": "BODYWEIGHT",
    "equipment": "Bodyweight",
    "difficulty": "Beginner",
    "experience_levels": [
      "beginner",
      "intermediate"
    ],
    "goals": [
      "general_fitness"
    ],
    "compound_or_isolation": "ISOLATION",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "HIGH",
    "fatigue_classification": "low_systemic",
    "recommended_rep_ranges": "12-15",
    "recommended_rest_ranges": "60s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "plank"
    ],
    "instructions": [
      "Extend opposite arm and leg while flat on back."
    ],
    "common_technique_errors": [
      "Arched back."
    ],
    "safety_flags": [],
    "redundancy_group": "CORE_FAMILY",
    "fatigue_score": 1,
    "stability_score": 4,
    "skill_score": 1,
    "preferred_for_beginners": true,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": false
  },
  {
    "id": "dumbbell_jump_squat",
    "name": "Dumbbell Jump Squat",
    "aliases": [
      "jump_squat",
      "explosive_squat"
    ],
    "primary_muscles": [
      "quads"
    ],
    "secondary_muscles": [
      "glutes",
      "calves"
    ],
    "movement_patterns": [
      "knee_dominant"
    ],
    "category": "POWER",
    "exercise_role": "POWER",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "power"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "3-5",
    "recommended_rest_ranges": "120s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_swing",
      "box_jump"
    ],
    "instructions": [
      "Hold light dumbbells. Squat to quarter-depth.",
      "Jump up explosively.",
      "Land soft on mid-foot."
    ],
    "common_technique_errors": [
      "Stiff landing.",
      "Using too heavy weights."
    ],
    "safety_flags": [
      "knee"
    ],
    "redundancy_group": "EXPLOSIVE_POWER",
    "fatigue_score": 4,
    "stability_score": 1,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": true
  },
  {
    "id": "dumbbell_snatch",
    "name": "Dumbbell Snatch",
    "aliases": [
      "db_snatch"
    ],
    "primary_muscles": [
      "front_delts",
      "back_lats"
    ],
    "secondary_muscles": [
      "glutes",
      "hamstrings",
      "core_anti_extension"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "POWER",
    "exercise_role": "POWER",
    "equipment": "Dumbbell",
    "difficulty": "Advanced",
    "experience_levels": [
      "advanced"
    ],
    "goals": [
      "power"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "UNILATERAL",
    "stability": "LOW",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "3-5",
    "recommended_rest_ranges": "120s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "dumbbell_swing"
    ],
    "instructions": [
      "Grip dumbbell on floor, flat back.",
      "Drive hips forward explosively, pulling dumbbell straight up.",
      "Lock weight out overhead, catch in soft squat."
    ],
    "common_technique_errors": [
      "Rounding spine.",
      "Torque on shoulders."
    ],
    "safety_flags": [
      "lower_back",
      "shoulder"
    ],
    "redundancy_group": "EXPLOSIVE_POWER",
    "fatigue_score": 4,
    "stability_score": 1,
    "skill_score": 4,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": true
  },
  {
    "id": "dumbbell_push_press",
    "name": "Dumbbell Push Press",
    "aliases": [
      "push_press"
    ],
    "primary_muscles": [
      "front_delts"
    ],
    "secondary_muscles": [
      "triceps",
      "quads"
    ],
    "movement_patterns": [
      "vertical_push"
    ],
    "category": "POWER",
    "exercise_role": "POWER",
    "equipment": "Dumbbell",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "power"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "MEDIUM",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "4-6",
    "recommended_rest_ranges": "120s",
    "progression_method": "Double Progression",
    "valid_substitutions": [
      "barbell_overhead_press"
    ],
    "instructions": [
      "Dumbbells at shoulders. Quick knee dip.",
      "Drive up through legs, pressing weights overhead."
    ],
    "common_technique_errors": [
      "Squatting too deep."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "VERTICAL_PRESSING",
    "fatigue_score": 4,
    "stability_score": 2,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": true
  },
  {
    "id": "clap_push_up",
    "name": "Clap Push-up",
    "aliases": [
      "explosive_push_up"
    ],
    "primary_muscles": [
      "chest"
    ],
    "secondary_muscles": [
      "front_delts",
      "triceps"
    ],
    "movement_patterns": [
      "horizontal_push"
    ],
    "category": "POWER",
    "exercise_role": "POWER",
    "equipment": "Bodyweight",
    "difficulty": "Advanced",
    "experience_levels": [
      "advanced"
    ],
    "goals": [
      "power"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "4-6",
    "recommended_rest_ranges": "90s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "push_up"
    ],
    "instructions": [
      "Lower in push-up. Press up explosively, clap in mid-air."
    ],
    "common_technique_errors": [
      "Stiff landing."
    ],
    "safety_flags": [
      "shoulder"
    ],
    "redundancy_group": "PUSHUP_FAMILY",
    "fatigue_score": 3,
    "stability_score": 2,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": true
  },
  {
    "id": "power_clean",
    "name": "Barbell Power Clean",
    "aliases": [
      "cleans"
    ],
    "primary_muscles": [
      "back_upper"
    ],
    "secondary_muscles": [
      "glutes",
      "hamstrings"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "POWER",
    "exercise_role": "POWER",
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "experience_levels": [
      "advanced"
    ],
    "goals": [
      "power"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "3-5",
    "recommended_rest_ranges": "120s",
    "progression_method": "Linear Overload",
    "valid_substitutions": [
      "dumbbell_snatch"
    ],
    "instructions": [
      "Deadlift stance. Pull bar up explosively. Catch on shoulders in partial squat."
    ],
    "common_technique_errors": [
      "Rounding spine."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "EXPLOSIVE_POWER",
    "fatigue_score": 5,
    "stability_score": 2,
    "skill_score": 5,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": true
  },
  {
    "id": "hang_clean",
    "name": "Barbell Hang Clean",
    "aliases": [
      "hang_cleans"
    ],
    "primary_muscles": [
      "back_upper"
    ],
    "secondary_muscles": [
      "glutes",
      "hamstrings"
    ],
    "movement_patterns": [
      "hip_dominant"
    ],
    "category": "POWER",
    "exercise_role": "POWER",
    "equipment": "Barbell",
    "difficulty": "Advanced",
    "experience_levels": [
      "advanced"
    ],
    "goals": [
      "power"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "high_systemic",
    "recommended_rep_ranges": "3-5",
    "recommended_rest_ranges": "120s",
    "progression_method": "Linear Overload",
    "valid_substitutions": [
      "power_clean"
    ],
    "instructions": [
      "Start with bar hanging at mid-thigh. Stand explosively, catch bar on front shoulders."
    ],
    "common_technique_errors": [
      "Rounding spine."
    ],
    "safety_flags": [
      "lower_back"
    ],
    "redundancy_group": "EXPLOSIVE_POWER",
    "fatigue_score": 5,
    "stability_score": 2,
    "skill_score": 5,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": true
  },
  {
    "id": "box_jump",
    "name": "Box Jump",
    "aliases": [
      "box_jumps"
    ],
    "primary_muscles": [
      "quads"
    ],
    "secondary_muscles": [
      "glutes",
      "calves"
    ],
    "movement_patterns": [
      "knee_dominant"
    ],
    "category": "POWER",
    "exercise_role": "POWER",
    "equipment": "Bodyweight",
    "difficulty": "Intermediate",
    "experience_levels": [
      "intermediate",
      "advanced"
    ],
    "goals": [
      "power"
    ],
    "compound_or_isolation": "COMPOUND",
    "unilateral_or_bilateral": "BILATERAL",
    "stability": "LOW",
    "fatigue_classification": "moderate_systemic",
    "recommended_rep_ranges": "5-6",
    "recommended_rest_ranges": "90s",
    "progression_method": "Rep Progression",
    "valid_substitutions": [
      "dumbbell_jump_squat"
    ],
    "instructions": [
      "Jump onto high box. Land soft."
    ],
    "common_technique_errors": [
      "Stiff landing."
    ],
    "safety_flags": [
      "knee"
    ],
    "redundancy_group": "EXPLOSIVE_POWER",
    "fatigue_score": 2,
    "stability_score": 1,
    "skill_score": 3,
    "preferred_for_beginners": false,
    "preferred_for_hypertrophy": false,
    "preferred_for_strength": false,
    "preferred_for_power": true
  },
  {
    "id": "incline_barbell_press",
    "name": "Incline Barbell Press",
    "movement_patterns": [
      "horizontal_push"
    ],
    "compound_or_isolation": "COMPOUND",
    "equipment": "barbell, incline_bench, rack",
    "recommended_rep_ranges": "6-10",
    "recommended_rest_ranges": "120s",
    "valid_substitutions": [
      "incline_dumbbell_press"
    ],
    "primary_muscles": [
      "unknown"
    ],
    "fatigue_score": 3,
    "stability_score": 3,
    "skill_score": 3
  },
  {
    "id": "pike_pushup",
    "name": "Pike Push-up",
    "movement_patterns": [
      "vertical_push"
    ],
    "compound_or_isolation": "COMPOUND",
    "equipment": "bodyweight",
    "recommended_rep_ranges": "8-15",
    "recommended_rest_ranges": "90s",
    "valid_substitutions": [
      "dumbbell_shoulder_press",
      "machine_shoulder_press"
    ],
    "primary_muscles": [
      "unknown"
    ],
    "fatigue_score": 3,
    "stability_score": 3,
    "skill_score": 3
  },
  {
    "id": "farmers_carry",
    "name": "Farmer's Carry",
    "movement_patterns": [
      "hip_dominant"
    ],
    "compound_or_isolation": "COMPOUND",
    "equipment": "dumbbells, kettlebells",
    "recommended_rep_ranges": "30-40 sec per set",
    "recommended_rest_ranges": "90s",
    "valid_substitutions": [],
    "primary_muscles": [
      "unknown"
    ],
    "fatigue_score": 3,
    "stability_score": 3,
    "skill_score": 3
  },
  {
    "id": "reverse_curl",
    "name": "Reverse Curl",
    "movement_patterns": [
      "elbow_flexion"
    ],
    "compound_or_isolation": "ISOLATION",
    "equipment": "ez_bar, barbell, dumbbells",
    "recommended_rep_ranges": "10-15",
    "recommended_rest_ranges": "60s",
    "valid_substitutions": [
      "hammer_curl"
    ],
    "primary_muscles": [
      "unknown"
    ],
    "fatigue_score": 3,
    "stability_score": 3,
    "skill_score": 3
  },
  {
    "id": "reverse_wrist_curl",
    "name": "Reverse Wrist Curl",
    "movement_patterns": [
      "elbow_extension"
    ],
    "compound_or_isolation": "ISOLATION",
    "equipment": "barbell, dumbbells, bench",
    "recommended_rep_ranges": "12-20",
    "recommended_rest_ranges": "45s",
    "valid_substitutions": [
      "wrist_curl"
    ],
    "primary_muscles": [
      "unknown"
    ],
    "fatigue_score": 3,
    "stability_score": 3,
    "skill_score": 3
  },
  {
    "id": "wrist_curl",
    "name": "Wrist Curl",
    "movement_patterns": [
      "elbow_flexion"
    ],
    "compound_or_isolation": "ISOLATION",
    "equipment": "barbell, dumbbells, bench",
    "recommended_rep_ranges": "12-20",
    "recommended_rest_ranges": "45s",
    "valid_substitutions": [
      "reverse_wrist_curl"
    ],
    "primary_muscles": [
      "unknown"
    ],
    "fatigue_score": 3,
    "stability_score": 3,
    "skill_score": 3
  },
  {
    "id": "cable_glute_kickback",
    "name": "Cable Glute Kickback",
    "movement_patterns": [
      "hip_dominant"
    ],
    "compound_or_isolation": "ISOLATION",
    "equipment": "cable_machine",
    "recommended_rep_ranges": "12-15 per leg",
    "recommended_rest_ranges": "60s",
    "valid_substitutions": [
      "hip_thrust",
      "glute_bridge"
    ],
    "primary_muscles": [
      "unknown"
    ],
    "fatigue_score": 3,
    "stability_score": 3,
    "skill_score": 3
  },
  {
    "id": "singleleg_calf_raise",
    "name": "Single-Leg Calf Raise",
    "movement_patterns": [
      "calf_plantar_flexion"
    ],
    "compound_or_isolation": "ISOLATION",
    "equipment": "bodyweight",
    "recommended_rep_ranges": "15-20 per leg",
    "recommended_rest_ranges": "45s",
    "valid_substitutions": [
      "standing_calf_raise"
    ],
    "primary_muscles": [
      "unknown"
    ],
    "fatigue_score": 3,
    "stability_score": 3,
    "skill_score": 3
  },
  {
    "id": "side_plank",
    "name": "Side Plank",
    "movement_patterns": [
      "anti_rotation_core"
    ],
    "compound_or_isolation": "ISOLATION",
    "equipment": "bodyweight",
    "recommended_rep_ranges": "20-40 sec per side",
    "recommended_rest_ranges": "45s",
    "valid_substitutions": [
      "pallof_press"
    ],
    "primary_muscles": [
      "unknown"
    ],
    "fatigue_score": 3,
    "stability_score": 3,
    "skill_score": 3
  }
];

export const getExerciseById = (id) => EXERCISE_DATABASE.find(ex => ex.id === id);
