'use client';

import { useState, useEffect } from 'react';
import { Loader2, Dumbbell, ShieldAlert, Sparkles, Brain, Apple } from 'lucide-react';

// 1. Simple loading spinner
export function LoadingSpinner({ size = 'md' }) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex items-center justify-center">
      <div
        className={`animate-spin rounded-full border-t-orange-500 border-r-transparent border-b-transparent border-l-transparent ${sizeClasses[size] || sizeClasses.md}`}
        role="status"
      >
        <span className="sr-only">Loading...</span>
      </div>
    </div>
  );
}

// 2. Gray pulsing skeleton cards
export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-4 w-full">
      <div className="h-6 bg-gray-800 rounded-lg w-1/4"></div>
      <div className="h-32 bg-gray-800 rounded-xl w-full"></div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-800 rounded w-5/6"></div>
        <div className="h-4 bg-gray-800 rounded w-4/5"></div>
        <div className="h-4 bg-gray-800 rounded w-full"></div>
      </div>
    </div>
  );
}

// 3. Page level loader
export function PageLoader() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4">
      <Loader2 className="h-12 w-12 text-orange-500 animate-spin" />
      <p className="text-gray-400 font-medium text-sm animate-pulse">Loading Coach Alex...</p>
    </div>
  );
}

// 4. Full screen overlay with progress steps animation for AI generation
export function PlanGenerating() {
  const steps = [
    { text: 'Analyzing your body type & metrics...', icon: Brain },
    { text: 'Calculating BMR and energy expenditures...', icon: Sparkles },
    { text: 'Generating personalized workout schedule...', icon: Dumbbell },
    { text: 'Designing optimal meal plans & macros...', icon: Apple },
    { text: 'Finalizing recommendations from Coach Alex...', icon: Loader2 },
  ];

  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    const intervals = [1800, 2200, 2600, 2200, 3000];
    let step = 0;

    const runNext = () => {
      if (step < steps.length - 1) {
        step++;
        setCurrentStep(step);
        setTimeout(runNext, intervals[step]);
      }
    };

    const timer = setTimeout(runNext, intervals[0]);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="fixed inset-0 bg-gray-950/90 z-50 flex items-center justify-center backdrop-blur-md px-4">
      <div className="bg-gray-900 border border-gray-800 rounded-2xl max-w-lg w-full p-8 shadow-2xl text-center space-y-6">
        {/* Animated Dumbbell logo */}
        <div className="mx-auto bg-orange-500/10 h-16 w-16 rounded-full flex items-center justify-center text-orange-500 animate-pulse border border-orange-500/20">
          <Dumbbell className="h-8 w-8 animate-spin" />
        </div>

        <div>
          <h2 className="text-2xl font-black tracking-wider text-white">Creating Your Plan</h2>
          <p className="text-gray-400 text-sm mt-1">Our AI algorithms are customizing your fitness plan.</p>
        </div>

        {/* Steps Progress Checklist */}
        <div className="space-y-4 text-left border-t border-b border-gray-800 py-6">
          {steps.map((step, idx) => {
            const Icon = step.icon;
            const isActive = idx === currentStep;
            const isCompleted = idx < currentStep;

            return (
              <div
                key={idx}
                className={`flex items-center space-x-3 transition-opacity duration-300 ${
                  isActive ? 'text-orange-500 font-bold opacity-100 scale-102' : isCompleted ? 'text-gray-500 opacity-70' : 'text-gray-600 opacity-40'
                }`}
              >
                <div
                  className={`h-6 w-6 rounded-full flex items-center justify-center border text-xs ${
                    isActive
                      ? 'border-orange-500 bg-orange-500/10'
                      : isCompleted
                      ? 'border-green-500 bg-green-500/10 text-green-500'
                      : 'border-gray-700'
                  }`}
                >
                  {isCompleted ? '✓' : idx + 1}
                </div>
                <Icon className={`h-4 w-4 ${isActive && idx === 4 ? 'animate-spin' : ''}`} />
                <span className="text-sm">{step.text}</span>
              </div>
            );
          })}
        </div>

        <p className="text-xs text-orange-500 font-medium animate-pulse">
          Please do not refresh the page. This will take up to 10 seconds.
        </p>
      </div>
    </div>
  );
}
