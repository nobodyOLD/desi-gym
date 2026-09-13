'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Search, Heart, Ban, Info, Video, Loader2 } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ExerciseLibraryPage() {
  const [exercises, setExercises] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeMuscle, setActiveMuscle] = useState('all');
  const [preferences, setPreferences] = useState({ favorites: [], excluded: [] });
  const [expandedId, setExpandedId] = useState(null);

  const muscles = [
    { id: 'all', label: 'All Muscles' },
    { id: 'chest', label: 'Chest' },
    { id: 'back', label: 'Back' },
    { id: 'shoulders', label: 'Shoulders' },
    { id: 'biceps', label: 'Biceps' },
    { id: 'triceps', label: 'Triceps' },
    { id: 'quads', label: 'Quads' },
    { id: 'hamstrings', label: 'Hamstrings' },
    { id: 'glutes', label: 'Glutes' },
    { id: 'calves', label: 'Calves' },
    { id: 'core', label: 'Core' },
  ];

  useEffect(() => {
    fetchExercises();
    fetchPreferences();
  }, [search, activeMuscle]);

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (activeMuscle !== 'all') params.append('muscle', activeMuscle);
      
      const res = await fetch(`/api/exercises?${params.toString()}`);
      const data = await res.json();
      if (data.success) {
        setExercises(data.exercises);
      }
    } catch (e) {
      toast.error('Failed to load exercises');
    } finally {
      setLoading(false);
    }
  };

  const fetchPreferences = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;
      const { data: profile } = await supabase
        .from('profiles')
        .select('exercise_preferences')
        .eq('id', session.user.id)
        .single();
      
      if (profile?.exercise_preferences) {
        setPreferences(profile.exercise_preferences);
      }
    } catch (e) {
      console.error(e);
    }
  };

  const togglePreference = async (exerciseId, action) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        toast.error('Unauthorized');
        return;
      }
      
      let prefs = { ...preferences };
      if (!Array.isArray(prefs.favorites)) prefs.favorites = [];
      if (!Array.isArray(prefs.excluded)) prefs.excluded = [];

      if (action === 'toggle_favorite') {
        if (prefs.favorites.includes(exerciseId)) {
          prefs.favorites = prefs.favorites.filter(id => id !== exerciseId);
        } else {
          prefs.favorites.push(exerciseId);
          prefs.excluded = prefs.excluded.filter(id => id !== exerciseId);
        }
      } else if (action === 'toggle_exclude') {
        if (prefs.excluded.includes(exerciseId)) {
          prefs.excluded = prefs.excluded.filter(id => id !== exerciseId);
        } else {
          prefs.excluded.push(exerciseId);
          prefs.favorites = prefs.favorites.filter(id => id !== exerciseId);
        }
      }

      const { error } = await supabase
        .from('profiles')
        .update({ exercise_preferences: prefs })
        .eq('id', session.user.id);
        
      if (error) throw error;
      
      setPreferences(prefs);
      toast.success('Updated preferences');
    } catch (e) {
      toast.error('Failed to update preference: ' + e.message);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in pb-12">
      <div>
        <h1 className="text-3xl font-black text-white">Exercise Library</h1>
        <p className="text-gray-400 text-sm mt-1">Browse, favorite, and exclude exercises from the Desi Gym Master Database.</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        {/* Search Bar */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-500" />
          </div>
          <input
            type="text"
            className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-xl leading-5 bg-gray-900 text-gray-300 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500 sm:text-sm transition-all"
            placeholder="Search exercises by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* Muscle Navigation */}
      <div className="flex overflow-x-auto pb-2 -mx-2 px-2 scrollbar-hide space-x-2">
        {muscles.map(m => (
          <button
            key={m.id}
            onClick={() => setActiveMuscle(m.id)}
            className={`whitespace-nowrap px-4 py-2 rounded-lg text-sm font-bold transition-all ${
              activeMuscle === m.id 
                ? 'bg-orange-500 text-white shadow' 
                : 'bg-gray-800 text-gray-400 hover:bg-gray-700 hover:text-white border border-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Exercise Grid */}
      {loading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exercises.length === 0 ? (
            <div className="col-span-full text-center py-12 text-gray-500">
              No exercises found matching your criteria.
            </div>
          ) : (
            exercises.map((ex) => {
              const isFav = preferences.favorites?.includes(ex.id);
              const isExcluded = preferences.excluded?.includes(ex.id);
              const isExpanded = expandedId === ex.id;

              return (
                <div key={ex.id} className={`bg-gray-800 border ${isExcluded ? 'border-red-900/50 opacity-75' : isFav ? 'border-orange-500/50' : 'border-gray-700'} rounded-2xl overflow-hidden transition-all duration-200`}>
                  <div className="p-5 space-y-4">
                    <div className="flex justify-between items-start">
                      <h3 className="text-lg font-bold text-white pr-4">{ex.name}</h3>
                      <div className="flex space-x-2 shrink-0">
                        <button 
                          onClick={() => togglePreference(ex.id, 'toggle_favorite')}
                          className={`p-1.5 rounded-lg transition-colors ${isFav ? 'bg-orange-500/20 text-orange-500' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
                          title="Favorite this exercise"
                        >
                          <Heart className={`h-4 w-4 ${isFav ? 'fill-current' : ''}`} />
                        </button>
                        <button 
                          onClick={() => togglePreference(ex.id, 'toggle_exclude')}
                          className={`p-1.5 rounded-lg transition-colors ${isExcluded ? 'bg-red-500/20 text-red-500' : 'bg-gray-700 text-gray-400 hover:text-white'}`}
                          title="Never include in generated plans"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Primary</span>
                        <span className="text-xs text-gray-300 capitalize">{ex.primary_muscles.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Equipment</span>
                        <span className="text-xs text-gray-300">{ex.equipment}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Pattern</span>
                        <span className="text-xs text-gray-300 capitalize">{ex.movement_patterns[0]?.replace('_', ' ')}</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-gray-500 font-bold uppercase block">Type</span>
                        <span className="text-xs text-orange-400 font-semibold">{ex.category?.replace('_', ' ')}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => setExpandedId(isExpanded ? null : ex.id)}
                      className="w-full text-center py-2 bg-gray-900 hover:bg-gray-700 text-xs font-bold text-gray-400 hover:text-white rounded-xl transition"
                    >
                      {isExpanded ? 'Hide Details' : 'View Details'}
                    </button>
                  </div>

                  {isExpanded && (
                    <div className="p-5 border-t border-gray-700 bg-gray-900/50 space-y-4">
                      <div className="space-y-2">
                        <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider block flex items-center">
                          <Info className="h-3 w-3 mr-1" /> Instructions
                        </span>
                        <ul className="text-xs text-gray-400 space-y-1 list-disc pl-4">
                          {ex.instructions?.map((inst, i) => (
                            <li key={i}>{inst}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-2">
                        <a
                          href={`https://www.youtube.com/results?search_query=${encodeURIComponent(ex.video_search_term || ex.name + ' exercise form')}`}
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
            })
          )}
        </div>
      )}
    </div>
  );
}
