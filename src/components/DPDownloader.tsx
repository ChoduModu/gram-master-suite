import { useState } from "react";
import { Download, User, Eye, Copy, Heart, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ProfileData {
  username: string;
  displayName: string;
  bio: string;
  followers: number;
  following: number;
  posts: number;
  profilePicUrl: string;
  isVerified: boolean;
  isPrivate: boolean;
}

export function DPDownloader() {
  const [username, setUsername] = useState("");
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const fetchProfile = async () => {
    if (!username.trim()) {
      toast({
        title: "Username Required",
        description: "Please enter an Instagram username",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { data } = await supabase.functions.invoke('instagram-downloader', {
        body: { type: 'profile', username: username.replace('@', '') }
      });

      if (data.success) {
        setProfileData(data.data);
        toast({
          title: "Profile Found!",
          description: "Profile data loaded successfully",
        });
      } else {
        throw new Error(data.error || 'Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Fetch Failed",
        description: "Could not fetch profile. Please check the username and try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const downloadImage = async () => {
    if (!profileData) return;

    try {
      const response = await fetch(profileData.profilePicUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${profileData.username}_profile_picture.jpg`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Download Started!",
        description: "Profile picture download has begun",
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "Could not download image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-primary rounded-2xl">
              <Download className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Instagram <span className="gradient-text">DP Downloader</span>
          </h1>
          <p className="text-lg text-muted-foreground">
            Download high-quality Instagram profile pictures instantly
          </p>
        </div>

        {/* Input Section */}
        <Card className="tool-card mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Enter Username
            </CardTitle>
            <CardDescription>
              Enter the Instagram username to download their profile picture
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Instagram Username</Label>
              <Input
                id="username"
                placeholder="username (without @)"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && fetchProfile()}
              />
            </div>

            <Button 
              onClick={fetchProfile} 
              disabled={isLoading}
              variant="gradient"
              size="lg"
              className="w-full"
            >
              {isLoading ? (
                <>Fetching Profile...</>
              ) : (
                <>
                  <Eye className="mr-2 h-5 w-5" />
                  Get Profile
                </>
              )}
            </Button>
          </CardContent>
        </Card>

        {/* Profile Display */}
        {profileData && (
          <Card className="tool-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5 text-primary" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col items-center space-y-6">
                {/* Profile Picture */}
                <div className="relative group">
                  <img
                    src={profileData.profilePicUrl}
                    alt={`${profileData.username}'s profile`}
                    className="w-32 h-32 rounded-full object-cover border-4 border-primary/20 group-hover:border-primary/40 transition-colors"
                  />
                  {profileData.isVerified && (
                    <div className="absolute -bottom-1 -right-1 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                  )}
                </div>

                {/* Profile Info */}
                <div className="text-center space-y-2">
                  <h3 className="text-xl font-bold">{profileData.displayName}</h3>
                  <p className="text-muted-foreground">@{profileData.username}</p>
                  {profileData.bio && (
                    <p className="text-sm text-center max-w-sm mx-auto">{profileData.bio}</p>
                  )}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-3 gap-6 w-full max-w-md">
                  <div className="text-center">
                    <div className="font-bold text-lg">{formatNumber(profileData.posts)}</div>
                    <div className="text-sm text-muted-foreground">Posts</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{formatNumber(profileData.followers)}</div>
                    <div className="text-sm text-muted-foreground">Followers</div>
                  </div>
                  <div className="text-center">
                    <div className="font-bold text-lg">{formatNumber(profileData.following)}</div>
                    <div className="text-sm text-muted-foreground">Following</div>
                  </div>
                </div>

                {/* Status */}
                {profileData.isPrivate && (
                  <div className="px-4 py-2 bg-amber-100 dark:bg-amber-900/20 text-amber-800 dark:text-amber-200 rounded-lg text-sm">
                    This account is private
                  </div>
                )}

                {/* Download Button */}
                <Button 
                  onClick={downloadImage}
                  variant="gradient"
                  size="lg"
                  className="w-full max-w-sm"
                >
                  <Download className="mr-2 h-5 w-5" />
                  Download HD Picture
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          <Card className="text-center p-4">
            <Heart className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">High Quality</h4>
            <p className="text-sm text-muted-foreground">Download original resolution images</p>
          </Card>
          <Card className="text-center p-4">
            <Download className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">Instant Download</h4>
            <p className="text-sm text-muted-foreground">No waiting, direct download</p>
          </Card>
          <Card className="text-center p-4">
            <Eye className="h-6 w-6 text-primary mx-auto mb-2" />
            <h4 className="font-semibold">Profile Info</h4>
            <p className="text-sm text-muted-foreground">Get additional profile details</p>
          </Card>
        </div>
      </div>
    </div>
  );
}