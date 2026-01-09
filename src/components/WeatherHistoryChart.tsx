import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, AreaChart, Area } from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { RefreshCw, TrendingUp, Calendar } from "lucide-react";
import { format } from "date-fns";

interface WeatherHistoryData {
  id: string;
  location: string;
  temperature: number;
  humidity: number;
  rainfall: number;
  wind_speed: number;
  aqi: number;
  recorded_at: string;
  flood_risk: string;
  heatwave_risk: string;
  air_quality_risk: string;
  storm_risk: string;
}

type TimeRange = "24h" | "7d" | "30d";

const WeatherHistoryChart = () => {
  const [historyData, setHistoryData] = useState<WeatherHistoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState<TimeRange>("24h");
  const [activeMetric, setActiveMetric] = useState<"temperature" | "humidity" | "aqi" | "wind">("temperature");

  const fetchHistoryData = async () => {
    setLoading(true);
    try {
      const now = new Date();
      let startDate: Date;

      switch (timeRange) {
        case "24h":
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
          break;
        case "7d":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
          break;
        case "30d":
          startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
          break;
        default:
          startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      }

      const { data, error } = await supabase
        .from("weather_history")
        .select("*")
        .gte("recorded_at", startDate.toISOString())
        .order("recorded_at", { ascending: true });

      if (error) {
        console.error("Error fetching weather history:", error);
        return;
      }

      setHistoryData(data || []);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistoryData();
  }, [timeRange]);

  const formatChartData = () => {
    return historyData.map((item) => ({
      time: format(new Date(item.recorded_at), timeRange === "24h" ? "HH:mm" : "MMM dd"),
      temperature: Number(item.temperature),
      humidity: Number(item.humidity),
      aqi: Number(item.aqi),
      windSpeed: Number(item.wind_speed),
      rainfall: Number(item.rainfall),
    }));
  };

  const chartData = formatChartData();

  const getChartColor = (metric: string) => {
    switch (metric) {
      case "temperature":
        return "hsl(var(--warning))";
      case "humidity":
        return "hsl(var(--primary))";
      case "aqi":
        return "hsl(var(--destructive))";
      case "wind":
        return "hsl(var(--accent))";
      default:
        return "hsl(var(--primary))";
    }
  };

  const getMetricConfig = () => {
    switch (activeMetric) {
      case "temperature":
        return { key: "temperature", label: "Temperature (°C)", color: getChartColor("temperature") };
      case "humidity":
        return { key: "humidity", label: "Humidity (%)", color: getChartColor("humidity") };
      case "aqi":
        return { key: "aqi", label: "Air Quality Index", color: getChartColor("aqi") };
      case "wind":
        return { key: "windSpeed", label: "Wind Speed (km/h)", color: getChartColor("wind") };
      default:
        return { key: "temperature", label: "Temperature (°C)", color: getChartColor("temperature") };
    }
  };

  const metricConfig = getMetricConfig();

  const calculateStats = () => {
    if (chartData.length === 0) return null;

    const values = chartData.map((d) => d[metricConfig.key as keyof typeof d] as number);
    const avg = values.reduce((a, b) => a + b, 0) / values.length;
    const max = Math.max(...values);
    const min = Math.min(...values);

    return { avg: avg.toFixed(1), max: max.toFixed(1), min: min.toFixed(1) };
  };

  const stats = calculateStats();

  return (
    <Card className="bg-gradient-card border-border shadow-glow">
      <CardHeader>
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <TrendingUp className="w-6 h-6 text-primary" />
            <div>
              <CardTitle className="text-2xl">Weather Trends</CardTitle>
              <CardDescription>Historical weather data analysis</CardDescription>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 bg-muted rounded-lg p-1">
              {(["24h", "7d", "30d"] as TimeRange[]).map((range) => (
                <Button
                  key={range}
                  variant={timeRange === range ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setTimeRange(range)}
                  className="px-3"
                >
                  <Calendar className="w-3 h-3 mr-1" />
                  {range}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="icon" onClick={fetchHistoryData} disabled={loading}>
              <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <RefreshCw className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
            <TrendingUp className="w-12 h-12 mb-4 opacity-50" />
            <p className="text-lg font-medium">No historical data available</p>
            <p className="text-sm">Weather data will appear here as it's collected</p>
          </div>
        ) : (
          <>
            <Tabs value={activeMetric} onValueChange={(v) => setActiveMetric(v as typeof activeMetric)} className="mb-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="temperature">Temperature</TabsTrigger>
                <TabsTrigger value="humidity">Humidity</TabsTrigger>
                <TabsTrigger value="aqi">Air Quality</TabsTrigger>
                <TabsTrigger value="wind">Wind Speed</TabsTrigger>
              </TabsList>
            </Tabs>

            {stats && (
              <div className="grid grid-cols-3 gap-4 mb-6">
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Average</p>
                  <p className="text-2xl font-bold text-foreground">{stats.avg}</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Maximum</p>
                  <p className="text-2xl font-bold text-destructive">{stats.max}</p>
                </div>
                <div className="bg-muted rounded-lg p-4 text-center">
                  <p className="text-sm text-muted-foreground">Minimum</p>
                  <p className="text-2xl font-bold text-primary">{stats.min}</p>
                </div>
              </div>
            )}

            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`color${activeMetric}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={metricConfig.color} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={metricConfig.color} stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="time" className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                  <YAxis className="text-xs fill-muted-foreground" tick={{ fontSize: 12 }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--card))",
                      border: "1px solid hsl(var(--border))",
                      borderRadius: "8px",
                    }}
                    labelStyle={{ color: "hsl(var(--foreground))" }}
                  />
                  <Area
                    type="monotone"
                    dataKey={metricConfig.key}
                    stroke={metricConfig.color}
                    strokeWidth={2}
                    fillOpacity={1}
                    fill={`url(#color${activeMetric})`}
                    name={metricConfig.label}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherHistoryChart;
