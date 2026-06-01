DROP POLICY IF EXISTS "bm_access" ON public.body_measurements;
DROP POLICY IF EXISTS "ex_access" ON public.exercises;
DROP POLICY IF EXISTS "wp_access" ON public.workout_plans;
DROP POLICY IF EXISTS "ws_access" ON public.workout_sessions;

-- Add proper UPDATE/DELETE policies for body_measurements (only owner)
CREATE POLICY "Users can update own measurements"
ON public.body_measurements FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own measurements"
ON public.body_measurements FOR DELETE
USING (user_id = auth.uid());

-- Add UPDATE/DELETE policies for workout_sessions (only owner)
CREATE POLICY "Users can update own sessions"
ON public.workout_sessions FOR UPDATE
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can delete own sessions"
ON public.workout_sessions FOR DELETE
USING (user_id = auth.uid());