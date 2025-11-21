import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import Dashboard from "@/components/Dashboard";
import Map from "@/components/Map";
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface LocationData {
  latitude: number;
  longitude: number;
  location: string;
}

const DashboardPage = () => {
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocationData({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            location: "Your Location",
          });
        },
        () => {
          // Default to Mumbai if geolocation fails
          setLocationData({
            latitude: 19.076,
            longitude: 72.8777,
            location: "Mumbai, India",
          });
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 0,
        }
      );
    }
  }, []);

  return (
    <main className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-1">
        <Dashboard />
        <section className="py-12 bg-background">
          <div className="container mx-auto px-4">
            <Card className="max-w-6xl mx-auto bg-gradient-card border-border shadow-glow">
              <CardHeader>
                <CardTitle className="text-2xl">Location Map</CardTitle>
                <CardDescription>
                  Your current location and surrounding area
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Map 
                  latitude={locationData?.latitude}
                  longitude={locationData?.longitude}
                  location={locationData?.location}
                />
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
      <Footer />
    </main>
  );
};

export default DashboardPage;
