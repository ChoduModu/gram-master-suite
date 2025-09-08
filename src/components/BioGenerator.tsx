import { useState } from "react";
import { PenTool, Copy, Sparkles, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export function BioGenerator() {
  const [input, setInput] = useState("");
  const [niche, setNiche] = useState("");
  const [mood, setMood] = useState("");
  const [bios, setBios] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const niches = [
    "Fashion", "Travel", "Food", "Fitness", "Beauty", "Photography", 
    "Business", "Lifestyle", "Art", "Music", "Technology", "Health",
    "Entrepreneur", "Student", "Parent", "Creative", "Influencer"
  ];

  const moods = [
    "Professional", "Casual", "Inspiring", "Funny", "Motivational", 
    "Authentic", "Creative", "Minimalist", "Bold", "Friendly"
  ];

  const generateBios = async () => {
    if (!input.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe yourself or your brand",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await supabase.functions.invoke('generate-content', {
        body: { type: 'bio', input, niche, mood }
      });

      if (data.success) {
        const parsedBios = data.content.split('\n\n').filter(b => b.trim());
        setBios(parsedBios);
        toast({
          title: "Bios Generated!",
          description: "Your Instagram bios are ready",
        });
      } else {
        throw new Error(data.error || 'Failed to generate bios');
      }
    } catch (error) {
      console.error('Error generating bios:', error);
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
      description: "Bio copied to clipboard",
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl">
              <PenTool className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            AI Instagram <span className="gradient-text">Bio Generator</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Create compelling Instagram bios that capture your personality and purpose
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <Card className="tool-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-primary" />
                About You
              </CardTitle>
              <CardDescription>
                Tell us about yourself or your brand to generate perfect bios
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="description">Describe Yourself/Brand</Label>
                <Textarea
                  id="description"
                  placeholder="What do you do? What are you passionate about? What makes you unique?"
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
                  <Label htmlFor="mood">Style (Optional)</Label>
                  <Select value={mood} onValueChange={setMood}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select style" />
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
                onClick={generateBios} 
                disabled={isLoading}
                variant="gradient"
                size="lg"
                className="w-full"
              >
                {isLoading ? (
                  <>Generating Bios...</>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Generate Bios
                  </>
                )}
              </Button>
            </CardContent>
          </Card>

          {/* Results Section */}
          <div className="space-y-6">
            {bios.length > 0 && (
              <Card className="tool-card">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PenTool className="h-5 w-5 text-primary" />
                    Generated Bios
                  </CardTitle>
                  <CardDescription>
                    Click on any bio to copy it to your clipboard
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {bios.map((bio, index) => (
                    <div key={index} className="relative group">
                      <div className="p-4 bg-muted/50 rounded-lg border-2 border-transparent hover:border-primary/20 transition-colors cursor-pointer"
                           onClick={() => copyToClipboard(bio)}>
                        <p className="text-sm whitespace-pre-wrap">{bio}</p>
                        <div className="mt-2 text-xs text-muted-foreground">
                          {bio.length}/150 characters
                        </div>
                      </div>
                      <Button
                        variant="copy"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          copyToClipboard(bio);
                        }}
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </CardContent>
              </Card>
            )}

            {/* Tips Card */}
            <Card className="tool-card">
              <CardHeader>
                <CardTitle className="text-lg">Bio Tips</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    <strong>Keep it short:</strong> Instagram bios have a 150-character limit
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    <strong>Use keywords:</strong> Include words your audience searches for
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    <strong>Add emojis:</strong> They make your bio more visually appealing
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Sparkles className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                  <div className="text-sm">
                    <strong>Include a CTA:</strong> Tell people what to do next
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}