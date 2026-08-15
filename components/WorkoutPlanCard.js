'use client';

import { Dumbbell, Calendar, Flame, AlertCircle } from 'lucide-react';
import Link from 'next/link';

export default function WorkoutPlanCard({ plan }) {
  if (!plan) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center space-y-4">
        <div className="mx-auto bg-orange-500/10 h-12 w-12 rounded-xl flex items-center justify-center text-orange-500 border border-orange-500/20">
          <Dumbbell className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">No Active Workout Plan</h3>
          <p className="text-gray-400 text-sm mt-1">Complete your profile to generate a customized 4-week split.</p>
        </div>
        <Link
          href="/dashboard/profile"
          className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all duration-200"
        >
          Setup Profile & Generate
        </Link>
      </div>
    );
  }

  const { plan_name, overview, duration_weeks = 4, difficulty = 'Intermediate' } = plan;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:shadow-xl hover:shadow-black/30 transition-all duration-200 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="bg-orange-500/10 p-3 rounded-xl text-orange-500 border border-orange-500/20">
            <Dumbbell className="h-6 w-6" />
          </div>
          <div className="flex space-x-2">
            <span className="inline-flex items-center text-xs bg-gray-700 text-gray-300 font-semibold px-2.5 py-1 rounded-lg">
              <Calendar className="h-3 w-3 mr-1 text-orange-500" />
              {duration_weeks} Weeks
            </span>
            <span className="inline-flex items-center text-xs bg-orange-500/10 text-orange-400 font-semibold px-2.5 py-1 rounded-lg border border-orange-500/20 capitalize">
              <Flame className="h-3 w-3 mr-1" />
              {difficulty}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-2">
          <h3 className="text-xl font-black tracking-wide text-white">{plan_name || 'Personalized Split'}</h3>
          <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed">
            {overview || 'A custom training plan developed specifically to match your physical parameters, target muscle groups, and fitness level.'}
          </p>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-700/60 mt-6">
        <Link
          href="/dashboard/workout"
          className="w-full text-center inline-block bg-gray-700 hover:bg-orange-500 hover:text-white text-gray-200 font-bold text-sm py-3 px-4 rounded-xl transition-all duration-200"
        >
          View Full Schedule Split →
        </Link>
      </div>
    </div>
  );
}
