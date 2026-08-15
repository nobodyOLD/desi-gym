'use client';

import { Apple, Flame, ChevronRight, Activity } from 'lucide-react';
import Link from 'next/link';

export default function NutritionPlanCard({ plan }) {
  if (!plan) {
    return (
      <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 text-center space-y-4">
        <div className="mx-auto bg-green-500/10 h-12 w-12 rounded-xl flex items-center justify-center text-green-500 border border-green-500/20">
          <Apple className="h-6 w-6" />
        </div>
        <div>
          <h3 className="text-lg font-bold text-white">No Active Nutrition Plan</h3>
          <p className="text-gray-400 text-sm mt-1">Setup your preferences to generate custom caloric intake and meal plans.</p>
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

  const {
    plan_name,
    daily_calories = 2000,
    protein_grams = 150,
    carbs_grams = 200,
    fat_grams = 65,
  } = plan;

  return (
    <div className="bg-gray-800 border border-gray-700 rounded-2xl p-6 hover:shadow-xl hover:shadow-black/30 transition-all duration-200 flex flex-col justify-between h-full">
      <div className="space-y-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="bg-green-500/10 p-3 rounded-xl text-green-500 border border-green-500/20">
            <Apple className="h-6 w-6" />
          </div>
          <div className="flex items-center space-x-1.5 text-xs bg-orange-500/10 text-orange-400 font-bold px-2.5 py-1 rounded-lg border border-orange-500/20">
            <Flame className="h-3.5 w-3.5" />
            <span>{daily_calories} Kcal / Day</span>
          </div>
        </div>

        {/* Content */}
        <div className="space-y-3">
          <h3 className="text-xl font-black tracking-wide text-white">{plan_name || 'Personalized Fuel Plan'}</h3>
          
          {/* Quick Macros Overview */}
          <div className="grid grid-cols-3 gap-2 pt-2">
            <div className="bg-gray-900/40 rounded-xl p-2.5 border border-gray-700/50 text-center">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">Protein</span>
              <span className="text-sm font-bold text-orange-500 mt-0.5 block">{protein_grams}g</span>
            </div>
            <div className="bg-gray-900/40 rounded-xl p-2.5 border border-gray-700/50 text-center">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">Carbs</span>
              <span className="text-sm font-bold text-blue-400 mt-0.5 block">{carbs_grams}g</span>
            </div>
            <div className="bg-gray-900/40 rounded-xl p-2.5 border border-gray-700/50 text-center">
              <span className="text-[10px] uppercase tracking-wider text-gray-400 font-semibold block">Fats</span>
              <span className="text-sm font-bold text-green-400 mt-0.5 block">{fat_grams}g</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-gray-700/60 mt-6">
        <Link
          href="/dashboard/nutrition"
          className="w-full text-center inline-block bg-gray-700 hover:bg-orange-500 hover:text-white text-gray-200 font-bold text-sm py-3 px-4 rounded-xl transition-all duration-200"
        >
          View Full Meal Plan →
        </Link>
      </div>
    </div>
  );
}
