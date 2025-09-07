import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export function DarkModeToggle() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkMode = localStorage.getItem("darkMode") === "true" || 
      (!localStorage.getItem("darkMode") && window.matchMedia("(prefers-color-scheme: dark)").matches);
    setIsDark(isDarkMode);
    document.documentElement.classList.toggle("dark", isDarkMode);
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDark;
    setIsDark(newDarkMode);
    localStorage.setItem("darkMode", newDarkMode.toString());
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleDarkMode}
      className="relative overflow-hidden bg-glass border border-glass-border hover:bg-primary/20 transition-all duration-300"
    >
      <Sun className={`h-5 w-5 transition-all duration-300 ${isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} />
      <Moon className={`absolute h-5 w-5 transition-all duration-300 ${isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} />
      <span className="sr-only">Toggle dark mode</span>
    </Button>
  );
}