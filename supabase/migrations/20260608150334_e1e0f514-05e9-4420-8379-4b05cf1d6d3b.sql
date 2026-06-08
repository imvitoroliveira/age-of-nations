-- 1. Ensure tracking code trigger exists
CREATE OR REPLACE FUNCTION public.set_tracking_code()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.tracking_code IS NULL THEN
    NEW.tracking_code := generate_tracking_code();
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS tr_set_tracking_code ON public.profiles;
CREATE TRIGGER tr_set_tracking_code
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.set_tracking_code();

-- 2. Generate tracking codes for existing users who don't have one
UPDATE public.profiles SET tracking_code = generate_tracking_code() WHERE tracking_code IS NULL OR tracking_code = '';

-- 3. Add bio and fitness_goals columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS bio TEXT;
COMMENT ON COLUMN public.profiles.bio IS 'User personal description, limited to 150 characters';
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS fitness_goals TEXT[];

-- 4. Update RLS policies for workout_plans to allow partner access
-- First, drop existing policies to recreate them with partner logic
DROP POLICY IF EXISTS "Users can view relevant workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can create workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can update relevant workout plans" ON public.workout_plans;
DROP POLICY IF EXISTS "Users can delete own workout plans" ON public.workout_plans;

-- Recreate policies
CREATE POLICY "Users can view relevant workout plans" ON public.workout_plans
FOR SELECT USING (
  created_by = auth.uid() OR 
  assigned_to = auth.uid() OR
  created_by IN (SELECT partner_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can create workout plans" ON public.workout_plans
FOR INSERT WITH CHECK (
  created_by = auth.uid() AND (
    assigned_to = auth.uid() OR 
    assigned_to IN (SELECT partner_id FROM public.profiles WHERE id = auth.uid())
  )
);

CREATE POLICY "Users can update relevant workout plans" ON public.workout_plans
FOR UPDATE USING (
  created_by = auth.uid() OR 
  assigned_to = auth.uid() OR
  created_by IN (SELECT partner_id FROM public.profiles WHERE id = auth.uid())
);

CREATE POLICY "Users can delete own workout plans" ON public.workout_plans
FOR DELETE USING (
  created_by = auth.uid()
);

-- 5. Ensure exercises also follow similar logic
DROP POLICY IF EXISTS "Users can view exercises for accessible plans" ON public.exercises;
DROP POLICY IF EXISTS "Users can manage exercises for their created plans" ON public.exercises;

CREATE POLICY "Users can view exercises for accessible plans" ON public.exercises
FOR SELECT USING (
  EXISTS (
    SELECT 1 FROM public.workout_plans wp
    WHERE wp.id = exercises.workout_plan_id AND (
      wp.created_by = auth.uid() OR 
      wp.assigned_to = auth.uid() OR
      wp.created_by IN (SELECT partner_id FROM public.profiles WHERE id = auth.uid())
    )
  )
);

CREATE POLICY "Users can manage exercises for their created plans" ON public.exercises
FOR ALL USING (
  EXISTS (
    SELECT 1 FROM public.workout_plans wp
    WHERE wp.id = exercises.workout_plan_id AND (
      wp.created_by = auth.uid()
    )
  )
);

-- Grant permissions (standard procedure)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_plans TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exercises TO authenticated;
GRANT ALL ON public.workout_plans TO service_role;
GRANT ALL ON public.exercises TO service_role;
