-- Drop functions if they exist with cascade to handle dependencies
DROP FUNCTION IF EXISTS generate_pairing_code() CASCADE;
DROP FUNCTION IF EXISTS find_profile_by_code(TEXT) CASCADE;

-- Function to generate a random pairing code
CREATE OR REPLACE FUNCTION generate_pairing_code() 
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  result TEXT := 'FIT-';
  i INTEGER := 0;
BEGIN
  FOR i IN 1..6 LOOP
    result := result || substr(chars, floor(random() * length(chars) + 1)::integer, 1);
  END LOOP;
  RETURN result;
END;
$$ LANGUAGE plpgsql;

-- Trigger function to ensure pairing_code exists
CREATE OR REPLACE FUNCTION ensure_profile_defaults()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.pairing_code IS NULL THEN
    NEW.pairing_code := generate_pairing_code();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to profiles
DROP TRIGGER IF EXISTS tr_ensure_profile_defaults ON public.profiles;
CREATE TRIGGER tr_ensure_profile_defaults
BEFORE INSERT ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION ensure_profile_defaults();

-- RPC function to safely find a partner by code without exposing all profiles via SELECT
CREATE OR REPLACE FUNCTION find_profile_by_code(search_code TEXT)
RETURNS TABLE (id UUID, display_name TEXT) 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN QUERY
  SELECT p.id, p.display_name
  FROM public.profiles p
  WHERE p.pairing_code = search_code
  LIMIT 1;
END;
$$ LANGUAGE plpgsql;

-- Grant access to the RPC
GRANT EXECUTE ON FUNCTION find_profile_by_code(TEXT) TO authenticated;

-- Ensure RLS allows updating own profile
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Ensure users can view their own profile and their partner's
DROP POLICY IF EXISTS "Users can view own profile and partner's" ON public.profiles;
CREATE POLICY "Users can view own profile and partner's" 
ON public.profiles 
FOR SELECT 
USING (
  auth.uid() = id 
  OR 
  id IN (SELECT p.partner_id FROM public.profiles p WHERE p.id = auth.uid())
  OR
  partner_id = auth.uid()
);
