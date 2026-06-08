CREATE TABLE public.exercise_library (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    video_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.exercise_library TO authenticated;
GRANT ALL ON public.exercise_library TO service_role;

ALTER TABLE public.exercise_library ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view the exercise library" ON public.exercise_library
    FOR SELECT TO authenticated USING (true);

CREATE POLICY "Users can add to the exercise library" ON public.exercise_library
    FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Users can update their entries in the library" ON public.exercise_library
    FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Users can delete from the library" ON public.exercise_library
    FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_exercise_library_updated_at 
    BEFORE UPDATE ON public.exercise_library 
    FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();