-- Create table for generated content and analytics
CREATE TABLE public.generated_content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  tool_type TEXT NOT NULL CHECK (tool_type IN ('caption', 'bio', 'hashtag')),
  input_text TEXT NOT NULL,
  generated_text TEXT NOT NULL,
  user_ip TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for trending hashtags
CREATE TABLE public.trending_hashtags (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  hashtag TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL,
  usage_count INTEGER DEFAULT 0,
  trending_score REAL DEFAULT 0.0,
  last_updated TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table for download analytics
CREATE TABLE public.download_analytics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  download_type TEXT NOT NULL CHECK (download_type IN ('profile', 'reel', 'post')),
  username TEXT,
  url TEXT,
  user_ip TEXT,
  success BOOLEAN DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security (RLS) for public access
ALTER TABLE public.generated_content ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trending_hashtags ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.download_analytics ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (no authentication required)
CREATE POLICY "Allow public insert on generated_content" 
ON public.generated_content 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Allow public select on trending_hashtags" 
ON public.trending_hashtags 
FOR SELECT 
USING (true);

CREATE POLICY "Allow public insert on download_analytics" 
ON public.download_analytics 
FOR INSERT 
WITH CHECK (true);

-- Insert some sample trending hashtags
INSERT INTO public.trending_hashtags (hashtag, category, usage_count, trending_score) VALUES
('#instagram', 'general', 1000000, 9.5),
('#reels', 'content', 800000, 9.2),
('#photography', 'creative', 600000, 8.8),
('#fashion', 'lifestyle', 550000, 8.5),
('#travel', 'lifestyle', 500000, 8.3),
('#food', 'lifestyle', 450000, 8.0),
('#fitness', 'lifestyle', 400000, 7.8),
('#art', 'creative', 350000, 7.5),
('#music', 'entertainment', 300000, 7.2),
('#business', 'professional', 250000, 7.0),
('#motivation', 'inspiration', 200000, 6.8),
('#love', 'general', 180000, 6.5),
('#nature', 'photography', 160000, 6.2),
('#style', 'fashion', 140000, 6.0),
('#beauty', 'lifestyle', 120000, 5.8);

-- Create function to update trending scores
CREATE OR REPLACE FUNCTION public.update_trending_scores()
RETURNS void AS $$
BEGIN
  UPDATE public.trending_hashtags 
  SET trending_score = LEAST(10.0, trending_score + (RANDOM() * 0.5 - 0.25)),
      last_updated = now()
  WHERE last_updated < now() - INTERVAL '1 hour';
END;
$$ LANGUAGE plpgsql;