import Hero from "@/components/Hero";
import Dashboard from "@/components/Dashboard";
import Features from "@/components/Features";
import SafetyGuide from "@/components/SafetyGuide";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Hero />
      <Dashboard />
      <Features />
      <SafetyGuide />
      <Footer />
    </main>
  );
};

export default Index;
