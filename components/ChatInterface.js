'use client';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Send, Bot, User, Loader2, Sparkles, Trash2, Copy } from 'lucide-react';
import { toast } from 'react-hot-toast';

export default function ChatInterface({ user, profile }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [messagesRemaining, setMessagesRemaining] = useState(20);
  const [initialLoading, setInitialLoading] = useState(true);
  
  const messagesEndRef = useRef(null);

  // Suggestions chips
  const suggestions = [
    { text: 'Create a workout for today 💪', prompt: 'Can you write me a custom workout routine for today based on my goals?' },
    { text: 'How much protein do I need? 🥩', prompt: 'Based on my body profile, how many grams of protein should I consume daily?' },
    { text: 'Best exercises for weight loss 🔥', prompt: 'What are the top 5 most effective movements for losing fat?' },
    { text: 'How to fix my squat form 🦵', prompt: 'Explain correct squat mechanics, setups, and common mistakes to avoid.' },
    { text: 'What should I eat before workout? 🍌', prompt: 'What is a good pre-workout meal or snack for energy?' },
    { text: 'How many rest days per week? 😴', prompt: 'How many rest days do you recommend for my fitness level?' },
    { text: 'Explain my body type to me 🧬', prompt: 'Tell me more about my body type and how it affects my training.' },
    { text: 'Motivate me! I feel lazy today 🎯', prompt: 'I lack motivation to hit the gym today. Give me an elite pep talk.' },
  ];

  // Fetch initial chat logs from Supabase
  useEffect(() => {
    async function loadChatHistory() {
      if (!user) return;
      try {
        const { data, error } = await supabase
          .from('chat_history')
          .select('message, role, created_at')
          .eq('user_id', user.id)
          .order('created_at', { ascending: true })
          .limit(20); // load last 20 messages

        if (error) throw error;

        // Load messages remaining today from redis rate limit or count messages
        const today = new Date().toISOString().split('T')[0];
        const { count, error: countError } = await supabase
          .from('chat_history')
          .select('*', { count: 'exact', head: true })
          .eq('user_id', user.id)
          .eq('role', 'user')
          .gte('created_at', `${today}T00:00:00Z`);

        if (!countError) {
          setMessagesRemaining(Math.max(0, 20 - (count || 0)));
        }

        if (data) {
          setMessages(data);
        }
      } catch (error) {
        console.error('Error loading chat history:', error);
        toast.error('Failed to load chat history');
      } finally {
        setInitialLoading(false);
      }
    }

    loadChatHistory();
  }, [user]);

  // Scroll to bottom when messages list grows
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Save message to Supabase
  const saveMessageToDatabase = async (msgText, role) => {
    try {
      await supabase.from('chat_history').insert({
        user_id: user.id,
        message: msgText,
        role: role,
      });
    } catch (e) {
      console.error('Database write error:', e);
    }
  };

  const handleSend = async (messageText) => {
    if (!messageText.trim() || loading) return;
    if (messagesRemaining <= 0) {
      toast.error('Daily message limit reached (20/20). Try again tomorrow!');
      return;
    }

    const currentPrompt = messageText;
    setInput('');
    setLoading(true);

    // Update messages local array immediately
    const updatedMessages = [...messages, { role: 'user', message: currentPrompt, created_at: new Date() }];
    setMessages(updatedMessages);
    setMessagesRemaining((prev) => Math.max(0, prev - 1));

    // Save user query to DB
    await saveMessageToDatabase(currentPrompt, 'user');

    // Create an empty assistant message slot to stream into
    setMessages((prev) => [...prev, { role: 'assistant', message: '', created_at: new Date() }]);

    try {
      // Build context history (last 10 messages)
      const contextHistory = updatedMessages.slice(-10).map((m) => ({
        role: m.role,
        content: m.message,
      }));

      // Query the streaming API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: contextHistory,
          profile: profile,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || 'Server error');
      }

      if (!response.body) {
        throw new Error('No stream body received');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let assistantText = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;

        const chunk = decoder.decode(value);
        assistantText += chunk;

        // Update active assistant slot with accumulated text
        setMessages((prev) => {
          const fresh = [...prev];
          if (fresh.length > 0) {
            fresh[fresh.length - 1].message = assistantText;
          }
          return fresh;
        });
      }

      // Save assistant response to DB on completed stream
      await saveMessageToDatabase(assistantText, 'assistant');
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Connection failure. Check API key configurations.');
      
      // Clean up error state: remove the last empty assistant slot if it is blank
      setMessages((prev) => {
        const copy = [...prev];
        if (copy.length > 0 && copy[copy.length - 1].message === '') {
          copy.pop();
        }
        return copy;
      });
      setMessagesRemaining((prev) => prev + 1); // refund
    } finally {
      setLoading(false);
    }
  };

  const handleClearChat = async () => {
    if (!window.confirm('Are you sure you want to clear your chat history?')) return;
    try {
      const { error } = await supabase.from('chat_history').delete().eq('user_id', user.id);
      if (error) throw error;
      setMessages([]);
      setMessagesRemaining(20);
      toast.success('Chat cleared!');
    } catch (e) {
      console.error(e);
      toast.error('Failed to clear chat logs');
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Copied to clipboard');
  };

  if (initialLoading) {
    return (
      <div className="h-[60vh] flex flex-col justify-center items-center">
        <Loader2 className="h-10 w-10 text-orange-500 animate-spin" />
        <span className="text-gray-400 text-sm mt-3 animate-pulse">Loading Coach Alex...</span>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[78vh] bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
      {/* Header Info */}
      <div className="bg-gray-800/80 px-6 py-4 border-b border-gray-700/60 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 bg-orange-500/10 rounded-xl flex items-center justify-center text-orange-500 border border-orange-500/20">
            <Bot className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white flex items-center">
              Coach Alex
              <span className="ml-2 inline-flex items-center bg-orange-500/15 border border-orange-500/20 text-[9px] font-black uppercase text-orange-400 px-1.5 py-0.5 rounded">
                Llama 3 AI
              </span>
            </h3>
            <p className="text-xs text-gray-400 mt-0.5">Your Personalized 24/7 Trainer</p>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <span className="text-xs text-gray-400 bg-gray-900 border border-gray-700 px-3 py-1.5 rounded-lg font-semibold">
            {messagesRemaining} / 20 messages left
          </span>
          {messages.length > 0 && (
            <button
              onClick={handleClearChat}
              className="p-2 bg-gray-700/40 border border-gray-700 hover:border-red-500/30 hover:bg-red-500/10 rounded-lg text-gray-400 hover:text-red-400 transition-colors"
              title="Clear all chat history"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Message Feed */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 ? (
          <div className="max-w-xl mx-auto text-center py-8 space-y-6">
            <div className="mx-auto bg-orange-500/5 h-16 w-16 rounded-full flex items-center justify-center text-orange-500 border border-orange-500/10">
              <Sparkles className="h-8 w-8 animate-pulse" />
            </div>
            
            <div className="space-y-2">
              <h2 className="text-xl font-black text-white">
                Hey {profile?.full_name?.split(' ')[0] || 'there'}! I'm Coach Alex. 💪
              </h2>
              <p className="text-gray-400 text-sm leading-relaxed">
                {profile?.body_type ? (
                  <span>
                    I see you are a <strong>{profile.body_type}</strong> looking to{' '}
                    <strong>{profile.fitness_goal?.replace('_', ' ')}</strong> at a{' '}
                    <strong>{profile.fitness_level}</strong> experience level.
                  </span>
                ) : (
                  'Complete your profile onboarding so I can personalize my gym split and diets for you.'
                )}
                {' '}Ask me anything about squats, compound movements, caloric balances, and staying motivated!
              </p>
            </div>

            {/* Suggestions Chips Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-4 text-left">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSend(sug.prompt)}
                  className="bg-gray-800 hover:bg-gray-700/80 border border-gray-700 rounded-xl p-3.5 text-xs text-gray-300 font-bold transition-all duration-200 hover:-translate-y-0.5 hover:border-orange-500/40 text-left"
                >
                  {sug.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="space-y-4 max-w-4xl mx-auto">
            {messages.map((msg, index) => {
              const isUser = msg.role === 'user';
              return (
                <div key={index} className={`flex ${isUser ? 'justify-end' : 'justify-start'} group`}>
                  <div className={`flex items-start max-w-[85%] space-x-2.5 ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
                    {/* Avatar */}
                    <div
                      className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs shrink-0 ${
                        isUser
                          ? 'bg-orange-500 text-white font-bold'
                          : 'bg-gray-800 border border-gray-700 text-orange-500'
                      }`}
                    >
                      {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>

                    {/* Chat Bubble content */}
                    <div className="relative">
                      <div
                        className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-md border ${
                          isUser
                            ? 'bg-orange-500 border-orange-600 text-white rounded-tr-none'
                            : 'bg-gray-800 border-gray-700 text-gray-100 rounded-tl-none'
                        }`}
                      >
                        {/* Stream parsing formatting helper */}
                        <div className="whitespace-pre-line prose prose-invert max-w-none text-sm">
                          {msg.message || (
                            <span className="flex items-center space-x-1.5 py-1">
                              <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                              <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                              <span className="h-2 w-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Copy hover action */}
                      {!isUser && msg.message && (
                        <button
                          onClick={() => copyToClipboard(msg.message)}
                          className="absolute right-0 top-full mt-1.5 opacity-0 group-hover:opacity-100 p-1.5 bg-gray-800 border border-gray-700 text-gray-400 hover:text-white rounded-md transition-opacity duration-200 flex items-center space-x-1 text-[10px] font-bold"
                        >
                          <Copy className="h-3 w-3" />
                          <span>Copy</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input controls form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-4 bg-gray-800/60 border-t border-gray-700/60 flex items-center space-x-3"
      >
        <div className="relative flex-1">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value.slice(0, 500))}
            placeholder={loading ? 'Coach Alex is drafting response...' : 'Ask your coach anything...'}
            disabled={loading}
            className="w-full bg-gray-700/80 border border-gray-600 focus:border-orange-500 rounded-xl px-4 py-3.5 pr-20 text-sm text-white placeholder-gray-400 focus:outline-none transition-all duration-200 disabled:opacity-50"
            maxLength={500}
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-500">
            {input.length} / 500
          </span>
        </div>

        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="bg-orange-500 hover:bg-orange-600 disabled:bg-gray-700 text-white p-3.5 rounded-xl transition-all duration-200 disabled:text-gray-500 disabled:cursor-not-allowed hover:shadow-lg hover:shadow-orange-500/20"
        >
          {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
        </button>
      </form>
    </div>
  );
}
