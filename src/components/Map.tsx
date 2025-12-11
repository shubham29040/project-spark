import { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default marker icons in Leaflet with Vite
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

interface MapProps {
  latitude?: number;
  longitude?: number;
  location?: string;
}

const Map = ({ latitude, longitude, location }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);

  const lat = latitude || 19.076;
  const lon = longitude || 72.8777;

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map only once
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([lat, lon], 12);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map.current);

      // Add marker
      marker.current = L.marker([lat, lon]).addTo(map.current);
      if (location) {
        marker.current.bindPopup(location).openPopup();
      }
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
        marker.current = null;
      }
    };
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (map.current && marker.current) {
      map.current.setView([lat, lon], 12);
      marker.current.setLatLng([lat, lon]);
      if (location) {
        marker.current.bindPopup(location).openPopup();
      }
    }
  }, [lat, lon, location]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-glow">
      <div ref={mapContainer} className="absolute inset-0" />
    </div>
  );
};

export default Map;
