-- 1. Add custom_fitness_goal column
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS custom_fitness_goal TEXT;

-- 2. Ensure every single profile has a tracking code right now
UPDATE public.profiles 
SET tracking_code = generate_tracking_code() 
WHERE tracking_code IS NULL OR tracking_code = '' OR tracking_code = '---';

-- 3. Improve the trigger function to be extra safe
CREATE OR REPLACE FUNCTION public.set_tracking_code()
 RETURNS trigger
 LANGUAGE plpgsql
 SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.tracking_code IS NULL OR NEW.tracking_code = '' OR NEW.tracking_code = '---' THEN
    NEW.tracking_code := generate_tracking_code();
  END IF;
  RETURN NEW;
END;
$$;
