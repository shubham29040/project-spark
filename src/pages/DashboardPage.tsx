import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Dashboard from "@/components/Dashboard";
import Map from "@/components/Map";
import PageTransition from "@/components/PageTransition";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

interface LocationData {
  latitude: number;
  longitude: number;
  location: string;
}

interface RiskData {
  flood: string;
  heatwave: string;
  airQuality: string;
  storm: string;
}

const DashboardPage = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [risks, setRisks] = useState<RiskData | null>(null);

  const fetchWeatherData = async (lat: number, lon: number) => {
    try {
      const { data, error } = await supabase.functions.invoke('weather-data', {
        body: { lat, lon }
      });

      if (!error && data?.risks) {
        setRisks(data.risks);
        setLocationData({
          latitude: lat,
          longitude: lon,
          location: data.location || "Your Location",
        });
      }
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          fetchWeatherData(position.coords.latitude, position.coords.longitude);
        },
        () => {
          // Default to Mumbai if geolocation fails
          fetchWeatherData(19.076, 72.8777);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    } else {
      fetchWeatherData(19.076, 72.8777);
    }
  }, []);

  return (
    <PageTransition>
      <main className="min-h-screen flex flex-col">
        <Navigation />
        <div className="flex-1">
          <Dashboard />
          <section className="py-12 bg-background">
            <div className="container mx-auto px-4">
              <Card className="max-w-6xl mx-auto bg-gradient-card border-border shadow-glow">
                <CardHeader>
                  <CardTitle className="text-2xl">Real-Time Alert Map</CardTitle>
                  <CardDescription>
                    Color-coded disaster risk zones for your area
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Map 
                    latitude={locationData?.latitude}
                    longitude={locationData?.longitude}
                    location={locationData?.location}
                    risks={risks || undefined}
                  />
                </CardContent>
              </Card>
            </div>
          </section>
        </div>
        <Footer />
      </main>
    </PageTransition>
  );
};

export default DashboardPage;
