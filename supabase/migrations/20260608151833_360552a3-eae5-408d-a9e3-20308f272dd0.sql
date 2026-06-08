-- 1. Drop existing problematic policies
DROP POLICY IF EXISTS "Users can view own profile and partner's" ON public.profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;

-- 2. Create clean, non-recursive policies
-- Simple Select: User can see their own profile OR profiles where they are the partner
CREATE POLICY "Users can view relevant profiles" ON public.profiles
FOR SELECT USING (
  auth.uid() = id 
  OR 
  partner_id = auth.uid()
);

-- Update: Only owner can update
CREATE POLICY "Users can update own profile" ON public.profiles
FOR UPDATE USING (auth.uid() = id) WITH CHECK (auth.uid() = id);

-- Insert: Only owner can insert
CREATE POLICY "Users can insert own profile" ON public.profiles
FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Ensure profiles exist for all users (one more time to be sure)
INSERT INTO public.profiles (id, display_name, tracking_code)
SELECT id, email, UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 8))
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 4. Ensure tracking_code is set for everyone
UPDATE public.profiles 
SET tracking_code = UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 8))
WHERE tracking_code IS NULL OR tracking_code = '';
