import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { HomePage } from "@/components/HomePage";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HomePage />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
