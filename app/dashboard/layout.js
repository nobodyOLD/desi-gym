'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Sidebar from '@/components/Sidebar';
import { LoadingSkeleton } from '@/components/LoadingSpinner';

/**
 * Client-side Layout for Protected Dashboard Routes.
 * Fetches user profile data client-side and displays sidebar navigation.
 */
export default function DashboardLayout({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadSessionData() {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session) {
          setUser(session.user);
          
          const { data: profileData } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();

          setProfile(profileData);
        }
      } catch (err) {
        console.error('Layout loading error:', err);
      } finally {
        setLoading(false);
      }
    }

    loadSessionData();
  }, []);

  if (loading) {
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gray-950 flex flex-col md:flex-row text-gray-100">
      {/* Responsive Sidebar component */}
      <Sidebar user={user} profile={profile} />

      {/* Main content viewport */}
      <main className="flex-1 md:pl-64 pb-24 md:pb-8 min-h-screen bg-gray-950">
        <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
