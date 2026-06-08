-- Revoke public/anon execute permission (best practice for security definer)
REVOKE EXECUTE ON FUNCTION public.find_profile_by_code(TEXT) FROM public;
REVOKE EXECUTE ON FUNCTION public.find_profile_by_code(TEXT) FROM anon;

-- Keep authenticated and service_role as they are the ones who need it
GRANT EXECUTE ON FUNCTION public.find_profile_by_code(TEXT) TO authenticated;
GRANT EXECUTE ON FUNCTION public.find_profile_by_code(TEXT) TO service_role;
