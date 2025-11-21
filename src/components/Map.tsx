import { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { MapPin } from 'lucide-react';
import { toast } from 'sonner';

interface MapProps {
  latitude?: number;
  longitude?: number;
  location?: string;
}

const Map = ({ latitude, longitude, location }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const marker = useRef<mapboxgl.Marker | null>(null);
  const [mapboxToken, setMapboxToken] = useState<string>('');

  useEffect(() => {
    if (!mapContainer.current || !mapboxToken) return;

    mapboxgl.accessToken = mapboxToken;
    
    const initialLat = latitude || 19.076;
    const initialLon = longitude || 72.8777;

    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v12',
      center: [initialLon, initialLat],
      zoom: 12,
    });

    map.current.addControl(
      new mapboxgl.NavigationControl({
        visualizePitch: true,
      }),
      'top-right'
    );

    // Add marker for current location
    marker.current = new mapboxgl.Marker({ color: '#1d7ac7' })
      .setLngLat([initialLon, initialLat])
      .addTo(map.current);

    if (location) {
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setText(location);
      marker.current.setPopup(popup);
    }

    return () => {
      marker.current?.remove();
      map.current?.remove();
    };
  }, [mapboxToken, latitude, longitude, location]);

  const handleTokenSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const token = formData.get('token') as string;
    if (token) {
      setMapboxToken(token);
      toast.success('Map loaded successfully');
    }
  };

  if (!mapboxToken) {
    return (
      <div className="w-full h-[400px] bg-muted rounded-lg flex items-center justify-center p-6">
        <div className="max-w-md w-full space-y-4">
          <div className="text-center space-y-2">
            <MapPin className="w-12 h-12 mx-auto text-primary" />
            <h3 className="text-xl font-semibold text-foreground">Enter Mapbox Token</h3>
            <p className="text-sm text-muted-foreground">
              Get your free token from{' '}
              <a 
                href="https://account.mapbox.com/access-tokens/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                mapbox.com
              </a>
            </p>
          </div>
          <form onSubmit={handleTokenSubmit} className="space-y-2">
            <Input
              name="token"
              type="text"
              placeholder="pk.ey..."
              className="w-full"
              required
            />
            <Button type="submit" className="w-full">
              Load Map
            </Button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-glow">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;
