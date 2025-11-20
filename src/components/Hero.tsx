import { Shield, AlertTriangle, MapPin } from "lucide-react";
import { Button } from "./ui/button";

const Hero = () => {
  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-hero">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDM0djItaDJ2LTJoLTJ6bTAgNHYyaDJ2LTJoLTJ6bS0yIDJ2Mmgydi0yaC0yem0wLTR2Mmgydi0yaC0yem0yLTJ2LTJoLTJ2Mmgyem0wLTRoLTJ2Mmgydi0yem0yIDJ2LTJoLTJ2Mmgyem0wIDR2LTJoLTJ2Mmgyem0yLTJ2Mmgydi0yaC0yem0wIDR2Mmgydi0yaC0yem0tMi00aDJ2LTJoLTJ2MnoiLz48L2c+PC9nPjwvc3ZnPg==')] opacity-20"></div>
      
      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center text-white">
          <div className="flex justify-center mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000">
            <Shield className="w-20 h-20 drop-shadow-lg" />
          </div>
          
          <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-150">
            DisasterSense
          </h1>
          
          <p className="text-xl md:text-2xl mb-4 text-blue-50 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-300">
            AI-Based Natural Disaster Early Indicator & Safety Guide
          </p>
          
          <p className="text-lg md:text-xl mb-10 text-blue-100 max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-500">
            Real-time environmental monitoring powered by machine learning. 
            Get instant alerts for floods, heatwaves, air quality hazards, and more.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-700">
            <Button 
              size="lg" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground shadow-glow"
              onClick={() => scrollToSection("dashboard")}
            >
              <AlertTriangle className="mr-2 h-5 w-5" />
              View Live Dashboard
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="bg-white/10 border-white/30 text-white hover:bg-white/20 backdrop-blur-sm"
              onClick={() => scrollToSection("safety")}
            >
              <MapPin className="mr-2 h-5 w-5" />
              Safety Guidelines
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-1000 delay-1000">
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold mb-2">24/7</div>
              <div className="text-blue-100">Real-Time Monitoring</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold mb-2">AI-Powered</div>
              <div className="text-blue-100">ML Prediction Models</div>
            </div>
            <div className="bg-white/10 backdrop-blur-md rounded-xl p-6 border border-white/20">
              <div className="text-3xl font-bold mb-2">Instant</div>
              <div className="text-blue-100">Risk Alerts</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
