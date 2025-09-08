import { useState } from "react";
import { Sparkles, Copy, MessageSquareText, Hash, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function CaptionGenerator() {
  const [input, setInput] = useState("");
  const [niche, setNiche] = useState("");
  const [mood, setMood] = useState("");
  const [captions, setCaptions] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const niches = [
    "Fashion", "Travel", "Food", "Fitness", "Beauty", "Photography", 
    "Business", "Lifestyle", "Art", "Music", "Technology", "Health"
  ];

  const moods = [
    "Professional", "Casual", "Inspiring", "Funny", "Motivational", 
    "Educational", "Trendy", "Authentic", "Engaging", "Creative"
  ];

  const generateContent = async () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe what your post is about",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      // Generate captions
      const { data: captionData } = await supabase.functions.invoke('generate-content', {
        body: { type: 'caption', input, niche, mood }
      });

      if (captionData.success) {
        const parsedCaptions = captionData.content.split('\n\n').filter(c => c.trim());
        setCaptions(parsedCaptions);
      }

      // Generate hashtags
      const { data: hashtagData } = await supabase.functions.invoke('generate-content', {
        body: { type: 'hashtags', input, niche, mood }
      });

      if (hashtagData.success) {
        const parsedHashtags = hashtagData.content.match(/#\w+/g) || [];
        setHashtags(parsedHashtags);
      }

      toast({
        title: "Content Generated!",
        description: "Your captions and hashtags are ready",
      });
    } catch (error) {
      console.error('Error generating content:', error);
      toast({
        title: "Generation Failed",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Copied!",
      description: "Content copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl">
              <MessageSquareText className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            AI Caption & <span className="gradient-text">Hashtag Generator</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Generate engaging Instagram captions and trending hashtags with AI
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="tool-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                Content Details
              </CardTitle>
              <CardDescription>
                Tell us about your post to generate perfect captions and hashtags
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="content">What's your post about?</Label>
                <Textarea
                  id="content"
                  placeholder="Describe your post content, theme, or message..."
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  rows={4}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="niche">Niche (Optional)</Label>
                  <Select value={niche} onValueChange={setNiche}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select niche" />
                    </SelectTrigger>
                    <SelectContent>
                      {niches.map((n) => (
                        <SelectItem key={n} value={n.toLowerCase()}>
                          {n}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mood">Mood (Optional)</Label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mood" />
                    </SelectTrigger>
                    <SelectContent>
                      {moods.map((m) => (
                        <SelectItem key={m} value={m.toLowerCase()}>
                          {m}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button 
                onClick={generateContent} 
                disabled={isLoading}
                variant="gradient"
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <>Generating...</>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Content
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {/* Generated Captions */}
            {captions.length > 0 && (
              <Card className="tool-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageSquareText className="h-5 w-5 text-primary" />
                    Generated Captions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {captions.map((caption, index) => (
                    <div key={index} className="relative group">
                      <div className="p-4 bg-muted/50 rounded-lg">
                        <p className="text-sm whitespace-pre-wrap">{caption}</p>
                      </div>
                      <Button
                        variant="copy"
                        size="sm"
                        onClick={() => copyToClipboard(caption)}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Generated Hashtags */}
            {hashtags.length > 0 && (
              <Card className="tool-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Hash className="h-5 w-5 text-primary" />
                    Generated Hashtags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hashtags.map((hashtag, index) => (
                      <span 
                        key={index}
                        className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm cursor-pointer hover:bg-primary/20 transition-colors"
                        onClick={() => copyToClipboard(hashtag)}
                      >
                        {hashtag}
                      </span>
                    ))}
                  </div>
                  <Button
                    variant="gradient"
                    onClick={() => copyToClipboard(hashtags.join(' '))}
                    className="w-full"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy All Hashtags
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}