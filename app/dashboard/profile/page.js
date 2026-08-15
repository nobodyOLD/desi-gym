'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { generateWorkoutPlanLocal, generateNutritionPlanLocal } from '@/lib/planGenerator';
import {
  User,
  Activity,
  Award,
  Apple,
  Eye,
  ArrowLeft,
  ArrowRight,
  Sparkles,
  Flame,
  Scale,
  ShieldAlert,
  Loader2,
  CheckCircle,
  Home,
  Check
} from 'lucide-react';

export default function ProfilePage() {
  const [step, setStep] = useState(1);
  const [loadingProfile, setLoadingProfile] = useState(true);
  const [generatingPlans, setGeneratingPlans] = useState(false);
  const [user, setUser] = useState(null);
  
  // Custom states for safety warnings
  const [safetyRisk, setSafetyRisk] = useState(false);
  const [acknowledgedSafety, setAcknowledgedSafety] = useState(false);

  const router = useRouter();

  // Initialize React Hook Form
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      fullName: '',
      age: 25,
      gender: 'Male',
      height: 175,
      weight: 70,
      fitnessGoal: 'build_muscle',
      fitnessLevel: 'beginner',
      trainingDays: '3',
      sessionDuration: '60 min',
      trainingLocation: 'Gym',
      equipmentAvailable: ['Dumbbell', 'Bodyweight'],
      dietaryPreference: 'non-vegetarian',
      foodPreference: 'North Indian',
      foodExclusions: '',
      budgetPreference: 'Standard',
      mealFrequency: '4',
      stepsTarget: '10000',
      sleepDuration: '7.0',
      workType: 'Desk job',
      availableTrainingTime: 'Evening',
      priorityMuscle: 'overall',
      hasInjuries: 'no',
      injuryDetails: '',
      hasMedicalRestrictions: 'no',
      medicalDetails: '',
      hasExerciseLimitations: 'no',
      limitDetails: '',
    },
  });

  // Watch fields for conditional UI styling
  const watchedGoal = watch('fitnessGoal');
  const watchedExperience = watch('fitnessLevel');
  const watchedDays = watch('trainingDays');
  const watchedDuration = watch('sessionDuration');
  const watchedLocation = watch('trainingLocation');
  const watchedEquipment = watch('equipmentAvailable') || [];
  const watchedDiet = watch('dietaryPreference');
  const watchedRegional = watch('foodPreference');
  const watchedBudget = watch('budgetPreference');
  const watchedFrequency = watch('mealFrequency');
  const watchedTime = watch('availableTrainingTime');
  const watchedWork = watch('workType');
  const watchedInjuries = watch('hasInjuries');
  const watchedMedical = watch('hasMedicalRestrictions');
  const watchedLimitations = watch('hasExerciseLimitations');

  // Sync safety risk state based on warning answers
  useEffect(() => {
    if (watchedInjuries === 'yes' || watchedMedical === 'yes' || watchedLimitations === 'yes') {
      setSafetyRisk(true);
    } else {
      setSafetyRisk(false);
    }
  }, [watchedInjuries, watchedMedical, watchedLimitations]);

  // Load profile data on page load
  useEffect(() => {
    async function loadUserProfile() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }
        setUser(session.user);

        // Fetch profile
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        if (profile) {
          // Parse metadata if available, otherwise fallback
          const metadata = profile.metadata || {};
          reset({
            fullName: profile.full_name || '',
            age: profile.age || 25,
            gender: profile.gender || 'Male',
            height: Number(profile.height) || 175,
            weight: Number(profile.weight) || 70,
            fitnessGoal: profile.fitness_goal || 'build_muscle',
            fitnessLevel: profile.fitness_level || 'beginner',
            trainingDays: metadata.training_days || '3',
            sessionDuration: metadata.session_duration || '60 min',
            trainingLocation: metadata.training_location || 'Gym',
            equipmentAvailable: metadata.equipment_available || ['Dumbbell', 'Bodyweight'],
            dietaryPreference: profile.dietary_preference || 'non-vegetarian',
            foodPreference: metadata.food_preference || 'North Indian',
            foodExclusions: metadata.food_exclusions || '',
            budgetPreference: metadata.budget_preference || 'Standard',
            mealFrequency: metadata.meal_frequency || '4',
            stepsTarget: metadata.steps_target || '10000',
            sleepDuration: metadata.sleep_duration || '7.0',
            workType: metadata.work_type || 'Desk job',
            availableTrainingTime: metadata.available_training_time || 'Evening',
            hasInjuries: metadata.has_injuries || 'no',
            injuryDetails: metadata.injury_details || '',
            hasMedicalRestrictions: metadata.has_medical_restrictions || 'no',
            medicalDetails: metadata.medical_details || '',
            hasExerciseLimitations: metadata.has_exercise_limitations || 'no',
            limitDetails: metadata.limit_details || '',
          });
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoadingProfile(false);
      }
    }

    loadUserProfile();
  }, [reset, router]);

  const handleNext = () => {
    // If step is safety review and they have risk but haven't acknowledged it
    if (step === 6 && safetyRisk && !acknowledgedSafety) {
      toast.error('Please acknowledge the safety disclaimer before generating your plan.');
      return;
    }
    setStep((prev) => Math.min(prev + 1, 7));
  };

  const handleBack = () => {
    setStep((prev) => Math.max(prev - 1, 1));
  };

  const handleEquipmentToggle = (item) => {
    const current = [...watchedEquipment];
    const idx = current.indexOf(item);
    if (idx > -1) {
      current.splice(idx, 1);
    } else {
      current.push(item);
    }
    setValue('equipmentAvailable', current);
  };

  const onSubmit = async (formData) => {
    if (!user) return;
    setGeneratingPlans(true);
    setStep(7); // Jump to loading state visual

    try {
      // Simulate delay for premium feel
      await new Promise((resolve) => setTimeout(resolve, 3000));

      const isSandbox = !process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder');

      const profilePayload = {
        full_name: formData.fullName,
        age: parseInt(formData.age),
        gender: formData.gender,
        height: parseFloat(formData.height),
        weight: parseFloat(formData.weight),
        body_type: 'mesomorph', // Default for fallback calculations
        fitness_goal: formData.fitnessGoal,
        activity_level: 'moderate',
        fitness_level: formData.fitnessLevel,
        dietary_preference: formData.dietaryPreference,
        health_conditions: formData.injuryDetails || formData.medicalDetails || 'None',
        metadata: {
          training_days: formData.trainingDays,
          session_duration: formData.sessionDuration,
          training_location: formData.trainingLocation,
          equipment_available: formData.equipmentAvailable,
          priority_muscle: formData.priorityMuscle,
          food_preference: formData.foodPreference,
          food_exclusions: formData.foodExclusions,
          budget_preference: formData.budgetPreference,
          meal_frequency: formData.mealFrequency,
          steps_target: formData.stepsTarget,
          sleep_duration: formData.sleepDuration,
          work_type: formData.workType,
          available_training_time: formData.availableTrainingTime,
          has_injuries: formData.hasInjuries,
          injury_details: formData.injuryDetails,
          has_medical_restrictions: formData.hasMedicalRestrictions,
          medical_details: formData.medicalDetails,
          has_exercise_limitations: formData.hasExerciseLimitations,
          limit_details: formData.limitDetails,
        }
      };

      // 1. Save Profile
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          ...profilePayload,
          updated_at: new Date().toISOString()
        });

      if (profileError) throw profileError;

      // 2. Generate Workouts & Nutrition (Local Fallback or Call API)
      if (isSandbox) {
        const localWorkoutPlan = generateWorkoutPlanLocal(formData);
        const localNutritionPlan = generateNutritionPlanLocal(formData);

        // Deactivate old plans
        await supabase.from('workout_plans').update({ is_active: false }).eq('user_id', user.id);
        await supabase.from('nutrition_plans').update({ is_active: false }).eq('user_id', user.id);

        // Save new local plans
        await supabase.from('workout_plans').insert({
          user_id: user.id,
          plan_name: localWorkoutPlan.plan_name,
          plan_data: localWorkoutPlan,
          difficulty: formData.fitnessLevel,
          is_active: true
        });

        await supabase.from('nutrition_plans').insert({
          user_id: user.id,
          plan_name: localNutritionPlan.plan_name,
          daily_calories: localNutritionPlan.daily_calories,
          protein_grams: localNutritionPlan.protein_grams,
          carbs_grams: localNutritionPlan.carbs_grams,
          fat_grams: localNutritionPlan.fat_grams,
          meal_plan: localNutritionPlan,
          is_active: true
        });
      } else {
        // API handles generation using live keys
        const workoutRes = await fetch('/api/workout-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: profilePayload }),
        });
        if (!workoutRes.ok) throw new Error('Failed to generate workout plan via API');

        const nutritionRes = await fetch('/api/nutrition-plan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ profile: profilePayload }),
        });
        if (!nutritionRes.ok) throw new Error('Failed to generate nutrition plan via API');
      }

      toast.success('Your Desi Gym program has been generated! Let\'s train! 🚀');
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      console.error(err);
      toast.error('An error occurred during plan generation: ' + err.message);
      setGeneratingPlans(false);
      setStep(6);
    }
  };

  if (loadingProfile) {
    return (
      <div className="h-[60vh] flex flex-col justify-center items-center">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        <span className="text-gray-400 text-sm mt-3 animate-pulse">Loading Desi Gym Wizard...</span>
      </div>
    );
  }

  const stepsLabel = [
    '01 About',
    '02 Goal',
    '03 Training',
    '04 Nutrition',
    '05 Lifestyle',
    '06 Safety',
    '07 Your Plan'
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Onboarding progress steps header */}
      {step < 7 && (
        <div className="bg-gray-900 border border-gray-800 p-6 rounded-2xl">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-lg font-black text-white tracking-tight uppercase">Plan Configurator</h2>
              <p className="text-xs text-gray-400 mt-0.5">Let's align your program to your real life.</p>
            </div>
            <div className="text-right">
              <span className="text-sm font-black text-orange-500">Step {step} of 6</span>
              <div className="w-32 h-1.5 bg-gray-950 rounded-full overflow-hidden mt-1 border border-gray-850">
                <div
                  className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-300"
                  style={{ width: `${(step / 6) * 100}%` }}
                />
              </div>
            </div>
          </div>

          {/* Stepper bar desktop */}
          <div className="hidden md:grid grid-cols-7 gap-2 mt-6 pt-4 border-t border-gray-850 text-center">
            {stepsLabel.map((label, idx) => {
              const active = step === idx + 1;
              const completed = step > idx + 1;
              return (
                <div
                  key={idx}
                  className={`text-xs font-bold transition-colors ${
                    active ? 'text-orange-500' : completed ? 'text-gray-400' : 'text-gray-600'
                  }`}
                >
                  <span className={`inline-block mr-1 rounded-full text-[9px] px-1 py-0.2 border ${
                    active ? 'border-orange-500' : completed ? 'border-gray-400 bg-gray-800' : 'border-gray-800'
                  }`}>{idx + 1}</span>
                  {label.split(' ')[1]}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Onboarding Card */}
      {step < 7 && (
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 shadow-2xl space-y-6">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* STEP 1: ABOUT YOU */}
            {step === 1 && (
              <div className="space-y-6">
                <div className="border-b border-gray-850 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <User className="h-5.5 w-5.5 text-orange-500 mr-2" />
                    Tell Us About You
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Provide basic biometric data to calculate correct training volumes.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Your Name</label>
                    <input
                      type="text"
                      {...register('fullName', { required: 'Name is required' })}
                      className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                      placeholder="e.g. Rahul Sharma"
                    />
                    {errors.fullName && <p className="text-red-500 text-xs mt-1 font-semibold">{errors.fullName.message}</p>}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Age</label>
                    <input
                      type="number"
                      {...register('age', { required: true, min: 14, max: 80 })}
                      className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Biological Sex</label>
                    <select
                      {...register('gender')}
                      className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                    >
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase">Height (cm)</label>
                      <input
                        type="number"
                        {...register('height', { required: true })}
                        className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                        placeholder="e.g. 175"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase">Weight (kg)</label>
                      <input
                        type="number"
                        {...register('weight', { required: true })}
                        className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                        placeholder="e.g. 70"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2: GOAL */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="border-b border-gray-850 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Award className="h-5.5 w-5.5 text-orange-500 mr-2" />
                    Select Your Primary Goal
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">This shapes the program split and caloric targets.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { id: 'build_muscle', title: 'Muscle Gain 💪', desc: 'Prioritize progressive compound lifts to pack on dense muscle tissue, paired with a calculated surplus.' },
                    { id: 'lose_weight', title: 'Fat Loss 🔥', desc: 'Promote metabolic fat burn while retaining lean tissue via active deficits and high-density splits.' },
                    { id: 'recomposition', title: 'Body Recomposition ⚖️', desc: 'Build skeletal muscle and shed body fat simultaneously. Ideal for beginner/intermediates.' },
                    { id: 'strength', title: 'Max Strength 🏋️', desc: 'Target lower-rep strength block programs focusing on Squat, Bench Press, and Deadlift progression.' },
                    { id: 'power', title: 'Athletic Power ⚡', desc: 'Prioritize explosive power movements, velocity-based training, and dynamic rate of force development.' },
                    { id: 'maintain', title: 'General Fitness 🏃', desc: 'Build cardiovascular capacity, core stabilization, active mobility, and standard overall health.' }
                  ].map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setValue('fitnessGoal', g.id)}
                      className={`text-left p-5 rounded-2xl border-2 transition-all flex flex-col justify-between ${
                        watchedGoal === g.id
                          ? 'border-orange-500 bg-orange-500/10'
                          : 'border-gray-800 bg-gray-950 hover:border-gray-700'
                      }`}
                    >
                      <span className="text-sm font-black text-white block">{g.title}</span>
                      <span className="text-xs text-gray-400 mt-2 font-medium leading-relaxed">{g.desc}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 3: TRAINING SETUP */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="border-b border-gray-850 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Flame className="h-5.5 w-5.5 text-orange-500 mr-2" />
                    Configure Your Training
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Determine where, how often, and with what you lift.</p>
                </div>

                <div className="space-y-6">
                  {/* Experience & Days */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase">Training Experience</label>
                      <select
                        {...register('fitnessLevel')}
                        className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                      >
                        <option value="beginner">Beginner (Under 6m lifting)</option>
                        <option value="intermediate">Intermediate (1-2 years lifting)</option>
                        <option value="advanced">Advanced (3+ years compound lifts)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase">Training Frequency (Days/Week)</label>
                      <div className="flex gap-1.5 mt-2 bg-gray-950 p-1 rounded-xl border border-gray-800">
                        {['2', '3', '4', '5', '6'].map((d) => (
                          <button
                            key={d}
                            type="button"
                            onClick={() => setValue('trainingDays', d)}
                            className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${
                              watchedDays === d ? 'bg-orange-500 text-white' : 'text-gray-400 hover:text-white'
                            }`}
                          >
                            {d}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase">Workout Duration</label>
                      <select
                        {...register('sessionDuration')}
                        className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                      >
                        <option value="30 min">30 min (Express)</option>
                        <option value="45 min">45 min (Standard)</option>
                        <option value="60 min">60 min (Hypertrophy)</option>
                        <option value="75+ min">75+ min (Powerlifting)</option>
                      </select>
                    </div>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Training Location</label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                      {[
                        { key: 'Gym', label: 'Commercial Gym 🏢' },
                        { key: 'Home', label: 'Home Gym 🏠' },
                        { key: 'Both', label: 'Mix of Both 🔄' }
                      ].map((loc) => (
                        <button
                          key={loc.key}
                          type="button"
                          onClick={() => setValue('trainingLocation', loc.key)}
                          className={`py-3.5 text-center text-xs font-bold rounded-xl border transition-all ${
                            watchedLocation === loc.key
                              ? 'border-orange-500 bg-orange-500/10 text-white'
                              : 'border-gray-800 bg-gray-950 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          {loc.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Priority Muscle Group */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Priority Muscle Focus</label>
                    <select
                      {...register('priorityMuscle')}
                      className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                    >
                      <option value="overall">Overall Physique (Balanced)</option>
                      <option value="chest">Chest Focus</option>
                      <option value="back">Back Focus</option>
                      <option value="shoulders">Shoulders Focus</option>
                      <option value="arms">Arms Focus (Biceps & Triceps)</option>
                      <option value="legs">Legs Focus (Quads & Hamstrings)</option>
                      <option value="glutes">Glutes Focus</option>
                    </select>
                  </div>

                  {/* Equipment Checklist */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase mb-2">Equipment Available (Select all that apply)</label>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                      {[
                        { key: 'Barbell', label: 'Barbell 🏋️' },
                        { key: 'Dumbbell', label: 'Dumbbells 🧴' },
                        { key: 'Cables', label: 'Cables ⚙️' },
                        { key: 'Machines', label: 'Machines 🗜️' },
                        { key: 'Bodyweight', label: 'Bodyweight 🤸' }
                      ].map((eq) => {
                        const isChecked = watchedEquipment.includes(eq.key);
                        return (
                          <button
                            key={eq.key}
                            type="button"
                            onClick={() => handleEquipmentToggle(eq.key)}
                            className={`py-3 text-center text-xs font-bold rounded-xl border transition-all flex items-center justify-center space-x-1.5 ${
                              isChecked
                                ? 'border-orange-500 bg-orange-500/5 text-white'
                                : 'border-gray-800 bg-gray-950 text-gray-400 hover:border-gray-700'
                            }`}
                          >
                            {isChecked && <Check className="h-3 w-3 text-orange-500" />}
                            <span>{eq.label}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4: NUTRITION */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="border-b border-gray-850 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Apple className="h-5.5 w-5.5 text-orange-500 mr-2" />
                    Indian Nutrition Setup
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">Specify diet preference, regional spices, and budget.</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Diet type */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase">Diet Type</label>
                      <select
                        {...register('dietaryPreference')}
                        className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                      >
                        <option value="vegetarian">Vegetarian (No meat, dairy okay)</option>
                        <option value="eggetarian">Eggetarian (Eggs and dairy okay)</option>
                        <option value="non-vegetarian">Non-Vegetarian (All proteins)</option>
                      </select>
                    </div>

                    {/* Regional preferences */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase">Regional Preferences</label>
                      <select
                        {...register('foodPreference')}
                        className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                      >
                        <option value="North Indian">North Indian (Wheat, paneer, dal)</option>
                        <option value="South Indian">South Indian (Rice, dosa, sambar)</option>
                        <option value="Bengali">Bengali (Rice, fish, mustard)</option>
                        <option value="Gujarati">Gujarati (Dal, roti, vegetarian khadi)</option>
                        <option value="Other">Standard / Fusion Indian</option>
                      </select>
                    </div>

                    {/* Meal frequency */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase">Meal Frequency</label>
                      <select
                        {...register('mealFrequency')}
                        className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                      >
                        <option value="3">3 meals (Breakfast, Lunch, Dinner)</option>
                        <option value="4">4 meals (Adds morning/evening snack)</option>
                        <option value="5">5 meals (High volume eating)</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Budget */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase">Monthly Nutrition Budget</label>
                      <div className="grid grid-cols-3 gap-3 mt-2">
                        {['Budget', 'Standard', 'Flexible'].map((b) => (
                          <button
                            key={b}
                            type="button; button"
                            onClick={() => setValue('budgetPreference', b)}
                            className={`py-3 text-center text-xs font-bold rounded-xl border transition-all ${
                              watchedBudget === b
                                ? 'border-orange-500 bg-orange-500/10 text-white'
                                : 'border-gray-800 bg-gray-950 text-gray-400 hover:border-gray-700'
                            }`}
                          >
                            {b}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Exclusions */}
                    <div>
                      <label className="block text-xs font-bold text-gray-400 uppercase">Food Exclusions / Allergies</label>
                      <input
                        type="text"
                        {...register('foodExclusions')}
                        className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                        placeholder="e.g. Peanuts, Gluten, Dairy"
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 5: LIFESTYLE */}
            {step === 5 && (
              <div className="space-y-6">
                <div className="border-b border-gray-850 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <Activity className="h-5.5 w-5.5 text-orange-500 mr-2" />
                    Lifestyle & Daily Habits
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">These parameters dictate recovery capacities and metabolic rate.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Activity Level */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Work / Movement Style</label>
                    <select
                      {...register('workType')}
                      className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                    >
                      <option value="Desk job">Desk Job (Desk bound most of day)</option>
                      <option value="Stand all day">Active Standing (Teacher, retail teller)</option>
                      <option value="Heavy labor">Heavy Labor (Constantly moving/carrying loads)</option>
                    </select>
                  </div>

                  {/* Steps */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Daily Steps Target</label>
                    <select
                      {...register('stepsTarget')}
                      className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                    >
                      <option value="5000">5,000 steps (Sedentary baseline)</option>
                      <option value="7500">7,500 steps (Moderate daily walking)</option>
                      <option value="10000">10,000 steps (Highly active target)</option>
                      <option value="12500">12,500+ steps (Extreme endurance target)</option>
                    </select>
                  </div>

                  {/* Sleep */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Sleep Duration (Hours)</label>
                    <select
                      {...register('sleepDuration')}
                      className="mt-2 w-full bg-gray-950 border border-gray-800 focus:border-orange-500 text-white rounded-xl px-4 py-3 text-sm focus:outline-none transition"
                    >
                      <option value="5.0">5-6 Hours (Slightly compromised)</option>
                      <option value="7.0">7-8 Hours (Optimal recovery window)</option>
                      <option value="9.0">9+ Hours (High athlete recovery)</option>
                    </select>
                  </div>

                  {/* Training Time */}
                  <div>
                    <label className="block text-xs font-bold text-gray-400 uppercase">Preferred Training Time</label>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      {['Early Morning', 'Afternoon', 'Evening', 'Late Night'].map((t) => (
                        <button
                          key={t}
                          type="button"
                          onClick={() => setValue('availableTrainingTime', t)}
                          className={`py-2 text-center text-xs font-bold rounded-xl border transition-all ${
                            watchedTime === t
                              ? 'border-orange-500 bg-orange-500/10 text-white'
                              : 'border-gray-800 bg-gray-950 text-gray-400 hover:border-gray-700'
                          }`}
                        >
                          {t}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 6: SAFETY SCREENING */}
            {step === 6 && (
              <div className="space-y-6">
                <div className="border-b border-gray-850 pb-4">
                  <h3 className="text-xl font-bold text-white flex items-center">
                    <ShieldAlert className="h-5.5 w-5.5 text-orange-500 mr-2" />
                    Safety & Medical Screening
                  </h3>
                  <p className="text-xs text-gray-400 mt-1">We take joint health and cardiovascular safety very seriously.</p>
                </div>

                <div className="space-y-6">
                  {/* Q1: Injuries */}
                  <div className="bg-gray-950 border border-gray-800 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-gray-200">Do you have any current muscle or joint injuries?</span>
                      <div className="flex gap-2">
                        {['yes', 'no'].map((ans) => (
                          <button
                            key={ans}
                            type="button"
                            onClick={() => setValue('hasInjuries', ans)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                              watchedInjuries === ans
                                ? ans === 'yes' ? 'bg-red-500/20 border border-red-500/40 text-red-400' : 'bg-green-500/20 border border-green-500/40 text-green-400'
                                : 'bg-gray-900 border border-gray-850 text-gray-400'
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                    </div>
                    {watchedInjuries === 'yes' && (
                      <textarea
                        {...register('injuryDetails')}
                        placeholder="Please detail what hurts (e.g., knee tendonitis, lower back herniation, shoulder impingement)..."
                        rows={2}
                        className="w-full bg-gray-900 border border-gray-850 focus:border-red-500 text-white rounded-lg p-3 text-xs focus:outline-none transition resize-none"
                      />
                    )}
                  </div>

                  {/* Q2: Medical restrictions */}
                  <div className="bg-gray-950 border border-gray-800 p-5 rounded-2xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-black text-gray-200">Has a doctor restricted you from strenuous cardiovascular training?</span>
                      <div className="flex gap-2">
                        {['yes', 'no'].map((ans) => (
                          <button
                            key={ans}
                            type="button"
                            onClick={() => setValue('hasMedicalRestrictions', ans)}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold uppercase transition ${
                              watchedMedical === ans
                                ? ans === 'yes' ? 'bg-red-500/20 border border-red-500/40 text-red-400' : 'bg-green-500/20 border border-green-500/40 text-green-400'
                                : 'bg-gray-900 border border-gray-850 text-gray-400'
                            }`}
                          >
                            {ans}
                          </button>
                        ))}
                      </div>
                    </div>
                    {watchedMedical === 'yes' && (
                      <textarea
                        {...register('medicalDetails')}
                        placeholder="Please describe medical constraints (e.g. high blood pressure, respiratory issues)..."
                        rows={2}
                        className="w-full bg-gray-900 border border-gray-850 focus:border-red-500 text-white rounded-lg p-3 text-xs focus:outline-none transition resize-none"
                      />
                    )}
                  </div>

                  {/* Safety Warning Block */}
                  {safetyRisk && (
                    <div className="bg-red-500/10 border border-red-500/30 rounded-2xl p-5 space-y-4">
                      <h4 className="text-sm font-bold text-red-400 flex items-center">
                        <ShieldAlert className="h-5 w-5 mr-1.5" />
                        Important: Elevated Training Risk Detected
                      </h4>
                      <p className="text-xs text-gray-400 leading-relaxed font-medium">
                        Based on your inputs, you have reported joint injuries or medical restrictions. To prevent injury, our local generator will filter out high-impact compound lifts and suggest high-stability movements. We strongly recommend seeking professional medical clearance before starting this program.
                      </p>
                      
                      <div className="flex items-center space-x-2 pt-2">
                        <input
                          id="safety-ack"
                          type="checkbox"
                          checked={acknowledgedSafety}
                          onChange={(e) => setAcknowledgedSafety(e.target.checked)}
                          className="h-4 w-4 bg-gray-950 border-gray-800 text-orange-500 focus:ring-orange-500 rounded cursor-pointer"
                        />
                        <label htmlFor="safety-ack" className="text-xs text-gray-300 font-bold select-none cursor-pointer">
                          I acknowledge this warning and wish to build my modified plan.
                        </label>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Wizard Navigation Action Controls */}
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-850">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center text-xs font-bold text-gray-400 hover:text-white px-4 py-2.5 rounded-xl border border-gray-850 hover:bg-gray-950 transition"
                >
                  <ArrowLeft className="h-4 w-4 mr-1.5" />
                  Back
                </button>
              ) : (
                <div />
              )}

              {step < 6 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="inline-flex items-center text-xs font-bold text-white bg-orange-500 hover:bg-orange-600 px-6 py-2.5 rounded-xl shadow-md transition"
                >
                  Next Step
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={generatingPlans}
                  className="inline-flex items-center text-xs font-black text-white bg-orange-500 hover:bg-orange-600 disabled:bg-gray-850 px-8 py-3 rounded-xl shadow-lg transition"
                >
                  {generatingPlans ? 'Analyzing...' : 'Generate Plan 🚀'}
                </button>
              )}
            </div>
          </form>
        </div>
      )}

      {/* STEP 7: PREMIUM GENERATION ANIMATION SCREEN */}
      {step === 7 && (
        <div className="min-h-[50vh] flex flex-col justify-center items-center text-center space-y-8 max-w-md mx-auto py-12 animate-fade-in">
          <div className="relative h-20 w-20 flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-4 border-orange-500/20 border-t-orange-500 animate-spin" />
            <Sparkles className="h-8 w-8 text-orange-500 animate-pulse" />
          </div>
          
          <div className="space-y-2">
            <h2 className="text-2xl font-black text-white">Building your Desi Gym plan</h2>
            <p className="text-gray-400 text-xs font-medium">Crunching sports-science programming parameters...</p>
          </div>

          <div className="w-full bg-gray-950 border border-gray-850 rounded-2xl p-4 text-left space-y-2.5 text-xs text-gray-400 font-semibold">
            <div className="flex items-center justify-between text-green-400">
              <span>✓ Analyzing bio-metrics & goal</span>
              <span>100%</span>
            </div>
            <div className="flex items-center justify-between text-green-400">
              <span>✓ Customizing {watchedDays}-day split split</span>
              <span>100%</span>
            </div>
            <div className="flex items-center justify-between text-green-400">
              <span>✓ Checking equipment exclusions</span>
              <span>100%</span>
            </div>
            <div className="flex items-center justify-between text-green-400 font-bold">
              <span>✓ Mapping Indian nutrition {watchedRegional} menu</span>
              <span>100%</span>
            </div>
            {safetyRisk && (
              <div className="flex items-center justify-between text-amber-500 font-bold">
                <span>⚠ Applied injury restrictions filters</span>
                <span>Active</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
