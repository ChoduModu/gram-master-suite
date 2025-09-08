-- Fix security warning by setting search_path for the function
CREATE OR REPLACE FUNCTION public.update_trending_scores()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.trending_hashtags 
  SET trending_score = LEAST(10.0, trending_score + (RANDOM() * 0.5 - 0.25)),
      last_updated = now()
  WHERE last_updated < now() - INTERVAL '1 hour';
END;
$$;