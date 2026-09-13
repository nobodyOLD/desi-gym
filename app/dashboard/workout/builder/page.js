'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { analyzeWorkout } from '@/lib/workoutAnalyzer';
import { 
  ArrowLeft, Plus, Save, ChevronUp, ChevronDown, 
  Trash2, Search, Filter, AlertTriangle, ShieldCheck, Activity 
} from 'lucide-react';
import Link from 'next/link';

export default function WorkoutBuilder() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const assignToDay = searchParams.get('day'); // e.g. "monday"

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const [workoutName, setWorkoutName] = useState('My Custom Workout');
  const [workoutType, setWorkoutType] = useState('custom');
  const [exercises, setExercises] = useState([]);
  
  // Library Modal State
  const [libraryOpen, setLibraryOpen] = useState(false);
  const [libraryData, setLibraryData] = useState([]);
  const [libraryLoading, setLibraryLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [muscleFilter, setMuscleFilter] = useState('All');
  
  useEffect(() => {
    async function loadData() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return router.push('/login');
      
      const { data: userProfile } = await supabase
        .from('profiles').select('*').eq('id', session.user.id).single();
      
      setProfile(userProfile);

      if (assignToDay) {
        const { data: wpData } = await supabase
          .from('workout_plans')
          .select('plan_data')
          .eq('user_id', userProfile.id)
          .eq('is_active', true)
          .maybeSingle();
          
        if (wpData && wpData.plan_data?.weekly_schedule?.week1?.[assignToDay]) {
          const dayData = wpData.plan_data.weekly_schedule.week1[assignToDay];
          if (dayData.exercises && dayData.exercises.length > 0) {
            setExercises(dayData.exercises);
            if (dayData.muscle_group) {
              setWorkoutType(dayData.muscle_group.toLowerCase());
            }
          }
        }
      }

      setLoading(false);
    }
    loadData();
  }, [router, assignToDay]);

  const fetchLibrary = async () => {
    setLibraryOpen(true);
    if (libraryData.length > 0) return;
    setLibraryLoading(true);
    try {
      const res = await fetch('/api/exercises');
      const data = await res.json();
      if (data.success) {
        setLibraryData(data.exercises);
      }
    } catch (e) {
      toast.error('Failed to load library');
    } finally {
      setLibraryLoading(false);
    }
  };

  const addExercise = (ex) => {
    const newEx = {
      id: ex.id,
      name: ex.name,
      primary_muscle: ex.primary_muscles[0],
      movement_patterns: ex.movement_patterns,
      compound_or_isolation: ex.compound_or_isolation,
      sets: '3',
      reps: '8-12',
      rest: '90s',
      target_effort: '1-2 RIR'
    };
    setExercises([...exercises, newEx]);
    toast.success(`Added ${ex.name}`);
    setLibraryOpen(false);
  };

  const removeExercise = (index) => {
    const updated = [...exercises];
    updated.splice(index, 1);
    setExercises(updated);
  };

  const moveExercise = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === exercises.length - 1) return;
    
    const updated = [...exercises];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = updated[index];
    updated[index] = updated[swapIndex];
    updated[swapIndex] = temp;
    setExercises(updated);
  };

  const updateExerciseParam = (index, field, value) => {
    const updated = [...exercises];
    updated[index][field] = value;
    setExercises(updated);
  };

  const handleSave = async () => {
    if (exercises.length === 0) return toast.error('Add at least one exercise');
    
    try {
      let customWorkouts = profile.metadata?.custom_workouts || [];
      const newCustomWorkout = {
        id: Date.now().toString(),
        name: workoutName,
        type: workoutType,
        exercises
      };
      
      customWorkouts.push(newCustomWorkout);
      
      const { error } = await supabase.from('profiles').update({
        metadata: { ...profile.metadata, custom_workouts: customWorkouts }
      }).eq('id', profile.id);
      
      if (error) throw error;
      toast.success('Workout saved to templates!');
      
      if (assignToDay) {
        // Need to load the main workout_plan and update the specific day
        const { data: wpData } = await supabase.from('workout_plans').select('*').eq('user_id', profile.id).eq('is_active', true).maybeSingle();
        if (wpData) {
          const updatedPlanData = { ...wpData.plan_data };
          if (updatedPlanData.weekly_schedule.week1[assignToDay]) {
             updatedPlanData.weekly_schedule.week1[assignToDay] = {
               muscle_group: workoutType.toUpperCase(),
               exercises: exercises,
               is_custom: true
             };
             // Clone to other weeks for simplicity in this MVP
             ['week2', 'week3', 'week4'].forEach(wk => {
               if (updatedPlanData.weekly_schedule[wk]) {
                 updatedPlanData.weekly_schedule[wk][assignToDay] = updatedPlanData.weekly_schedule.week1[assignToDay];
               }
             });
             
             await supabase.from('workout_plans').update({ plan_data: updatedPlanData }).eq('id', wpData.id);
             toast.success(`Assigned to ${assignToDay} in active program!`);
             router.push('/dashboard/workout');
             return;
          }
        }
      }

    } catch (e) {
      toast.error('Failed to save workout');
    }
  };

  const analysis = analyzeWorkout(exercises);

  const filteredLibrary = libraryData.filter(ex => {
    if (muscleFilter !== 'All') {
      const f = muscleFilter.toLowerCase();
      const match = ex.primary_muscles.some(m => 
        m.includes(f) || (f === 'shoulders' && m.includes('delts'))
      );
      if (!match) return false;
    }
    if (searchQuery && !ex.name.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    return true;
  });

  if (loading) return <div className="p-10 text-center text-white">Loading Builder...</div>;

  return (
    <div className="space-y-6 animate-fade-in pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-4">
        <div className="flex items-center space-x-4">
          <Link href="/dashboard/workout" className="text-gray-400 hover:text-white bg-gray-900 p-2 rounded-lg">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <input 
              type="text" 
              value={workoutName}
              onChange={(e) => setWorkoutName(e.target.value)}
              className="text-2xl sm:text-3xl font-black bg-transparent text-white focus:outline-none border-b border-transparent focus:border-orange-500 transition"
            />
          </div>
        </div>
        <button onClick={handleSave} className="flex items-center justify-center bg-orange-500 hover:bg-orange-600 text-white font-bold py-2.5 px-6 rounded-xl transition">
          <Save className="h-4 w-4 mr-2" />
          Save Workout
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Col: Builder */}
        <div className="lg:col-span-2 space-y-4">
          
          <div className="flex space-x-2 overflow-x-auto pb-2 scrollbar-hide">
            {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(t => (
              <button 
                key={t}
                onClick={() => setWorkoutType(t.toLowerCase())}
                className={`whitespace-nowrap px-4 py-2 rounded-lg text-xs font-bold transition ${workoutType === t.toLowerCase() ? 'bg-gray-800 text-white' : 'bg-gray-950 text-gray-500 hover:bg-gray-900'}`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="space-y-4 min-h-[400px]">
            {exercises.map((ex, i) => (
              <div key={i} className="bg-gray-950 border border-gray-800 rounded-xl p-4 flex flex-col md:flex-row gap-4 relative group">
                <div className="flex flex-row md:flex-col justify-between md:justify-center items-center gap-2 border-b md:border-b-0 md:border-r border-gray-850 pb-3 md:pb-0 md:pr-4">
                  <button onClick={() => moveExercise(i, 'up')} className="text-gray-500 hover:text-white bg-gray-900 p-1 rounded"><ChevronUp className="h-4 w-4" /></button>
                  <span className="text-xs font-black text-gray-400">#{i + 1}</span>
                  <button onClick={() => moveExercise(i, 'down')} className="text-gray-500 hover:text-white bg-gray-900 p-1 rounded"><ChevronDown className="h-4 w-4" /></button>
                </div>
                
                <div className="flex-1 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="text-sm font-bold text-white">{ex.name}</h4>
                      <p className="text-xs text-gray-400 capitalize">{ex.primary_muscle}</p>
                    </div>
                    <button onClick={() => removeExercise(i)} className="text-red-500/50 hover:text-red-500 p-1 transition"><Trash2 className="h-4 w-4"/></button>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">Sets</label>
                      <input value={ex.sets} onChange={(e) => updateExerciseParam(i, 'sets', e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-white rounded p-1.5 text-xs focus:outline-none focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">Reps</label>
                      <input value={ex.reps} onChange={(e) => updateExerciseParam(i, 'reps', e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-white rounded p-1.5 text-xs focus:outline-none focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">Rest</label>
                      <input value={ex.rest} onChange={(e) => updateExerciseParam(i, 'rest', e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-white rounded p-1.5 text-xs focus:outline-none focus:border-orange-500" />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase font-bold text-gray-500">Effort</label>
                      <input value={ex.target_effort} onChange={(e) => updateExerciseParam(i, 'target_effort', e.target.value)} className="w-full bg-gray-900 border border-gray-800 text-white rounded p-1.5 text-xs focus:outline-none focus:border-orange-500" />
                    </div>
                  </div>
                </div>
              </div>
            ))}

            <button onClick={fetchLibrary} className="w-full py-4 border-2 border-dashed border-gray-800 hover:border-orange-500/50 rounded-xl text-gray-500 hover:text-orange-500 font-bold text-sm flex items-center justify-center transition">
              <Plus className="h-5 w-5 mr-2" />
              ADD EXERCISE
            </button>
          </div>
        </div>

        {/* Right Col: AI Analysis */}
        <div className="lg:col-span-1">
          <div className="bg-gray-950 border border-gray-850 rounded-2xl p-5 sticky top-24 space-y-6">
            <div className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-orange-500" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Desi Gym Analysis</h3>
            </div>

            {analysis.empty ? (
              <p className="text-xs text-gray-500 leading-relaxed">Add exercises to see a real-time scientific evaluation of your custom session.</p>
            ) : (
              <>
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold">Session Score</span>
                    <span className={`px-2 py-1 rounded font-black ${analysis.score === 'GOOD' ? 'bg-green-500/10 text-green-400' : analysis.score === 'HIGH REDUNDANCY' ? 'bg-red-500/10 text-red-400' : 'bg-amber-500/10 text-amber-400'}`}>
                      {analysis.score}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold">Est. Duration</span>
                    <span className="text-white font-medium">~{analysis.estimatedDurationMinutes} mins</span>
                  </div>
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-400 font-bold">Total Sets</span>
                    <span className="text-white font-medium">{analysis.totalSets}</span>
                  </div>
                </div>

                <div className="border-t border-gray-850 pt-4 space-y-2">
                  <h4 className="text-xs font-bold text-gray-500 uppercase">Muscle Volume</h4>
                  {analysis.coverage.map((c, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs">
                      <span className="capitalize text-gray-300">{c.muscle}</span>
                      <span className={`${c.level === 'High' ? 'text-green-400' : c.level === 'Moderate' ? 'text-orange-400' : 'text-gray-500'}`}>{c.level} ({c.sets}s)</span>
                    </div>
                  ))}
                </div>

                {analysis.warnings.length > 0 && (
                  <div className="border-t border-gray-850 pt-4 space-y-2">
                    <h4 className="text-xs font-bold text-red-400 flex items-center uppercase"><AlertTriangle className="h-3 w-3 mr-1" /> Warnings</h4>
                    <ul className="space-y-2">
                      {analysis.warnings.map((w, idx) => <li key={idx} className="text-[10px] text-gray-400 leading-relaxed">• {w}</li>)}
                    </ul>
                  </div>
                )}

                {analysis.recommendations.length > 0 && (
                  <div className="border-t border-gray-850 pt-4 space-y-2">
                    <h4 className="text-xs font-bold text-green-400 flex items-center uppercase"><ShieldCheck className="h-3 w-3 mr-1" /> Coach Advice</h4>
                    <ul className="space-y-2">
                      {analysis.recommendations.map((r, idx) => <li key={idx} className="text-[10px] text-gray-400 leading-relaxed">• {r}</li>)}
                    </ul>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Library Modal */}
      {libraryOpen && (
        <div className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[100] flex items-center justify-center p-2 sm:p-4">
          <div className="bg-gray-950 border border-gray-800 rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl">
            <div className="p-4 border-b border-gray-850 flex justify-between items-center">
              <h3 className="text-lg font-black text-white">Exercise Library</h3>
              <button onClick={() => setLibraryOpen(false)} className="text-gray-400 hover:text-white"><ArrowLeft className="h-6 w-6" /></button>
            </div>
            
            <div className="p-4 border-b border-gray-850 flex flex-col sm:flex-row gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-500" />
                <input 
                  type="text" 
                  placeholder="Search exercises..." 
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-gray-900 border border-gray-800 text-white rounded-xl pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-orange-500"
                />
              </div>
              <select 
                value={muscleFilter}
                onChange={e => setMuscleFilter(e.target.value)}
                className="bg-gray-900 border border-gray-800 text-white rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-orange-500"
              >
                {['All', 'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Quads', 'Hamstrings', 'Glutes', 'Calves', 'Core'].map(m => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-2">
              {libraryLoading ? (
                <div className="text-center text-gray-500 py-10">Loading library...</div>
              ) : (
                filteredLibrary.map(ex => (
                  <div key={ex.id} className="flex justify-between items-center bg-gray-900 border border-gray-850 p-3 rounded-xl hover:border-gray-700 transition">
                    <div>
                      <h4 className="text-sm font-bold text-white">{ex.name}</h4>
                      <div className="flex gap-2 mt-1">
                        <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded capitalize">{ex.primary_muscles[0]}</span>
                        <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded capitalize">{ex.equipment}</span>
                      </div>
                    </div>
                    <button onClick={() => addExercise(ex)} className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-1.5 rounded-lg text-xs font-bold transition">
                      Add
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
