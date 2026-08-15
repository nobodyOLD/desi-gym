import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import ChatInterface from '@/components/ChatInterface';

export const dynamic = 'force-dynamic';

/**
 * Server-side entry page for AI Coach chat.
 * Fetches user session and profile details, rendering ChatInterface client module.
 */
export default async function ChatPage() {
  const cookieStore = cookies();
  const supabase = createServerComponentClient({ cookies: () => cookieStore });

  // Get active session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Retrieve user profiles details
  let profile = null;
  if (session?.user) {
    const { data } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', session.user.id)
      .single();
    profile = data;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">AI Coach Assistant</h1>
        <p className="text-gray-400 text-sm mt-1">
          Chat with Coach Alex for immediate guidance on exercise execution, training frequency, and nutrition.
        </p>
      </div>

      {/* Interactive Chat interface component */}
      <ChatInterface user={session?.user} profile={profile} />
    </div>
  );
}
