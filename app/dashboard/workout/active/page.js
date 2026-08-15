'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { getExerciseById } from '@/lib/exercises';
import { calculateProgression } from '@/lib/progression';
import { toast } from 'react-hot-toast';
import {
  Play,
  Pause,
  RotateCcw,
  CheckCircle,
  AlertTriangle,
  Info,
  Clock,
  Dumbbell,
  ArrowRight,
  TrendingUp,
  Volume2,
  Trash2,
  ListTodo,
  Loader2
} from 'lucide-react';

export default function ActiveWorkoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const targetDay = searchParams.get('day') || 'monday';

  const [plan, setPlan] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Active workout execution tracking
  const [exercises, setExercises] = useState([]);
  const [currentExerciseIdx, setCurrentExerciseIdx] = useState(0);
  const [workoutStarted, setWorkoutStarted] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [workoutEnded, setWorkoutEnded] = useState(false);

  // Rest Timer State
  const [showTimer, setShowTimer] = useState(false);
  const [timerMax, setTimerMax] = useState(60);
  const [timeLeft, setTimeLeft] = useState(60);
  const [timerRunning, setTimerRunning] = useState(false);

  const stopwatchRef = useRef(null);
  const countdownRef = useRef(null);

  // Load plan and profile
  useEffect(() => {
    async function loadWorkoutPlan() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const { data: profileData } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        setProfile(profileData);

        const { data: activePlan } = await supabase
          .from('workout_plans')
          .select('*')
          .eq('user_id', session.user.id)
          .eq('is_active', true)
          .maybeSingle();

        if (activePlan && activePlan.plan_data?.weekly_schedule?.week1) {
          setPlan(activePlan.plan_data);
          
          // Extract exercises for target day
          const daySplit = activePlan.plan_data.weekly_schedule.week1[targetDay];
          if (daySplit && daySplit.exercises) {
            // Load previous history to perform progression calculations
            const { data: allHistory } = await supabase
              .from('progress_logs')
              .select('*')
              .eq('user_id', session.user.id)
              .order('log_date', { ascending: false });

            // Structure our initial state
            const mappedExercises = daySplit.exercises.map((ex) => {
              const fullEx = getExerciseById(ex.id || ex.name) || {};
              const setsCount = parseInt(ex.sets) || 3;
              
              // Load historical sessions for this specific exercise
              const exerciseLogs = (allHistory || [])
                .filter(log => log.workout_notes && log.workout_notes.includes(ex.name));

              let prevSets = [];
              if (exerciseLogs.length > 0) {
                try {
                  // Attempt to extract sets from note string or metadata if stored
                  const recentLog = exerciseLogs[0];
                  // If we saved sets in metadata (which we will), fetch it.
                  if (recentLog.metadata?.workout_sets?.[ex.name]) {
                    prevSets = recentLog.metadata.workout_sets[ex.name];
                  }
                } catch (e) {
                  console.error(e);
                }
              }

              // Compute progression recommendations
              const progResult = calculateProgression(fullEx, prevSets, []);

              return {
                id: ex.id || fullEx.id,
                name: ex.name,
                primary_muscle: fullEx.primary_muscle || 'General',
                instructions: fullEx.instructions || ex.instructions,
                target_reps: ex.reps || fullEx.rep_range || '8-12',
                target_sets: setsCount,
                rest: ex.rest || '60s',
                prevSets: prevSets,
                progressionMessage: progResult?.message || 'Establish baseline today.',
                // Initialize sets inputs
                sets: Array.from({ length: setsCount }).map((_, sIdx) => {
                  const suggestedWeight = progResult?.suggestedSets?.[sIdx]?.weight || prevSets[sIdx]?.weight || '';
                  return {
                    set_index: sIdx,
                    weight: suggestedWeight,
                    reps: '',
                    completed: false,
                    rpe: '8' // Default RPE
                  };
                }),
                notes: ''
              };
            });

            setExercises(mappedExercises);
          } else {
            toast.error(`No exercises scheduled for ${targetDay}. Showing rest overlay.`);
          }
        }
      } catch (err) {
        console.error('Error loading active split:', err);
        toast.error('Failed to load active workout split.');
      } finally {
        setLoading(false);
      }
    }

    loadWorkoutPlan();
  }, [router, targetDay]);

  // Overall workout stopwatch timer
  useEffect(() => {
    if (workoutStarted && !workoutEnded) {
      stopwatchRef.current = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(stopwatchRef.current);
  }, [workoutStarted, workoutEnded]);

  // Rest Timer countdown logic
  useEffect(() => {
    if (timerRunning && timeLeft > 0) {
      countdownRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && timerRunning) {
      clearInterval(countdownRef.current);
      setTimerRunning(false);
      setShowTimer(false);
      toast.success('Rest over! Get back to the bar! 🏋️', { icon: '🔔' });
      // Play brief audio alert if possible
      if (typeof window !== 'undefined' && 'AudioContext' in window) {
        try {
          const ctx = new (window.AudioContext || window.webkitAudioContext)();
          const osc = ctx.createOscillator();
          osc.connect(ctx.destination);
          osc.start();
          osc.stop(ctx.currentTime + 0.3);
        } catch (e) {}
      }
    }
    return () => clearInterval(countdownRef.current);
  }, [timerRunning, timeLeft]);

  const handleStartWorkout = () => {
    setWorkoutStarted(true);
    toast.success('Stopwatch started! Let\'s lift heavy! 🔥');
  };

  const handleCompleteSet = (exerciseIdx, setIdx) => {
    if (!workoutStarted) {
      handleStartWorkout();
    }

    const currentEx = exercises[exerciseIdx];
    const currentSet = currentEx.sets[setIdx];
    
    if (!currentSet.weight || !currentSet.reps) {
      toast.error('Please input both Weight and Reps completed.');
      return;
    }

    // Toggle set completed status
    const updated = [...exercises];
    updated[exerciseIdx].sets[setIdx].completed = true;
    setExercises(updated);

    // Launch Rest Timer
    const restSeconds = currentEx.rest.includes('90') ? 90 : 60;
    setTimerMax(restSeconds);
    setTimeLeft(restSeconds);
    setShowTimer(true);
    setTimerRunning(true);
  };

  const handleSetFieldChange = (exerciseIdx, setIdx, field, val) => {
    const updated = [...exercises];
    updated[exerciseIdx].sets[setIdx][field] = val;
    setExercises(updated);
  };

  const handleNoteChange = (exerciseIdx, val) => {
    const updated = [...exercises];
    updated[exerciseIdx].notes = val;
    setExercises(updated);
  };

  const handleAdd30s = () => {
    setTimeLeft((prev) => prev + 30);
    setTimerMax((prev) => prev + 30);
  };

  const handleSkipTimer = () => {
    clearInterval(countdownRef.current);
    setTimerRunning(false);
    setShowTimer(false);
    setTimeLeft(0);
  };

  const handleFinishWorkout = async () => {
    // Check if at least one set is logged
    const totalSetsCompleted = exercises.reduce(
      (sum, ex) => sum + ex.sets.filter((s) => s.completed).length,
      0
    );

    if (totalSetsCompleted === 0) {
      toast.error('Please log at least one completed set before ending.');
      return;
    }

    if (!window.confirm('Are you finished with this training session? We will write logs and calculate progression metrics.')) {
      return;
    }

    setWorkoutEnded(true);
    clearInterval(stopwatchRef.current);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const todayStr = new Date().toISOString().split('T')[0];

      // Calculate statistics
      let totalVolume = 0;
      const completedExercisesList = [];
      const loggedSetsMetadata = {};

      exercises.forEach((ex) => {
        const completedSets = ex.sets.filter((s) => s.completed);
        if (completedSets.length > 0) {
          completedExercisesList.push(ex.name);
          loggedSetsMetadata[ex.name] = completedSets.map((s) => ({
            set_index: s.set_index,
            weight: parseFloat(s.weight),
            reps: parseInt(s.reps),
            rpe: parseInt(s.rpe)
          }));

          completedSets.forEach((s) => {
            totalVolume += parseFloat(s.weight) * parseInt(s.reps);
          });
        }
      });

      // Write session details into progress logs
      const workoutNotesString = exercises
        .filter((ex) => ex.sets.some((s) => s.completed))
        .map((ex) => {
          const setsStr = ex.sets
            .filter((s) => s.completed)
            .map((s) => `${s.weight}kg × ${s.reps} reps (RPE ${s.rpe})`)
            .join(', ');
          return `${ex.name}: ${setsStr}. Notes: ${ex.notes || 'None'}`;
        })
        .join(' | ');

      const payload = {
        user_id: session.user.id,
        log_date: todayStr,
        weight: profile?.weight || null,
        workout_completed: true,
        workout_notes: `Split: ${plan?.plan_name || 'Upper Body'} - ${targetDay.toUpperCase()} | ` + workoutNotesString,
        energy_level: 8,
        mood: '🔥',
        metadata: {
          workout_sets: loggedSetsMetadata,
          duration_seconds: elapsedTime,
          total_volume_kg: totalVolume,
          completed_exercises: completedExercisesList,
          sets_logged_count: totalSetsCompleted
        }
      };

      // Upsert today's progress log
      const { data: existingLog } = await supabase
        .from('progress_logs')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('log_date', todayStr)
        .maybeSingle();

      if (existingLog) {
        await supabase
          .from('progress_logs')
          .update({ ...payload, updated_at: new Date().toISOString() })
          .eq('id', existingLog.id);
      } else {
        await supabase.from('progress_logs').insert(payload);
      }

      toast.success('Workout session logged successfully!');
      
      // Store session summary in session storage for the completion screen
      sessionStorage.setItem('desigym_completion_data', JSON.stringify({
        duration: Math.round(elapsedTime / 60),
        volume: totalVolume,
        exercisesCount: completedExercisesList.length,
        setsCount: totalSetsCompleted,
        day: targetDay
      }));

      router.push('/dashboard/workout/complete');
    } catch (e) {
      console.error(e);
      toast.error('Failed to log workout completion.');
      setWorkoutEnded(false);
    }
  };

  const formatStopwatch = (totalSeconds) => {
    const mins = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="h-[60vh] flex flex-col justify-center items-center">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        <span className="text-gray-400 text-sm mt-3">Readying workout sheets...</span>
      </div>
    );
  }

  const currentExercise = exercises[currentExerciseIdx];

  // Rest Timer Circle Math
  const radius = 40;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = showTimer 
    ? circumference - (timeLeft / timerMax) * circumference 
    : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pb-20 animate-fade-in relative">
      
      {/* REST TIMER FLOAT PANEL */}
      {showTimer && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center p-4">
          <div className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-sm w-full text-center space-y-6 shadow-2xl">
            <h3 className="text-sm font-black text-orange-500 uppercase tracking-widest">Rest Period</h3>
            
            {/* Visual Circular Timer */}
            <div className="relative h-32 w-32 mx-auto flex items-center justify-center">
              <svg className="absolute inset-0 transform -rotate-95" viewBox="0 0 100 100">
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#1f2937" // gray-800
                  strokeWidth="8"
                  fill="transparent"
                />
                <circle
                  cx="50"
                  cy="50"
                  r={radius}
                  stroke="#f97316" // orange-500
                  strokeWidth="8"
                  fill="transparent"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  className="transition-all duration-1000 ease-linear"
                />
              </svg>
              <div className="text-3xl font-black text-white">{timeLeft}s</div>
            </div>

            <p className="text-xs text-gray-400 font-semibold leading-relaxed">
              Up next: <span className="text-white font-bold">{currentExercise?.name}</span>
            </p>

            <div className="flex justify-center gap-4">
              <button
                onClick={handleAdd30s}
                className="bg-gray-800 hover:bg-gray-750 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition"
              >
                +30s
              </button>
              <button
                onClick={handleSkipTimer}
                className="bg-orange-500 hover:bg-orange-600 text-white font-black text-xs py-2.5 px-6 rounded-xl shadow transition"
              >
                Skip Rest
              </button>
            </div>
          </div>
        </div>
      )}

      {/* LEFT COLUMN: ACTIVE WORKOUT SHEETS */}
      <div className="lg:col-span-8 space-y-6">
        {/* Title Header with stopwatch */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 flex justify-between items-center">
          <div>
            <span className="text-[10px] text-orange-500 font-black uppercase tracking-wider block">Active Session</span>
            <h1 className="text-xl font-black text-white capitalize">{targetDay} Workout Split</h1>
          </div>
          <div className="flex items-center space-x-3 bg-gray-950 border border-gray-850 px-4 py-2.5 rounded-xl">
            <Clock className="h-5 w-5 text-orange-500 animate-pulse" />
            <span className="text-lg font-black text-white">{formatStopwatch(elapsedTime)}</span>
          </div>
        </div>

        {/* Selected Exercise Main Logging Form */}
        {currentExercise ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-6">
            
            {/* Header info */}
            <div className="flex justify-between items-start pb-4 border-b border-gray-850">
              <div>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Exercise {currentExerciseIdx + 1} of {exercises.length}</span>
                <h2 className="text-2xl font-black text-white mt-1">{currentExercise.name}</h2>
                <span className="inline-block text-[10px] font-black bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded uppercase mt-2">
                  {currentExercise.primary_muscle}
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-bold text-gray-400">Target Range</span>
                <div className="text-sm font-black text-white mt-0.5">{currentExercise.target_sets} Sets × {currentExercise.target_reps} Reps</div>
              </div>
            </div>

            {/* AI Progression Tips Box */}
            <div className="bg-orange-500/5 border border-orange-500/15 rounded-xl p-4 flex items-start space-x-3 text-xs">
              <TrendingUp className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Suggested Progression Targets</span>
                <p className="text-gray-300 font-medium leading-relaxed">{currentExercise.progressionMessage}</p>
              </div>
            </div>

            {/* Logger table */}
            <div className="space-y-3">
              <div className="hidden sm:grid grid-cols-5 gap-4 text-[10px] font-bold text-gray-500 uppercase px-2">
                <span>Set</span>
                <span>Previous performance</span>
                <span>Weight (kg)</span>
                <span>Reps completed</span>
                <span className="text-right">Action</span>
              </div>

              <div className="space-y-2">
                {currentExercise.sets.map((set, sIdx) => (
                  <div
                    key={sIdx}
                    className={`grid grid-cols-1 sm:grid-cols-5 gap-3 p-3 rounded-xl border transition items-center ${
                      set.completed 
                        ? 'bg-green-500/5 border-green-500/20' 
                        : 'bg-gray-950 border-gray-850'
                    }`}
                  >
                    {/* Set label */}
                    <div className="text-xs font-black text-white flex items-center gap-1.5">
                      <span className="sm:hidden text-gray-500">Set</span>
                      <span>Set {set.set_index + 1}</span>
                      {set.completed && <span className="text-green-500 text-[10px] font-bold">(Logged)</span>}
                    </div>

                    {/* Previous load */}
                    <div className="text-xs text-gray-400 font-semibold">
                      <span className="sm:hidden text-[10px] text-gray-500 block uppercase font-bold mb-0.5">Prev Performance</span>
                      {currentExercise.prevSets[sIdx] 
                        ? `${currentExercise.prevSets[sIdx].weight}kg × ${currentExercise.prevSets[sIdx].reps}`
                        : 'Establish Baseline'
                      }
                    </div>

                    {/* Weight Input */}
                    <div>
                      <span className="sm:hidden text-[10px] text-gray-500 block uppercase font-bold mb-1">Weight (kg)</span>
                      <input
                        type="number"
                        step="0.5"
                        value={set.weight}
                        onChange={(e) => handleSetFieldChange(currentExerciseIdx, sIdx, 'weight', e.target.value)}
                        placeholder="e.g. 60"
                        disabled={set.completed}
                        className="w-full bg-gray-900 border border-gray-800 focus:border-orange-500 disabled:bg-gray-850 disabled:text-gray-500 text-white rounded-lg px-3 py-2 text-xs focus:outline-none transition"
                      />
                    </div>

                    {/* Reps Input */}
                    <div>
                      <span className="sm:hidden text-[10px] text-gray-500 block uppercase font-bold mb-1">Reps Completed</span>
                      <input
                        type="number"
                        value={set.reps}
                        onChange={(e) => handleSetFieldChange(currentExerciseIdx, sIdx, 'reps', e.target.value)}
                        placeholder="e.g. 10"
                        disabled={set.completed}
                        className="w-full bg-gray-900 border border-gray-800 focus:border-orange-500 disabled:bg-gray-850 disabled:text-gray-500 text-white rounded-lg px-3 py-2 text-xs focus:outline-none transition"
                      />
                    </div>

                    {/* Complete button */}
                    <div className="sm:text-right">
                      {set.completed ? (
                        <button
                          type="button"
                          onClick={() => {
                            const updated = [...exercises];
                            updated[currentExerciseIdx].sets[setIdx].completed = false;
                            setExercises(updated);
                          }}
                          className="w-full sm:w-auto text-xs font-bold text-gray-400 hover:text-white"
                        >
                          Edit Set
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleCompleteSet(currentExerciseIdx, sIdx)}
                          className="w-full sm:w-auto bg-orange-500 hover:bg-orange-600 text-white font-bold text-[11px] py-2 px-4 rounded-lg shadow-md transition"
                        >
                          Complete Set
                        </button>
                      )}
                    </div>

                  </div>
                ))}
              </div>
            </div>

            {/* Exercise Notes */}
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-400 uppercase">Exercise Notes</label>
              <textarea
                value={currentExercise.notes}
                onChange={(e) => handleNoteChange(currentExerciseIdx, e.target.value)}
                placeholder="Write logs (e.g. Felt light, minor shoulder strain on set 3)..."
                rows={2}
                className="w-full bg-gray-950 border border-gray-850 focus:border-orange-500 text-white rounded-xl p-3 text-xs focus:outline-none transition resize-none"
              />
            </div>

            {/* Expandable execution instructions */}
            <div className="bg-gray-950 border border-gray-850 rounded-xl p-4 space-y-2">
              <h4 className="text-xs font-bold text-white flex items-center">
                <Info className="h-4.5 w-4.5 text-orange-500 mr-1.5" />
                Execution Instructions
              </h4>
              <p className="text-gray-400 text-xs leading-relaxed font-semibold">{currentExercise.instructions}</p>
            </div>

            {/* Exercise Page Controls */}
            <div className="flex justify-between items-center pt-6 border-t border-gray-850">
              <button
                type="button"
                disabled={currentExerciseIdx === 0}
                onClick={() => setCurrentExerciseIdx((prev) => prev - 1)}
                className="text-xs font-bold text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400"
              >
                ← Previous Exercise
              </button>
              
              {currentExerciseIdx < exercises.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentExerciseIdx((prev) => prev + 1)}
                  className="bg-gray-800 hover:bg-gray-750 text-white font-bold text-xs py-2.5 px-6 rounded-xl transition flex items-center"
                >
                  <span>Next Exercise</span>
                  <ArrowRight className="h-4 w-4 ml-1.5" />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleFinishWorkout}
                  className="bg-green-500 hover:bg-green-600 text-white font-black text-xs py-2.5 px-8 rounded-xl shadow-lg shadow-green-500/20 transition"
                >
                  Finish Workout 🎉
                </button>
              )}
            </div>

          </div>
        ) : (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl p-12 text-center space-y-4">
            <AlertTriangle className="h-10 w-10 text-orange-500 mx-auto" />
            <h3 className="text-lg font-bold text-white">No Exercises Loaded</h3>
            <p className="text-gray-400 text-xs max-w-sm mx-auto">
              Please complete onboarding or make sure you have generated a workout plan split first.
            </p>
          </div>
        )}
      </div>

      {/* RIGHT COLUMN: WORKOUT SHEET SIDEBAR DIRECTORY */}
      <div className="lg:col-span-4 space-y-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-5 space-y-4">
          <h3 className="text-sm font-black text-white uppercase tracking-wider flex items-center border-b border-gray-850 pb-3">
            <ListTodo className="h-4.5 w-4.5 text-orange-500 mr-2" />
            Exercises Checklist
          </h3>

          <div className="space-y-2">
            {exercises.map((ex, idx) => {
              const active = idx === currentExerciseIdx;
              const setsCompleted = ex.sets.filter((s) => s.completed).length;
              const isFinished = setsCompleted === ex.target_sets;

              return (
                <button
                  key={ex.id}
                  onClick={() => setCurrentExerciseIdx(idx)}
                  className={`w-full text-left p-3.5 rounded-xl border transition flex items-center justify-between ${
                    active
                      ? 'border-orange-500 bg-orange-500/5 text-white'
                      : isFinished
                      ? 'border-green-500/20 bg-green-500/5 text-gray-300'
                      : 'border-gray-850 bg-gray-950 text-gray-400 hover:border-gray-700'
                  }`}
                >
                  <div className="space-y-0.5">
                    <span className="text-xs font-bold block">{ex.name}</span>
                    <span className="text-[10px] text-gray-500 block uppercase font-bold tracking-wide">
                      {ex.primary_muscle}
                    </span>
                  </div>
                  <span className={`text-[10px] font-black px-2 py-0.5 rounded border ${
                    isFinished
                      ? 'bg-green-500/10 text-green-400 border-green-500/20'
                      : setsCompleted > 0
                      ? 'bg-orange-500/10 text-orange-400 border-orange-500/20'
                      : 'bg-gray-900 border-gray-850 text-gray-500'
                  }`}>
                    {setsCompleted}/{ex.target_sets} Sets
                  </span>
                </button>
              );
            })}
          </div>

          <div className="pt-4 border-t border-gray-850">
            <button
              onClick={handleFinishWorkout}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-black text-xs py-3.5 rounded-xl shadow-lg transition flex items-center justify-center space-x-2"
            >
              <span>Finish Workout Session</span>
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
