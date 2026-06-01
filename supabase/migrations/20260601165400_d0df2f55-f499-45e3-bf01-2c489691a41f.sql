-- Update functions to include search_path for security
ALTER FUNCTION generate_pairing_code() SET search_path = public;
ALTER FUNCTION ensure_profile_defaults() SET search_path = public;

-- For find_profile_by_code, it already has SET search_path = public.
-- To address the warning about authenticated users executing it, 
-- we confirm this is intended as it's the only way to search by pairing_code 
-- without broad SELECT permissions.
