'use client';

import { Activity, Flame, Zap } from 'lucide-react';

export default function BodyTypeForm({ selectedType, onChange }) {
  const bodyTypes = [
    {
      id: 'ectomorph',
      name: 'Ectomorph',
      description: 'Lean and long, with difficulty building muscle or gaining weight.',
      traits: ['Fast metabolism', 'Naturally thin frame', 'Small shoulders/joints', 'Hard gainer'],
      accentColor: 'border-blue-500/40 text-blue-400 bg-blue-500/5 hover:border-blue-500',
      activeColor: 'ring-2 ring-blue-500 border-blue-500 bg-blue-500/10',
      icon: Zap,
    },
    {
      id: 'mesomorph',
      name: 'Mesomorph',
      description: 'Naturally athletic build, efficient at building muscle and losing fat.',
      traits: ['Athletic posture', 'Broad shoulders', 'Responds well to training', 'Gains muscle easily'],
      accentColor: 'border-orange-500/40 text-orange-400 bg-orange-500/5 hover:border-orange-500',
      activeColor: 'ring-2 ring-orange-500 border-orange-500 bg-orange-500/10',
      icon: Activity,
    },
    {
      id: 'endomorph',
      name: 'Endomorph',
      description: 'Broader build, gains muscle and fat easily, slow metabolism.',
      traits: ['Stocky/round build', 'High calorie storage capacity', 'Gains weight quickly', 'Strong power potential'],
      accentColor: 'border-green-500/40 text-green-400 bg-green-500/5 hover:border-green-500',
      activeColor: 'ring-2 ring-green-500 border-green-500 bg-green-500/10',
      icon: Flame,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-xl font-bold text-white">Select Your Body Type</h3>
        <p className="text-gray-400 text-sm mt-1">Choose the body type that best fits your natural build and metabolism.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {bodyTypes.map((type) => {
          const Icon = type.icon;
          const isActive = selectedType === type.id;

          return (
            <button
              key={type.id}
              type="button"
              onClick={() => onChange(type.id)}
              className={`text-left rounded-2xl p-6 border transition-all duration-300 flex flex-col justify-between h-full group ${
                isActive ? type.activeColor : `border-gray-700 bg-gray-800/80 ${type.accentColor}`
              }`}
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-center justify-between">
                  <span className={`text-sm font-black tracking-wide uppercase ${isActive ? 'text-white' : ''}`}>
                    {type.name}
                  </span>
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center border transition-colors ${
                      isActive
                        ? 'bg-white/15 border-white/20 text-white'
                        : 'bg-gray-900 border-gray-700 text-gray-400 group-hover:text-white'
                    }`}
                  >
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                </div>

                {/* Description */}
                <p className={`text-sm leading-relaxed ${isActive ? 'text-gray-100' : 'text-gray-400'}`}>
                  {type.description}
                </p>

                {/* Traits Checklist */}
                <ul className="space-y-2 pt-2">
                  {type.traits.map((trait, index) => (
                    <li key={index} className="flex items-center space-x-2 text-xs">
                      <span className={`h-1.5 w-1.5 rounded-full ${isActive ? 'bg-white' : 'bg-gray-500'}`} />
                      <span className={isActive ? 'text-gray-200' : 'text-gray-400'}>{trait}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action indicator at bottom */}
              <div className="mt-6 pt-4 border-t border-white/10 w-full flex items-center justify-between text-xs font-bold">
                <span>{isActive ? 'Selected ✓' : 'Click to Select'}</span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
