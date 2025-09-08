import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
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
    const { type, input, niche, mood } = await req.json();
    console.log('Received request:', { type, input, niche, mood });

    let systemPrompt = '';
    let userPrompt = '';
    
    if (type === 'caption') {
      systemPrompt = `You are an expert Instagram caption writer. Create engaging, authentic captions that drive engagement. Include relevant emojis and call-to-actions. Always provide exactly 5 different caption options.`;
      userPrompt = `Create 5 Instagram captions for: "${input}". Niche: ${niche || 'general'}. Mood: ${mood || 'engaging'}. Make them varied in length and style.`;
    } else if (type === 'bio') {
      systemPrompt = `You are an expert at writing Instagram bios. Create compelling, concise bios that capture personality and purpose. Include relevant emojis and call-to-actions when appropriate. Always provide exactly 7 different bio options.`;
      userPrompt = `Create 7 Instagram bio options for: "${input}". Niche: ${niche || 'general'}. Mood: ${mood || 'professional'}. Make them varied in style and length (under 150 characters each).`;
    } else if (type === 'hashtags') {
      systemPrompt = `You are an expert at Instagram hashtag research. Provide a mix of popular, medium, and niche hashtags. Always provide exactly 30 hashtags.`;
      userPrompt = `Generate 30 relevant Instagram hashtags for: "${input}". Niche: ${niche || 'general'}. Include a mix of popular (#100k+ posts), medium (#10k-100k posts), and niche hashtags (#1k-10k posts).`;
    }

    console.log('Making request to OpenAI API...');
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.8,
        max_tokens: 1000,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    const generatedText = data.choices[0].message.content;
    console.log('Generated content:', generatedText);

    // Store in database for analytics
    try {
      await supabase.from('generated_content').insert({
        tool_type: type,
        input_text: input,
        generated_text: generatedText,
        user_ip: req.headers.get('x-forwarded-for') || 'unknown'
      });
    } catch (dbError) {
      console.warn('Database insert error:', dbError);
      // Don't fail the request if DB insert fails
    }

    return new Response(JSON.stringify({ 
      success: true, 
      content: generatedText,
      type: type
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in generate-content function:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      error: error.message 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});