import { GoogleGenerativeAI } from '@google/generative-ai';
import { generateWorkoutPlanLocal } from './planGenerator.js';

// Initialize the Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Fetch the model
const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-flash',
});

/**
 * Generates a complete 4-week workout plan using the deterministic engine, then enriches with Gemini explanations.
 * @param {object} profile - The user's physical profile.
 * @returns {Promise<object>} The enriched JSON workout plan.
 */
export async function generateWorkoutPlan(profile) {
  // 1. Generate plan using the deterministic programming engine
  const plan = generateWorkoutPlanLocal(profile);

  // 2. Call Gemini to personalize communication and explain coaching rationale
  if (process.env.GEMINI_API_KEY) {
    try {
      const fitnessGoal = profile.fitnessGoal || profile.fitness_goal || 'build_muscle';
      const fitnessLevel = profile.fitnessLevel || profile.fitness_level || 'beginner';
      const trainingDays = profile.trainingDays || (profile.metadata && profile.metadata.training_days) || 3;

      const prompt = `
        You are an elite sports scientist and personal trainer. We have deterministically built a resistance-training program:
        Client: ${profile.fullName || profile.full_name || 'Client'}
        Goal: ${fitnessGoal}
        Level: ${fitnessLevel}
        Days: ${trainingDays}
        
        The generated week 1 routine is:
        ${JSON.stringify(plan.weekly_schedule.week1)}

        Please write a personalized coaching explanation for this specific program:
        1. why_this_workout: A simple, scientific rationale of why this weekly/session layout fits the client under the ACSM 2026 guidelines.
        2. pro_tips: A list of 3 specific, actionable coaching tips. Do NOT include generic advice like 'stay motivated' or 'drink water'. Focus on safety, technique cues, or recovery.

        Respond ONLY with a single JSON object matching this structure:
        {
          "why_this_workout": "Your rationale here",
          "pro_tips": ["tip1", "tip2", "tip3"]
        }
      `;

      const result = await model.generateContent({
        contents: [{ role: 'user', parts: [{ text: prompt }] }],
        generationConfig: {
          responseMimeType: 'application/json',
        },
      });

      const text = result.response.text();
      const explanation = JSON.parse(text);
      
      if (explanation.why_this_workout) {
        plan.why_this_workout = explanation.why_this_workout;
      }
      if (explanation.pro_tips && Array.isArray(explanation.pro_tips)) {
        plan.pro_tips = explanation.pro_tips;
      }
    } catch (error) {
      console.warn('Gemini coaching explanation enrichment failed, using local fallback:', error);
    }
  }

  return plan;
}

/**
 * Generates a complete 7-day nutrition and meal plan using Gemini Flash.
 * @param {object} profile - The user's physical profile.
 * @param {number} targetCalories - Pre-calculated target daily calories.
 * @returns {Promise<object>} The parsed JSON nutrition plan.
 */
export async function generateNutritionPlan(profile, targetCalories) {
  const {
    full_name,
    body_type,
    fitness_goal,
    dietary_preference,
    activity_level,
    age,
    weight,
    height,
    health_conditions,
  } = profile;

  const prompt = `
    You are an elite sports nutritionist and dietitian. Generate a comprehensive, personalized 7-day nutrition and meal plan for a user with the following profile:
    - Name: ${full_name || 'Client'}
    - Age: ${age} years old
    - Height: ${height} cm
    - Weight: ${weight} kg
    - Body Type: ${body_type}
    - Fitness Goal: ${fitness_goal}
    - Dietary Preference: ${dietary_preference} (non-vegetarian/vegetarian/vegan)
    - Activity Level: ${activity_level}
    - Target Daily Calories: ${targetCalories} kcal
    - Health Conditions / Allergies: ${health_conditions || 'None'}
 
    The meal plan must be tailored to their dietary preference and daily calorie target.
    
    You MUST respond with a single, valid JSON object matching this exact structure:
    {
      "plan_name": "Name of the customized nutrition plan",
      "daily_calories": ${targetCalories},
      "macros": {
        "protein": 180, 
        "carbs": 220, 
        "fat": 70, 
        "fiber": 30
      },
      "meal_timing": "Overview of when to eat meals for optimal performance and metabolism",
      "meal_plan": {
        "monday": {
          "breakfast": {
            "name": "Meal Name",
            "calories": 450,
            "protein": 30,
            "carbs": 50,
            "fat": 12,
            "ingredients": ["ingredient 1 (amount)", "ingredient 2 (amount)"],
            "recipe": "Step-by-step simple cooking instructions"
          },
          "morning_snack": {
            "name": "Snack Name",
            "calories": 150,
            "protein": 15,
            "carbs": 10,
            "fat": 4,
            "ingredients": ["item 1"],
            "recipe": "Direct consumption or assembly"
          },
          "lunch": {
            "name": "Lunch Name",
            "calories": 600,
            "protein": 40,
            "carbs": 65,
            "fat": 18,
            "ingredients": [],
            "recipe": ""
          },
          "evening_snack": {
            "name": "Snack Name",
            "calories": 150,
            "protein": 12,
            "carbs": 15,
            "fat": 3,
            "ingredients": [],
            "recipe": ""
          },
          "dinner": {
            "name": "Dinner Name",
            "calories": 550,
            "protein": 35,
            "carbs": 45,
            "fat": 15,
            "ingredients": [],
            "recipe": ""
          }
        },
        "tuesday": { ... same 5 meal breakdown ... },
        "wednesday": { ... same 5 meal breakdown ... },
        "thursday": { ... same 5 meal breakdown ... },
        "friday": { ... same 5 meal breakdown ... },
        "saturday": { ... same 5 meal breakdown ... },
        "sunday": { ... same 5 meal breakdown ... }
      },
      "hydration": "Daily target water intake and scheduling advice",
      "supplements": [
        {
          "name": "Supplement Name",
          "dosage": "e.g., 5g",
          "timing": "e.g., Post-workout",
          "reason": "Why this benefits them"
        }
      ],
      "foods_to_avoid": ["specific food items to avoid based on goals/profile"],
      "grocery_list": ["itemized checklist of ingredients needed for the entire week"]
    }

    Notes:
    - Custom values for macros must be calculated and align logically with the calorie target (${targetCalories} kcal) where Protein is 4 cal/g, Carbs is 4 cal/g, and Fat is 9 cal/g.
    - Provide high-quality, actionable, and delicious recipes.
    - Return ONLY valid JSON. Do not include markdown formatting like \`\`\`json.
  `;

  try {
    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: prompt }] }],
      generationConfig: {
        responseMimeType: 'application/json',
      },
    });

    const text = result.response.text();
    return JSON.parse(text);
  } catch (error) {
    console.error('Gemini generateNutritionPlan Error:', error);
    throw new Error('Failed to generate nutrition plan from AI. Please try again.');
  }
}
