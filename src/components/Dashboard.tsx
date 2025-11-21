import { Thermometer, Droplets, Wind, Gauge, Cloud, MapPin, RefreshCw, Bell, BellOff } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import AlertBanner from "./AlertBanner";
import { useNotifications } from "@/hooks/useNotifications";

interface WeatherData {
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  windSpeed: number;
  aqi: number;
  description: string;
  risks: {
    flood: string;
    heatwave: string;
    airQuality: string;
    storm: string;
  };
  timestamp: string;
}

const Dashboard = () => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [alerts, setAlerts] = useState<{ type: string; level: string; message: string }[]>([]);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const { permission, requestPermission, showNotification, isSupported } = useNotifications();

  const fetchWeatherData = async () => {
    try {
      setLoading(true);
      
      // Get user's location
      if (!navigator.geolocation) {
        toast.error("Geolocation is not supported by your browser");
        return;
      }

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          
          const { data, error } = await supabase.functions.invoke('weather-data', {
            body: { lat: latitude, lon: longitude }
          });

          if (error) {
            console.error('Error fetching weather data:', error);
            toast.error("Failed to fetch weather data");
            return;
          }

          setWeatherData(data);
          setLastUpdate(new Date());
          checkForAlerts(data);
          toast.success(`Weather data updated for ${data.location}`);
        },
        (error) => {
          console.error('Geolocation error:', error);
          if (error.code === error.PERMISSION_DENIED) {
            toast.error("Location access denied. Using default location.");
          } else if (error.code === error.POSITION_UNAVAILABLE) {
            toast.error("Location information unavailable. Using default location.");
          } else if (error.code === error.TIMEOUT) {
            toast.error("Location request timed out. Using default location.");
          }
          fetchWithDefaultLocation();
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0
        }
      );
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to fetch weather data");
    } finally {
      setLoading(false);
    }
  };

  const fetchWithDefaultLocation = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('weather-data', {
        body: { lat: 19.076, lon: 72.8777 } // Mumbai coordinates as default
      });

      if (error) {
        console.error('Error fetching weather data:', error);
        toast.error("Failed to fetch weather data");
        return;
      }

      setWeatherData(data);
      setLastUpdate(new Date());
      checkForAlerts(data);
    } catch (error) {
      console.error('Error:', error);
      toast.error("Failed to fetch weather data");
    }
  };

  const checkForAlerts = (data: WeatherData) => {
    const newAlerts: { type: string; level: string; message: string }[] = [];

    if (data.risks.flood === "High") {
      newAlerts.push({
        type: "Flood",
        level: "High",
        message: `High flood risk detected in ${data.location}`,
      });
    }

    if (data.risks.heatwave === "High") {
      newAlerts.push({
        type: "Heatwave",
        level: "High",
        message: `Extreme heat warning for ${data.location}`,
      });
    }

    if (data.risks.airQuality === "High") {
      newAlerts.push({
        type: "Air Quality",
        level: "High",
        message: `Unhealthy air quality detected (AQI: ${data.aqi})`,
      });
    }

    if (data.risks.storm === "High") {
      newAlerts.push({
        type: "Storm",
        level: "High",
        message: `Severe storm warning for ${data.location}`,
      });
    }

    // Check for moderate risks
    if (data.risks.flood === "Moderate") {
      newAlerts.push({
        type: "Flood",
        level: "Moderate",
        message: `Moderate flood risk in ${data.location}`,
      });
    }

    if (data.risks.airQuality === "Moderate") {
      newAlerts.push({
        type: "Air Quality",
        level: "Moderate",
        message: `Moderate air quality levels (AQI: ${data.aqi})`,
      });
    }

    setAlerts(newAlerts);

    // Show notifications for critical alerts
    if (notificationsEnabled && newAlerts.some(a => a.level === "High")) {
      const criticalAlerts = newAlerts.filter(a => a.level === "High");
      criticalAlerts.forEach(alert => {
        showNotification("DisasterSense Alert", {
          body: alert.message,
          tag: alert.type,
          requireInteraction: true,
        });
      });
    }

    // Show toast for high-level alerts
    newAlerts.forEach(alert => {
      if (alert.level === "High") {
        toast.error(alert.message, {
          duration: 10000,
        });
      } else if (alert.level === "Moderate") {
        toast.warning(alert.message);
      }
    });
  };

  const toggleNotifications = async () => {
    if (!notificationsEnabled) {
      const result = await requestPermission();
      if (result === "granted") {
        setNotificationsEnabled(true);
        toast.success("Browser notifications enabled");
      } else {
        toast.error("Please enable notifications in your browser settings");
      }
    } else {
      setNotificationsEnabled(false);
      toast.info("Browser notifications disabled");
    }
  };

  useEffect(() => {
    fetchWeatherData();
    
    // Auto-refresh every 5 minutes
    const interval = setInterval(fetchWeatherData, 5 * 60 * 1000);
    
    return () => clearInterval(interval);
  }, []);

  const getProgressValue = (metric: string, value: number) => {
    switch (metric) {
      case 'temperature':
        return Math.min((value / 50) * 100, 100);
      case 'humidity':
        return value;
      case 'rainfall':
        return Math.min((value / 20) * 100, 100);
      case 'windSpeed':
        return Math.min((value / 100) * 100, 100);
      case 'aqi':
        return Math.min((value / 500) * 100, 100);
      default:
        return 0;
    }
  };

  const getStatusColor = (value: number, metric: string) => {
    if (metric === 'temperature') {
      return value > 35 ? 'text-warning' : value > 30 ? 'text-accent' : 'text-success';
    }
    if (metric === 'aqi') {
      return value > 150 ? 'text-destructive' : value > 100 ? 'text-warning' : 'text-success';
    }
    if (metric === 'rainfall') {
      return value > 10 ? 'text-destructive' : value > 5 ? 'text-warning' : 'text-primary';
    }
    if (metric === 'windSpeed') {
      return value > 50 ? 'text-destructive' : value > 30 ? 'text-warning' : 'text-success';
    }
    return 'text-primary';
  };

  const getStatus = (value: number, metric: string) => {
    if (metric === 'temperature') {
      return value > 35 ? 'High' : value > 30 ? 'Moderate' : 'Normal';
    }
    if (metric === 'aqi') {
      return value > 150 ? 'Unhealthy' : value > 100 ? 'Moderate' : 'Good';
    }
    if (metric === 'rainfall') {
      return value > 10 ? 'Heavy' : value > 5 ? 'Moderate' : 'Light';
    }
    if (metric === 'windSpeed') {
      return value > 50 ? 'Storm' : value > 30 ? 'Strong' : 'Normal';
    }
    return 'Normal';
  };

  const metrics = weatherData ? [
    {
      icon: Thermometer,
      label: "Temperature",
      value: `${weatherData.temperature}°C`,
      status: getStatus(weatherData.temperature, 'temperature'),
      color: getStatusColor(weatherData.temperature, 'temperature'),
      progress: getProgressValue('temperature', weatherData.temperature),
    },
    {
      icon: Droplets,
      label: "Humidity",
      value: `${weatherData.humidity}%`,
      status: "Moderate",
      color: "text-primary",
      progress: weatherData.humidity,
    },
    {
      icon: Cloud,
      label: "Rainfall",
      value: `${weatherData.rainfall}mm`,
      status: getStatus(weatherData.rainfall, 'rainfall'),
      color: getStatusColor(weatherData.rainfall, 'rainfall'),
      progress: getProgressValue('rainfall', weatherData.rainfall),
    },
    {
      icon: Wind,
      label: "Wind Speed",
      value: `${weatherData.windSpeed} km/h`,
      status: getStatus(weatherData.windSpeed, 'windSpeed'),
      color: getStatusColor(weatherData.windSpeed, 'windSpeed'),
      progress: getProgressValue('windSpeed', weatherData.windSpeed),
    },
    {
      icon: Gauge,
      label: "Air Quality (AQI)",
      value: `${weatherData.aqi}`,
      status: getStatus(weatherData.aqi, 'aqi'),
      color: getStatusColor(weatherData.aqi, 'aqi'),
      progress: getProgressValue('aqi', weatherData.aqi),
    },
  ] : [];

  const getRiskColor = (level: string) => {
    return level === 'High' ? 'bg-destructive' : level === 'Moderate' ? 'bg-warning' : 'bg-success';
  };

  const getRiskTextColor = (level: string) => {
    return level === 'High' ? 'text-destructive' : level === 'Moderate' ? 'text-warning' : 'text-success';
  };

  const risks = weatherData ? [
    { type: "Flood Risk", level: weatherData.risks.flood, color: getRiskColor(weatherData.risks.flood), textColor: getRiskTextColor(weatherData.risks.flood) },
    { type: "Heatwave Risk", level: weatherData.risks.heatwave, color: getRiskColor(weatherData.risks.heatwave), textColor: getRiskTextColor(weatherData.risks.heatwave) },
    { type: "Air Quality Risk", level: weatherData.risks.airQuality, color: getRiskColor(weatherData.risks.airQuality), textColor: getRiskTextColor(weatherData.risks.airQuality) },
  ] : [];

  return (
    <>
      <AlertBanner alerts={alerts} onDismiss={() => setAlerts([])} />
      <section id="dashboard" className="py-20 bg-muted">
        <div className="container mx-auto px-4">
        <div className="text-center mb-8">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 text-foreground">
            Live Environmental Dashboard
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Real-time monitoring of environmental conditions powered by AI
          </p>
          
          {weatherData && (
            <div className="flex items-center justify-center gap-4 text-muted-foreground">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="font-medium">{weatherData.location}</span>
              </div>
              <span>•</span>
              <span className="text-sm">
                Last updated: {lastUpdate.toLocaleTimeString()}
              </span>
              <Button
                variant="ghost"
                size="sm"
                onClick={fetchWeatherData}
                disabled={loading}
                className="ml-2"
              >
                <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              </Button>
              {isSupported && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleNotifications}
                  className="ml-2"
                  title={notificationsEnabled ? "Disable notifications" : "Enable notifications"}
                >
                  {notificationsEnabled ? (
                    <Bell className="w-4 h-4 text-primary" />
                  ) : (
                    <BellOff className="w-4 h-4" />
                  )}
                </Button>
              )}
            </div>
          )}
        </div>

        {loading && !weatherData ? (
          <div className="text-center py-12">
            <RefreshCw className="w-12 h-12 animate-spin mx-auto text-primary mb-4" />
            <p className="text-muted-foreground">Loading environmental data...</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {metrics.map((metric, index) => (
                <Card key={index} className="bg-gradient-card border-border hover:shadow-glow transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <metric.icon className={`w-8 h-8 ${metric.color}`} />
                      <Badge variant={metric.status === "Normal" || metric.status === "Good" || metric.status === "Light" ? "default" : "destructive"}>
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
                <CardDescription>Current disaster probability predictions based on real-time data</CardDescription>
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
          </>
        )}
        </div>
      </section>
    </>
  );
};

export default Dashboard;
