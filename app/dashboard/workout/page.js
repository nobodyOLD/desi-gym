'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { LoadingSkeleton, PlanGenerating } from '@/components/LoadingSpinner';
import {
  Dumbbell,
  Play,
  RotateCcw,
  Video,
  Smile,
  Compass,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  Info,
  CalendarCheck,
  CheckCircle,
} from 'lucide-react';

export default function WorkoutPage() {
  const [profile, setProfile] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeWeek, setActiveWeek] = useState('week1');
  const [activeDay, setActiveDay] = useState('monday');
  const [expandedExercises, setExpandedExercises] = useState({});
  const [workoutLoggedToday, setWorkoutLoggedToday] = useState(false);
  const [warmUpOpen, setWarmUpOpen] = useState(false);
  const [coolDownOpen, setCoolDownOpen] = useState(false);
  
  const router = useRouter();

  // Load profile and plan data
  useEffect(() => {
    async function loadWorkoutData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        // Fetch user profile
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(userProfile);

        if (userProfile) {
          // Fetch active plan
          const { data: workoutPlan } = await supabase
            .from('workout_plans')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('is_active', true)
            .maybeSingle();

          if (workoutPlan) {
            setPlan(workoutPlan.plan_data);
          }

          // Check if workout was logged today
          const todayStr = new Date().toISOString().split('T')[0];
          const { data: todayLogs } = await supabase
            .from('progress_logs')
            .select('workout_completed')
            .eq('user_id', session.user.id)
            .eq('log_date', todayStr)
            .maybeSingle();

          if (todayLogs?.workout_completed) {
            setWorkoutLoggedToday(true);
          }
        }
      } catch (error) {
        console.error('Error loading workout plans:', error);
        toast.error('Failed to load workout split.');
      } finally {
        setLoading(false);
      }
    }

    loadWorkoutData();
  }, [router]);

  const handleGenerate = async () => {
    if (!profile || !profile.body_type) {
      toast.error('Please complete your onboarding profile details first to generate custom plans.');
      router.push('/dashboard/profile');
      return;
    }

    setGenerating(true);
    try {
      const response = await fetch('/api/workout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile }),
      });

      if (!response.ok) {
        throw new Error('API failed to generate workout program');
      }

      const result = await response.json();
      if (result.success) {
        setPlan(result.plan);
        toast.success('Your workout program has been successfully generated!');
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
    if (!window.confirm('Are you sure you want to regenerate your workout split? This will bypass your cache and build a new plan.')) {
      return;
    }
    await handleGenerate();
  };

  const toggleExerciseExpand = (index) => {
    setExpandedExercises((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const handleMarkCompleted = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const todayStr = new Date().toISOString().split('T')[0];
      
      // Update or insert today's progress log
      const { data: existingLog } = await supabase
        .from('progress_logs')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('log_date', todayStr)
        .maybeSingle();

      if (existingLog) {
        await supabase
          .from('progress_logs')
          .update({ workout_completed: true, updated_at: new Date() })
          .eq('id', existingLog.id);
      } else {
        await supabase.from('progress_logs').insert({
          user_id: session.user.id,
          log_date: todayStr,
          workout_completed: true,
          weight: profile?.weight || null,
          energy_level: 8,
          mood: '🔥',
        });
      }

      setWorkoutLoggedToday(true);
      toast.success("Awesome! Today's session logged! Keep pushing! 🔥");
    } catch (e) {
      console.error(e);
      toast.error('Failed to log workout completion.');
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
        <div className="bg-orange-500/10 p-5 rounded-2xl text-orange-500 border border-orange-500/20">
          <Dumbbell className="h-10 w-10 animate-bounce" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">No Workout Program</h2>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Generate your custom 4-week split. We will use Google Gemini to structure compound sets, intensities, and targets for your body type.
          </p>
        </div>
        <button
          onClick={handleGenerate}
          className="bg-orange-500 hover:bg-orange-600 text-white font-bold py-3.5 px-8 rounded-xl shadow-lg transition"
        >
          Generate Workout Plan 🚀
        </button>
      </div>
    );
  }

  const currentSchedule = plan.weekly_schedule?.[activeWeek]?.[activeDay] || { type: 'rest', activities: ['Light walk', 'Stretching'] };
  const isRestDay = currentSchedule.type === 'rest' || !currentSchedule.exercises;

  const days = [
    { key: 'monday', label: 'Mon' },
    { key: 'tuesday', label: 'Tue' },
    { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' },
    { key: 'friday', label: 'Fri' },
    { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' },
  ];

  const weeks = [
    { key: 'week1', label: 'Week 1' },
    { key: 'week2', label: 'Week 2' },
    { key: 'week3', label: 'Week 3' },
    { key: 'week4', label: 'Week 4' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">{plan.plan_name}</h1>
          <p className="text-gray-400 text-sm mt-1 leading-relaxed max-w-2xl">{plan.overview}</p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={handleRegenerate}
            className="flex items-center text-xs font-bold text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl px-4 py-3 bg-gray-900 transition"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Regenerate Split
          </button>
        </div>
      </div>

      {/* Week Selector Tabs */}
      <div className="flex bg-gray-900 border border-gray-800 p-1.5 rounded-xl max-w-md">
        {weeks.map((wk) => (
          <button
            key={wk.key}
            onClick={() => setActiveWeek(wk.key)}
            className={`flex-1 text-center py-2.5 rounded-lg text-xs font-black transition-all ${
              activeWeek === wk.key ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'
            }`}
          >
            {wk.label}
          </button>
        ))}
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

      {/* Day Content Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Exercises Split Panel (Left/Center) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-gray-850 border border-gray-700/80 rounded-2xl p-6">
            <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
              <div>
                <span className="text-[10px] text-orange-500 font-black uppercase tracking-wider block">Today's Focus</span>
                <h3 className="text-xl font-bold text-white capitalize">
                  {isRestDay ? 'Active Recovery / Rest' : currentSchedule.muscle_group}
                </h3>
              </div>
              <div className="p-2 bg-orange-500/10 rounded-xl text-orange-500 border border-orange-500/10">
                <Dumbbell className="h-5 w-5" />
              </div>
            </div>

            {isRestDay ? (
              <div className="text-center py-12 space-y-4">
                <div className="mx-auto bg-gray-800 h-16 w-16 rounded-full flex items-center justify-center text-gray-400 border border-gray-700">
                  <Compass className="h-8 w-8 animate-spin" style={{ animationDuration: '10s' }} />
                </div>
                <div>
                  <h4 className="text-base font-bold text-white">Let your muscles recover!</h4>
                  <p className="text-gray-400 text-xs mt-1.5 max-w-sm mx-auto leading-relaxed">
                    Growth happens during rest. Here are some active lifestyle recommendations to promote vascular recovery:
                  </p>
                </div>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  {(currentSchedule.activities || ['Light walk', 'Yoga', 'Stretching']).map((act, index) => (
                    <span
                      key={index}
                      className="text-xs bg-gray-800 border border-gray-700 px-3 py-1.5 rounded-lg text-gray-300 font-semibold"
                    >
                      {act}
                    </span>
                  ))}
                  </div>
              </div>
            ) : (
              <div className="space-y-4">
                {plan.why_this_workout && (
                  <div className="bg-orange-500/5 border border-orange-500/15 rounded-2xl p-4 text-xs text-gray-300 leading-relaxed mb-2">
                    💡 <strong>Why this workout?</strong> {plan.why_this_workout}
                  </div>
                )}

                {currentSchedule.exercises.map((ex, index) => {
                  const isExpanded = expandedExercises[index] || false;
                  return (
                    <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                      {/* Accordion Trigger Header */}
                      <button
                        onClick={() => toggleExerciseExpand(index)}
                        className="w-full text-left p-4 flex items-center justify-between hover:bg-gray-800/40 transition duration-200"
                      >
                        <div className="space-y-1 pr-4">
                          <h4 className="text-base font-bold text-white leading-snug">{ex.name}</h4>
                          <div className="flex items-center space-x-2">
                            <span className="text-[10px] font-black bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
                              {ex.sets} Sets × {ex.reps} Reps
                            </span>
                            {ex.rest && (
                              <span className="text-[10px] font-semibold text-gray-400">
                                Rest: {ex.rest}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-gray-400">
                          {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                        </div>
                      </button>

                      {/* Expanded Section Details */}
                      {isExpanded && (
                        <div className="p-4 border-t border-gray-800 bg-gray-900/50 space-y-4 text-xs">
                          {/* ACSM Parameters Grid */}
                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Primary Muscle</span>
                              <span className="text-white font-semibold">{ex.primary_muscle || 'General'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Target Effort</span>
                              <span className="text-orange-400 font-bold">{ex.target_effort || '2 RIR'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Today's Target</span>
                              <span className="text-white font-bold">{ex.todays_target || 'Establish Baseline'}</span>
                            </div>
                            <div>
                              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Previous Session</span>
                              <span className="text-gray-300 font-semibold">{ex.previous_performance || 'Baseline Session'}</span>
                            </div>
                          </div>

                          {ex.coach_note && (
                            <div className="bg-orange-500/5 border border-orange-500/10 rounded-xl p-3 text-xs leading-relaxed">
                              <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block mb-0.5">Coach Note</span>
                              <p className="text-gray-300 italic">"{ex.coach_note}"</p>
                            </div>
                          )}

                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Instructions</span>
                            <p className="text-gray-300 leading-relaxed">{ex.instructions}</p>
                          </div>
                          
                          <div className="pt-2 flex items-center">
                            <a
                              href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.video_search_term || ex.name)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center text-xs font-bold text-red-500 hover:text-red-400 transition"
                            >
                              <Video className="h-4 w-4 mr-1.5" />
                              Search Form on YouTube
                            </a>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Start Workout Action Bar */}
          {!isRestDay && (
            <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col sm:flex-row justify-between items-center gap-4">
              <div>
                <h4 className="text-sm font-bold text-white">Ready to train today's split?</h4>
                <p className="text-xs text-gray-400 mt-0.5">Log weights, reps, RPE, and calculate your overload progression targets.</p>
              </div>
              <Link
                href={`/dashboard/workout/active?day=${activeDay}`}
                className="w-full sm:w-auto text-center bg-orange-500 hover:bg-orange-600 text-white font-black py-3.5 px-8 rounded-xl transition flex items-center justify-center space-x-2 shadow-lg shadow-orange-500/20"
              >
                <Play className="h-4.5 w-4.5 fill-current" />
                <span>Start Workout</span>
              </Link>
            </div>
          )}
        </div>

        {/* Warm-Up / Cool-Down / Tips Sidebar Panels (Right) */}
        <div className="space-y-6">
          {/* Collapsible Warm-Up */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
            <button
              onClick={() => setWarmUpOpen(!warmUpOpen)}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-700/30 transition"
            >
              <h3 className="text-sm font-bold text-white flex items-center">
                <Play className="h-4.5 w-4.5 text-orange-500 mr-2" />
                Suggested Warm-Up
              </h3>
              {warmUpOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {warmUpOpen && (
              <div className="p-5 border-t border-gray-700/60 space-y-3 bg-gray-900/10">
                <ul className="space-y-2">
                  {(plan.warm_up || ['5-10 mins light cardio', 'Dynamic stretching (arm circles, leg swings)', 'Warm up work-sets with lighter weight']).map((item, idx) => (
                    <li key={idx} className="text-xs text-gray-300 leading-relaxed flex items-start space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-orange-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Collapsible Cool-Down */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden">
            <button
              onClick={() => setCoolDownOpen(!coolDownOpen)}
              className="w-full p-5 flex items-center justify-between text-left hover:bg-gray-700/30 transition"
            >
              <h3 className="text-sm font-bold text-white flex items-center">
                <Play className="h-4.5 w-4.5 text-blue-500 rotate-90 mr-2" />
                Suggested Cool-Down
              </h3>
              {coolDownOpen ? <ChevronUp className="h-4 w-4 text-gray-400" /> : <ChevronDown className="h-4 w-4 text-gray-400" />}
            </button>
            {coolDownOpen && (
              <div className="p-5 border-t border-gray-700/60 space-y-3 bg-gray-900/10">
                <ul className="space-y-2">
                  {(plan.cool_down || ['5-10 mins slow walking', 'Static stretching targeting worked muscles', 'Hydrate and consume protein']).map((item, idx) => (
                    <li key={idx} className="text-xs text-gray-300 leading-relaxed flex items-start space-x-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-500 mt-1.5 shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Progression & Pro Tips */}
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center pb-3 border-b border-gray-700/60">
              <Info className="h-4.5 w-4.5 text-orange-500 mr-2" />
              Coach Alex Pro Tips
            </h3>
            
            <ul className="space-y-3">
              {(plan.pro_tips || ['Focus on form over weight.', 'Record your log metrics daily.', 'Aim for 7-9 hours of deep sleep.']).map((tip, idx) => (
                <li key={idx} className="text-xs text-gray-300 leading-relaxed">
                  <strong>Tip {idx + 1}:</strong> {tip}
                </li>
              ))}
            </ul>

            {plan.progression_notes && (
              <div className="pt-3 border-t border-gray-700/60 space-y-1.5">
                <span className="text-[10px] text-orange-400 font-bold uppercase tracking-wider block">Progression Notes</span>
                <p className="text-gray-400 text-xs leading-relaxed">{plan.progression_notes}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Methodology Attribution Note */}
      <div className="text-center pt-8 border-t border-gray-900 text-[10px] text-gray-500 font-bold leading-relaxed max-w-xl mx-auto">
        ℹ️ Desi Gym's resistance-training programming is informed by the American College of Sports Medicine's 2026 Position Stand on Resistance Training.
      </div>
    </div>
  );
}
