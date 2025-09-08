import { useState } from "react";
import { FileImage, Download, Play, Calendar, Heart, MessageCircle, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReelData {
  url: string;
  videoUrl: string;
  thumbnail: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  duration: number;
  uploadDate: string;
}

export function ReelsDownloader() {
  const [url, setUrl] = useState("");
  const [reelData, setReelData] = useState<ReelData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchReel = async () => {
    if (!url.trim()) {
      toast({
        title: "URL Required",
        description: "Please enter an Instagram reel or post URL",
        variant: "destructive",
      });
      return;
    }

    if (!url.includes('instagram.com')) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid Instagram URL",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await supabase.functions.invoke('instagram-downloader', {
        body: { type: 'reel', url }
      });

      if (data.success) {
        setReelData(data.data);
        toast({
          title: "Content Found!",
          description: "Content data loaded successfully",
        });
      } else {
        throw new Error(data.error || 'Failed to fetch content');
      }
    } catch (error) {
      console.error('Error fetching reel:', error);
      toast({
        title: "Fetch Failed",
        description: "Could not fetch content. Please check the URL and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadVideo = async () => {
    if (!reelData) return;

    try {
      const response = await fetch(reelData.videoUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `instagram_reel_${Date.now()}.mp4`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started!",
        description: "Video download has begun",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download video. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl">
              <FileImage className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Instagram <span className="gradient-text">Reels Downloader</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Download Instagram reels and posts without watermarks
          </p>
        </div>

        {/* Input Section */}
        <Card className="tool-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileImage className="h-5 w-5 text-primary" />
              Enter URL
            </CardTitle>
            <CardDescription>
              Paste the Instagram reel or post URL to download the content
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="url">Instagram URL</Label>
              <Input
                id="url"
                placeholder="https://www.instagram.com/reel/..."
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchReel()}
              />
            </div>

            <Button 
              onClick={fetchReel} 
              disabled={isLoading}
              variant="gradient"
              size="lg"
              className="w-full"
            >
              {isLoading ? (
                <>Fetching Content...</>
              ) : (
                <>
                  <Play className="mr-2 h-5 w-5" />
                  Get Content
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Content Display */}
        {reelData && (
          <Card className="tool-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileImage className="h-5 w-5 text-primary" />
                Content Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Video Preview */}
                <div className="relative aspect-video bg-black rounded-lg overflow-hidden">
                  <img
                    src={reelData.thumbnail}
                    alt="Video thumbnail"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 bg-black/50 rounded-full flex items-center justify-center">
                      <Play className="h-8 w-8 text-white ml-1" />
                    </div>
                  </div>
                  <div className="absolute bottom-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-sm">
                    {formatDuration(reelData.duration)}
                  </div>
                </div>

                {/* Content Details */}
                <div className="space-y-4">
                  {reelData.caption && (
                    <div>
                      <h4 className="font-semibold mb-2">Caption</h4>
                      <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-lg">
                        {reelData.caption}
                      </p>
                    </div>
                  )}

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4">
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Heart className="h-5 w-5 text-red-500 mx-auto mb-1" />
                      <div className="font-semibold">{formatNumber(reelData.likes)}</div>
                      <div className="text-xs text-muted-foreground">Likes</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <MessageCircle className="h-5 w-5 text-blue-500 mx-auto mb-1" />
                      <div className="font-semibold">{formatNumber(reelData.comments)}</div>
                      <div className="text-xs text-muted-foreground">Comments</div>
                    </div>
                    <div className="text-center p-3 bg-muted/50 rounded-lg">
                      <Share className="h-5 w-5 text-green-500 mx-auto mb-1" />
                      <div className="font-semibold">{formatNumber(reelData.shares)}</div>
                      <div className="text-xs text-muted-foreground">Shares</div>
                    </div>
                  </div>

                  {/* Upload Date */}
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <Calendar className="h-4 w-4" />
                    <span>Uploaded: {new Date(reelData.uploadDate).toLocaleDateString()}</span>
                  </div>

                  {/* Download Button */}
                  <Button 
                    onClick={downloadVideo}
                    variant="gradient"
                    size="lg"
                    className="w-full"
                  >
                    <Download className="mr-2 h-5 w-5" />
                    Download Video (Watermark-Free)
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="text-center p-4">
            <Download className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">No Watermarks</h4>
            <p className="text-sm text-muted-foreground">Clean downloads without watermarks</p>
          </Card>
          <Card className="text-center p-4">
            <Play className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">High Quality</h4>
            <p className="text-sm text-muted-foreground">Original quality video downloads</p>
          </Card>
          <Card className="text-center p-4">
            <FileImage className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">Content Details</h4>
            <p className="text-sm text-muted-foreground">Get captions, stats, and metadata</p>
          </Card>
        </div>
      </div>
    </div>
  );
}