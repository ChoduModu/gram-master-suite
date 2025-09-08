import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Header } from "./components/Header";
import { Footer } from "./components/Footer";
import Index from "./pages/Index";
import { CaptionGenerator } from "./components/CaptionGenerator";
import { DPDownloader } from "./components/DPDownloader";
import { ReelsDownloader } from "./components/ReelsDownloader";
import { BioGenerator } from "./components/BioGenerator";
import { TrendingHashtags } from "./components/TrendingHashtags";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <div className="min-h-screen bg-background">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/caption-generator" element={<CaptionGenerator />} />
              <Route path="/dp-downloader" element={<DPDownloader />} />
              <Route path="/reels-downloader" element={<ReelsDownloader />} />
              <Route path="/bio-generator" element={<BioGenerator />} />
              <Route path="/trending-hashtags" element={<TrendingHashtags />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
