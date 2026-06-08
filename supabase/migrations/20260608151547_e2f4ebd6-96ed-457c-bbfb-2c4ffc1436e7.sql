-- 1. Make username nullable to avoid strict constraints on automatic creation
ALTER TABLE public.profiles ALTER COLUMN username DROP NOT NULL;

-- 2. Ensure all existing users have a profile
INSERT INTO public.profiles (id, display_name, tracking_code)
SELECT id, email, UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 8))
FROM auth.users
ON CONFLICT (id) DO NOTHING;

-- 3. Function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name, tracking_code)
  VALUES (
    new.id, 
    COALESCE(new.raw_user_meta_data->>'display_name', new.email), 
    UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 8))
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger for new user profile creation
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 5. Ensure tracking_code is never null for existing profiles
UPDATE public.profiles 
SET tracking_code = UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 8))
WHERE tracking_code IS NULL;
