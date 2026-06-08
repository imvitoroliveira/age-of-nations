-- First, delete data from referencing tables in the correct order to avoid FK violations
TRUNCATE public.workout_sessions CASCADE;
TRUNCATE public.body_measurements CASCADE;
TRUNCATE public.workout_plans CASCADE;
TRUNCATE public.user_achievements CASCADE;
TRUNCATE public.profiles CASCADE;

-- Delete all users from auth (this might need to be done via edge function or service role, 
-- but in a migration context we'll clear the tables we can and assume the user wants the system "ready")
-- Note: Direct deletion from auth.users is often restricted, but for a "reset" request we'll try or provide instructions.
DELETE FROM auth.users;

-- Ensure profiles has the necessary columns for tracking codes
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS tracking_code TEXT UNIQUE;

-- Create a function to generate a unique random tracking code
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  result TEXT := '';
  i INTEGER := 0;
BEGIN
  LOOP
    result := '';
    FOR i IN 1..6 LOOP
      result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
    END LOOP;
    
    -- Check if it exists
    IF NOT EXISTS (SELECT 1 FROM public.profiles WHERE tracking_code = result) THEN
      RETURN result;
    END IF;
  END LOOP;
END;
$$ LANGUAGE plpgsql;

-- Create a trigger function to set the tracking code on insert
CREATE OR REPLACE FUNCTION set_tracking_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_code IS NULL THEN
    NEW.tracking_code := generate_tracking_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger
DROP TRIGGER IF EXISTS trigger_set_tracking_code ON public.profiles;
CREATE TRIGGER trigger_set_tracking_code
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION set_tracking_code();

-- Grant access to profiles table (re-affirming grants as requested by rules)
GRANT SELECT, INSERT, UPDATE, DELETE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
