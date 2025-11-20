import { Thermometer, Droplets, Wind, Gauge, Cloud } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";

const Dashboard = () => {
  const metrics = [
    {
      icon: Thermometer,
      label: "Temperature",
      value: "32°C",
      status: "High",
      color: "text-warning",
      progress: 80,
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: "70%",
      status: "Moderate",
      color: "text-primary",
      progress: 70,
    },
    {
      icon: Cloud,
      label: "Rainfall",
      value: "12mm",
      status: "Moderate",
      color: "text-primary",
      progress: 60,
    },
    {
      icon: Wind,
      label: "Wind Speed",
      value: "15 km/h",
      status: "Normal",
      color: "text-success",
      progress: 40,
    },
    {
      icon: Gauge,
      label: "Air Quality (AQI)",
      value: "140",
      status: "Unhealthy",
      color: "text-destructive",
      progress: 90,
    },
  ];

  const risks = [
    { type: "Flood Risk", level: "Moderate", color: "bg-warning", textColor: "text-warning" },
    { type: "Heatwave Risk", level: "Low", color: "bg-success", textColor: "text-success" },
    { type: "Air Quality Risk", level: "High", color: "bg-destructive", textColor: "text-destructive" },
  ];

  return (
    <section id="dashboard" className="py-20 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Live Environmental Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Real-time monitoring of environmental conditions powered by AI
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {metrics.map((metric, index) => (
            <Card key={index} className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <metric.icon className={`w-8 h-8 ${metric.color}`} />
                  <Badge variant={metric.status === "Normal" || metric.status === "Low" ? "default" : "destructive"}>
                    {metric.status}
                  </Badge>
                </div>
                <CardTitle className="text-xl">{metric.label}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold mb-3">{metric.value}</div>
                <Progress value={metric.progress} className="h-2" />
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="max-w-4xl mx-auto bg-gradient-card border-border shadow-glow">
          <CardHeader>
            <CardTitle className="text-2xl">AI Risk Assessment</CardTitle>
            <CardDescription>Current disaster probability predictions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {risks.map((risk, index) => (
                <div key={index} className="flex items-center justify-between p-4 bg-background rounded-lg border border-border">
                  <div className="flex items-center gap-4">
                    <div className={`w-3 h-3 rounded-full ${risk.color}`}></div>
                    <span className="font-semibold text-lg">{risk.type}</span>
                  </div>
                  <Badge className={risk.textColor} variant="outline">
                    {risk.level} Risk
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default Dashboard;
