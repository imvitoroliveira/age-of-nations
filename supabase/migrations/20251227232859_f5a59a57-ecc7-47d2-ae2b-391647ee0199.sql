-- Fix function search paths for security
CREATE OR REPLACE FUNCTION public.update_player_stats()
RETURNS TRIGGER 
LANGUAGE plpgsql 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
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
$$;

CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$;