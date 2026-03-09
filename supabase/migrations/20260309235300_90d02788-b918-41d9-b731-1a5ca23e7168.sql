
-- Update profiles table for Kidari
ALTER TABLE public.profiles
  DROP COLUMN IF EXISTS country_id,
  DROP COLUMN IF EXISTS wins,
  DROP COLUMN IF EXISTS losses,
  DROP COLUMN IF EXISTS games_played,
  DROP COLUMN IF EXISTS total_score,
  DROP COLUMN IF EXISTS rank_points,
  ADD COLUMN IF NOT EXISTS parent_pin TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS is_premium BOOLEAN DEFAULT FALSE,
  ADD COLUMN IF NOT EXISTS premium_until TIMESTAMP WITH TIME ZONE DEFAULT NULL;

-- Children table
CREATE TABLE public.children (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  parent_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  age INTEGER NOT NULL DEFAULT 2,
  age_group TEXT NOT NULL DEFAULT 'mini',
  avatar_emoji TEXT NOT NULL DEFAULT '🐻',
  avatar_accessories JSONB DEFAULT '[]'::jsonb,
  farm_items JSONB DEFAULT '[]'::jsonb,
  total_stars INTEGER DEFAULT 0,
  level INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.children ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view their children" ON public.children
  FOR SELECT USING (auth.uid() = parent_id);
CREATE POLICY "Parents can insert children" ON public.children
  FOR INSERT WITH CHECK (auth.uid() = parent_id);
CREATE POLICY "Parents can update their children" ON public.children
  FOR UPDATE USING (auth.uid() = parent_id);
CREATE POLICY "Parents can delete their children" ON public.children
  FOR DELETE USING (auth.uid() = parent_id);

-- Progress tracking
CREATE TABLE public.activity_progress (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  category TEXT NOT NULL,
  correct_count INTEGER DEFAULT 0,
  total_count INTEGER DEFAULT 0,
  stars_earned INTEGER DEFAULT 0,
  streak INTEGER DEFAULT 0,
  best_streak INTEGER DEFAULT 0,
  last_played_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(child_id, category)
);

ALTER TABLE public.activity_progress ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Parents can view child progress" ON public.activity_progress
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.children WHERE children.id = activity_progress.child_id AND children.parent_id = auth.uid()));
CREATE POLICY "Parents can insert child progress" ON public.activity_progress
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.children WHERE children.id = activity_progress.child_id AND children.parent_id = auth.uid()));
CREATE POLICY "Parents can update child progress" ON public.activity_progress
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.children WHERE children.id = activity_progress.child_id AND children.parent_id = auth.uid()));

-- Achievements
CREATE TABLE public.achievements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  achievement_key TEXT NOT NULL,
  unlocked_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(child_id, achievement_key)
);

ALTER TABLE public.achievements ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view achievements" ON public.achievements
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.children WHERE children.id = achievements.child_id AND children.parent_id = auth.uid()));
CREATE POLICY "Parents can insert achievements" ON public.achievements
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.children WHERE children.id = achievements.child_id AND children.parent_id = auth.uid()));

-- Daily usage tracking
CREATE TABLE public.daily_usage (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  seconds_used INTEGER DEFAULT 0,
  activities_completed INTEGER DEFAULT 0,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  UNIQUE(child_id, usage_date)
);

ALTER TABLE public.daily_usage ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view daily usage" ON public.daily_usage
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.children WHERE children.id = daily_usage.child_id AND children.parent_id = auth.uid()));
CREATE POLICY "Parents can insert daily usage" ON public.daily_usage
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.children WHERE children.id = daily_usage.child_id AND children.parent_id = auth.uid()));
CREATE POLICY "Parents can update daily usage" ON public.daily_usage
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.children WHERE children.id = daily_usage.child_id AND children.parent_id = auth.uid()));

-- Screen time settings
CREATE TABLE public.screen_time_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  child_id UUID REFERENCES public.children(id) ON DELETE CASCADE NOT NULL UNIQUE,
  daily_limit_minutes INTEGER DEFAULT 15,
  break_interval_minutes INTEGER DEFAULT 10,
  break_duration_minutes INTEGER DEFAULT 2,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

ALTER TABLE public.screen_time_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Parents can view screen time settings" ON public.screen_time_settings
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.children WHERE children.id = screen_time_settings.child_id AND children.parent_id = auth.uid()));
CREATE POLICY "Parents can insert screen time settings" ON public.screen_time_settings
  FOR INSERT WITH CHECK (EXISTS (SELECT 1 FROM public.children WHERE children.id = screen_time_settings.child_id AND children.parent_id = auth.uid()));
CREATE POLICY "Parents can update screen time settings" ON public.screen_time_settings
  FOR UPDATE USING (EXISTS (SELECT 1 FROM public.children WHERE children.id = screen_time_settings.child_id AND children.parent_id = auth.uid()));

-- Triggers
CREATE TRIGGER update_children_updated_at BEFORE UPDATE ON public.children
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
CREATE TRIGGER update_progress_updated_at BEFORE UPDATE ON public.activity_progress
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
