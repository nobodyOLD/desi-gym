'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { toast } from 'react-hot-toast';
import {
  Home,
  User,
  Dumbbell,
  Apple,
  LineChart,
  MessageSquare,
  LogOut,
  Sparkles,
} from 'lucide-react';

export default function Sidebar({ user, profile }) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast.success('Logged out successfully');
      router.push('/');
      router.refresh();
    } catch (error) {
      console.error('Logout error:', error);
      toast.error('Failed to log out');
    }
  };

  const navItems = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'My Profile', href: '/dashboard/profile', icon: User },
    { name: 'Workout Plan', href: '/dashboard/workout', icon: Dumbbell },
    { name: 'Nutrition Plan', href: '/dashboard/nutrition', icon: Apple },
    { name: 'Progress Logs', href: '/dashboard/progress', icon: LineChart },
    { name: 'Weekly Review', href: '/dashboard/weekly-review', icon: Sparkles },
    { name: 'AI Coach Chat', href: '/dashboard/chat', icon: MessageSquare },
  ];

  const getInitials = (name) => {
    if (!name) return 'U';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-900 border-r border-gray-800 fixed h-screen left-0 top-0 text-gray-300">
        {/* Brand Header */}
        <div className="p-6 border-b border-gray-800">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Dumbbell className="h-7 w-7 text-orange-500" />
            <span className="text-lg font-black tracking-wider text-white">
              DESI <span className="text-orange-500">GYM</span>
            </span>
          </Link>
        </div>

        {/* User Card */}
        <div className="p-5 border-b border-gray-800/60 bg-gray-900/50 flex items-center space-x-3">
          <div className="h-10 w-10 rounded-xl bg-orange-500/10 border border-orange-500/30 flex items-center justify-center font-bold text-orange-500">
            {getInitials(profile?.full_name || user?.email)}
          </div>
          <div className="overflow-hidden flex-1">
            <h4 className="text-sm font-bold text-white truncate">
              {profile?.full_name || 'Fitness Member'}
            </h4>
            <p className="text-xs text-gray-400 truncate mt-0.5">
              {profile?.body_type ? (
                <span className="inline-flex items-center text-[10px] bg-orange-500/10 text-orange-400 px-1.5 py-0.5 rounded capitalize">
                  {profile.body_type}
                </span>
              ) : (
                'Setup Profile'
              )}
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-orange-500 text-white shadow-lg shadow-orange-500/20'
                    : 'hover:bg-gray-800 text-gray-400 hover:text-white'
                }`}
              >
                <Icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
                <span>{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* Logout Bottom Footer */}
        <div className="p-4 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="flex items-center space-x-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-red-500/10 hover:border hover:border-red-500/20 transition-all duration-200"
          >
            <LogOut className="h-5 w-5 text-gray-400" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Mobile Bottom Navigation Bar */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-gray-900 border-t border-gray-800 flex items-center justify-around py-2 px-1 backdrop-blur-md">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex flex-col items-center justify-center flex-1 py-1 ${
                isActive ? 'text-orange-500' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className="h-5.5 w-5.5" />
              <span className="text-[9px] mt-1 font-medium scale-90">{item.name.split(' ')[0]}</span>
            </Link>
          );
        })}
        <button
          onClick={handleLogout}
          className="flex flex-col items-center justify-center flex-1 py-1 text-gray-400 hover:text-white"
        >
          <LogOut className="h-5.5 w-5.5 text-gray-400" />
          <span className="text-[9px] mt-1 font-medium scale-90">Sign Out</span>
        </button>
      </nav>
    </>
  );
}
