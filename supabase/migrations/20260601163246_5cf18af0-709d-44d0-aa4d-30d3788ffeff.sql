-- Fix security linter warning by setting search_path
ALTER FUNCTION public.generate_pairing_code() SET search_path = public;
