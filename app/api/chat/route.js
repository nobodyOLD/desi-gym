import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { redis } from '@/lib/redis';
import { buildSystemPrompt } from '@/lib/groq';

// Use Next.js Edge Runtime for extremely fast response streaming
export const runtime = 'edge';
export const dynamic = 'force-dynamic';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY || '',
});

/**
 * Chat API Route handler. Authenticates the session,
 * applies rate limits via Upstash, and streams Groq completions.
 */
export async function POST(req) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient({ cookies: () => cookieStore });

  try {
    // 1. Verify user session
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      return new Response(JSON.stringify({ error: 'Unauthorized session' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const userId = session.user.id;
    const body = await req.json();
    const { messages, profile } = body;

    if (!messages || !Array.isArray(messages)) {
      return new Response(JSON.stringify({ error: 'Missing chat messages list' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 2. Check daily message rate limits (20 messages per user per day) using Redis
    const todayStr = new Date().toISOString().split('T')[0];
    const limitKey = `chat_rate_limit:${userId}:${todayStr}`;
    
    const count = await redis.incr(limitKey);
    if (count === 1) {
      await redis.expire(limitKey, 86400); // Expires in 24 hours
    }

    if (count > 20) {
      return new Response(
        JSON.stringify({ error: 'Daily message count exceeded (20/20). Please try again tomorrow.' }),
        {
          status: 429,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    // 3. Build system prompt using client bio configurations
    const systemPromptText = buildSystemPrompt(profile);

    // Format chat log history for Groq completion client
    const groqMessages = [
      { role: 'system', content: systemPromptText },
      ...messages.map((m) => ({
        role: m.role === 'assistant' ? 'assistant' : 'user',
        content: m.content,
      })),
    ];

    // 4. Query Llama 3 on Groq with streaming enabled
    const groqResponse = await groq.chat.completions.create({
      messages: groqMessages,
      model: 'llama3-8b-8192',
      temperature: 0.7,
      max_tokens: 1024,
      stream: true,
    });

    // 5. Create streaming response
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of groqResponse) {
            const content = chunk.choices[0]?.delta?.content || '';
            if (content) {
              controller.enqueue(encoder.encode(content));
            }
          }
        } catch (streamError) {
          console.error('Error during streaming:', streamError);
          controller.error(streamError);
        } finally {
          controller.close();
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache, no-transform',
        'X-Accel-Buffering': 'no', // Disable buffering on Nginx proxies for instant stream delivery
      },
    });
  } catch (error) {
    console.error('API /api/chat error:', error);
    return new Response(
      JSON.stringify({ error: error.message || 'Server error starting conversation stream' }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }
}
