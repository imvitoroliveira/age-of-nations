-- Fix security warnings by setting search_path
ALTER FUNCTION public.generate_tracking_code() SET search_path = public;
ALTER FUNCTION public.set_tracking_code() SET search_path = public;
