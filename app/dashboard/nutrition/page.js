'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getMealReplacements } from '@/lib/mealReplacements';
import { toast } from 'react-hot-toast';
import { LoadingSkeleton, PlanGenerating } from '@/components/LoadingSpinner';
import { MacroPieChart } from '@/components/ProgressChart';
import {
  Apple,
  Flame,
  RotateCcw,
  Plus,
  Compass,
  ChevronDown,
  ChevronUp,
  Droplet,
  ShieldAlert,
  ClipboardList,
  Copy,
  CheckCircle,
  SwapHorizontal,
  X,
  Check,
  CircleCheck
} from 'lucide-react';

export default function NutritionPage() {
  const [profile, setProfile] = useState(null);
  const [nutritionPlanRecord, setNutritionPlanRecord] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeDay, setActiveDay] = useState('monday');
  const [expandedMeals, setExpandedMeals] = useState({});

  // Onboarding direct profile navigation fallback
  const router = useRouter();

  // Meal Replacement Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMealKey, setSelectedMealKey] = useState('');
  const [replacements, setReplacements] = useState([]);

  // Daily Nutrition Tracker State
  const [eatenMeals, setEatenMeals] = useState({}); // e.g. { monday: { breakfast: true } }
  const [savingLog, setSavingLog] = useState(false);

  // Load profile and plan data
  useEffect(() => {
    async function loadNutritionData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const userId = session.user.id;

        // Fetch profile
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(userProfile);

        if (userProfile) {
          // Fetch active plan
          const { data: nutritionPlan } = await supabase
            .from('nutrition_plans')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('is_active', true)
            .maybeSingle();

          if (nutritionPlan) {
            setNutritionPlanRecord(nutritionPlan);
            setPlan(nutritionPlan.meal_plan);
          }
        }

        // Fetch today's logged eaten meals from progress_logs
        const todayStr = new Date().toISOString().split('T')[0];
        const { data: todayLog } = await supabase
          .from('progress_logs')
          .select('metadata')
          .eq('user_id', userId)
          .eq('log_date', todayStr)
          .maybeSingle();

        if (todayLog?.metadata?.eaten_meals) {
          setEatenMeals(todayLog.metadata.eaten_meals);
        }
      } catch (error) {
        console.error('Error loading nutrition plans:', error);
        toast.error('Failed to load nutrition split.');
      } finally {
        setLoading(false);
      }
    }

    loadNutritionData();
  }, [router]);

  const handleGenerate = async () => {
    if (!profile) {
      toast.error('Please complete your onboarding profile details first.');
      router.push('/dashboard/profile');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/nutrition-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) {
        throw new Error('API failed to generate nutrition schedule');
      }

      const result = await response.json();
      if (result.success) {
        setPlan(result.plan);
        toast.success('Your nutrition split has been successfully generated!');
      } else {
        throw new Error(result.error || 'Server error');
      }
    } catch (error) {
      console.error(error);
      toast.error('AI generation failed. Verify API key settings.');
    } finally {
      setGenerating(false);
    }
  };

  const handleRegenerate = async () => {
    if (!window.confirm('Are you sure you want to regenerate your nutrition split? This will overwrite your current plan.')) {
      return;
    }
    await handleGenerate();
  };

  const toggleMealExpand = (index) => {
    setExpandedMeals((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleCopyGroceryList = () => {
    if (!plan?.grocery_list) return;
    const text = plan.grocery_list.join('\n');
    navigator.clipboard.writeText(text);
    toast.success('Grocery list copied to clipboard! 🛒');
  };

  // Open Meal Replacement Modal
  const openReplacementModal = (mealKey) => {
    if (!profile) return;
    setSelectedMealKey(mealKey);
    const list = getMealReplacements(mealKey, profile.dietary_preference || 'vegetarian');
    setReplacements(list);
    setIsModalOpen(true);
  };

  // Swap Meal in active plan
  const handleSwapMeal = async (replacementMeal) => {
    if (!plan || !nutritionPlanRecord) return;

    try {
      const updatedPlan = { ...plan };
      updatedPlan.meal_plan[activeDay][selectedMealKey] = replacementMeal;

      // Calculate new averages if necessary, or preserve targets
      const { error } = await supabase
        .from('nutrition_plans')
        .update({
          meal_plan: updatedPlan,
          updated_at: new Date().toISOString()
        })
        .eq('id', nutritionPlanRecord.id);

      if (error) throw error;

      setPlan(updatedPlan);
      setIsModalOpen(false);
      toast.success(`${selectedMealKey.replace('_', ' ')} replaced with ${replacementMeal.name}! 🔄`);
    } catch (err) {
      console.error('Error swapping meal:', err);
      toast.error('Failed to replace meal.');
    }
  };

  // Toggle meal eaten tracking for today
  const handleToggleEaten = async (mealKey) => {
    setSavingLog(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const todayStr = new Date().toISOString().split('T')[0];
      const updatedEaten = { ...eatenMeals };
      updatedEaten[mealKey] = !updatedEaten[mealKey];

      // Calculate total consumed calories/macros for today based on checked meals
      let consumedCalories = 0;
      let consumedProtein = 0;
      let consumedCarbs = 0;
      let consumedFat = 0;

      const currentDayMeals = plan.meal_plan?.[activeDay] || {};
      Object.keys(updatedEaten).forEach((key) => {
        if (updatedEaten[key] && currentDayMeals[key]) {
          const mealObj = currentDayMeals[key];
          consumedCalories += parseInt(mealObj.calories) || 0;
          consumedProtein += parseInt(mealObj.protein) || 0;
          consumedCarbs += parseInt(mealObj.carbs) || 0;
          consumedFat += parseInt(mealObj.fat) || 0;
        }
      });

      // Upsert into progress_logs
      const { data: existingLog } = await supabase
        .from('progress_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('log_date', todayStr)
        .maybeSingle();

      const existingMetadata = existingLog?.metadata || {};
      const payload = {
        user_id: session.user.id,
        log_date: todayStr,
        weight: existingLog?.weight || profile?.weight || null,
        workout_completed: existingLog?.workout_completed || false,
        workout_notes: existingLog?.workout_notes || '',
        energy_level: existingLog?.energy_level || 7,
        mood: existingLog?.mood || '😊',
        water_intake: existingLog?.water_intake || 2.0,
        sleep_hours: existingLog?.sleep_hours || 7.0,
        metadata: {
          ...existingMetadata,
          eaten_meals: updatedEaten,
          consumed_calories: consumedCalories,
          consumed_protein: consumedProtein,
          consumed_carbs: consumedCarbs,
          consumed_fat: consumedFat
        }
      };

      if (existingLog) {
        await supabase
          .from('progress_logs')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', existingLog.id);
      } else {
        await supabase.from('progress_logs').insert(payload);
      }

      setEatenMeals(updatedEaten);
      toast.success(updatedEaten[mealKey] ? 'Meal logged as eaten! 🍽️' : 'Meal log removed.');
    } catch (err) {
      console.error(err);
      toast.error('Failed to log daily nutrition intake.');
    } finally {
      setSavingLog(false);
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (generating) {
    return <PlanGenerating />;
  }

  if (!plan) {
    return (
      <div className="min-h-[50vh] flex flex-col justify-center items-center text-center space-y-6 max-w-md mx-auto">
        <div className="bg-green-500/10 p-5 rounded-2xl text-green-500 border border-green-500/20">
          <Apple className="h-10 w-10 animate-bounce" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">No Nutrition Plan</h2>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Generate your custom 7-day nutritional split. We will structure caloric levels, macro distributions, and recipe instructions matching your goal.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition"
        >
          Generate Nutrition Plan 🥗
        </button>
      </div>
    );
  }

  const days = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' },
  ];

  const currentMeals = plan.meal_plan?.[activeDay] || {};

  const mealTypes = [
    { key: 'breakfast', name: 'Breakfast 🌅' },
    { key: 'morning_snack', name: 'Morning Snack 🍎' },
    { key: 'lunch', name: 'Lunch ☀️' },
    { key: 'evening_snack', name: 'Evening Snack 🌤' },
    { key: 'dinner', name: 'Dinner 🌙' },
  ];

  const proteinG = nutritionPlanRecord?.protein_grams || plan.macros?.protein || 150;
  const carbsG = nutritionPlanRecord?.carbs_grams || plan.macros?.carbs || 200;
  const fatG = nutritionPlanRecord?.fat_grams || plan.macros?.fat || 65;

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* MEAL REPLACEMENT DIALOG MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 max-w-lg w-full max-h-[85vh] overflow-y-auto space-y-6 shadow-2xl">
            <div className="flex justify-between items-center border-b border-gray-850 pb-3">
              <h3 className="text-base font-black text-white capitalize">
                Replace {selectedMealKey.replace('_', ' ')}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              Choose one of the Indian alternative choices with matching target macros:
            </p>

            <div className="space-y-4">
              {replacements.length > 0 ? (
                replacements.map((rep, idx) => (
                  <div key={idx} className="bg-gray-950 border border-gray-850 rounded-2xl p-4 space-y-3">
                    <div className="flex justify-between items-start">
                      <h4 className="text-xs font-black text-white pr-4">{rep.name}</h4>
                      <span className="text-[10px] font-black bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded shrink-0">
                        {rep.calories} kcal
                      </span>
                    </div>

                    {/* Macros grid */}
                    <div className="grid grid-cols-3 gap-2 text-[10px] text-gray-400 font-bold bg-gray-900 p-2 rounded-lg text-center">
                      <span>P: <strong className="text-orange-500">{rep.protein}g</strong></span>
                      <span>C: <strong className="text-blue-400">{rep.carbs}g</strong></span>
                      <span>F: <strong className="text-green-500">{rep.fat}g</strong></span>
                    </div>

                    <div className="text-[10px] text-gray-400 font-semibold leading-relaxed">
                      <strong>Ingredients:</strong> {rep.ingredients?.join(', ')}
                    </div>
                    <div className="text-[10px] text-gray-400 font-semibold leading-relaxed pt-1 border-t border-gray-900/50">
                      <strong>Recipe:</strong> {rep.recipe}
                    </div>

                    <div className="text-right pt-2">
                      <button
                        onClick={() => handleSwapMeal(rep)}
                        className="bg-orange-500 hover:bg-orange-600 text-white font-black text-[10px] py-2 px-5 rounded-lg shadow-md transition"
                      >
                        Swap Meal Choice
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-xs text-gray-500">No specific replacements found for this preference.</div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white capitalize">
            {nutritionPlanRecord?.plan_name || plan.plan_name}
          </h1>
          <p className="text-gray-400 text-sm mt-1 leading-relaxed max-w-2xl">{plan.meal_timing || 'Custom dietary fuel split.'}</p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleRegenerate}
            className="flex items-center text-xs font-bold text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl px-4 py-3 bg-gray-900 transition"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Regenerate Plan
          </button>
        </div>
      </div>

      {/* TOP SECTION: Daily Macros Dashboard */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Macro Distribution Ratio */}
        <div className="bg-gray-900 border border-gray-850 rounded-2xl p-6 flex flex-col justify-center items-center">
          <h3 className="text-sm font-bold text-white mb-4">Macro Distribution Ratio</h3>
          <MacroPieChart protein={proteinG} carbs={carbsG} fat={fatG} />
        </div>

        {/* Macros Stats Cards Grid */}
        <div className="lg:col-span-2 grid grid-cols-2 gap-4">
          <div className="bg-gray-900 border border-gray-850 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Calorie Limit</span>
            <div className="mt-2 flex items-baseline">
              <span className="text-2xl font-black text-white">{nutritionPlanRecord?.daily_calories || plan.daily_calories}</span>
              <span className="text-xs text-gray-400 ml-1">kcal</span>
            </div>
            <div className="w-full h-1.5 bg-gray-950 rounded-full mt-3 overflow-hidden border border-gray-850">
              <div className="h-full bg-orange-500 w-[75%]" />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-850 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-orange-500">Protein</span>
            <div className="mt-2 flex items-baseline">
              <span className="text-2xl font-black text-white">{proteinG}</span>
              <span className="text-xs text-gray-400 ml-1">g</span>
            </div>
            <div className="w-full h-1.5 bg-gray-950 rounded-full mt-3 overflow-hidden border border-gray-850">
              <div className="h-full bg-orange-500 w-[60%]" />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-850 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-blue-400">Carbohydrates</span>
            <div className="mt-2 flex items-baseline">
              <span className="text-2xl font-black text-white">{carbsG}</span>
              <span className="text-xs text-gray-400 ml-1">g</span>
            </div>
            <div className="w-full h-1.5 bg-gray-950 rounded-full mt-3 overflow-hidden border border-gray-850">
              <div className="h-full bg-blue-500 w-[70%]" />
            </div>
          </div>

          <div className="bg-gray-900 border border-gray-850 rounded-2xl p-5 flex flex-col justify-between">
            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider text-green-400">Fats</span>
            <div className="mt-2 flex items-baseline">
              <span className="text-2xl font-black text-white">{fatG}</span>
              <span className="text-xs text-gray-400 ml-1">g</span>
            </div>
            <div className="w-full h-1.5 bg-gray-950 rounded-full mt-3 overflow-hidden border border-gray-850">
              <div className="h-full bg-green-500 w-[50%]" />
            </div>
          </div>
        </div>
      </div>

      {/* Day Selector Tabs */}
      <div className="grid grid-cols-7 gap-1 bg-gray-900 border border-gray-800 p-1.5 rounded-xl w-full">
        {days.map((dy) => (
          <button
            key={dy.key}
            onClick={() => setActiveDay(dy.key)}
            className={`text-center py-3 rounded-lg text-xs font-bold transition-all ${
              activeDay === dy.key ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            {dy.label}
          </button>
        ))}
      </div>

      {/* Meals & Extra Instructions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Daily Meals Panel */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-gray-850 pb-3">
              <h3 className="text-base font-bold text-white flex items-center capitalize">
                Meals Schedule ({activeDay})
              </h3>
              <span className="text-xs text-gray-400 font-semibold">5 meals split</span>
            </div>

            <div className="space-y-3">
              {mealTypes.map((mealType) => {
                const meal = currentMeals[mealType.key] || { name: 'Rest / Light Fast', calories: 200 };
                const isExpanded = expandedMeals[mealType.key] || false;
                const isEaten = eatenMeals[mealType.key] || false;

                return (
                  <div key={mealType.key} className="bg-gray-950 border border-gray-850 rounded-2xl overflow-hidden">
                    
                    {/* Header */}
                    <div className="w-full p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                      {/* Left: expand toggle & names */}
                      <button
                        onClick={() => toggleMealExpand(mealType.key)}
                        className="text-left flex items-start space-x-3 flex-1"
                      >
                        <div className="mt-0.5">
                          {isExpanded ? <ChevronUp className="h-4.5 w-4.5 text-gray-400" /> : <ChevronDown className="h-4.5 w-4.5 text-gray-400" />}
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">
                            {mealType.name}
                          </span>
                          <h4 className="text-sm font-bold text-white leading-snug">{meal.name}</h4>
                          <span className="text-[10px] font-black text-gray-400 bg-gray-900 border border-gray-850 px-2 py-0.5 rounded inline-block">
                            {meal.calories} kcal
                          </span>
                        </div>
                      </button>

                      {/* Right: replacement & tracker actions */}
                      <div className="flex items-center space-x-3 shrink-0 self-end sm:self-center">
                        <button
                          onClick={() => openReplacementModal(mealType.key)}
                          className="bg-gray-900 hover:bg-gray-850 border border-gray-800 text-gray-300 font-bold text-[10px] py-1.5 px-3 rounded-lg transition"
                          title="Swap with similar macros option"
                        >
                          Replace Meal
                        </button>
                        
                        <button
                          onClick={() => handleToggleEaten(mealType.key)}
                          disabled={savingLog}
                          className={`flex items-center space-x-1.5 text-[10px] font-bold py-1.5 px-3 rounded-lg border transition ${
                            isEaten
                              ? 'bg-green-500/10 border-green-500/20 text-green-400'
                              : 'bg-gray-900 border-gray-800 text-gray-400 hover:text-white'
                          }`}
                        >
                          {isEaten ? <CheckCircle className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
                          <span>{isEaten ? 'Eaten ✓' : 'Log Eaten'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Collapsible Details */}
                    {isExpanded && (
                      <div className="p-4 border-t border-gray-850 bg-gray-950/50 space-y-4 text-xs leading-relaxed">
                        {/* Macro details */}
                        <div className="flex space-x-4 border-b border-gray-850 pb-3 text-gray-400 font-bold text-[10px] uppercase">
                          {meal.protein !== undefined && (
                            <span>
                              Protein: <strong className="text-orange-500">{meal.protein}g</strong>
                            </span>
                          )}
                          {meal.carbs !== undefined && (
                            <span>
                              Carbs: <strong className="text-blue-400">{meal.carbs}g</strong>
                            </span>
                          )}
                          {meal.fat !== undefined && (
                            <span>
                              Fats: <strong className="text-green-400">{meal.fat}g</strong>
                            </span>
                          )}
                        </div>

                        {/* Ingredients */}
                        {meal.ingredients && meal.ingredients.length > 0 && (
                          <div className="space-y-1.5">
                            <span className="text-[10px] text-gray-500 font-bold uppercase block">Ingredients Needed</span>
                            <ul className="space-y-1 pl-4 list-disc text-gray-300">
                              {meal.ingredients.map((ing, idx) => (
                                <li key={idx} className="font-medium">{ing}</li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Preparation instructions */}
                        {meal.recipe && (
                          <div className="space-y-1.5 border-t border-gray-850/60 pt-3">
                            <span className="text-[10px] text-gray-500 font-bold uppercase block">Preparation Recipe</span>
                            <p className="text-gray-300 font-medium">{meal.recipe}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Extras Sidebar Panels (Right) */}
        <div className="space-y-6">
          {/* Hydration Tips */}
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center border-b border-gray-850 pb-3">
              <Droplet className="h-4.5 w-4.5 text-blue-400 mr-2" />
              Hydration Tips 💧
            </h3>
            <p className="text-gray-300 text-xs leading-relaxed font-semibold">
              {plan.hydration || 'Drink at least 3.5 liters of clean water. Keep a steel flask at your desk and sip consistently.'}
            </p>
          </div>

          {/* Supplements Panel */}
          {plan.supplements && plan.supplements.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center border-b border-gray-850 pb-3">
                <ClipboardList className="h-4.5 w-4.5 text-orange-500 mr-2" />
                Supplements Recommendation
              </h3>
              <div className="space-y-3.5">
                {plan.supplements.map((sup, idx) => (
                  <div key={idx} className="space-y-1 text-xs border-b border-gray-850 pb-2.5 last:border-0 last:pb-0">
                    <h4 className="font-bold text-white">{sup.name}</h4>
                    <p className="text-gray-400 text-[10px] leading-tight font-semibold">
                      Dosage: <strong>{sup.dosage}</strong> | Timing: <strong>{sup.timing}</strong>
                    </p>
                    <p className="text-gray-500 text-[10px] italic mt-0.5 font-semibold">{sup.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Foods to Avoid List */}
          {plan.foods_to_avoid && plan.foods_to_avoid.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
              <h3 className="text-sm font-bold text-white flex items-center border-b border-gray-850 pb-3">
                <ShieldAlert className="h-4.5 w-4.5 text-red-500 mr-2" />
                Foods to Avoid
              </h3>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {plan.foods_to_avoid.map((item, idx) => (
                  <span
                    key={idx}
                    className="bg-red-500/10 text-red-400 border border-red-500/20 text-[10px] font-bold px-2.5 py-1 rounded"
                  >
                    {item}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Weekly Grocery Checklist */}
          {plan.grocery_list && plan.grocery_list.length > 0 && (
            <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-3">
              <div className="flex justify-between items-center border-b border-gray-850 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center">
                  <ClipboardList className="h-4.5 w-4.5 text-green-500 mr-2" />
                  Weekly Grocery Checklist
                </h3>
                <button
                  onClick={handleCopyGroceryList}
                  className="p-1 hover:bg-gray-850 rounded text-gray-400 hover:text-white transition"
                  title="Copy grocery checklist"
                >
                  <Copy className="h-4 w-4" />
                </button>
              </div>
              <ul className="space-y-1.5 pl-4 list-disc text-xs text-gray-300 max-h-56 overflow-y-auto font-medium">
                {plan.grocery_list.map((item, idx) => (
                  <li key={idx} className="leading-snug">{item}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
