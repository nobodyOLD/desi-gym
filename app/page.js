'use client';

import { useState } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Brain,
  Dumbbell,
  Apple,
  LineChart,
  ChevronRight,
  TrendingUp,
  Activity,
  Flame,
  Award,
  Users,
  Clock,
  Sparkles,
  ChevronDown,
  Scale,
  Utensils,
  CheckCircle,
  HelpCircle,
  BookOpen,
  Check
} from 'lucide-react';

export default function Home() {
  const [activeFaq, setActiveFaq] = useState(null);
  
  // Dynamic pricing settings
  const [proPrice, setProPrice] = useState(499); // ₹499/month, editable/configurable

  const toggleFaq = (idx) => {
    setActiveFaq(activeFaq === idx ? null : idx);
  };

  const goals = [
    { title: 'Muscle Gain', desc: 'Build skeletal mass & strength splits', icon: '💪', bg: 'from-orange-500/10 to-amber-500/5' },
    { title: 'Fat Loss', desc: 'Active deficit planning & cardio circuits', icon: '🔥', bg: 'from-red-500/10 to-orange-500/5' },
    { title: 'Body Recomposition', desc: 'Simultaneous fat loss and muscle gain', icon: '⚖️', bg: 'from-blue-500/10 to-indigo-500/5' },
    { title: 'Strength', desc: 'Heavy compounds and neural adaptations', icon: '🏋️', bg: 'from-purple-500/10 to-pink-500/5' },
    { title: 'General Fitness', desc: 'Core stability, posture & joint endurance', icon: '🏃', bg: 'from-green-500/10 to-teal-500/5' },
  ];

  const trustCards = [
    {
      title: 'Personalized',
      desc: 'Workout splits and volumes specifically tailored to your experience, height, weight, and fitness level.',
      icon: Award
    },
    {
      title: 'Progressive',
      desc: 'Our progression engine analyzes your previous weight and reps to recommend exact targets for your next session.',
      icon: Activity
    },
    {
      title: 'Indian-Friendly',
      desc: 'Nutrition plans designed around local foods (Roti, Dal, Paneer, Curd, Rice, Eggs) matching regional preferences.',
      icon: Apple
    },
    {
      title: 'Data-Driven',
      desc: 'Visualize your strength milestones, body fat changes, and consistency streaks with clean, interactive charts.',
      icon: LineChart
    }
  ];

  const steps = [
    {
      num: '01',
      title: 'Tell Us About You',
      desc: 'Enter your biometric details, training history, location (gym/home), equipment access, and regional dietary preference.'
    },
    {
      num: '02',
      title: 'Build Your Plan',
      desc: 'The Desi Gym algorithm constructs a complete 4-week workout routine and daily macronutrient guidelines.'
    },
    {
      num: '03',
      title: 'Train & Log',
      desc: 'Execute your daily routine, entering weight, reps, and sets completed. We track your progress in real-time.'
    },
    {
      num: '04',
      title: 'Progress Overload',
      desc: 'We calculate recommendations for your next session using your previous sets, keeping your muscles growing.'
    }
  ];

  const faqs = [
    {
      q: 'What is Desi Gym?',
      a: 'Desi Gym is an Indian-first personalized coaching application. It replaces generic, copy-paste workouts with custom plans structured around real Indian lifestyles, gym environments, and regional foods.'
    },
    {
      q: 'Is Desi Gym free?',
      a: 'Yes, our Free plan includes a personalized starter workout and standard workout logging. Our Pro plan unlocks advanced progression suggestions, Indian meal trackers, and full analytics.'
    },
    {
      q: 'Can beginners use it?',
      a: 'Absolutely. The onboarding questionnaire adjusts splits and exercise selections based on your training experience (Beginner, Intermediate, or Advanced).'
    },
    {
      q: 'Can I track using local Indian foods?',
      a: 'Yes. Our meal targets support regional choices (North Indian, South Indian, Bengali, Gujarati) using daily staples like roti, rice, paneer, dahi, eggs, dal, and local vegetables.'
    },
    {
      q: 'Can I train at home?',
      a: 'Yes. During onboarding, you can select "Home" or "Both" and check-off the exact equipment you have (e.g. Dumbbells, Bodyweight only) to filter the exercises.'
    },
    {
      q: 'Can I change exercises?',
      a: 'Yes. If you hit a strength plateau or find an exercise uncomfortable, you can substitute it with biomechanically equivalent exercises from our database.'
    },
    {
      q: 'How does progression work?',
      a: 'We use double-progression logic. When you complete the maximum target reps for all sets of an exercise, the system suggests a minor load increase (+2.5kg to +5kg) for your next session.'
    },
    {
      q: 'Is Desi Gym medical advice?',
      a: 'No. Desi Gym provides structured exercise programming and energy balance guidelines. We screen users for safety, and warn elevated-risk individuals to seek professional medical clearance.'
    },
    {
      q: 'Can I cancel Pro anytime?',
      a: 'Yes. Subscriptions are fully flexible, and you can cancel recurring charges directly from your settings dashboard with a single click.'
    }
  ];

  return (
    <div className="bg-gray-950 min-h-screen relative overflow-hidden flex flex-col font-sans">
      <Navbar />

      {/* Hero Section */}
      <header className="relative pt-32 pb-20 lg:pt-40 lg:pb-32 flex items-center justify-center min-h-[90vh] bg-gradient-to-b from-orange-500/10 via-transparent to-transparent border-b border-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 space-y-6 text-left animate-slide-up">
            <div className="inline-flex items-center space-x-2 bg-orange-500/10 border border-orange-500/20 px-4 py-2 rounded-full text-orange-400 text-xs font-black uppercase tracking-wider">
              <Sparkles className="h-3.5 w-3.5" />
              <span>Train Desi. Progress Strong.</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-none">
              Train Desi. <br />
              <span className="text-orange-500 bg-gradient-to-r from-orange-500 to-amber-500 bg-clip-text text-transparent">Progress Strong.</span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg font-medium leading-relaxed max-w-xl">
              Personalized workouts, Indian-friendly nutrition and progressive coaching built around your body, your goals and your real lifestyle.
            </p>

            <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
              <Link
                href="/dashboard/profile"
                className="w-full sm:w-auto text-center bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-8 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-600/30 transform hover:-translate-y-0.5 transition-all duration-200 text-sm"
              >
                Build My Plan
              </Link>
              <Link
                href="#how-it-works"
                className="w-full sm:w-auto text-center border border-gray-800 hover:border-gray-700 text-white font-bold py-4 px-8 rounded-xl hover:bg-gray-900 transition-all duration-200 text-sm"
              >
                See How It Works
              </Link>
            </div>
          </div>

          {/* Right Dashboard Mockup Column */}
          <div className="lg:col-span-5 animate-fade-in">
            <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 shadow-2xl relative overflow-hidden max-w-md mx-auto">
              
              {/* Card Header */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-800">
                <div>
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Today's Split</span>
                  <h3 className="text-base font-black text-white">Upper Body — Strength</h3>
                </div>
                <span className="text-[10px] font-black bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded border border-orange-500/20">
                  Week 1
                </span>
              </div>

              {/* Card Content: Workouts */}
              <div className="py-4 space-y-3">
                <div className="bg-gray-950 border border-gray-850 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-bold text-gray-200">Bench Press</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold">60kg → 62.5kg Suggested</span>
                </div>
                <div className="bg-gray-950 border border-gray-850 p-3 rounded-xl flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span className="text-xs font-bold text-gray-200">Bent-Over Rows</span>
                  </div>
                  <span className="text-[10px] text-gray-500 font-bold">3 Sets × 8 Reps</span>
                </div>
              </div>

              {/* Card Content: Targets */}
              <div className="grid grid-cols-2 gap-3 pt-3 border-t border-gray-800">
                <div className="bg-gray-950 border border-gray-850 p-3 rounded-xl">
                  <span className="text-[10px] text-gray-500 font-bold block uppercase">Protein target</span>
                  <span className="text-sm font-black text-orange-500 block mt-0.5">140g</span>
                </div>
                <div className="bg-gray-950 border border-gray-850 p-3 rounded-xl">
                  <span className="text-[10px] text-gray-500 font-bold block uppercase">Consistency</span>
                  <div className="flex space-x-1 mt-1">
                    {['M', 'T', 'W', 'T', 'F'].map((day, i) => (
                      <span key={i} className={`h-4 w-4 text-[9px] font-bold rounded flex items-center justify-center ${i < 3 ? 'bg-green-500/20 text-green-400' : 'bg-gray-900 text-gray-500'}`}>
                        {day}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Button */}
              <Link
                href="/dashboard/profile"
                className="block text-center mt-5 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 rounded-xl text-xs transition"
              >
                Access Dashboard
              </Link>
            </div>
          </div>

        </div>
      </header>

      {/* Trust Section */}
      <section className="py-20 bg-gray-900/40 border-t border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white">Fitness that fits real life.</h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed">
              Desi Gym is designed around real-world Indian lifestyles, food choices, budgets, schedules and gym environments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {trustCards.map((card, idx) => {
              const Icon = card.icon;
              return (
                <div
                  key={idx}
                  className="bg-gray-900 border border-gray-800 rounded-2xl p-6 hover:border-orange-500/30 transition duration-200 space-y-4"
                >
                  <div className="bg-orange-500/10 p-3 rounded-xl text-orange-500 border border-orange-500/20 inline-block">
                    <Icon className="h-6 w-6" />
                  </div>
                  <h3 className="text-lg font-bold text-white">{card.title}</h3>
                  <p className="text-gray-400 text-xs leading-relaxed font-semibold">{card.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white">How It Works</h2>
            <p className="text-gray-400 text-sm">Four scientific steps to unlock consistent structural transformation.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((step, idx) => (
              <div key={idx} className="relative bg-gray-900 border border-gray-800 rounded-2xl p-6 space-y-4 hover:border-orange-500/20 transition">
                <span className="text-4xl font-black text-orange-500/10 absolute right-6 top-6">{step.num}</span>
                <h3 className="text-base font-bold text-white pr-8">{step.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed font-semibold">{step.desc}</p>
              </div>
            ))}
          </div>

          <div className="text-center pt-6">
            <Link
              href="/dashboard/profile"
              className="inline-block bg-orange-500 hover:bg-orange-600 text-white font-black py-4 px-10 rounded-xl shadow-lg transition"
            >
              Build My Plan
            </Link>
          </div>
        </div>
      </section>

      {/* Fitness Goals */}
      <section id="goals" className="py-20 bg-gray-900/40 border-t border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white">Engineered For Your Intentions</h2>
            <p className="text-gray-400 text-sm">Every split is mathematically structured to serve a unique aesthetic or athletic purpose.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {goals.map((g, idx) => (
              <div key={idx} className={`bg-gradient-to-b ${g.bg} border border-gray-800 rounded-2xl p-6 space-y-4 hover:-translate-y-1 transition duration-200`}>
                <span className="text-3xl block">{g.icon}</span>
                <h3 className="text-sm font-bold text-white">{g.title}</h3>
                <p className="text-gray-400 text-[11px] leading-relaxed font-semibold">{g.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Personalized Coaching Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-6 space-y-6 text-left">
            <h2 className="text-3xl sm:text-4xl font-black text-white">Your plan should change as you change.</h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-semibold">
              Hypertrophy is fueled by **Progressive Overload**. Desi Gym checks what you completed in your last workout, adjusting suggested sets and weight to keep your body adapting.
            </p>
            <div className="pt-2 border-l-2 border-orange-500 pl-4 text-xs italic text-gray-400">
              Note: Weight progressions are calculated systematically, avoiding sudden volume jumps to prevent joint fatigue.
            </div>
          </div>

          {/* Overload Visual Comparison */}
          <div className="lg:col-span-6 space-y-4 max-w-md mx-auto w-full">
            {/* Prev workout */}
            <div className="bg-gray-900/60 border border-gray-850 rounded-2xl p-5 space-y-3">
              <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wider block">Previous Workout (Log)</span>
              <h4 className="text-xs font-bold text-white">Flat Bench Press</h4>
              <div className="space-y-1 text-xs text-gray-400 font-semibold">
                <div className="flex justify-between">
                  <span>Set 1</span>
                  <span>60 kg × 10 reps (RPE 9)</span>
                </div>
                <div className="flex justify-between">
                  <span>Set 2</span>
                  <span>60 kg × 9 reps (RPE 9)</span>
                </div>
                <div className="flex justify-between">
                  <span>Set 3</span>
                  <span>57.5 kg × 10 reps (RPE 8)</span>
                </div>
              </div>
            </div>

            {/* Down Arrow */}
            <div className="text-center text-orange-500">↓ progression suggestions calculated ↓</div>

            {/* Next workout */}
            <div className="bg-gray-900 border border-orange-500/20 rounded-2xl p-5 space-y-3 shadow-lg shadow-orange-500/5">
              <div className="flex justify-between items-center">
                <span className="text-[10px] text-orange-500 font-bold uppercase tracking-wider block">Suggested Next Workout</span>
                <span className="text-[9px] bg-orange-500/10 text-orange-400 px-2 py-0.5 rounded">Calculated Overload</span>
              </div>
              <h4 className="text-xs font-bold text-white">Flat Bench Press</h4>
              <div className="space-y-1 text-xs text-gray-300 font-bold">
                <div className="flex justify-between">
                  <span>Set 1</span>
                  <span>60 kg × 10 reps</span>
                </div>
                <div className="flex justify-between">
                  <span>Set 2</span>
                  <span>60 kg × 10 reps</span>
                </div>
                <div className="flex justify-between">
                  <span>Set 3</span>
                  <span>60 kg × 9 reps</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Indian Nutrition Section */}
      <section id="nutrition" className="py-20 bg-gray-900/40 border-t border-b border-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Nutrition text */}
          <div className="lg:col-span-6 space-y-6 text-left">
            <h2 className="text-3xl sm:text-4xl font-black text-white">Eat for your goal. Without abandoning your food.</h2>
            <p className="text-gray-400 text-sm sm:text-base leading-relaxed font-semibold">
              You do not need to eat bland chicken and broccoli to build an athletic physique. Desi Gym supports vegetarian, eggetarian, and non-vegetarian users, mapping local staples to your daily caloric and protein targets.
            </p>
            <p className="text-gray-400 text-xs leading-relaxed">
              Supports regional Indian food choices (North Indian wheat, South Indian rice/sambar, Bengali fish focus, Gujarati dals) calculated to fit energy balance principles.
            </p>
          </div>

          {/* Meals Visual Cards */}
          <div className="lg:col-span-6 space-y-3 w-full max-w-md mx-auto">
            {[
              { meal: 'Breakfast', items: 'Eggs / Oats / Milk or Curd / Fresh Fruit' },
              { meal: 'Lunch', items: 'Rice or Roti / Chicken / Fish / Paneer or Dal / Green Salad / Dahi' },
              { meal: 'Evening Snack', items: 'Mixed Fruits / Roasted Chana / Paneer cubes / Hardboiled eggs / Almonds' },
              { meal: 'Dinner', items: 'Light Rice or Roti / Grilled Fish / Tandoori Chicken or Dal / Sautéed Vegetables' }
            ].map((m, idx) => (
              <div key={idx} className="bg-gray-950 border border-gray-850 p-4 rounded-xl flex items-center justify-between">
                <div className="space-y-0.5">
                  <span className="text-[10px] text-gray-500 font-bold uppercase block">{m.meal}</span>
                  <span className="text-xs text-gray-300 font-bold leading-relaxed">{m.items}</span>
                </div>
                <span className="text-[9px] bg-green-500/10 text-green-400 px-2 py-0.5 rounded font-black border border-green-500/20">Indian Staples</span>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* Science Section */}
      <section id="science" className="py-20 lg:py-32">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-16">
          <div className="space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white">The Science of Progress</h2>
            <p className="text-gray-400 text-sm max-w-xl mx-auto">We cut through the fitness myths. Desi Gym operates on verified athletic principles.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {[
              { title: 'Progressive Overload', desc: 'Systematic loading of muscles via weight or rep increases over consecutive workouts.' },
              { title: 'Training Volume', desc: 'Targeting 10-20 working sets per muscle group weekly depending on experience.' },
              { title: 'Protein Adherence', desc: 'Targeting 1.6g - 2.2g of protein per kilogram of body weight to support synthesis.' },
              { title: 'Recovery Optimization', desc: 'Ensuring deep sleep blocks and active rest overlays to restore nervous systems.' }
            ].map((sci, idx) => (
              <div key={idx} className="bg-gray-900 border border-gray-800 p-6 rounded-2xl space-y-3">
                <h4 className="text-sm font-bold text-orange-500">{sci.title}</h4>
                <p className="text-gray-400 text-[11px] leading-relaxed font-semibold">{sci.desc}</p>
              </div>
            ))}
          </div>

          <div className="bg-orange-500/5 border border-orange-500/25 rounded-2xl p-6 text-xs text-gray-400 max-w-2xl mx-auto leading-relaxed">
            📢 <strong>Disclaimer:</strong> Desi Gym is a fitness coaching assistant. It is not medical advice. Always consult with a qualified medical practitioner before undertaking high-intensity physical routines.
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 lg:py-32">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
          <div className="text-center space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white">Frequently Asked Questions</h2>
            <p className="text-gray-400 text-sm">Everything you need to know about the platform.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = activeFaq === idx;
              return (
                <div key={idx} className="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full p-5 text-left flex justify-between items-center text-xs font-bold text-white hover:bg-gray-850/50 transition"
                  >
                    <span>{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs text-gray-400 font-semibold leading-relaxed border-t border-gray-850/50">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 border-t border-gray-800 py-12 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1">
            <Link href="/" className="flex items-center space-x-2">
              <Dumbbell className="h-6 w-6 text-orange-500" />
              <span className="text-base font-black tracking-wider text-white">
                DESI <span className="text-orange-500">GYM</span>
              </span>
            </Link>
            <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider">Train Desi. Progress Strong.</p>
          </div>

          <div className="flex flex-wrap gap-6 text-xs text-gray-400 font-bold justify-center">
            <Link href="#how-it-works" className="hover:text-white transition">How It Works</Link>
            <Link href="#goals" className="hover:text-white transition">Workout</Link>
            <Link href="#nutrition" className="hover:text-white transition">Nutrition</Link>
            <Link href="#science" className="hover:text-white transition">Science</Link>
          </div>

          <p className="text-xs text-gray-500 font-medium">
            &copy; {new Date().getFullYear()} DESI GYM. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
