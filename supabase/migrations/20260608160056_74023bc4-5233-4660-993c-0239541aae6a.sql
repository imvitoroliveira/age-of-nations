ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_measurement_date TIMESTAMP WITH TIME ZONE;

-- Create body_measurements if it doesn't exist (just in case, based on schema context)
CREATE TABLE IF NOT EXISTS public.body_measurements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    weight_kg NUMERIC,
    waist_cm NUMERIC,
    thigh_cm NUMERIC,
    hip_cm NUMERIC,
    recorded_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.body_measurements TO authenticated;
GRANT ALL ON public.body_measurements TO service_role;

ALTER TABLE public.body_measurements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage their own measurements" ON public.body_measurements 
FOR ALL USING (auth.uid() = user_id) WITH CHECK (auth.uid() = user_id);
