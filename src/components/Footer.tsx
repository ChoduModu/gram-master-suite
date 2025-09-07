import { Heart, Github, Twitter, Instagram } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "@/assets/logo.png";

export function Footer() {
  const currentYear = new Date().getFullYear();

  const tools = [
    { name: "Caption Generator", href: "/caption-generator" },
    { name: "DP Downloader", href: "/dp-downloader" },
    { name: "Reels Downloader", href: "/reels-downloader" },
    { name: "Bio Generator", href: "/bio-generator" },
    { name: "Trending Hashtags", href: "/trending-hashtags" },
  ];

  const company = [
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
  ];

  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo & Description */}
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center space-x-3 mb-4">
              <img src={logo} alt="InstaMasterPro" className="h-8 w-8" />
              <span className="text-lg font-bold gradient-text">InstaMasterPro</span>
            </Link>
            <p className="text-muted-foreground text-sm mb-4">
              Your ultimate Instagram tools hub. Generate AI-powered captions, download content, and boost your social media presence.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                <Github className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Tools */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Tools</h3>
            <ul className="space-y-2">
              {tools.map((tool) => (
                <li key={tool.name}>
                  <Link
                    to={tool.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {tool.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              {company.map((item) => (
                <li key={item.name}>
                  <Link
                    to={item.href}
                    className="text-muted-foreground hover:text-primary transition-colors text-sm"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Stay Updated</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Get the latest updates and new features delivered to your inbox.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="px-3 py-2 bg-input border border-border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button className="btn-gradient px-4 py-2 text-white text-sm font-medium rounded-md">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm">
            © {currentYear} InstaMasterPro. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center mt-2 md:mt-0">
            Made with <Heart className="h-4 w-4 text-red-500 mx-1" /> for creators
          </p>
        </div>
      </div>
    </footer>
  );
}