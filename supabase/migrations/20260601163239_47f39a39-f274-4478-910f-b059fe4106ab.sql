-- Add extended profile fields
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS height DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS initial_weight DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS goal TEXT,
ADD COLUMN IF NOT EXISTS pairing_code TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS theme_preference TEXT DEFAULT 'system' CHECK (theme_preference IN ('light', 'dark', 'system'));

-- Generate a unique pairing code for existing profiles that don't have one
UPDATE public.profiles 
SET pairing_code = 'FIT-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 6))
WHERE pairing_code IS NULL;

-- Create index for pairing_code search
CREATE INDEX IF NOT EXISTS idx_profiles_pairing_code ON public.profiles (pairing_code);

-- Function to generate pairing code for new profiles
CREATE OR REPLACE FUNCTION public.generate_pairing_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.pairing_code IS NULL THEN
    NEW.pairing_code := 'FIT-' || UPPER(SUBSTRING(REPLACE(gen_random_uuid()::text, '-', ''), 1, 6));
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to auto-generate pairing code on insert
DROP TRIGGER IF EXISTS tr_generate_pairing_code ON public.profiles;
CREATE TRIGGER tr_generate_pairing_code
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.generate_pairing_code();
