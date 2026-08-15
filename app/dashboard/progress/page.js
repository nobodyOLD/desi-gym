'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import { LoadingSkeleton } from '@/components/LoadingSpinner';
import {
  WeightChart,
  BodyFatChart,
  EnergyChart,
  MeasurementsRadar,
} from '@/components/ProgressChart';
import {
  Calendar,
  Scale,
  Activity,
  Smile,
  Clock,
  Droplet,
  Trash2,
  Save,
  CheckCircle,
  Plus,
  Flame,
  Info,
} from 'lucide-react';

export default function ProgressPage() {
  const [profile, setProfile] = useState(null);
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [dateRange, setDateRange] = useState('all'); // '1w', '1m', '3m', 'all'
  
  // Form States
  const [logDate, setLogDate] = useState('');
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [chest, setChest] = useState('');
  const [waist, setWaist] = useState('');
  const [hips, setHips] = useState('');
  const [bicep, setBicep] = useState('');
  const [energy, setEnergy] = useState(5);
  const [mood, setMood] = useState('😊');
  const [water, setWater] = useState(2.0);
  const [sleep, setSleep] = useState(7.0);
  const [workoutDone, setWorkoutDone] = useState(false);
  const [workoutNotes, setWorkoutNotes] = useState('');

  const router = useRouter();

  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setLogDate(today);
  }, []);

  // Fetch initial profile & logs
  useEffect(() => {
    async function loadData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (!session) {
          router.push('/login');
          return;
        }

        // Profile
        const { data: userProfile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        setProfile(userProfile);

        // Fetch logs (ascending order for charts)
        const { data: progressLogs, error: logError } = await supabase
          .from('progress_logs')
          .select('*')
          .eq('user_id', session.user.id)
          .order('log_date', { ascending: true });

        if (logError) throw logError;
        setLogs(progressLogs || []);
      } catch (error) {
        console.error('Error loading logs:', error);
        toast.error('Failed to load metrics.');
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [router]);

  const handleSave = async (e) => {
    e.preventDefault();
    if (!weight) {
      toast.error('Please input your weight to log progress.');
      return;
    }

    setSaving(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const payload = {
        user_id: session.user.id,
        log_date: logDate,
        weight: parseFloat(weight),
        body_fat_percentage: bodyFat ? parseFloat(bodyFat) : null,
        chest_cm: chest ? parseFloat(chest) : null,
        waist_cm: waist ? parseFloat(waist) : null,
        hips_cm: hips ? parseFloat(hips) : null,
        bicep_cm: bicep ? parseFloat(bicep) : null,
        energy_level: parseInt(energy),
        mood: mood,
        water_intake: parseFloat(water),
        sleep_hours: parseFloat(sleep),
        workout_completed: workoutDone,
        workout_notes: workoutNotes,
      };

      // Upsert: check if there's already a log for this date
      const { data: existingLog } = await supabase
        .from('progress_logs')
        .select('id')
        .eq('user_id', session.user.id)
        .eq('log_date', logDate)
        .maybeSingle();

      let error = null;
      if (existingLog) {
        const { error: updateError } = await supabase
          .from('progress_logs')
          .update({ ...payload, updated_at: new Date() })
          .eq('id', existingLog.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('progress_logs')
          .insert(payload);
        error = insertError;
      }

      if (error) throw error;

      toast.success('Progress parameters saved successfully! 📊');

      // Refresh logs
      const { data: freshLogs } = await supabase
        .from('progress_logs')
        .select('*')
        .eq('user_id', session.user.id)
        .order('log_date', { ascending: true });

      setLogs(freshLogs || []);

      // Clear/Reset temporary inputs (keep weight/bodyFat as last recorded values)
      setWorkoutNotes('');
      setWorkoutDone(false);
    } catch (err) {
      console.error(err);
      toast.error('Failed to save parameters.');
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteLog = async (id) => {
    if (!window.confirm('Delete this progress log entry? This will permanently delete the metrics.')) return;
    try {
      const { error } = await supabase.from('progress_logs').delete().eq('id', id);
      if (error) throw error;
      setLogs((prev) => prev.filter((item) => item.id !== id));
      toast.success('Log entry deleted');
    } catch (e) {
      console.error(e);
      toast.error('Failed to delete log entry.');
    }
  };

  // Filter logs based on active date range selection
  const getFilteredLogs = () => {
    if (dateRange === 'all') return logs;
    const now = new Date();
    let cutoff = new Date();

    if (dateRange === '1w') cutoff.setDate(now.getDate() - 7);
    else if (dateRange === '1m') cutoff.setMonth(now.getMonth() - 1);
    else if (dateRange === '3m') cutoff.setMonth(now.getMonth() - 3);

    return logs.filter((log) => new Date(log.log_date) >= cutoff);
  };

  const filteredLogs = getFilteredLogs();

  // Sort descending for list table
  const sortedTableLogs = [...logs].sort(
    (a, b) => new Date(b.log_date) - new Date(a.log_date)
  );

  // Stats summary calculations
  const totalDaysTracked = logs.length;
  const averageEnergy =
    totalDaysTracked > 0
      ? (logs.reduce((acc, curr) => acc + (curr.energy_level || 0), 0) / totalDaysTracked).toFixed(1)
      : '0';

  const workoutsCompletedCount = logs.filter((l) => l.workout_completed).length;
  const completionRate =
    totalDaysTracked > 0
      ? ((workoutsCompletedCount / totalDaysTracked) * 100).toFixed(0)
      : '0';

  // Streak calculation
  let currentStreak = 0;
  const reversedLogs = [...logs].reverse();
  for (const log of reversedLogs) {
    if (log.workout_completed) {
      currentStreak++;
    } else {
      break;
    }
  }

  // Weight changes calculation
  let weightLost = '0.0';
  let bestWeight = 'N/A';

  if (logs.length > 0) {
    const weightsList = logs.map((l) => l.weight).filter(Boolean);
    if (weightsList.length > 0) {
      bestWeight = Math.min(...weightsList).toFixed(1);
      const initialWeight = weightsList[0];
      const latestWeight = weightsList[weightsList.length - 1];
      weightLost = (initialWeight - latestWeight).toFixed(1);
    }
  }

  const latestLog = logs.length > 0 ? logs[logs.length - 1] : {};

  if (loading) {
    return <LoadingSkeleton />;
  }

  const moods = [
    { emoji: '😴', label: 'Tired' },
    { emoji: '😔', label: 'Sad' },
    { emoji: '😐', label: 'Neutral' },
    { emoji: '😊', label: 'Happy' },
    { emoji: '💪', label: 'Strong' },
    { emoji: '🔥', label: 'Unstoppable' },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Title */}
      <div className="border-b border-gray-800 pb-6">
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">Progress Logs & Analytics</h1>
        <p className="text-gray-400 text-sm mt-1">Log physical measurements, monitor streaks, and chart your gains.</p>
      </div>

      {/* TOP SECTION: Log Form & Radar Comparison */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Progress Logger Form */}
        <div className="lg:col-span-2 bg-gray-850 border border-gray-700/80 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-white flex items-center border-b border-gray-700 pb-4 mb-4">
            <Save className="h-5 w-5 text-orange-500 mr-2" />
            Log Parameters For Today
          </h2>

          <form onSubmit={handleSave} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">Log Date</label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="mt-1.5 w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">Weight (kg)</label>
                <input
                  type="number"
                  step="0.1"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="e.g. 74.5"
                  className="mt-1.5 w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">Body Fat %</label>
                <input
                  type="number"
                  step="0.1"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  placeholder="e.g. 14.2"
                  className="mt-1.5 w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Tape Measurements Collapsible Details */}
            <div className="space-y-2">
              <span className="text-xs font-semibold text-gray-300 block">Tape Measurements (Optional)</span>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-gray-900/40 p-4 rounded-xl border border-gray-800">
                <div>
                  <label className="text-[10px] text-gray-500 font-bold block uppercase">Chest (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={chest}
                    onChange={(e) => setChest(e.target.value)}
                    placeholder="Chest"
                    className="mt-1 w-full bg-gray-950 border border-gray-850 text-white rounded px-2 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-bold block uppercase">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={waist}
                    onChange={(e) => setWaist(e.target.value)}
                    placeholder="Waist"
                    className="mt-1 w-full bg-gray-950 border border-gray-850 text-white rounded px-2 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-bold block uppercase">Hips (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={hips}
                    onChange={(e) => setHips(e.target.value)}
                    placeholder="Hips"
                    className="mt-1 w-full bg-gray-950 border border-gray-850 text-white rounded px-2 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[10px] text-gray-500 font-bold block uppercase">Bicep (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={bicep}
                    onChange={(e) => setBicep(e.target.value)}
                    placeholder="Bicep"
                    className="mt-1 w-full bg-gray-950 border border-gray-850 text-white rounded px-2 py-1.5 text-xs focus:border-orange-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>

            {/* Slider parameters */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">
                  Energy Level: <span className="text-orange-500 font-black">{energy} / 10</span>
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={energy}
                  onChange={(e) => setEnergy(parseInt(e.target.value))}
                  className="w-full mt-3 h-1.5 bg-gray-900 rounded-lg appearance-none cursor-pointer accent-orange-500"
                />
              </div>

              {/* Mood emojis Selection */}
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase mb-2">Mood Indicator</label>
                <div className="flex items-center space-x-1.5 bg-gray-900 p-1.5 rounded-lg border border-gray-700 justify-around">
                  {moods.map((m) => (
                    <button
                      key={m.emoji}
                      type="button"
                      onClick={() => setMood(m.emoji)}
                      className={`text-lg p-1.5 rounded transition ${
                        mood === m.emoji ? 'bg-orange-500/20 border border-orange-500/40' : 'opacity-60 hover:opacity-100'
                      }`}
                      title={m.label}
                    >
                      {m.emoji}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Water and Sleep */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">Water Intake (L)</label>
                <input
                  type="number"
                  step="0.25"
                  value={water}
                  onChange={(e) => setWater(parseFloat(e.target.value))}
                  className="mt-1.5 w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-400 uppercase">Sleep Hours</label>
                <input
                  type="number"
                  step="0.5"
                  value={sleep}
                  onChange={(e) => setSleep(parseFloat(e.target.value))}
                  className="mt-1.5 w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-xs focus:border-orange-500 focus:outline-none"
                />
              </div>
            </div>

            {/* Checkbox completed */}
            <div className="flex items-start">
              <input
                id="workoutDone"
                type="checkbox"
                checked={workoutDone}
                onChange={(e) => setWorkoutDone(e.target.checked)}
                className="mt-1 h-4.5 w-4.5 bg-gray-900 border-gray-700 text-orange-500 focus:ring-orange-500 rounded cursor-pointer"
              />
              <label htmlFor="workoutDone" className="ml-2 block text-xs text-gray-400 font-bold select-none cursor-pointer leading-tight">
                Workout completed today <br />
                <span className="text-[10px] text-gray-500 font-normal">Check this if you finished your scheduled split.</span>
              </label>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-400 uppercase">Workout/Exercise Notes</label>
              <textarea
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                placeholder="Log sets reached, form details, soreness..."
                rows={2}
                className="mt-1.5 w-full bg-gray-900 border border-gray-700 text-white rounded-lg px-3 py-2 text-xs focus:border-orange-500 focus:outline-none resize-none"
              />
            </div>

            <button
              type="submit"
              disabled={saving}
              className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 text-white font-bold py-3 px-4 rounded-lg transition-all text-xs"
            >
              {saving ? 'Saving metrics parameters...' : 'Save Today\'s Entry 📊'}
            </button>
          </form>
        </div>

        {/* Measurements Radar Panel (Right side) */}
        <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-bold text-white mb-2">Body Measurements Radar</h3>
            <p className="text-gray-400 text-xs leading-normal">
              Visualizes chest, waist, hips, and bicep balance. Log measurements regularly to compile a radar grid.
            </p>
          </div>
          <MeasurementsRadar data={latestLog} />
        </div>
      </div>

      {/* STATS SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
          <span className="text-[10px] text-gray-400 font-semibold block uppercase">Weight Change</span>
          <span className={`text-lg font-black block mt-1 ${parseFloat(weightLost) > 0 ? 'text-green-500' : parseFloat(weightLost) < 0 ? 'text-orange-500' : 'text-gray-300'}`}>
            {parseFloat(weightLost) > 0 ? `-${weightLost}` : parseFloat(weightLost) < 0 ? `+${Math.abs(weightLost)}` : '0.0'} kg
          </span>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
          <span className="text-[10px] text-gray-400 font-semibold block uppercase">Days Tracked</span>
          <span className="text-lg font-black text-white block mt-1">{totalDaysTracked}</span>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
          <span className="text-[10px] text-gray-400 font-semibold block uppercase">Avg Energy</span>
          <span className="text-lg font-black text-white block mt-1">{averageEnergy} /10</span>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
          <span className="text-[10px] text-gray-400 font-semibold block uppercase">Done Rate %</span>
          <span className="text-lg font-black text-white block mt-1">{completionRate}%</span>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
          <span className="text-[10px] text-gray-400 font-semibold block uppercase">Streak Days</span>
          <span className="text-lg font-black text-orange-500 block mt-1 flex items-center justify-center">
            <Flame className="h-4 w-4 mr-1 text-orange-500 fill-orange-500" />
            {currentStreak}
          </span>
        </div>
        <div className="bg-gray-800 border border-gray-700 rounded-xl p-4 text-center">
          <span className="text-[10px] text-gray-400 font-semibold block uppercase">Best Weight</span>
          <span className="text-lg font-black text-white block mt-1">{bestWeight} kg</span>
        </div>
      </div>

      {/* CHARTS GRAPH SECTION */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 space-y-6">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-gray-700/60">
          <h2 className="text-lg font-bold text-white flex items-center">
            <Activity className="h-5 w-5 text-orange-500 mr-2" />
            Analytical Fitness Metrics
          </h2>

          {/* Date range filter chips */}
          <div className="flex space-x-1.5 bg-gray-900 border border-gray-755 p-1 rounded-lg">
            {[
              { id: '1w', label: '1 Wk' },
              { id: '1m', label: '1 Mo' },
              { id: '3m', label: '3 Mo' },
              { id: 'all', label: 'All Time' },
            ].map((chip) => (
              <button
                key={chip.id}
                onClick={() => setDateRange(chip.id)}
                className={`px-3 py-1 text-[10px] font-bold rounded-md transition ${
                  dateRange === chip.id ? 'bg-orange-500 text-white shadow' : 'text-gray-400 hover:text-white'
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Charts list mapping */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="bg-gray-900/40 border border-gray-700/40 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-black text-gray-300 uppercase">Weight Progression Trend (kg)</h4>
            <WeightChart data={filteredLogs} />
          </div>

          <div className="bg-gray-900/40 border border-gray-700/40 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-black text-gray-300 uppercase">Body Fat Percentage (%)</h4>
            <BodyFatChart data={filteredLogs} />
          </div>

          <div className="bg-gray-900/40 border border-gray-700/40 rounded-xl p-4 space-y-2">
            <h4 className="text-xs font-black text-gray-300 uppercase">Daily Energy Levels (/10)</h4>
            <EnergyChart data={filteredLogs} />
          </div>
        </div>
      </div>

      {/* HISTORICAL LOG DATA TABLE */}
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 overflow-hidden">
        <h2 className="text-lg font-bold text-white mb-4">Historical Parameter Entries</h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-gray-700/80 text-gray-400">
                <th className="py-3 px-4 font-semibold uppercase">Date</th>
                <th className="py-3 px-4 font-semibold uppercase">Weight (kg)</th>
                <th className="py-3 px-4 font-semibold uppercase">Body Fat (%)</th>
                <th className="py-3 px-4 font-semibold uppercase">Energy / Mood</th>
                <th className="py-3 px-4 font-semibold uppercase">Water / Sleep</th>
                <th className="py-3 px-4 font-semibold uppercase">Workout Done</th>
                <th className="py-3 px-4 font-semibold uppercase">Notes</th>
                <th className="py-3 px-4 font-semibold text-center uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700/40">
              {sortedTableLogs.slice(0, 10).map((log) => (
                <tr key={log.id} className="hover:bg-gray-750/30 text-gray-300">
                  <td className="py-3 px-4 font-bold text-white">
                    {new Date(log.log_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                  </td>
                  <td className="py-3 px-4 font-bold text-white">{log.weight} kg</td>
                  <td className="py-3 px-4">{log.body_fat_percentage ? `${log.body_fat_percentage}%` : 'N/A'}</td>
                  <td className="py-3 px-4 font-medium">
                    {log.energy_level}/10 | {log.mood || '😐'}
                  </td>
                  <td className="py-3 px-4">
                    {log.water_intake ? `${log.water_intake} L` : 'N/A'} | {log.sleep_hours ? `${log.sleep_hours} hrs` : 'N/A'}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`inline-flex px-2 py-0.5 rounded text-[10px] font-bold ${log.workout_completed ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-gray-700 text-gray-400'}`}>
                      {log.workout_completed ? 'Yes ✓' : 'No'}
                    </span>
                  </td>
                  <td className="py-3 px-4 max-w-[200px] truncate" title={log.workout_notes}>
                    {log.workout_notes || '-'}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <button
                      onClick={() => handleDeleteLog(log.id)}
                      className="p-1 hover:bg-red-500/10 border border-transparent hover:border-red-500/25 rounded text-gray-500 hover:text-red-500 transition"
                      title="Delete log"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </td>
                </tr>
              ))}
              {sortedTableLogs.length === 0 && (
                <tr>
                  <td colSpan="8" className="py-8 text-center text-gray-500">
                    No entries logged yet. Input parameters above to record metrics history.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
