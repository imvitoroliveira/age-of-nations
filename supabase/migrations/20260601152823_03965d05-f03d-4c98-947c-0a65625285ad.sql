ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS display_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS partner_name TEXT;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender TEXT;

GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;