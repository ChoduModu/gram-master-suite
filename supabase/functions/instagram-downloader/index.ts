import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY');

const supabase = createClient(supabaseUrl!, supabaseKey!);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { username, url, type } = await req.json();
    console.log('Instagram download request:', { username, url, type });

    // Simulate Instagram data (in production, this would use Instagram's API or web scraping)
    let mockData;
    
    if (type === 'profile' && username) {
      mockData = {
        success: true,
        data: {
          username: username,
          displayName: `${username.charAt(0).toUpperCase() + username.slice(1)} Creator`,
          bio: "Content creator | Digital artist | Inspiring others daily ✨",
          followers: Math.floor(Math.random() * 100000) + 1000,
          following: Math.floor(Math.random() * 1000) + 100,
          posts: Math.floor(Math.random() * 500) + 50,
          profilePicUrl: `https://picsum.photos/400/400?random=${username}`,
          isVerified: Math.random() > 0.8,
          isPrivate: Math.random() > 0.7
        }
      };
    } else if (type === 'reel' && url) {
      mockData = {
        success: true,
        data: {
          url: url,
          videoUrl: `https://sample-videos.com/zip/10/mp4/SampleVideo_1280x720_1mb.mp4`,
          thumbnail: `https://picsum.photos/400/600?random=${Date.now()}`,
          caption: "Amazing content! Check this out 🔥 #reels #viral #trending",
          likes: Math.floor(Math.random() * 50000) + 1000,
          comments: Math.floor(Math.random() * 1000) + 50,
          shares: Math.floor(Math.random() * 500) + 10,
          duration: Math.floor(Math.random() * 60) + 15,
          uploadDate: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString()
        }
      };
    } else {
      throw new Error('Invalid request parameters');
    }

    // Store analytics
    try {
      await supabase.from('download_analytics').insert({
        download_type: type,
        username: username || null,
        url: url || null,
        user_ip: req.headers.get('x-forwarded-for') || 'unknown',
        success: true
      });
    } catch (dbError) {
      console.warn('Database insert error:', dbError);
    }

    return new Response(JSON.stringify(mockData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in instagram-downloader function:', error);
    
    // Store failed attempt
    try {
      const { username, url, type } = await req.json();
      await supabase.from('download_analytics').insert({
        download_type: type,
        username: username || null,
        url: url || null,
        user_ip: req.headers.get('x-forwarded-for') || 'unknown',
        success: false
      });
    } catch {}

    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});