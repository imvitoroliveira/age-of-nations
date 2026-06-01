-- Planos de Treino
CREATE TABLE IF NOT EXISTS public.workout_plans (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_plans TO authenticated;
ALTER TABLE public.workout_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "wp_access" ON public.workout_plans FOR ALL TO authenticated USING (true);

-- Exercícios
CREATE TABLE IF NOT EXISTS public.exercises (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_plan_id UUID REFERENCES public.workout_plans(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    sets INTEGER,
    reps TEXT,
    weight_kg NUMERIC,
    rest_seconds INTEGER,
    notes TEXT,
    order_index INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.exercises TO authenticated;
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ex_access" ON public.exercises FOR ALL TO authenticated USING (true);

-- Sessões de Treino
CREATE TABLE IF NOT EXISTS public.workout_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workout_plan_id UUID REFERENCES public.workout_plans(id) NOT NULL,
    started_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    completed_at TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    mood TEXT,
    intensity INTEGER
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_sessions TO authenticated;
ALTER TABLE public.workout_sessions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "ws_access" ON public.workout_sessions FOR ALL TO authenticated USING (true);

-- Medições Corporais
CREATE TABLE IF NOT EXISTS public.body_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    weight NUMERIC,
    body_fat NUMERIC,
    waist NUMERIC,
    hip NUMERIC,
    measured_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.body_measurements TO authenticated;
ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "bm_access" ON public.body_measurements FOR ALL TO authenticated USING (true);