-- Add restrictive SELECT policy for download_analytics table
-- This prevents any public access to analytics data while maintaining INSERT functionality
CREATE POLICY "Restrict analytics data access" 
ON public.download_analytics 
FOR SELECT 
USING (false);

-- Note: This policy blocks all SELECT access to analytics data
-- In the future, when admin authentication is implemented, 
-- this can be updated to: USING (auth.jwt() ->> 'role' = 'admin')