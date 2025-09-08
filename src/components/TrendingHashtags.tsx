import { useState, useEffect } from "react";
import { TrendingUp, Copy, Hash, Filter, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface Hashtag {
  id: string;
  hashtag: string;
  category: string;
  usage_count: number;
  trending_score: number;
}

export function TrendingHashtags() {
  const [hashtags, setHashtags] = useState<Hashtag[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("all");
  const { toast } = useToast();

  const categories = [
    { value: "all", label: "All" },
    { value: "general", label: "General" },
    { value: "lifestyle", label: "Lifestyle" },
    { value: "creative", label: "Creative" },
    { value: "professional", label: "Professional" },
    { value: "entertainment", label: "Entertainment" },
    { value: "content", label: "Content" },
    { value: "photography", label: "Photography" },
    { value: "fashion", label: "Fashion" },
    { value: "inspiration", label: "Inspiration" },
  ];

  useEffect(() => {
    fetchHashtags();
  }, []);

  const fetchHashtags = async () => {
    try {
      const { data, error } = await supabase
        .from('trending_hashtags')
        .select('*')
        .order('trending_score', { ascending: false });

      if (error) throw error;
      setHashtags(data || []);
    } catch (error) {
      console.error('Error fetching hashtags:', error);
      toast({
        title: "Failed to load hashtags",
        description: "Please try again later",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const filteredHashtags = selectedCategory === "all" 
    ? hashtags 
    : hashtags.filter(h => h.category === selectedCategory);

  const copyHashtag = (hashtag: string) => {
    navigator.clipboard.writeText(hashtag);
    toast({
      title: "Copied!",
      description: `${hashtag} copied to clipboard`,
    });
  };

  const copyMultipleHashtags = (tags: string[]) => {
    const hashtagString = tags.join(' ');
    navigator.clipboard.writeText(hashtagString);
    toast({
      title: "Copied!",
      description: `${tags.length} hashtags copied to clipboard`,
    });
  };

  const getTrendingIcon = (score: number) => {
    if (score >= 9) return "🔥";
    if (score >= 8) return "📈";
    if (score >= 7) return "⭐";
    return "💫";
  };

  const formatUsageCount = (count: number) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(0)}K`;
    return count.toString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl">
              <TrendingUp className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Trending <span className="gradient-text">Hashtags</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Discover and copy the most trending hashtags organized by category
          </p>
        </div>

        {/* Category Tabs */}
        <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="mb-8">
          <TabsList className="grid w-full grid-cols-5 lg:grid-cols-10 gap-2">
            {categories.map((category) => (
              <TabsTrigger 
                key={category.value} 
                value={category.value}
                className="text-xs"
              >
                {category.label}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        {isLoading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            <p className="mt-4 text-muted-foreground">Loading trending hashtags...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Top Hashtags Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredHashtags.slice(0, 6).map((hashtag) => (
                <Card key={hashtag.id} className="tool-card group cursor-pointer"
                      onClick={() => copyHashtag(hashtag.hashtag)}>
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="text-lg">{getTrendingIcon(hashtag.trending_score)}</span>
                        <span className="font-mono text-lg font-semibold text-primary">
                          {hashtag.hashtag}
                        </span>
                      </div>
                      <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary" className="capitalize">
                        {hashtag.category}
                      </Badge>
                      <div className="text-right">
                        <div className="text-sm font-semibold">
                          {formatUsageCount(hashtag.usage_count)} posts
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Trending Score: {hashtag.trending_score.toFixed(1)}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* All Hashtags List */}
            <Card className="tool-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Hash className="h-5 w-5 text-primary" />
                  All {selectedCategory === "all" ? "" : selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Hashtags
                </CardTitle>
                <CardDescription>
                  Click on any hashtag to copy it, or select multiple hashtags to copy them all at once
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2 mb-6">
                  {filteredHashtags.map((hashtag) => (
                    <span
                      key={hashtag.id}
                      onClick={() => copyHashtag(hashtag.hashtag)}
                      className="px-3 py-2 bg-muted/50 hover:bg-primary/10 text-foreground rounded-lg text-sm cursor-pointer transition-colors border border-transparent hover:border-primary/20 flex items-center space-x-2"
                    >
                      <span>{getTrendingIcon(hashtag.trending_score)}</span>
                      <span className="font-mono">{hashtag.hashtag}</span>
                      <span className="text-xs text-muted-foreground">
                        {formatUsageCount(hashtag.usage_count)}
                      </span>
                    </span>
                  ))}
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Button
                    variant="gradient"
                    onClick={() => copyMultipleHashtags(filteredHashtags.slice(0, 10).map(h => h.hashtag))}
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Top 10 Hashtags
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => copyMultipleHashtags(filteredHashtags.slice(0, 30).map(h => h.hashtag))}
                    className="flex-1"
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Top 30 Hashtags
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Tips Card */}
            <Card className="tool-card">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-primary" />
                  Hashtag Tips
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="font-semibold">Best Practices</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>• Use 20-30 hashtags per post for maximum reach</li>
                    <li>• Mix popular, medium, and niche hashtags</li>
                    <li>• Research hashtags before using them</li>
                    <li>• Create branded hashtags for your content</li>
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="font-semibold">Hashtag Types</h4>
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li>🔥 <strong>Viral:</strong> 1M+ posts (high competition)</li>
                    <li>📈 <strong>Popular:</strong> 100K-1M posts (good reach)</li>
                    <li>⭐ <strong>Medium:</strong> 10K-100K posts (targeted)</li>
                    <li>💫 <strong>Niche:</strong> Under 10K posts (specific)</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}