import { Brain, Bell, Map, LineChart, Shield, Smartphone } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { useNavigate } from "react-router-dom";

const Features = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Predictions",
      description: "Machine learning models analyze environmental data to predict disaster risks with high accuracy",
      color: "text-primary",
      action: () => navigate("/dashboard"),
    },
    {
      icon: Bell,
      title: "Real-Time Alerts",
      description: "Instant push notifications when environmental conditions indicate high risk levels",
      color: "text-accent",
      action: () => navigate("/dashboard"),
    },
    {
      icon: Map,
      title: "Geographic Mapping",
      description: "Color-coded heat maps show safe zones, moderate risk areas, and danger zones in your region",
      color: "text-success",
      action: () => navigate("/dashboard"),
    },
    {
      icon: LineChart,
      title: "Live Monitoring",
      description: "Track temperature, humidity, rainfall, wind speed, and air quality index in real-time",
      color: "text-warning",
      action: () => navigate("/dashboard"),
    },
    {
      icon: Shield,
      title: "Safety Guidelines",
      description: "Comprehensive emergency protocols and first aid instructions for each disaster type",
      color: "text-destructive",
      action: () => navigate("/safety"),
    },
    {
      icon: Smartphone,
      title: "Offline Access",
      description: "Critical safety information available offline when network connectivity is lost",
      color: "text-primary",
      action: () => navigate("/safety"),
    },
  ];

  return (
    <section className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Intelligent Features
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Advanced technology designed to keep you safe and informed
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <Card 
              key={index} 
              onClick={feature.action}
              className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300 hover:-translate-y-1 cursor-pointer"
            >
              <CardHeader>
                <feature.icon className={`w-12 h-12 ${feature.color} mb-3`} />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-base">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
