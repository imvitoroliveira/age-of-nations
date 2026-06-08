ALTER TABLE public.exercises ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Adiciona também uma coluna video_url para workout_plans, caso o usuário queira um vídeo para o treino todo
ALTER TABLE public.workout_plans ADD COLUMN IF NOT EXISTS video_url TEXT;

-- Concede permissões para garantir que o acesso funcione corretamente
GRANT SELECT, INSERT, UPDATE, DELETE ON public.exercises TO authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.workout_plans TO authenticated;
GRANT ALL ON public.exercises TO service_role;
GRANT ALL ON public.workout_plans TO service_role;