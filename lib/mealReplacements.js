/**
 * DESI GYM — Indian Meal Replacements Database
 * Contains alternative meal combinations with close macronutrient profiles.
 */

export const MEAL_REPLACEMENTS = {
  breakfast: {
    vegetarian: [
      {
        name: "Sautéed Paneer & Moong Sprouts",
        calories: 450, protein: 28, carbs: 42, fat: 16,
        ingredients: ["Paneer (100g)", "Sprouted Moong (60g)", "Onions & Tomatoes", "Olive oil (1 tsp)"],
        recipe: "Toss moong sprouts and cubed paneer in a hot pan with spices, salt, and lemon juice."
      },
      {
        name: "High-Protein Besan Chilla & Dahi",
        calories: 430, protein: 22, carbs: 48, fat: 14,
        ingredients: ["Gram Flour/Besan (80g)", "Low-fat Dahi/Curd (150g)", "Chopped Spinach & Green Chillies"],
        recipe: "Make a batter of besan, water, spinach, and spices. Pour on tawa, cook both sides. Serve with curd."
      },
      {
        name: "Peanut Butter Oats & Whey Shake",
        calories: 460, protein: 32, carbs: 50, fat: 12,
        ingredients: ["Rolled Oats (40g)", "Peanut Butter (1 tbsp)", "Skimmed Milk (200ml)", "Whey Protein (1/2 scoop)"],
        recipe: "Boil oats in milk. Stir in peanut butter. Drink alongside protein shake."
      }
    ],
    "non-vegetarian": [
      {
        name: "Whole Egg Scramble & Whole Wheat Toast",
        calories: 450, protein: 26, carbs: 38, fat: 18,
        ingredients: ["Whole Eggs (3)", "Brown Bread (2 slices) or Roti (2)", "Onions & Peppers", "Butter (1 tsp)"],
        recipe: "Scramble eggs with onions, peppers, and green chillies in butter. Serve on toasted bread."
      },
      {
        name: "Chicken Breast Sandwich & Fruit",
        calories: 470, protein: 34, carbs: 45, fat: 11,
        ingredients: ["Boiled Shredded Chicken (100g)", "Whole Wheat Bread (2 slices)", "Low-fat Mayo (1 tsp)", "One Apple"],
        recipe: "Mix chicken and light spices with mayo. Place between toasted bread. Serve with sliced apple."
      }
    ]
  },
  morning_snack: {
    vegetarian: [
      {
        name: "Spiced Roasted Makhana & Pumpkin Seeds",
        calories: 170, protein: 7, carbs: 18, fat: 9,
        ingredients: ["Foxnuts/Makhana (25g)", "Pumpkin Seeds (15g)", "Turmeric & Salt (pinch)"],
        recipe: "Dry roast makhana and pumpkin seeds in a tawa with light seasoning."
      },
      {
        name: "Sattu Drink (Roasted Chickpea Shake)",
        calories: 160, protein: 9, carbs: 24, fat: 3,
        ingredients: ["Sattu Flour (30g)", "Water (250ml)", "Lemon Juice", "Roasted Cumin Powder"],
        recipe: "Mix sattu flour in cold water, squeeze lemon, add black salt and cumin powder. Stir vigorously."
      }
    ],
    "non-vegetarian": [
      {
        name: "Boiled Egg Whites & Cucumber Slices",
        calories: 130, protein: 16, carbs: 6, fat: 4,
        ingredients: ["Egg Whites (4 boiled)", "Whole Cucumber (1)", "Black pepper"],
        recipe: "Slice boiled egg whites and cucumber. Sprinkle chat masala or black pepper."
      }
    ]
  },
  lunch: {
    vegetarian: [
      {
        name: "Paneer Bhurji, Sookhi Dal & Rice",
        calories: 590, protein: 34, carbs: 70, fat: 18,
        ingredients: ["Paneer (100g scrambled)", "Moong Dal (1 cup cooked)", "Basmati Rice (100g cooked)", "Salad"],
        recipe: "Sauté paneer bhurji with spices. Serve alongside plain boiled rice and thick yellow dal."
      },
      {
        name: "Soya Chunks Biryani & Cucumber Raita",
        calories: 610, protein: 38, carbs: 78, fat: 12,
        ingredients: ["Soya Chunks (50g)", "Basmati Rice (100g raw weight)", "Curd (100g)", "Biryani Spices"],
        recipe: "Boil soya chunks, squeeze out water. Cook with rice, tomatoes, onions, and biryani spices. Serve with raita."
      }
    ],
    "non-vegetarian": [
      {
        name: "Fish Curry, Steamed Rice & Stir-fry bhindi",
        calories: 600, protein: 36, carbs: 75, fat: 14,
        ingredients: ["Rohu/Surmai Fish (150g)", "Steamed White Rice (120g)", "Bhindi/Okra Sabzi (1 cup)", "Mustard oil (1 tsp)"],
        recipe: "Cook fish curry in light gravy. Serve with hot steamed rice and bhindi stir-fry."
      },
      {
        name: "Chicken Masala Roti Wrap & Salad",
        calories: 580, protein: 40, carbs: 65, fat: 16,
        ingredients: ["Boneless Chicken Breast (150g)", "Whole Wheat Roti (2)", "Sliced Onion & Lemon", "Olive oil (1 tsp)"],
        recipe: "Cook chicken in pan with spices. Wrap inside warm rotis with sliced raw onions and squeeze of lemon."
      }
    ]
  },
  evening_snack: {
    vegetarian: [
      {
        name: "Paneer Tikka cubes (Tawa grilled)",
        calories: 190, protein: 12, carbs: 6, fat: 14,
        ingredients: ["Paneer (80g)", "Bell Peppers & Onions (30g)", "Yogurt marinade (1 tbsp)"],
        recipe: "Marinate paneer and vegetables in spiced curd. Skewer and grill on non-stick tawa until golden."
      },
      {
        name: "Roasted Peanuts (Moongfali)",
        calories: 200, protein: 9, carbs: 7, fat: 17,
        ingredients: ["Roasted Peanuts (35g)"],
        recipe: "Direct consumption of lightly salted roasted peanuts."
      }
    ],
    "non-vegetarian": [
      {
        name: "Chicken Seekh Kebab (2 skewers)",
        calories: 180, protein: 18, carbs: 4, fat: 10,
        ingredients: ["Minced Chicken Seekh Kebab (100g cooked)", "Mint Chutney"],
        recipe: "Tawa grill seekh kebabs. Serve with green coriander-mint chutney."
      }
    ]
  },
  dinner: {
    vegetarian: [
      {
        name: "Tofu Stir-fry, Quinoa/Rice & Dal",
        calories: 520, protein: 28, carbs: 55, fat: 16,
        ingredients: ["Firm Tofu (150g)", "Brown Rice (100g cooked)", "Masoor Dal (1 cup)", "Broccoli & Mushrooms"],
        recipe: "Sauté tofu cubes and vegetables in garlic and light soy sauce. Serve with hot rice and dal."
      },
      {
        name: "Paneer Kathi Roll (Whole Wheat)",
        calories: 540, protein: 26, carbs: 50, fat: 20,
        ingredients: ["Paneer (100g)", "Whole Wheat Paratha (1)", "Capsicum/Onions", "Mint Sauce"],
        recipe: "Stir-fry paneer strips with capsicum and onions. Wrap inside tawa-paratha with green chutney."
      }
    ],
    "non-vegetarian": [
      {
        name: "Grilled Chicken Breast, Mashed Potato & Beans",
        calories: 530, protein: 42, carbs: 45, fat: 13,
        ingredients: ["Chicken Breast (180g)", "Mashed Potato (100g)", "Sautéed French Beans", "Butter (1/2 tsp)"],
        recipe: "Pan-sear chicken breast. Prepare mashed potato with a touch of butter/milk. Serve with green beans."
      },
      {
        name: "Egg Roti Roll with Mint Chutney",
        calories: 510, protein: 26, carbs: 46, fat: 18,
        ingredients: ["Whole Eggs (3)", "Whole Wheat Roti (2)", "Green chutney & onions"],
        recipe: "Make a flat omelette with eggs. Place on top of roti on tawa. Wrap with onions and mint chutney."
      }
    ]
  }
};

/**
 * Gets a list of replacements for a specific meal type and diet
 * @param {string} mealType - breakfast, morning_snack, lunch, evening_snack, dinner
 * @param {string} dietType - vegetarian, eggetarian, non-vegetarian
 * @returns {array} list of replacement meals
 */
export function getMealReplacements(mealType, dietType) {
  const normalizedDiet = dietType === 'vegetarian' || dietType === 'vegan' ? 'vegetarian' : 'non-vegetarian';
  const group = MEAL_REPLACEMENTS[mealType] || {};
  return group[normalizedDiet] || group['vegetarian'] || []; // fallback to veg
}
