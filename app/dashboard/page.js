'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { LoadingSkeleton } from '@/components/LoadingSpinner';
import {
  Flame,
  Dumbbell,
  Scale,
  Utensils,
  ArrowRight,
  TrendingUp,
  Award,
  Calendar,
  MessageSquare,
  AlertTriangle,
  UserCheck,
  Footprints,
  Droplet,
  Plus
} from 'lucide-react';
import { WeightChart, BodyFatChart } from '@/components/ProgressChart';

const quotes = [
  'Consistency is the key to unlocking your physical potential.',
  'Your body can stand almost anything. It is your mind you have to convince.',
  'The only bad workout is the one that did not happen.',
  'Success is not always about greatness. It is about consistent daily efforts.',
  'Hypertrophy is a marathon, not a sprint. Lock in your form and eat your protein.',
  'Energy flows where focus goes. Lock in your session today!',
  'Do not wish for a good body. Work for it.',
  'Train Desi. Progress Strong.'
];

export default function DashboardHome() {
  const [profile, setProfile] = useState(null);
  const [workoutPlan, setWorkoutPlan] = useState(null);
  const [nutritionPlan, setNutritionPlan] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [randomQuote, setRandomQuote] = useState('');
  
  const router = useRouter();

  useEffect(() => {
    setRandomQuote(quotes[Math.floor(Math.random() * quotes.length)]);
  }, []);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const userId = session.user.id;

        // 1. Fetch Profile
        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', userId)
          .maybeSingle();

        setProfile(profileData);

        if (profileData) {
          // 2. Fetch Active Workout Plan
          const { data: workoutData } = await supabase
            .from('workout_plans')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .maybeSingle();

          setWorkoutPlan(workoutData);

          // 3. Fetch Active Nutrition Plan
          const { data: nutritionData } = await supabase
            .from('nutrition_plans')
            .select('*')
            .eq('user_id', userId)
            .eq('is_active', true)
            .maybeSingle();

          setNutritionPlan(nutritionData);
        }

        // 4. Fetch Progress Logs
        const { data: logData } = await supabase
          .from('progress_logs')
          .select('*')
          .eq('user_id', userId)
          .order('log_date', { ascending: false })
          .limit(7);

        setLogs(logData || []);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        toast.error('Failed to load dashboard metrics.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, [router]);

  if (loading) {
    return <LoadingSkeleton />;
  }

  // Calculate profile completion percentage
  let completionCount = 0;
  const fields = ['full_name', 'age', 'gender', 'height', 'weight', 'body_type', 'fitness_goal', 'activity_level', 'dietary_preference'];
  if (profile) {
    fields.forEach((f) => {
      if (profile[f] !== null && profile[f] !== undefined && profile[f] !== '') {
        completionCount++;
      }
    });
  }
  const completionPercentage = Math.round((completionCount / fields.length) * 100);
  const isProfileComplete = completionPercentage === 100;

  // Consume daily logged macro metrics from today's progress logs
  const todayStr = new Date().toISOString().split('T')[0];
  const todayLog = logs?.find((log) => log.log_date === todayStr);

  const consumedCalories = todayLog?.metadata?.consumed_calories || 0;
  const consumedProtein = todayLog?.metadata?.consumed_protein || 0;
  const consumedCarbs = todayLog?.metadata?.consumed_carbs || 0;
  const consumedFat = todayLog?.metadata?.consumed_fat || 0;

  const targetCalories = nutritionPlan?.daily_calories || 2000;
  const targetProtein = nutritionPlan?.protein_grams || 120;
  const targetCarbs = nutritionPlan?.carbs_grams || 220;
  const targetFat = nutritionPlan?.fat_grams || 65;

  const calPct = Math.min(100, Math.round((consumedCalories / targetCalories) * 100)) || 0;
  const proteinPct = Math.min(100, Math.round((consumedProtein / targetProtein) * 100)) || 0;
  const carbsPct = Math.min(100, Math.round((consumedCarbs / targetCarbs) * 100)) || 0;
  const fatPct = Math.min(100, Math.round((consumedFat / targetFat) * 100)) || 0;

  // Determine current day for workout split display
  const daysOfWeek = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  const todayName = daysOfWeek[new Date().getDay()];
  
  let todayWorkout = null;
  let isRestDay = true;
  let todayDayKey = 'monday';

  if (workoutPlan?.plan_data?.weekly_schedule?.week1) {
    // Check if Sunday or Saturday is a training day in split, else fallback to Monday
    const schedule = workoutPlan.plan_data.weekly_schedule.week1;
    if (schedule[todayName] && schedule[todayName].type !== 'rest') {
      todayWorkout = schedule[todayName];
      isRestDay = false;
      todayDayKey = todayName;
    } else {
      // Find the first training day (e.g. monday) to display as next up
      for (const day of daysOfWeek) {
        if (schedule[day] && schedule[day].type !== 'rest') {
          todayWorkout = schedule[day];
          todayDayKey = day;
          break;
        }
      }
    }
  }

  // Get greeting
  const hour = new Date().getHours();
  let greeting = 'Good morning';
  if (hour >= 12 && hour < 17) greeting = 'Good afternoon';
  else if (hour >= 17) greeting = 'Good evening';

  // Calculate streak days
  let streakDays = 0;
  if (logs.length > 0) {
    for (const log of logs) {
      if (log.workout_completed) {
        streakDays++;
      } else {
        break;
      }
    }
  }

  // Check if completed today
  const loggedToday = logs.find(l => l.log_date === todayStr);
  const isWorkoutCompletedToday = loggedToday?.workout_completed || false;
  const currentWeight = loggedToday?.weight || profile?.weight || 'N/A';
  const currentWater = loggedToday?.water_intake || 0;

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      {/* Top Greeting Block */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white capitalize">
            {greeting}, {profile?.full_name?.split(' ')[0] || 'Desi Athlete'}! 🏋️
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            Current Goal: <span className="text-orange-500 font-bold capitalize">{profile?.fitness_goal?.replace('_', ' ') || 'Not Set'}</span>
          </p>
        </div>
        <div className="bg-gray-900 border border-gray-800 rounded-xl px-4 py-3 flex items-center space-x-3 max-w-sm">
          <Flame className="h-5 w-5 text-orange-500 animate-pulse" />
          <span className="text-xs text-gray-300 italic font-medium">"{randomQuote}"</span>
        </div>
      </div>

      {/* Warning Profile Complete Banner */}
      {!isProfileComplete && (
        <div className="bg-gradient-to-r from-orange-500/10 via-amber-500/5 to-transparent border border-orange-500/20 rounded-2xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-start space-x-4">
            <div className="bg-orange-500/10 p-3 rounded-xl text-orange-500 border border-orange-500/20 shrink-0">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">Setup Your Desi Gym Plan</h3>
              <p className="text-gray-400 text-sm max-w-xl font-medium">
                Your fitness profile is <strong>{completionPercentage}%</strong> complete. Enter your measurements and goals to generate your personalized workouts and Indian-friendly nutrition.
              </p>
              <div className="w-full h-2 bg-gray-950 rounded-full overflow-hidden mt-3 max-w-md border border-gray-800">
                <div className="h-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all duration-500" style={{ width: `${completionPercentage}%` }} />
              </div>
            </div>
          </div>
          <Link
            href="/dashboard/profile"
            className="bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm py-3 px-6 rounded-xl text-center shadow-lg shadow-orange-500/20 shrink-0 transform hover:-translate-y-0.5 transition"
          >
            Start Setup →
          </Link>
        </div>
      )}

      {/* Today's Key Performance Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Metric 1: Workout Completed */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-gray-400 text-xs font-black uppercase tracking-wider">Today's Session</span>
            <div className="p-2 rounded-lg bg-orange-500/10 text-orange-500 border border-orange-500/15">
              <Dumbbell className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className={`text-xl font-bold ${isWorkoutCompletedToday ? 'text-green-500' : 'text-orange-500'}`}>
              {isWorkoutCompletedToday ? 'Completed ✓' : 'Pending...'}
            </h3>
            <p className="text-gray-400 text-xs mt-1.5 font-semibold">
              {isWorkoutCompletedToday ? 'Nice job! Feed those muscles.' : 'Get ready to crush your weights!'}
            </p>
          </div>
        </div>

        {/* Metric 2: Current Weight */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-gray-400 text-xs font-black uppercase tracking-wider">Current Weight</span>
            <div className="p-2 rounded-lg bg-blue-500/10 text-blue-500 border border-blue-500/15">
              <Scale className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-white">
              {currentWeight} <span className="text-xs text-gray-400 font-medium">{currentWeight !== 'N/A' ? 'kg' : ''}</span>
            </h3>
            <p className="text-gray-400 text-xs mt-1.5 font-semibold">
              {loggedToday ? 'Logged today!' : 'No entry logged for today.'}
            </p>
          </div>
        </div>

        {/* Metric 3: Streak */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-gray-400 text-xs font-black uppercase tracking-wider">Consistency Streak</span>
            <div className="p-2 rounded-lg bg-green-500/10 text-green-500 border border-green-500/15">
              <Flame className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-white">
              {streakDays} <span className="text-xs text-gray-400 font-medium">Sessions</span>
            </h3>
            <p className="text-gray-400 text-xs mt-1.5 font-semibold">Consecutive workouts completed</p>
          </div>
        </div>

        {/* Metric 4: Target Calories */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all">
          <div className="flex justify-between items-start">
            <span className="text-gray-400 text-xs font-black uppercase tracking-wider">Energy Goal</span>
            <div className="p-2 rounded-lg bg-purple-500/10 text-purple-500 border border-purple-500/15">
              <Utensils className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4">
            <h3 className="text-xl font-bold text-white">
              {nutritionPlan?.daily_calories || 'N/A'}{' '}
              <span className="text-xs text-gray-400 font-medium">{nutritionPlan?.daily_calories ? 'kcal' : ''}</span>
            </h3>
            <p className="text-gray-400 text-xs mt-1.5 font-semibold">Daily caloric target</p>
          </div>
        </div>
      </div>

      {/* TODAY'S WORKOUT SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Workout Plan Summary Panel */}
        <div className="lg:col-span-2 bg-gray-900 border border-gray-800 rounded-2xl p-6 flex flex-col justify-between space-y-6">
          <div>
            <div className="flex justify-between items-center pb-4 border-b border-gray-850">
              <h2 className="text-lg font-bold text-white flex items-center">
                <Dumbbell className="h-5 w-5 text-orange-500 mr-2" />
                Today's Workout Routine
              </h2>
              {isRestDay && workoutPlan && (
                <span className="text-[10px] font-black uppercase tracking-wider bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
                  Rest Day / Next Up
                </span>
              )}
            </div>

            {workoutPlan ? (
              <div className="mt-6 space-y-4">
                <div>
                  <h3 className="text-xl font-black text-white capitalize">
                    {isRestDay ? `Active Recovery (${todayWorkout?.muscle_group || 'Split'})` : todayWorkout?.muscle_group}
                  </h3>
                  <p className="text-gray-400 text-xs leading-relaxed mt-1">
                    {workoutPlan.plan_data.overview.substring(0, 150)}...
                  </p>
                </div>
                
                {todayWorkout?.exercises && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                    {todayWorkout.exercises.slice(0, 4).map((ex, idx) => (
                      <div key={idx} className="bg-gray-950 border border-gray-850 rounded-xl px-4 py-3 flex items-center justify-between">
                        <span className="text-xs font-bold text-gray-200">{ex.name}</span>
                        <span className="text-[10px] font-black bg-gray-900 text-gray-400 px-2 py-0.5 rounded border border-gray-800">{ex.sets}x{ex.reps}</span>
                      </div>
                    ))}
                    {todayWorkout.exercises.length > 4 && (
                      <div className="text-[10px] text-gray-500 font-bold pl-2 flex items-center">
                        + {todayWorkout.exercises.length - 4} more exercises
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center space-y-4">
                <div className="mx-auto h-12 w-12 bg-gray-950 border border-gray-850 rounded-full flex items-center justify-center text-orange-500">
                  <Dumbbell className="h-6 w-6" />
                </div>
                <p className="text-gray-400 text-sm max-w-sm mx-auto">
                  You haven't generated a workout program yet. Configure your metrics in the onboarding profile.
                </p>
              </div>
            )}
          </div>

          <div className="pt-4 border-t border-gray-850 flex flex-col sm:flex-row items-center gap-4">
            {workoutPlan ? (
              <>
                <Link
                  href={`/dashboard/workout/active?day=${todayDayKey}`}
                  className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black text-sm py-3.5 px-8 rounded-xl text-center shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5 transition flex items-center justify-center space-x-2"
                >
                  <Flame className="h-4.5 w-4.5" />
                  <span>Start Workout</span>
                </Link>
                <Link
                  href="/dashboard/workout"
                  className="w-full sm:w-auto text-center border border-gray-800 hover:border-gray-700 text-white font-bold text-sm py-3.5 px-6 rounded-xl hover:bg-gray-950 transition"
                >
                  View Weekly Split
                </Link>
              </>
            ) : (
              <Link
                href="/dashboard/profile"
                className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-black text-sm py-3.5 px-8 rounded-xl text-center shadow-lg transition"
              >
                Generate Program Now
              </Link>
            )}
          </div>
        </div>

        {/* Daily Targets Panel */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white flex items-center pb-4 border-b border-gray-850">
            <Award className="h-5 w-5 text-green-500 mr-2" />
            Daily Target Macros
          </h2>

          <div className="space-y-4">
            {/* Calories Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">Calories target</span>
                <span className="text-white font-bold">{consumedCalories} / {targetCalories} kcal</span>
              </div>
              <div className="h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-850">
                <div className="h-full bg-orange-500 rounded-full transition-all duration-300" style={{ width: `${calPct}%` }} />
              </div>
            </div>

            {/* Protein Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">Protein</span>
                <span className="text-orange-500 font-bold">{consumedProtein} / {targetProtein}g</span>
              </div>
              <div className="h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-850">
                <div className="h-full bg-orange-500 rounded-full transition-all duration-300" style={{ width: `${proteinPct}%` }} />
              </div>
            </div>

            {/* Carbs Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">Carbohydrates</span>
                <span className="text-blue-400 font-bold">{consumedCarbs} / {targetCarbs}g</span>
              </div>
              <div className="h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-850">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-300" style={{ width: `${carbsPct}%` }} />
              </div>
            </div>

            {/* Fats Progress */}
            <div className="space-y-1.5">
              <div className="flex justify-between text-xs font-semibold">
                <span className="text-gray-400">Dietary Fats</span>
                <span className="text-green-500 font-bold">{consumedFat} / {targetFat}g</span>
              </div>
              <div className="h-2 bg-gray-950 rounded-full overflow-hidden border border-gray-850">
                <div className="h-full bg-green-500 rounded-full transition-all duration-300" style={{ width: `${fatPct}%` }} />
              </div>
            </div>

            {/* Steps & Water */}
            <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-850">
              <div className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-center">
                <Footprints className="h-4.5 w-4.5 text-orange-500 mx-auto mb-1" />
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Steps Target</span>
                <span className="text-xs font-bold text-white block mt-0.5">10,000 steps</span>
              </div>
              <div className="bg-gray-950 border border-gray-850 p-3 rounded-xl text-center">
                <Droplet className="h-4.5 w-4.5 text-blue-400 mx-auto mb-1" />
                <span className="text-[10px] text-gray-500 font-bold uppercase block">Water Intake</span>
                <span className="text-xs font-bold text-white block mt-0.5">{currentWater > 0 ? `${currentWater}L` : '3.5-4L'}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* QUICK ACTIONS SECTION */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-white">Quick Shortcuts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <Link
            href="/dashboard/progress"
            className="bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-orange-500/50 group rounded-xl p-4 text-center transition-all duration-200"
          >
            <Calendar className="h-6 w-6 text-orange-500 group-hover:scale-110 transition mx-auto mb-2" />
            <span className="text-xs font-bold text-gray-300 group-hover:text-white block">Log Progress</span>
          </Link>
          <Link
            href="/dashboard/workout"
            className="bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-orange-500/50 group rounded-xl p-4 text-center transition-all duration-200"
          >
            <Dumbbell className="h-6 w-6 text-orange-500 group-hover:scale-110 transition mx-auto mb-2" />
            <span className="text-xs font-bold text-gray-300 group-hover:text-white block">Workout Routine</span>
          </Link>
          <Link
            href="/dashboard/profile"
            className="bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-orange-500/50 group rounded-xl p-4 text-center transition-all duration-200"
          >
            <UserCheck className="h-6 w-6 text-orange-500 group-hover:scale-110 transition mx-auto mb-2" />
            <span className="text-xs font-bold text-gray-300 group-hover:text-white block">Edit Profile</span>
          </Link>
          <Link
            href="/dashboard/chat"
            className="bg-gray-900 hover:bg-gray-850 border border-gray-800 hover:border-orange-500/50 group rounded-xl p-4 text-center transition-all duration-200"
          >
            <MessageSquare className="h-6 w-6 text-orange-500 group-hover:scale-110 transition mx-auto mb-2" />
            <span className="text-xs font-bold text-gray-300 group-hover:text-white block">Ask Coach Alex</span>
          </Link>
        </div>
      </div>

      {/* PROGRESS GAINS CHART OVERVIEW */}
      {logs.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-900 border border-gray-800 rounded-2xl p-6">
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center">
              <TrendingUp className="h-4.5 w-4.5 text-orange-500 mr-2" />
              Weight Progression (Recent)
            </h3>
            <WeightChart data={[...logs].reverse()} />
          </div>
          <div className="space-y-3">
            <h3 className="text-base font-bold text-white flex items-center">
              <TrendingUp className="h-4.5 w-4.5 text-blue-500 mr-2" />
              Body Fat Trend (Recent)
            </h3>
            <BodyFatChart data={[...logs].reverse()} />
          </div>
        </div>
      )}

      {/* RECENT ACTIVITY FEED */}
      <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
        <h2 className="text-lg font-bold text-white border-b border-gray-850 pb-4 mb-4">Recent Activity Logs</h2>
        {logs && logs.length > 0 ? (
          <div className="space-y-4">
            {logs.slice(0, 4).map((log) => (
              <div
                key={log.id}
                className="flex items-center justify-between border-b border-gray-850 pb-3.5 last:border-b-0 last:pb-0"
              >
                <div className="flex items-center space-x-3">
                  <div
                    className={`h-9 w-9 rounded-xl flex items-center justify-center border ${
                      log.workout_completed
                        ? 'bg-green-500/10 border-green-500/20 text-green-500'
                        : 'bg-orange-500/10 border-orange-500/20 text-orange-500'
                    }`}
                  >
                    <Dumbbell className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-white">
                      Workout {log.workout_completed ? 'Completed' : 'Missed / Rested'}
                    </h4>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Date: {new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-sm font-bold text-gray-200">{log.weight} kg</span>
                  <p className="text-[10px] text-gray-400 font-semibold mt-0.5">Energy: {log.energy_level || 'N/A'}/10</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <p className="text-gray-500 text-sm">No activity logged yet.</p>
            <Link href="/dashboard/progress" className="text-orange-500 font-bold hover:text-orange-400 text-xs mt-2 inline-block">
              Click here to make your first log entry
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
