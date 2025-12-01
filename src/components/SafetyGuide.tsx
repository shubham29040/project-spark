import { Shield, AlertCircle, Heart, Home, Droplets, Sun, Wind, CloudLightning } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import EmergencyContactsManager from "./EmergencyContactsManager";

const SafetyGuide = () => {
  const guidelines = {
    flood: {
      icon: Droplets,
      color: "text-blue-400",
      bgClass: "bg-gradient-to-br from-blue-900/90 via-blue-800/80 to-cyan-900/90",
      overlayClass: "before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+CjxwYXRoIGQ9Ik0wIDMwIFE1IDIwIDEwIDMwIFQyMCAzMCBUMzAgMzAgVDQwIDMwIFQ1MCAzMCBUNjAgMzAiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDcsMTk3LDI1MywwLjMpIiBzdHJva2Utd2lkdGg9IjIiLz4KPHBhdGggZD0iTTAgNDUgUTUgMzUgMTAgNDUgVDIwIDQ1IFQzMCA0NSBUNDAgNDUgVDUwIDQ1IFQ2MCA0NSIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJyZ2JhKDE0NywxOTcsMjUzLDAuMikiIHN0cm9rZS13aWR0aD0iMiIvPgo8L3N2Zz4=')] before:opacity-50 before:animate-pulse",
      items: [
        "Move to higher ground immediately",
        "Avoid walking or driving through flood waters",
        "Disconnect electrical appliances and turn off utilities",
        "Keep emergency supplies ready (water, food, first aid)",
        "Stay informed via emergency broadcasts",
      ],
    },
    heatwave: {
      icon: Sun,
      color: "text-orange-400",
      bgClass: "bg-gradient-to-br from-orange-900/90 via-red-800/80 to-yellow-900/90",
      overlayClass: "before:absolute before:inset-0 before:bg-[radial-gradient(ellipse_at_top,_rgba(251,191,36,0.3)_0%,_transparent_70%)] before:animate-pulse",
      items: [
        "Stay indoors during peak heat hours (12 PM - 4 PM)",
        "Drink plenty of water even if not thirsty",
        "Wear light-colored, loose-fitting clothing",
        "Check on elderly and vulnerable neighbors",
        "Never leave children or pets in vehicles",
      ],
    },
    airQuality: {
      icon: Wind,
      color: "text-gray-400",
      bgClass: "bg-gradient-to-br from-gray-800/90 via-slate-700/80 to-zinc-800/90",
      overlayClass: "before:absolute before:inset-0 before:bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTUiIGZpbGw9InJnYmEoMTYxLDE2MSwxNzAsMC4xNSkiLz4KPGNpcmNsZSBjeD0iNjAiIGN5PSI0MCIgcj0iMjAiIGZpbGw9InJnYmEoMTYxLDE2MSwxNzAsMC4xKSIvPgo8Y2lyY2xlIGN4PSI4MCIgY3k9IjgwIiByPSIxMiIgZmlsbD0icmdiYSgxNjEsMTYxLDE3MCwwLjEyKSIvPgo8Y2lyY2xlIGN4PSIzMCIgY3k9IjcwIiByPSIxOCIgZmlsbD0icmdiYSgxNjEsMTYxLDE3MCwwLjA4KSIvPgo8L3N2Zz4=')] before:opacity-70",
      items: [
        "Stay indoors and keep windows closed",
        "Use air purifiers if available",
        "Wear N95 masks when going outside",
        "Avoid outdoor exercise and strenuous activities",
        "Monitor air quality index regularly",
      ],
    },
    storm: {
      icon: CloudLightning,
      color: "text-purple-400",
      bgClass: "bg-gradient-to-br from-slate-900/90 via-purple-900/80 to-indigo-900/90",
      overlayClass: "before:absolute before:inset-0 before:bg-[linear-gradient(135deg,rgba(147,51,234,0.1)_0%,transparent_50%,rgba(147,51,234,0.15)_100%)]",
      items: [
        "Secure loose outdoor items",
        "Stay away from windows and glass doors",
        "Unplug electrical appliances",
        "Have flashlights and batteries ready",
        "Identify the safest room in your home",
      ],
    },
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
            <TabsTrigger value="flood" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              <Droplets className="w-4 h-4 mr-2" />
              Flood
            </TabsTrigger>
            <TabsTrigger value="heatwave" className="data-[state=active]:bg-orange-600 data-[state=active]:text-white">
              <Sun className="w-4 h-4 mr-2" />
              Heatwave
            </TabsTrigger>
            <TabsTrigger value="airQuality" className="data-[state=active]:bg-gray-600 data-[state=active]:text-white">
              <Wind className="w-4 h-4 mr-2" />
              Air Quality
            </TabsTrigger>
            <TabsTrigger value="storm" className="data-[state=active]:bg-purple-600 data-[state=active]:text-white">
              <CloudLightning className="w-4 h-4 mr-2" />
              Storm
            </TabsTrigger>
          </TabsList>

          {Object.entries(guidelines).map(([key, data]) => {
            const IconComponent = data.icon;
            return (
              <TabsContent key={key} value={key} className="mt-6">
                <Card className={`relative overflow-hidden border-border ${data.bgClass} ${data.overlayClass}`}>
                  {/* Animated background elements */}
                  {key === "flood" && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-blue-500/20 to-transparent animate-pulse" />
                      <div className="absolute -bottom-4 left-0 right-0 h-24 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMjAiIGhlaWdodD0iMjQiPgo8cGF0aCBkPSJNMCAxMiBRMTUgMCAzMCAxMiBUNjAgMTIgVDkwIDEyIFQxMjAgMTIiIGZpbGw9Im5vbmUiIHN0cm9rZT0icmdiYSgxNDcsMTk3LDI1MywwLjQpIiBzdHJva2Utd2lkdGg9IjMiLz4KPC9zdmc+')] bg-repeat-x animate-[wave_3s_ease-in-out_infinite]" />
                    </div>
                  )}
                  {key === "heatwave" && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-4 right-8 w-24 h-24 bg-yellow-400/20 rounded-full blur-xl animate-pulse" />
                      <div className="absolute top-8 right-12 w-16 h-16 bg-orange-400/30 rounded-full blur-lg" />
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-red-500/10 to-transparent" />
                    </div>
                  )}
                  {key === "airQuality" && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-10 left-10 w-32 h-32 bg-gray-400/10 rounded-full blur-2xl animate-pulse" style={{ animationDelay: "0s" }} />
                      <div className="absolute top-20 right-20 w-40 h-40 bg-slate-400/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                      <div className="absolute bottom-10 left-1/3 w-24 h-24 bg-zinc-400/10 rounded-full blur-xl animate-pulse" style={{ animationDelay: "2s" }} />
                    </div>
                  )}
                  {key === "storm" && (
                    <div className="absolute inset-0 overflow-hidden pointer-events-none">
                      <div className="absolute top-4 left-1/4 w-1 h-16 bg-gradient-to-b from-purple-400/60 to-transparent rotate-12 animate-pulse" />
                      <div className="absolute top-8 right-1/3 w-0.5 h-12 bg-gradient-to-b from-indigo-400/50 to-transparent -rotate-6" style={{ animationDelay: "0.5s" }} />
                      <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-slate-900/50 to-transparent" />
                    </div>
                  )}
                  
                  <CardHeader className="relative z-10">
                    <div className="flex items-center gap-3">
                      <div className={`p-3 rounded-xl bg-background/20 backdrop-blur-sm ${data.color}`}>
                        <IconComponent className="w-8 h-8" />
                      </div>
                      <div>
                        <CardTitle className="text-2xl capitalize text-white drop-shadow-lg">
                          {key.replace(/([A-Z])/g, ' $1')} Safety Protocol
                        </CardTitle>
                        <CardDescription className="text-white/70">Follow these steps to stay safe</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="relative z-10">
                    <ul className="space-y-4">
                      {data.items.map((item, index) => (
                        <li 
                          key={index} 
                          className="flex items-start gap-3 p-4 bg-background/80 backdrop-blur-sm rounded-lg border border-white/10 shadow-lg"
                        >
                          <div className={`p-1 rounded-full ${data.bgClass.includes('blue') ? 'bg-blue-500/20' : data.bgClass.includes('orange') ? 'bg-orange-500/20' : data.bgClass.includes('gray') ? 'bg-gray-500/20' : 'bg-purple-500/20'}`}>
                            <AlertCircle className={`w-5 h-5 ${data.color} mt-0.5 flex-shrink-0`} />
                          </div>
                          <span className="text-foreground font-medium">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </TabsContent>
            );
          })}
        </Tabs>

        <div className="mt-12 max-w-4xl mx-auto mb-8">
          <EmergencyContactsManager />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 max-w-4xl mx-auto">
          <Card className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
            <CardHeader>
              <Heart className="w-10 h-10 text-destructive mb-2" />
              <CardTitle>Emergency Services</CardTitle>
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
