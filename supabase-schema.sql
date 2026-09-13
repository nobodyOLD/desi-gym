-- Profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users PRIMARY KEY,
  full_name TEXT,
  age INTEGER,
  gender TEXT,
  height DECIMAL,
  weight DECIMAL,
  body_type TEXT CHECK (body_type IN ('ectomorph', 'mesomorph', 'endomorph')),
  fitness_goal TEXT CHECK (fitness_goal IN ('lose_weight', 'build_muscle', 'maintain')),
  activity_level TEXT CHECK (activity_level IN ('sedentary', 'moderate', 'active', 'very_active')),
  dietary_preference TEXT CHECK (dietary_preference IN ('vegetarian', 'vegan', 'non-vegetarian')),
  fitness_level TEXT CHECK (fitness_level IN ('beginner', 'intermediate', 'advanced')),
  health_conditions TEXT,
  exercise_preferences JSONB DEFAULT '{"favorites": [], "excluded": []}'::jsonb,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Workout plans table
CREATE TABLE workout_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_name TEXT,
  plan_data JSONB,
  duration_weeks INTEGER DEFAULT 4,
  difficulty TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Nutrition plans table
CREATE TABLE nutrition_plans (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  plan_name TEXT,
  daily_calories INTEGER,
  protein_grams INTEGER,
  carbs_grams INTEGER,
  fat_grams INTEGER,
  meal_plan JSONB,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Progress logs table
CREATE TABLE progress_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  log_date DATE DEFAULT CURRENT_DATE,
  weight DECIMAL,
  body_fat_percentage DECIMAL,
  chest_cm DECIMAL,
  waist_cm DECIMAL,
  hips_cm DECIMAL,
  bicep_cm DECIMAL,
  workout_completed BOOLEAN DEFAULT FALSE,
  workout_notes TEXT,
  energy_level INTEGER CHECK (energy_level BETWEEN 1 AND 10),
  mood TEXT,
  water_intake DECIMAL,
  sleep_hours DECIMAL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Chat history table
CREATE TABLE chat_history (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  message TEXT NOT NULL,
  role TEXT CHECK (role IN ('user', 'assistant')),
  created_at TIMESTAMP DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE nutrition_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE progress_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE chat_history ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users manage own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users manage own workouts" ON workout_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own nutrition" ON nutrition_plans FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own progress" ON progress_logs FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users manage own chat" ON chat_history FOR ALL USING (auth.uid() = user_id);

-- Auto-create profile on signup trigger
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
