import { Shield, AlertCircle, Heart, Home } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

const SafetyGuide = () => {
  const guidelines = {
    flood: [
      "Move to higher ground immediately",
      "Avoid walking or driving through flood waters",
      "Disconnect electrical appliances and turn off utilities",
      "Keep emergency supplies ready (water, food, first aid)",
      "Stay informed via emergency broadcasts",
    ],
    heatwave: [
      "Stay indoors during peak heat hours (12 PM - 4 PM)",
      "Drink plenty of water even if not thirsty",
      "Wear light-colored, loose-fitting clothing",
      "Check on elderly and vulnerable neighbors",
      "Never leave children or pets in vehicles",
    ],
    airQuality: [
      "Stay indoors and keep windows closed",
      "Use air purifiers if available",
      "Wear N95 masks when going outside",
      "Avoid outdoor exercise and strenuous activities",
      "Monitor air quality index regularly",
    ],
    storm: [
      "Secure loose outdoor items",
      "Stay away from windows and glass doors",
      "Unplug electrical appliances",
      "Have flashlights and batteries ready",
      "Identify the safest room in your home",
    ],
  };

  return (
    <section id="safety" className="py-20 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Safety Guidelines
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Essential steps to protect yourself and your family during natural disasters
          </p>
        </div>

        <Tabs defaultValue="flood" className="max-w-4xl mx-auto">
          <TabsList className="grid w-full grid-cols-2 lg:grid-cols-4 h-auto gap-2">
            <TabsTrigger value="flood" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
              Flood
            </TabsTrigger>
            <TabsTrigger value="heatwave" className="data-[state=active]:bg-accent data-[state=active]:text-accent-foreground">
              Heatwave
            </TabsTrigger>
            <TabsTrigger value="airQuality" className="data-[state=active]:bg-destructive data-[state=active]:text-destructive-foreground">
              Air Quality
            </TabsTrigger>
            <TabsTrigger value="storm" className="data-[state=active]:bg-warning data-[state=active]:text-warning-foreground">
              Storm
            </TabsTrigger>
          </TabsList>

          {Object.entries(guidelines).map(([key, items]) => (
            <TabsContent key={key} value={key} className="mt-6">
              <Card className="bg-gradient-card border-border">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <Shield className="w-8 h-8 text-primary" />
                    <div>
                      <CardTitle className="text-2xl capitalize">{key.replace(/([A-Z])/g, ' $1')} Safety Protocol</CardTitle>
                      <CardDescription>Follow these steps to stay safe</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {items.map((item, index) => (
                      <li key={index} className="flex items-start gap-3 p-4 bg-background rounded-lg border border-border">
                        <AlertCircle className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
                        <span className="text-foreground">{item}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          ))}
        </Tabs>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <Heart className="w-10 h-10 text-destructive mb-2" />
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p><strong>Emergency:</strong> 112</p>
                <p><strong>Ambulance:</strong> 108</p>
                <p><strong>Fire:</strong> 101</p>
                <p><strong>Police:</strong> 100</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <Home className="w-10 h-10 text-primary mb-2" />
              <CardTitle>Emergency Kit</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                <li>• Water & non-perishable food</li>
                <li>• First aid supplies</li>
                <li>• Flashlight & batteries</li>
                <li>• Important documents</li>
                <li>• Mobile phone charger</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <Shield className="w-10 h-10 text-success mb-2" />
              <CardTitle>Evacuation Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-1 text-sm">
                <li>• Know multiple exit routes</li>
                <li>• Identify safe meeting points</li>
                <li>• Keep vehicle fueled</li>
                <li>• Store copies of documents</li>
                <li>• Practice evacuation drills</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default SafetyGuide;
