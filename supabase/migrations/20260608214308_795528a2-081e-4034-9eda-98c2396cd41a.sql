-- 1. Profiles Table: Restrict SELECT to mutual confirmation
DROP POLICY IF EXISTS "Users can view relevant profiles" ON public.profiles;
CREATE POLICY "Users can view relevant profiles" ON public.profiles
FOR SELECT TO authenticated
USING (
  auth.uid() = id 
  OR 
  (partner_id = auth.uid() AND id IN (SELECT partner_id FROM public.profiles WHERE id = auth.uid()))
);

-- 2. Exercise Library: Remove overly broad policies and enforce ownership
DROP POLICY IF EXISTS "Users can view the exercise library" ON public.exercise_library;
DROP POLICY IF EXISTS "Users can add to the exercise library" ON public.exercise_library;
DROP POLICY IF EXISTS "Users can update their entries in the library" ON public.exercise_library;
DROP POLICY IF EXISTS "Users can delete from the library" ON public.exercise_library;
DROP POLICY IF EXISTS "Anyone can view exercises" ON public.exercise_library;
DROP POLICY IF EXISTS "Authenticated users can insert exercises" ON public.exercise_library;
DROP POLICY IF EXISTS "Users can delete their own exercises" ON public.exercise_library;

CREATE POLICY "Anyone can view exercises" ON public.exercise_library
FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can insert exercises" ON public.exercise_library
FOR INSERT TO authenticated WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own exercises" ON public.exercise_library
FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete own exercises" ON public.exercise_library
FOR DELETE TO authenticated USING (auth.uid() = created_by);

-- 3. Workout Plans: Restrict UPDATE to creator only
DROP POLICY IF EXISTS "Users can update relevant workout plans" ON public.workout_plans;
CREATE POLICY "Users can update own workout plans" ON public.workout_plans
FOR UPDATE TO authenticated USING (auth.uid() = created_by) WITH CHECK (auth.uid() = created_by);

-- 4. Storage: Secure deletion from exercise-videos
DROP POLICY IF EXISTS "Allow authenticated deletion from exercise-videos" ON storage.objects;
CREATE POLICY "Allow owners to delete their videos" ON storage.objects
FOR DELETE TO authenticated
USING (bucket_id = 'exercise-videos' AND (storage.foldername(name))[1] = auth.uid()::text);

-- 5. Functions: Switch to SECURITY INVOKER using correct signatures
ALTER FUNCTION public.find_profile_by_code(search_code text) SECURITY INVOKER;
ALTER FUNCTION public.link_partner(pairing_code text) SECURITY INVOKER;
ALTER FUNCTION public.unlink_partner(partner_id_param uuid) SECURITY INVOKER;
ALTER FUNCTION public.add_body_measurement(weight_kg_param numeric, waist_cm_param numeric, thigh_cm_param numeric, hip_cm_param numeric) SECURITY INVOKER;
