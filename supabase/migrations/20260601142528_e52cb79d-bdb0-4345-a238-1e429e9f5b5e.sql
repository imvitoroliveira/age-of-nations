-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. ADJUST PROFILES
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='birth_date') THEN
        ALTER TABLE public.profiles ADD COLUMN birth_date DATE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='height_cm') THEN
        ALTER TABLE public.profiles ADD COLUMN height_cm NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='weight_kg') THEN
        ALTER TABLE public.profiles ADD COLUMN weight_kg NUMERIC;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='goal') THEN
        ALTER TABLE public.profiles ADD COLUMN goal TEXT DEFAULT 'fat_loss' CHECK (goal IN ('fat_loss', 'muscle_gain', 'maintenance'));
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='profiles' AND column_name='partner_id') THEN
        ALTER TABLE public.profiles ADD COLUMN partner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 3. CREATE OTHER TABLES (Dropping first to ensure a clean state for these)
DROP TABLE IF EXISTS public.user_achievements CASCADE;
DROP TABLE IF EXISTS public.achievements CASCADE;
DROP TABLE IF EXISTS public.body_measurements CASCADE;
DROP TABLE IF EXISTS public.workout_sessions CASCADE;
DROP TABLE IF EXISTS public.exercises CASCADE;
DROP TABLE IF EXISTS public.workout_plans CASCADE;

CREATE TABLE public.workout_plans (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  assigned_to UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  muscle_groups TEXT[] DEFAULT '{}',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.exercises (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  workout_plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  sets INTEGER NOT NULL,
  reps TEXT NOT NULL,
  rest_seconds INTEGER,
  weight_kg NUMERIC,
  notes TEXT,
  order_index INTEGER NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.workout_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE SET NULL,
  started_at TIMESTAMPTZ DEFAULT now(),
  finished_at TIMESTAMPTZ,
  duration_minutes INTEGER,
  notes TEXT
);

CREATE TABLE public.body_measurements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recorded_at DATE NOT NULL DEFAULT CURRENT_DATE,
  weight_kg NUMERIC,
  waist_cm NUMERIC,
  hip_cm numeric,
  chest_cm numeric,
  arm_cm numeric,
  thigh_cm numeric,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  icon TEXT NOT NULL,
  category TEXT NOT NULL CHECK (category IN ('streak', 'milestone', 'couple', 'body')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE public.user_achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  achievement_id UUID NOT NULL REFERENCES public.achievements(id) ON DELETE CASCADE,
  unlocked_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, achievement_id)
);

-- 4. RLS & GRANTS

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_achievements ENABLE ROW LEVEL SECURITY;

GRANT ALL ON ALL TABLES IN SCHEMA public TO postgres, service_role;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_plans TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exercises TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_sessions TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.body_measurements TO authenticated;
GRANT SELECT ON public.achievements TO authenticated;
GRANT SELECT, INSERT ON public.user_achievements TO authenticated;

-- Policies
CREATE POLICY "Users can view own profile and partner's" ON public.profiles FOR SELECT USING (auth.uid() = id OR partner_id = auth.uid());
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can view relevant workout plans" ON public.workout_plans FOR SELECT USING (created_by = auth.uid() OR assigned_to = auth.uid());
CREATE POLICY "Users can create workout plans" ON public.workout_plans FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can update relevant workout plans" ON public.workout_plans FOR UPDATE USING (created_by = auth.uid() OR assigned_to = auth.uid());
CREATE POLICY "Users can delete own workout plans" ON public.workout_plans FOR DELETE USING (created_by = auth.uid());

CREATE POLICY "Users can view exercises for accessible plans" ON public.exercises FOR SELECT USING (EXISTS (SELECT 1 FROM public.workout_plans WHERE id = workout_plan_id));
CREATE POLICY "Users can manage exercises for their created plans" ON public.exercises FOR ALL USING (EXISTS (SELECT 1 FROM public.workout_plans WHERE id = workout_plan_id AND created_by = auth.uid()));

CREATE POLICY "Users can view own sessions and partner's" ON public.workout_sessions FOR SELECT USING (user_id = auth.uid() OR user_id IN (SELECT partner_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can insert own sessions" ON public.workout_sessions FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can view own measurements and partner's" ON public.body_measurements FOR SELECT USING (user_id = auth.uid() OR user_id IN (SELECT partner_id FROM public.profiles WHERE id = auth.uid()));
CREATE POLICY "Users can insert own measurements" ON public.body_measurements FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Achievements are viewable by all" ON public.achievements FOR SELECT USING (true);
CREATE POLICY "Users can view achievements" ON public.user_achievements FOR SELECT USING (user_id = auth.uid() OR user_id IN (SELECT partner_id FROM public.profiles WHERE id = auth.uid()));

-- 5. INITIAL SEED DATA
INSERT INTO public.achievements (key, title, description, icon, category) VALUES
('first_workout', 'Primeiro Treino', 'Realize seu primeiro treino', 'Play', 'milestone'),
('week_streak_1', 'Semana Completa', 'Treine 5x em uma semana', 'Flame', 'streak'),
('ten_workouts', 'Força de Vontade', '10 treinos realizados', 'Dumbbell', 'milestone'),
('couple_sync', 'Em Sincronia', 'Ambos treinaram no mesmo dia', 'Heart', 'couple'),
('first_measurement', 'Ponto de Partida', 'Primeiro registro de medidas', 'Ruler', 'body'),
('weight_loss_1kg', 'Primeiro Quilo', 'Perdeu 1kg desde o início', 'TrendingDown', 'body')
ON CONFLICT (key) DO NOTHING;
