'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Award,
  Clock,
  Dumbbell,
  TrendingUp,
  Flame,
  ArrowRight,
  Home,
  CheckCircle2
} from 'lucide-react';

export default function WorkoutCompletePage() {
  const router = useRouter();
  const [stats, setStats] = useState({
    duration: 45,
    volume: 1200,
    exercisesCount: 4,
    setsCount: 12,
    day: 'monday'
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const data = sessionStorage.getItem('desigym_completion_data');
      if (data) {
        setStats(JSON.parse(data));
      }
    }
  }, []);

  return (
    <div className="min-h-[80vh] flex flex-col justify-center items-center py-12 px-4 sm:px-6 lg:px-8 animate-fade-in">
      <div className="max-w-md w-full bg-gray-900 border border-gray-800 rounded-3xl p-8 text-center space-y-8 shadow-2xl relative overflow-hidden">
        
        {/* Glow Background effect */}
        <div className="absolute -top-24 -left-24 h-48 w-48 bg-orange-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 h-48 w-48 bg-green-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Success Icon */}
        <div className="relative">
          <div className="mx-auto h-20 w-20 bg-green-500/10 border border-green-500/30 text-green-500 rounded-full flex items-center justify-center animate-bounce" style={{ animationDuration: '3s' }}>
            <CheckCircle2 className="h-10 w-10" />
          </div>
          <span className="absolute top-[60px] right-[130px] flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-green-500"></span>
          </span>
        </div>

        {/* Title */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black text-white tracking-tight">Workout Complete!</h1>
          <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider">
            You crushed your {stats.day.toUpperCase()} split today!
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-4">
          {/* Duration */}
          <div className="bg-gray-950 border border-gray-850 p-4 rounded-2xl text-center space-y-1">
            <Clock className="h-5 w-5 text-orange-500 mx-auto mb-1" />
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Duration</span>
            <span className="text-sm font-black text-white block">{stats.duration} mins</span>
          </div>

          {/* Volume */}
          <div className="bg-gray-950 border border-gray-850 p-4 rounded-2xl text-center space-y-1">
            <TrendingUp className="h-5 w-5 text-blue-500 mx-auto mb-1" />
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Total Volume</span>
            <span className="text-sm font-black text-white block">{stats.volume.toLocaleString()} kg</span>
          </div>

          {/* Exercises */}
          <div className="bg-gray-950 border border-gray-850 p-4 rounded-2xl text-center space-y-1">
            <Dumbbell className="h-5 w-5 text-purple-500 mx-auto mb-1" />
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Exercises</span>
            <span className="text-sm font-black text-white block">{stats.exercisesCount} moves</span>
          </div>

          {/* Sets */}
          <div className="bg-gray-950 border border-gray-850 p-4 rounded-2xl text-center space-y-1">
            <Award className="h-5 w-5 text-green-500 mx-auto mb-1" />
            <span className="text-[10px] text-gray-500 font-bold uppercase block">Sets Logged</span>
            <span className="text-sm font-black text-white block">{stats.setsCount} sets</span>
          </div>
        </div>

        {/* Achievement message */}
        <div className="bg-orange-500/5 border border-orange-500/20 rounded-xl p-4 flex items-center space-x-3 text-left">
          <Flame className="h-5 w-5 text-orange-500 shrink-0" />
          <p className="text-xs text-gray-300 font-medium leading-relaxed">
            Your workout sets have been loaded into the **Progression Engine**. Next time you train this day, we'll adapt your weight targets based on today's reps!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 pt-2">
          <Link
            href="/dashboard/progress"
            className="w-full bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-6 rounded-xl text-center shadow-lg shadow-orange-500/20 transform hover:-translate-y-0.5 transition flex items-center justify-center space-x-2 text-sm"
          >
            <span>View Progress Logs</span>
            <ArrowRight className="h-4.5 w-4.5" />
          </Link>

          <Link
            href="/dashboard"
            className="w-full border border-gray-800 hover:border-gray-700 text-white font-bold py-3.5 rounded-xl text-center hover:bg-gray-950 transition flex items-center justify-center space-x-2 text-xs"
          >
            <Home className="h-4 w-4" />
            <span>Back to Dashboard</span>
          </Link>
        </div>

      </div>
    </div>
  );
}
