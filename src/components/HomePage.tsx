import { 
  MessageSquareText, 
  Download, 
  FileImage, 
  PenTool, 
  TrendingUp, 
  Sparkles,
  Instagram,
  Users,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-bg.jpg";

export function HomePage() {
  const tools = [
    {
      title: "AI Caption & Hashtag Generator",
      description: "Generate engaging captions and trending hashtags powered by AI",
      icon: MessageSquareText,
      href: "/caption-generator",
      gradient: "from-instagram-purple to-instagram-pink",
      features: ["5-10 AI captions", "Trending hashtags", "Copy & share"],
    },
    {
      title: "Instagram DP Downloader",
      description: "Download high-quality profile pictures instantly",
      icon: Download,
      href: "/dp-downloader",
      gradient: "from-instagram-pink to-instagram-orange",
      features: ["HD quality", "Profile info", "Copyright safe"],
    },
    {
      title: "Reels & Post Downloader",
      description: "Download Instagram reels and posts without watermarks",
      icon: FileImage,
      href: "/reels-downloader",
      gradient: "from-instagram-orange to-instagram-yellow",
      features: ["Watermark-free", "HD downloads", "Post details"],
    },
    {
      title: "AI Bio Generator",
      description: "Create compelling Instagram bios with AI assistance",
      icon: PenTool,
      href: "/bio-generator",
      gradient: "from-instagram-yellow to-instagram-purple",
      features: ["Multiple options", "Editable", "Niche-specific"],
    },
    {
      title: "Trending Hashtags",
      description: "Discover and copy trending hashtags by category",
      icon: TrendingUp,
      href: "/trending-hashtags",
      gradient: "from-instagram-purple to-instagram-pink",
      features: ["Auto-updated", "Category-wise", "One-click copy"],
    },
  ];

  const stats = [
    { value: "100K+", label: "Happy Users", icon: Users },
    { value: "1M+", label: "Downloads", icon: Download },
    { value: "50K+", label: "Captions Generated", icon: MessageSquareText },
    { value: "99.9%", label: "Uptime", icon: Zap },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative py-24 lg:py-32 overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-10"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-hero opacity-20" />
        
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex justify-center mb-8">
              <div className="p-4 bg-glass border border-glass-border rounded-2xl backdrop-blur-sm animate-float">
                <Instagram className="h-12 w-12 text-primary" />
              </div>
            </div>
            
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 animate-slide-up">
              Instagram Tools{" "}
              <span className="gradient-text">Reimagined</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Your ultimate hub for AI-powered Instagram tools. Generate captions, download content, 
              and boost your social media presence with cutting-edge AI technology.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-slide-up" style={{ animationDelay: "0.4s" }}>
              <Button variant="hero" size="lg" asChild>
                <Link to="/caption-generator">
                  <Sparkles className="mr-2 h-5 w-5" />
                  Start Creating
                </Link>
              </Button>
              <Button variant="glass" size="lg" asChild>
                <Link to="/trending-hashtags">
                  <TrendingUp className="mr-2 h-5 w-5" />
                  Explore Tools
                </Link>
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.6s" }}>
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className="flex justify-center mb-2">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-2xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-muted/20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Powerful <span className="gradient-text">Instagram Tools</span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Everything you need to succeed on Instagram, powered by advanced AI and built for creators
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tools.map((tool, index) => (
              <Card 
                key={tool.title} 
                className="tool-card group cursor-pointer animate-slide-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardHeader>
                  <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${tool.gradient} p-3 mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <tool.icon className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle className="text-xl mb-2">{tool.title}</CardTitle>
                  <CardDescription className="text-base">
                    {tool.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {tool.features.map((feature) => (
                      <li key={feature} className="flex items-center text-sm text-muted-foreground">
                        <Sparkles className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button variant="gradient" className="w-full" asChild>
                    <Link to={tool.href}>
                      Try Now
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">
                Why Choose <span className="gradient-text">InstaMasterPro?</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Sparkles className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">AI-Powered Intelligence</h3>
                    <p className="text-muted-foreground">
                      Advanced AI algorithms generate high-quality captions, hashtags, and bios tailored to your niche.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Zap className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Lightning Fast</h3>
                    <p className="text-muted-foreground">
                      Get results in seconds. No waiting, no complicated processes - just instant, professional results.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-4">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                    <Users className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold mb-2">Trusted by Creators</h3>
                    <p className="text-muted-foreground">
                      Join thousands of influencers, marketers, and businesses who trust InstaMasterPro.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-hero rounded-3xl opacity-20 animate-float"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <Instagram className="h-24 w-24 text-primary mx-auto mb-4 animate-glow" />
                  <p className="text-lg font-semibold">Ready to Get Started?</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready to Transform Your Instagram?
            </h2>
            <p className="text-xl mb-8 opacity-90">
              Join thousands of creators who are already using InstaMasterPro to grow their presence
            </p>
            <Button variant="secondary" size="lg" asChild>
              <Link to="/caption-generator">
                <Sparkles className="mr-2 h-5 w-5" />
                Get Started Free
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
}