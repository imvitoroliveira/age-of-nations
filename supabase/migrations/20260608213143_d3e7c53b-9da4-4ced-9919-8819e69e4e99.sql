-- Add created_by column if it doesn't exist
DO $$ 
BEGIN 
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'exercise_library' AND column_name = 'created_by') THEN
    ALTER TABLE public.exercise_library ADD COLUMN created_by UUID REFERENCES auth.users(id) DEFAULT auth.uid();
  END IF;
END $$;

-- Update existing rows to have a creator if possible (using the current user as a fallback for now if this is run by one)
-- In a real scenario, we might want to be more careful, but for this migration:
UPDATE public.exercise_library SET created_by = auth.uid() WHERE created_by IS NULL;

-- Enable RLS
ALTER TABLE public.exercise_library ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if any
DROP POLICY IF EXISTS "Anyone can view exercises" ON public.exercise_library;
DROP POLICY IF EXISTS "Authenticated users can insert exercises" ON public.exercise_library;
DROP POLICY IF EXISTS "Users can delete their own exercises" ON public.exercise_library;

-- Create policies
CREATE POLICY "Anyone can view exercises" 
ON public.exercise_library FOR SELECT 
TO authenticated 
USING (true);

CREATE POLICY "Authenticated users can insert exercises" 
ON public.exercise_library FOR INSERT 
TO authenticated 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can delete their own exercises" 
ON public.exercise_library FOR DELETE 
TO authenticated 
USING (auth.uid() = created_by);

-- Grant permissions
GRANT SELECT, INSERT, DELETE ON public.exercise_library TO authenticated;
GRANT ALL ON public.exercise_library TO service_role;
