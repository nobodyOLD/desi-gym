'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { LoadingSkeleton, PlanGenerating } from '@/components/LoadingSpinner';
import { findReplacements, validateWorkoutChange } from '@/lib/customizer';
import {
  Dumbbell,
  Play,
  RotateCcw,
  Video,
  Compass,
  ChevronDown,
  ChevronUp,
  Info,
  Settings2,
  RefreshCw,
  X,
  AlertTriangle,
  CheckCircle2
} from 'lucide-react';

export default function WorkoutPage() {
  const [profile, setProfile] = useState(null);
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [activeWeek, setActiveWeek] = useState('week1');
  const [activeDay, setActiveDay] = useState('monday');
  const [expandedExercises, setExpandedExercises] = useState({});
  const [warmUpOpen, setWarmUpOpen] = useState(false);
  const [coolDownOpen, setCoolDownOpen] = useState(false);
  
  // Customization State
  const [isCustomMode, setIsCustomMode] = useState(false);
  const [replaceModal, setReplaceModal] = useState({ open: false, index: null, exId: null });
  const [candidates, setCandidates] = useState({ recommended: [], others: [] });
  const [candidateLoading, setCandidateLoading] = useState(false);
    const [warningModal, setWarningModal] = useState({ open: false, warnings: [], candidate: null });
  
  // Change Program Modal State
  const [changeProgramModalOpen, setChangeProgramModalOpen] = useState(false);
  const [modalDays, setModalDays] = useState([]);
  const [modalSplit, setModalSplit] = useState('recommended');

  const openChangeProgramModal = () => {
    const meta = profile?.metadata || {};
    setModalDays(meta.available_days || ['monday', 'wednesday', 'friday']);
    setModalSplit(meta.split_preference || 'recommended');
    setChangeProgramModalOpen(true);
  };

  const submitChangeProgram = async () => {
    if (modalDays.length === 0) {
      toast.error('You must select at least one training day.');
      return;
    }
    try {
      const updatedProfile = { 
        ...profile, 
        metadata: { 
          ...profile.metadata, 
          available_days: modalDays, 
          split_preference: modalSplit 
        } 
      };

      const { error } = await supabase.from('profiles').update({
        metadata: updatedProfile.metadata
      }).eq('id', profile.id);
      
      if (error) throw error;
      
      setProfile(updatedProfile);
      setChangeProgramModalOpen(false);
      setGenerating(true);
      
      const response = await fetch('/api/workout-plan', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ profile: updatedProfile }),
      });
      const result = await response.json();
      if (result.success) {
        setPlan(result.plan);
        toast.success('Your workout program has been successfully rebuilt!');
      } else {
        throw new Error(result.error);
      }
    } catch (e) {
      toast.error('Failed to change program settings');
    } finally {
      setGenerating(false);
    }
  };

  const router = useRouter();

  useEffect(() => {
    async function loadWorkoutData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(userProfile);

        if (userProfile) {
          const { data: workoutPlan } = await supabase
            .from('workout_plans')
            .select('*')
            .eq('user_id', session.user.id)
            .eq('is_active', true)
            .maybeSingle();

          if (workoutPlan) {
            setPlan(workoutPlan.plan_data);
          }
        }
      } catch (error) {
        toast.error('Failed to load workout split.');
      } finally {
        setLoading(false);
      }
    }
    loadWorkoutData();
  }, [router]);

  const handleGenerate = async () => {
    if (!profile || !profile.body_type) {
      toast.error('Please complete your onboarding profile details first.');
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

      if (!response.ok) throw new Error('API failed');

      const result = await response.json();
      if (result.success) {
        setPlan(result.plan);
        toast.success('Your workout program has been successfully generated!');
      } else {
        throw new Error(result.error);
      }
    } catch (error) {
      toast.error('Generation failed.');
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

  // ---- CUSTOMIZATION LOGIC ----
  const currentSchedule = plan?.weekly_schedule?.[activeWeek]?.[activeDay] || { type: 'rest', activities: ['Light walk'] };
  const isRestDay = currentSchedule.type === 'rest' || !currentSchedule.exercises;

  const openReplaceModal = async (exIndex, exId) => {
    setReplaceModal({ open: true, index: exIndex, exId });
    setCandidateLoading(true);
    try {
      // Small timeout to allow modal animation before heavy blocking
      await new Promise(r => setTimeout(r, 50));
      const { recommended, others } = findReplacements(exId, profile, currentSchedule.exercises);
      setCandidates({ recommended, others });
    } catch (e) {
      toast.error('Failed to find replacements');
    } finally {
      setCandidateLoading(false);
    }
  };

  const handleSelectCandidate = async (candidateEx) => {
    // Propose the change
    const newExercises = [...currentSchedule.exercises];
    // Copy sets/reps from original exercise to maintain volume structure
    const originalEx = newExercises[replaceModal.index];
    newExercises[replaceModal.index] = {
      id: candidateEx.id,
      name: candidateEx.name,
      sets: originalEx.sets,
      reps: candidateEx.recommended_rep_ranges || originalEx.reps,
      rest: candidateEx.recommended_rest_ranges || originalEx.rest,
      primary_muscle: candidateEx.primary_muscles[0],
      target_effort: originalEx.target_effort,
      todays_target: originalEx.todays_target,
      instructions: candidateEx.instructions?.join(' '),
      movement_patterns: candidateEx.movement_patterns
    };

    try {
      const warnings = validateWorkoutChange(newExercises, currentSchedule.exercises);
      
      if (warnings && warnings.length > 0) {
        // Show warnings first
        setWarningModal({ open: true, warnings: warnings, candidate: candidateEx, newExercises });
        setReplaceModal({ open: false, index: null, exId: null });
      } else {
        // Safe to apply directly
        applyWorkoutChange(newExercises);
      }
    } catch (e) {
      toast.error('Validation failed');
    }
  };

  const applyWorkoutChange = async (newExercises) => {
    const updatedPlan = { ...plan };
    updatedPlan.weekly_schedule[activeWeek][activeDay].exercises = newExercises;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Unauthorized to save workout');
        return;
      }
      
      const { error } = await supabase
        .from('workout_plans')
        .update({ plan_data: updatedPlan })
        .eq('user_id', session.user.id)
        .eq('is_active', true);
        
      if (error) throw error;
      
      setPlan(updatedPlan);
      toast.success('Workout successfully updated!');
    } catch (e) {
      toast.error('Failed to save workout: ' + e.message);
    } finally {
      setReplaceModal({ open: false, index: null, exId: null });
      setWarningModal({ open: false, warnings: [], candidate: null });
    }
  };

  if (loading) return <LoadingSkeleton />;
  if (generating) return <PlanGenerating />;

  if (!plan) {
    return (
      <div className="min-h-[50vh] flex flex-col justify-center items-center text-center space-y-6 max-w-md mx-auto">
        <div className="bg-orange-500/10 p-5 rounded-2xl text-orange-500 border border-orange-500/20">
          <Dumbbell className="h-10 w-10 animate-bounce" />
        </div>
        <div>
          <h2 className="text-2xl font-black text-white">No Workout Program</h2>
          <p className="text-gray-400 text-sm mt-2 leading-relaxed">
            Generate your custom 4-week split. We will use the Desi Gym engine to structure compound sets, intensities, and targets.
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

  const days = [
    { key: 'monday', label: 'Mon' }, { key: 'tuesday', label: 'Tue' }, { key: 'wednesday', label: 'Wed' },
    { key: 'thursday', label: 'Thu' }, { key: 'friday', label: 'Fri' }, { key: 'saturday', label: 'Sat' },
    { key: 'sunday', label: 'Sun' },
  ];

  const weeks = [
    { key: 'week1', label: 'Week 1' }, { key: 'week2', label: 'Week 2' },
    { key: 'week3', label: 'Week 3' }, { key: 'week4', label: 'Week 4' },
  ];

  return (
    <div className="space-y-8 animate-fade-in relative pb-12">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-800 pb-6">
        <div>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">{plan.plan_name}</h1>
          <p className="text-gray-400 text-sm mt-1 leading-relaxed max-w-2xl">{plan.overview}</p>
        </div>
        <div className="flex items-center space-x-3 shrink-0">
          <button
            onClick={() => setIsCustomMode(!isCustomMode)}
            className={`flex items-center text-xs font-bold border rounded-xl px-4 py-3 transition ${
              isCustomMode ? 'bg-orange-500/20 text-orange-400 border-orange-500/50' : 'bg-gray-900 text-gray-400 border-gray-700 hover:text-white'
            }`}
          >
            <Settings2 className="h-4 w-4 mr-2" />
            {isCustomMode ? 'Custom Mode Active' : 'Customize Workout'}
          </button>
          <button
            onClick={openChangeProgramModal}
            className="flex items-center text-xs font-bold text-gray-400 hover:text-white border border-gray-700 hover:border-gray-500 rounded-xl px-4 py-3 bg-gray-900 transition"
          >
            <RotateCcw className="h-4 w-4 mr-2" />
            Change Program
          </button>
        </div>
      </div>

      {/* Tabs */}
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className={`bg-gray-850 border ${isCustomMode ? 'border-orange-500/30' : 'border-gray-700/80'} rounded-2xl p-6 transition-all`}>
            <div className="flex justify-between items-center border-b border-gray-700 pb-4 mb-4">
              <div>
                <span className="text-[10px] text-orange-500 font-black uppercase tracking-wider block">Today's Focus</span>
                <h3 className="text-xl font-bold text-white capitalize flex items-center">
                  {isRestDay ? 'Active Recovery / Rest' : currentSchedule.muscle_group}
                  {currentSchedule.is_custom && <span className="ml-2 text-[10px] bg-orange-500/20 border border-orange-500/30 text-orange-500 px-2 py-0.5 rounded uppercase font-black">CUSTOM</span>}
                </h3>
              </div>
              <Link href={`/dashboard/workout/builder?day=${activeDay}`} className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase transition flex items-center">
                Build Custom Session
              </Link>
            </div>

            {isRestDay ? (
              <div className="text-center py-12 space-y-4">
                <h4 className="text-base font-bold text-white">Let your muscles recover!</h4>
              </div>
            ) : (
              <div className="space-y-4">
                {currentSchedule.exercises.map((ex, index) => {
                  const isExpanded = expandedExercises[index] || false;
                  return (
                    <div key={index} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden relative">
                      <div className="w-full text-left p-4 flex items-center justify-between">
                        <button onClick={() => toggleExerciseExpand(index)} className="flex-1 text-left flex items-center justify-between hover:bg-gray-800/40 p-2 -m-2 rounded-lg transition duration-200">
                          <div className="space-y-1 pr-4">
                            <h4 className="text-base font-bold text-white leading-snug">{ex.name}</h4>
                            <div className="flex items-center space-x-2">
                              <span className="text-[10px] font-black bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
                                {ex.sets} Sets × {ex.reps} Reps
                              </span>
                            </div>
                          </div>
                          <div className="text-gray-400 px-2">
                            {isExpanded ? <ChevronUp className="h-5 w-5" /> : <ChevronDown className="h-5 w-5" />}
                          </div>
                        </button>
                        
                        {isCustomMode && (
                          <div className="ml-4 shrink-0">
                            <button
                              onClick={() => openReplaceModal(index, ex.id)}
                              className="bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600 px-3 py-1.5 rounded-lg text-xs font-bold transition flex items-center"
                            >
                              <RefreshCw className="h-3 w-3 mr-1.5" /> Replace
                            </button>
                          </div>
                        )}
                      </div>

                      {isExpanded && (
                        <div className="p-4 border-t border-gray-800 bg-gray-900/50 space-y-4 text-xs">
                          <div className="space-y-1">
                            <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block">Instructions</span>
                            <p className="text-gray-300 leading-relaxed">{ex.instructions}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-gray-800 border border-gray-700 rounded-2xl p-5 space-y-4">
            <h3 className="text-sm font-bold text-white flex items-center pb-3 border-b border-gray-700/60">
              <Info className="h-4.5 w-4.5 text-orange-500 mr-2" />
              Coach Alex Pro Tips
            </h3>
            <ul className="space-y-3">
              {(plan.pro_tips || ['Focus on form over weight.']).map((tip, idx) => (
                <li key={idx} className="text-xs text-gray-300 leading-relaxed">
                  <strong>Tip {idx + 1}:</strong> {tip}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* REPLACEMENT MODAL */}
      {replaceModal.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
            <div className="p-5 border-b border-gray-800 flex justify-between items-center bg-gray-850">
              <h3 className="text-lg font-black text-white flex items-center">
                <RefreshCw className="h-5 w-5 mr-2 text-orange-500" />
                Select Alternative Exercise
              </h3>
              <button onClick={() => setReplaceModal({ open: false, index: null, exId: null })} className="text-gray-400 hover:text-white bg-gray-800 p-1.5 rounded-lg">
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-5 overflow-y-auto space-y-8">
              {candidateLoading ? (
                <div className="flex justify-center py-12"><LoadingSkeleton /></div>
              ) : (
                <>
                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-orange-500 uppercase tracking-wider">Recommended Substitutions</h4>
                    {candidates.recommended?.length === 0 ? (
                      <p className="text-gray-500 text-sm italic">No direct substitutions found for your equipment profile.</p>
                    ) : (
                      <div className="grid gap-3">
                        {candidates.recommended?.map(cand => (
                          <div key={cand.id} className="bg-gray-800 border border-orange-500/20 rounded-xl p-4 flex justify-between items-center hover:bg-gray-750 transition cursor-pointer" onClick={() => handleSelectCandidate(cand)}>
                            <div>
                              <h5 className="text-sm font-bold text-white">{cand.name}</h5>
                              <p className="text-[10px] text-gray-400 mt-1 capitalize">{cand.equipment} • {cand.movement_patterns[0]?.replace('_', ' ')}</p>
                            </div>
                            <CheckCircle2 className="h-5 w-5 text-gray-600 hover:text-orange-500" />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="space-y-4">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Other Valid Options</h4>
                    <div className="grid gap-3">
                      {candidates.others?.map(cand => (
                        <div key={cand.id} className="bg-gray-800 border border-gray-700 rounded-xl p-4 flex justify-between items-center hover:bg-gray-750 transition cursor-pointer" onClick={() => handleSelectCandidate(cand)}>
                          <div>
                            <h5 className="text-sm font-bold text-white">{cand.name}</h5>
                            <p className="text-[10px] text-gray-400 mt-1 capitalize">{cand.equipment} • {cand.movement_patterns[0]?.replace('_', ' ')}</p>
                          </div>
                          <CheckCircle2 className="h-5 w-5 text-gray-600 hover:text-orange-500" />
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* WARNING MODAL */}
      {warningModal.open && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-gray-900 border border-orange-500/30 rounded-2xl w-full max-w-md shadow-2xl shadow-orange-500/10 overflow-hidden animate-fade-in">
            <div className="p-6 space-y-6">
              <div className="flex items-center space-x-3 text-orange-500">
                <AlertTriangle className="h-8 w-8" />
                <h3 className="text-xl font-black">Smart Coaching Warning</h3>
              </div>
              
              <div className="space-y-4">
                <p className="text-sm text-gray-300">
                  Replacing this exercise with <strong>{warningModal.candidate?.name}</strong> triggered the following architectural warnings:
                </p>
                <ul className="space-y-2">
                  {warningModal.warnings.map((warn, i) => (
                    <li key={i} className="text-xs text-orange-400 bg-orange-500/10 p-3 rounded-lg border border-orange-500/20 flex items-start">
                      <span className="mr-2 mt-0.5">•</span> {warn}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-3 pt-4 border-t border-gray-800">
                <button
                  onClick={() => setWarningModal({ open: false, warnings: [], candidate: null })}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white font-bold py-3 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => applyWorkoutChange(warningModal.newExercises)}
                  className="flex-1 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl transition"
                >
                  Add Anyway
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
