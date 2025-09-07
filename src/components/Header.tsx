import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DarkModeToggle } from "./DarkModeToggle";
import { Link, useLocation } from "react-router-dom";
import logo from "@/assets/logo.png";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    { name: "Home", href: "/" },
    { name: "Caption Generator", href: "/caption-generator" },
    { name: "DP Downloader", href: "/dp-downloader" },
    { name: "Reels Downloader", href: "/reels-downloader" },
    { name: "Bio Generator", href: "/bio-generator" },
    { name: "Trending Hashtags", href: "/trending-hashtags" },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-xl bg-background/80 border-b border-border">
      <nav className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 logo-glow">
            <img src={logo} alt="InstaMasterPro" className="h-10 w-10" />
            <span className="text-xl font-bold gradient-text">InstaMasterPro</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  location.pathname === item.href
                    ? "text-primary border-b-2 border-primary pb-1"
                    : "text-muted-foreground"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            <DarkModeToggle />
            
            {/* Mobile menu button */}
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 border-t border-border bg-card/50 backdrop-blur-sm">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 text-base font-medium rounded-md transition-colors ${
                    location.pathname === item.href
                      ? "text-primary bg-primary/10"
                      : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}