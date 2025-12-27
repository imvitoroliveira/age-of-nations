-- Create profiles table for player stats
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  avatar_url TEXT,
  country_id TEXT DEFAULT 'usa',
  wins INTEGER DEFAULT 0,
  losses INTEGER DEFAULT 0,
  games_played INTEGER DEFAULT 0,
  total_score INTEGER DEFAULT 0,
  rank_points INTEGER DEFAULT 1000,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies
CREATE POLICY "Profiles are viewable by everyone" 
  ON public.profiles FOR SELECT 
  USING (true);

CREATE POLICY "Users can update their own profile" 
  ON public.profiles FOR UPDATE 
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile" 
  ON public.profiles FOR INSERT 
  WITH CHECK (auth.uid() = id);

-- Create game rooms table
CREATE TABLE public.game_rooms (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  host_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  status TEXT DEFAULT 'waiting' CHECK (status IN ('waiting', 'starting', 'in_progress', 'finished')),
  max_players INTEGER DEFAULT 2,
  map_size TEXT DEFAULT 'medium',
  ai_difficulty TEXT DEFAULT 'medium',
  starting_resources TEXT DEFAULT 'medium',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  finished_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on game_rooms
ALTER TABLE public.game_rooms ENABLE ROW LEVEL SECURITY;

-- Game rooms policies
CREATE POLICY "Game rooms are viewable by everyone" 
  ON public.game_rooms FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can create rooms" 
  ON public.game_rooms FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Host can update their room" 
  ON public.game_rooms FOR UPDATE 
  USING (auth.uid() = host_id);

CREATE POLICY "Host can delete their room" 
  ON public.game_rooms FOR DELETE 
  USING (auth.uid() = host_id);

-- Create game room players junction table
CREATE TABLE public.game_room_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.game_rooms(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  country_id TEXT NOT NULL,
  team INTEGER DEFAULT 1,
  is_ready BOOLEAN DEFAULT false,
  joined_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(room_id, player_id)
);

-- Enable RLS on game_room_players
ALTER TABLE public.game_room_players ENABLE ROW LEVEL SECURITY;

-- Game room players policies
CREATE POLICY "Room players are viewable by everyone" 
  ON public.game_room_players FOR SELECT 
  USING (true);

CREATE POLICY "Authenticated users can join rooms" 
  ON public.game_room_players FOR INSERT 
  WITH CHECK (auth.uid() = player_id);

CREATE POLICY "Players can update their own entry" 
  ON public.game_room_players FOR UPDATE 
  USING (auth.uid() = player_id);

CREATE POLICY "Players can leave rooms" 
  ON public.game_room_players FOR DELETE 
  USING (auth.uid() = player_id);

-- Create match history table
CREATE TABLE public.match_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  room_id UUID REFERENCES public.game_rooms(id) ON DELETE SET NULL,
  winner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  duration_seconds INTEGER,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on match_history
ALTER TABLE public.match_history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match history is viewable by everyone" 
  ON public.match_history FOR SELECT 
  USING (true);

CREATE POLICY "System can insert match history" 
  ON public.match_history FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create match players table for detailed stats
CREATE TABLE public.match_players (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  match_id UUID REFERENCES public.match_history(id) ON DELETE CASCADE,
  player_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
  country_id TEXT NOT NULL,
  is_winner BOOLEAN DEFAULT false,
  score INTEGER DEFAULT 0,
  units_created INTEGER DEFAULT 0,
  units_lost INTEGER DEFAULT 0,
  buildings_created INTEGER DEFAULT 0,
  buildings_lost INTEGER DEFAULT 0,
  resources_gathered JSONB DEFAULT '{"wood": 0, "food": 0, "gold": 0, "stone": 0}'
);

-- Enable RLS on match_players
ALTER TABLE public.match_players ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Match players are viewable by everyone" 
  ON public.match_players FOR SELECT 
  USING (true);

CREATE POLICY "System can insert match players" 
  ON public.match_players FOR INSERT 
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create function to update profile stats after a match
CREATE OR REPLACE FUNCTION public.update_player_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update winner stats
  IF NEW.is_winner THEN
    UPDATE public.profiles
    SET 
      wins = wins + 1,
      games_played = games_played + 1,
      total_score = total_score + NEW.score,
      rank_points = rank_points + 25,
      updated_at = NOW()
    WHERE id = NEW.player_id;
  ELSE
    UPDATE public.profiles
    SET 
      losses = losses + 1,
      games_played = games_played + 1,
      total_score = total_score + NEW.score,
      rank_points = GREATEST(0, rank_points - 15),
      updated_at = NOW()
    WHERE id = NEW.player_id;
  END IF;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create trigger for updating stats
CREATE TRIGGER on_match_player_insert
  AFTER INSERT ON public.match_players
  FOR EACH ROW
  EXECUTE FUNCTION public.update_player_stats();

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for profiles timestamp
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Enable realtime for game rooms and players
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_rooms;
ALTER PUBLICATION supabase_realtime ADD TABLE public.game_room_players;

-- Set REPLICA IDENTITY for realtime
ALTER TABLE public.game_rooms REPLICA IDENTITY FULL;
ALTER TABLE public.game_room_players REPLICA IDENTITY FULL;