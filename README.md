# AI Gym Coach - Complete Fitness Platform

A premium, state-of-the-art professional gym website with conversational AI coaching, automated calorie calculation, and progress analytics tracking.

## Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Styling**: Tailwind CSS
- **Database & Auth**: Supabase
- **Workout/Nutrition AI**: Google Gemini Flash API (via `@google/generative-ai`)
- **Conversational Coach AI**: Groq Llama 3 API (via `groq-sdk`)
- **Caching & Rate Limiting**: Upstash Redis (via `@upstash/redis` and `@upstash/ratelimit`)
- **Analytics Charts**: Recharts
- **Forms**: React Hook Form with Zod

---

## Installation & Local Setup

### 1. Clone or Move to Workspace
Open this directory inside your IDE or command terminal:
```bash
cd gym-website
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Setup Environment Variables
Duplicate the `.env.local.example` file and rename it to `.env.local`:
```bash
cp .env.local.example .env.local
```
Fill out the variables listed in the Environment Variables Guide below.

### 4. Create Database Tables
Run the SQL queries inside [supabase-schema.sql](file:///C:/Users/admin/.gemini/antigravity-ide/scratch/gym-website/supabase-schema.sql) in your Supabase SQL Editor. This will automatically:
- Setup `profiles`, `workout_plans`, `nutrition_plans`, `progress_logs`, and `chat_history` tables.
- Configure Row Level Security (RLS) policies.
- Setup database trigger triggers to auto-create user profiles upon email signup.

### 5. Launch the Development Server
```bash
npm run dev
```
Open `http://localhost:3000` to view the website.

---

## Environment Variables Guide

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-secret-service-role-key

# Google Gemini API
GEMINI_API_KEY=your-google-gemini-key

# Groq API
GROQ_API_KEY=gsk_your-groq-api-key

# Upstash Redis Connection (Serverless HTTP)
UPSTASH_REDIS_REST_URL=https://your-redis-serverless-endpoint.upstash.io
UPSTASH_REDIS_REST_TOKEN=your-redis-rest-token
```

---

## How to Acquire Free API Keys

### 1. Supabase (Database & Auth)
1. Go to [supabase.com](https://supabase.com) and sign up for a free account.
2. Create a new project.
3. Once created, go to **Project Settings** -> **API** to copy your `Project URL`, `anon public key`, and `service_role key`.

### 2. Google Gemini (Workout & Nutrition Generators)
1. Visit [Google AI Studio](https://aistudio.google.com/).
2. Log in with a Google account.
3. Click **Get API key** and create a key for your new project.

### 3. Groq (AI Coaching Stream)
1. Visit [Groq Console](https://console.groq.com/).
2. Log in and head over to the **API Keys** section.
3. Click **Create API Key** and copy it.

### 4. Upstash Redis (Caching & Message Limits)
1. Go to [upstash.com](https://upstash.com) and create an account.
2. Deploy a serverless Redis database (Free Tier).
3. Copy the `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` from the REST connection detail section.

---

## Vercel Deployment Steps

1. Install Vercel CLI globally (`npm install -g vercel`) or deploy directly via GitHub integration.
2. Run `vercel` in your project root directory.
3. Add all the environment variables listed in `.env.local` to your Vercel Project Dashboard.
4. Run `vercel --prod` to complete the live compilation.
