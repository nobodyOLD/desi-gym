'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { LoadingSkeleton } from '@/components/LoadingSpinner';
import {
  Sparkles,
  TrendingUp,
  Award,
  Flame,
  Calendar,
  Apple,
  Weight,
  Target,
  ArrowRight,
  TrendingDown,
  Scale,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';

export default function WeeklyReviewPage() {
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [nutritionPlan, setNutritionPlan] = useState(null);

  const router = useRouter();

  useEffect(() => {
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const userId = session.user.id;

        // Fetch user profile
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .single();
        setProfile(userProfile);

        // Fetch active workout plan
        const { data: activeWorkout } = await supabase
          .from('workout_plans')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true)
          .maybeSingle();
        setWorkoutPlan(activeWorkout);

        // Fetch active nutrition plan
        const { data: activeNutrition } = await supabase
          .from('nutrition_plans')
          .select('*')
          .eq('user_id', userId)
          .eq('is_active', true)
          .maybeSingle();
        setNutritionPlan(activeNutrition);

        // Fetch all progress logs
        const { data: allLogs } = await supabase
          .from('progress_logs')
          .select('*')
          .eq('user_id', userId)
          .order('log_date', { ascending: false });
        setLogs(allLogs || []);

      } catch (err) {
        console.error('Error loading weekly review data:', err);
        toast.error('Failed to load weekly coaching review.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  // Filter logs for the last 7 days (including today)
  const oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  const weeklyLogs = logs.filter(log => new Date(log.log_date) >= oneWeekAgo);

  // 1. Calculate Training Adherence
  const workoutsCompletedThisWeek = weeklyLogs.filter(log => log.workout_completed).length;
  // Calculate target days from active split schedule (count non-rest days)
  let targetSessionsCount = 4; // default
  if (workoutPlan?.plan_data?.weekly_schedule?.week1) {
    const schedule = workoutPlan.plan_data.weekly_schedule.week1;
    targetSessionsCount = Object.keys(schedule).filter(day => schedule[day] && schedule[day].type !== 'rest').length;
  }
  const trainingAdherencePct = targetSessionsCount > 0 
    ? Math.min(100, Math.round((workoutsCompletedThisWeek / targetSessionsCount) * 100))
    : 100;

  // 2. Calculate Total Volume Lifted (kg)
  let totalVolumeKg = 0;
  let loggedSetsThisWeek = 0;
  weeklyLogs.forEach(log => {
    if (log.metadata?.total_volume_kg) {
      totalVolumeKg += parseFloat(log.metadata.total_volume_kg);
    }
    if (log.metadata?.sets_logged_count) {
      loggedSetsThisWeek += parseInt(log.metadata.sets_logged_count);
    }
  });

  // 3. Weight Trend Analysis
  let startingWeight = profile?.weight || null;
  let currentWeight = profile?.weight || null;
  
  if (weeklyLogs.length > 0) {
    // Oldest log weight
    const validWeightLogs = weeklyLogs.filter(log => log.weight).sort((a, b) => new Date(a.log_date) - new Date(b.log_date));
    if (validWeightLogs.length > 0) {
      startingWeight = validWeightLogs[0].weight;
      currentWeight = validWeightLogs[validWeightLogs.length - 1].weight;
    }
  }

  const weightChange = startingWeight && currentWeight 
    ? parseFloat((currentWeight - startingWeight).toFixed(2)) 
    : 0;

  // 4. Calculate Nutrition Adherence
  // Target total meals is targetSessionsCount * 5 meals/day or 7 days * 5 meals = 35 meals
  let totalMealsLoggedEaten = 0;
  weeklyLogs.forEach(log => {
    if (log.metadata?.eaten_meals) {
      const eatenMap = log.metadata.eaten_meals;
      Object.keys(eatenMap).forEach(key => {
        if (eatenMap[key]) totalMealsLoggedEaten++;
      });
    }
  });
  const maxPossibleMeals = weeklyLogs.length > 0 ? weeklyLogs.length * 5 : 7 * 5;
  const nutritionAdherencePct = maxPossibleMeals > 0 
    ? Math.min(100, Math.round((totalMealsLoggedEaten / maxPossibleMeals) * 100))
    : 0;

  // Generate Tailored Progression Review Suggestions
  const getReviewSuggestions = () => {
    const suggestions = [];

    // Nutrition suggestions
    const goal = profile?.fitness_goal || 'build_muscle';
    if (goal === 'lose_weight') {
      if (weightChange > 0) {
        suggestions.push({
          title: "Optimize Energy Expenditure",
          desc: "Your weight rose slightly this week. If fat loss is your primary target, try cutting daily calories by -100 kcal or increasing your daily steps target from 10k to 12k.",
          type: "nutrition"
        });
      } else if (weightChange === 0) {
        suggestions.push({
          title: "Maintain Deficit Consistency",
          desc: "Weight remained steady. Ensure you are accurately tracking cooking oils and condiments, as minor caloric additions can block fat loss.",
          type: "nutrition"
        });
      } else {
        suggestions.push({
          title: "Excellent Deficit Progress",
          desc: `Nice drop of ${Math.abs(weightChange)}kg! Keep your current macros stable. Do not drop calories lower to prevent loss of lean muscle mass.`,
          type: "nutrition"
        });
      }
    } else { // build_muscle / maintain
      if (weightChange < 0) {
        suggestions.push({
          title: "Caloric Surplus Adjustment",
          desc: "You lost weight this week while trying to build muscle. Increase your daily energy targets by +150 kcal (e.g. add a handful of almonds or a glass of milk).",
          type: "nutrition"
        });
      } else if (weightChange > 0) {
        suggestions.push({
          title: "Controlled Rate of Gain",
          desc: "Slight weight increase detected. This is optimal for lean muscle synthesis. Keep protein high to maximize skeletal hypertrophy.",
          type: "nutrition"
        });
      }
    }

    // Training suggestions
    if (trainingAdherencePct < 75) {
      suggestions.push({
        title: "Schedule Training Windows",
        desc: `You completed ${workoutsCompletedThisWeek} of ${targetSessionsCount} workouts. Try blocking out 45-minute sessions in your calendar on Sunday to secure training consistency.`,
        type: "training"
      });
    } else {
      suggestions.push({
        title: "Fantastic Training Compliance!",
        desc: "You hit your training split targets consistently! Your neural pathways are adapting, making weights feel progressively lighter.",
        type: "training"
      });
    }

    // Progression overload check
    if (totalVolumeKg > 0) {
      suggestions.push({
        title: "Apply Double Progression",
        desc: "In your next sessions, if you hit top rep ranges for all sets, increase load by +2.5kg for upper body compounds and +5kg for lower body squats/lifts.",
        type: "progression"
      });
    } else {
      suggestions.push({
        title: "Log Active Sets Next Session",
        desc: "No active sets were logged this week. In your next split, tap 'Start Workout' on your split overview to capture weight, reps, and RPE for automatic overload targets.",
        type: "progression"
      });
    }

    return suggestions;
  };

  const suggestions = getReviewSuggestions();

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      
      {/* Page Header */}
      <div className="border-b border-gray-800 pb-6 flex items-center space-x-3">
        <div className="bg-orange-500/10 p-2.5 rounded-xl text-orange-500 border border-orange-500/20">
          <Sparkles className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Weekly Review</h1>
          <p className="text-gray-400 text-sm mt-1">
            Sports-science coaching report calculated from your logged parameters.
          </p>
        </div>
      </div>

      {/* STATS MATRIX CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Adherence */}
        <div className="bg-gray-900 border border-gray-850 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Training Adherence</span>
            <Calendar className="h-4.5 w-4.5 text-orange-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-white">{trainingAdherencePct}%</span>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">
              {workoutsCompletedThisWeek} of {targetSessionsCount} sessions logged
            </p>
          </div>
          <div className="w-full h-1 bg-gray-950 rounded-full mt-4 overflow-hidden border border-gray-850">
            <div className="h-full bg-orange-500" style={{ width: `${trainingAdherencePct}%` }} />
          </div>
        </div>

        {/* Volume */}
        <div className="bg-gray-900 border border-gray-850 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Volume Moved</span>
            <TrendingUp className="h-4.5 w-4.5 text-blue-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-white">{totalVolumeKg.toLocaleString()} kg</span>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">
              Across {loggedSetsThisWeek} logged workout sets
            </p>
          </div>
          <div className="w-full h-1 bg-gray-950 rounded-full mt-4 overflow-hidden border border-gray-850">
            <div className="h-full bg-blue-500" style={{ width: totalVolumeKg > 0 ? '70%' : '0%' }} />
          </div>
        </div>

        {/* Weight Change */}
        <div className="bg-gray-900 border border-gray-850 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Weight Trend</span>
            <Scale className="h-4.5 w-4.5 text-green-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-white">
              {weightChange > 0 ? `+${weightChange}` : weightChange} kg
            </span>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">
              From {startingWeight ? `${startingWeight}kg` : 'N/A'} to {currentWeight ? `${currentWeight}kg` : 'N/A'}
            </p>
          </div>
          <div className="w-full h-1 bg-gray-950 rounded-full mt-4 overflow-hidden border border-gray-850">
            <div className="h-full bg-green-500" style={{ width: weightChange !== 0 ? '50%' : '0%' }} />
          </div>
        </div>

        {/* Diet Adherence */}
        <div className="bg-gray-900 border border-gray-850 rounded-2xl p-5 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Nutrition Consistency</span>
            <Apple className="h-4.5 w-4.5 text-purple-500" />
          </div>
          <div className="mt-4">
            <span className="text-2xl font-black text-white">{nutritionAdherencePct}%</span>
            <p className="text-[10px] text-gray-400 mt-1 font-semibold">
              {totalMealsLoggedEaten} meals marked eaten
            </p>
          </div>
          <div className="w-full h-1 bg-gray-950 rounded-full mt-4 overflow-hidden border border-gray-850">
            <div className="h-full bg-purple-500" style={{ width: `${nutritionAdherencePct}%` }} />
          </div>
        </div>
      </div>

      {/* CORE RECOMMENDATIONS & SUGGESTIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* AI Recommendations List */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-850 rounded-3xl p-6 space-y-6">
          <h2 className="text-lg font-black text-white flex items-center border-b border-gray-850 pb-4">
            <Award className="h-5 w-5 text-orange-500 mr-2" />
            AI Coach Adaptation Decisions
          </h2>

          <div className="space-y-4">
            {suggestions.map((sug, idx) => (
              <div key={idx} className="bg-gray-950 border border-gray-850 rounded-2xl p-5 flex items-start space-x-4">
                <div className={`p-2 rounded-xl shrink-0 border ${
                  sug.type === 'nutrition' 
                    ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' 
                    : sug.type === 'training' 
                    ? 'bg-orange-500/10 border-orange-500/20 text-orange-400'
                    : 'bg-blue-500/10 border-blue-500/20 text-blue-400'
                }`}>
                  {sug.type === 'nutrition' ? <Apple className="h-5 w-5" /> : sug.type === 'training' ? <Calendar className="h-5 w-5" /> : <Target className="h-5 w-5" />}
                </div>
                <div className="space-y-1">
                  <h4 className="text-xs font-bold text-white uppercase tracking-wider">{sug.title}</h4>
                  <p className="text-xs text-gray-400 leading-relaxed font-medium">{sug.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Sidebar: Weekly Achievements & Guidelines */}
        <div className="space-y-6">
          {/* Achievements */}
          <div className="bg-gray-900 border border-gray-850 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center border-b border-gray-850 pb-3">
              <Flame className="h-4.5 w-4.5 text-orange-500 mr-2" />
              Week Milestones
            </h3>
            
            <ul className="space-y-3 text-xs text-gray-300 font-semibold pl-1">
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Logged {workoutsCompletedThisWeek} splits keeping consistent muscle loading.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                <span>Maintained structural TDEE targets based on local dietary guidelines.</span>
              </li>
              {totalVolumeKg > 1000 && (
                <li className="flex items-start space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500 shrink-0 mt-0.5" />
                  <span>Crossed {Math.round(totalVolumeKg / 1000)} metric tons of total mechanical overload! 🏋️</span>
                </li>
              )}
            </ul>
          </div>

          {/* Coaching Guidelines Safety Check */}
          <div className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-5 space-y-3">
            <h3 className="text-sm font-bold text-white flex items-center border-b border-orange-500/10 pb-3">
              <AlertCircle className="h-4.5 w-4.5 text-orange-500 mr-2" />
              Safety Verification
            </h3>
            <p className="text-gray-400 text-xs leading-relaxed font-semibold">
              Before raising loads on compound lifts:
            </p>
            <ul className="list-disc pl-4 text-gray-500 text-[11px] space-y-1 font-semibold leading-relaxed">
              <li>Form must remain strict (no momentum swing).</li>
              <li>Joints (elbows, knees, lower back) should feel entirely pain-free.</li>
              <li>Ensure you get 7-8 hours of sleep before heavy lower-body squat or pull splits.</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
}
