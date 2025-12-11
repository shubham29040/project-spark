import { useEffect, useState } from 'react';
import 'leaflet/dist/leaflet.css';

interface MapProps {
  latitude?: number;
  longitude?: number;
  location?: string;
}

const Map = ({ latitude, longitude, location }: MapProps) => {
  const [MapComponents, setMapComponents] = useState<any>(null);
  const lat = latitude || 19.076;
  const lon = longitude || 72.8777;

  useEffect(() => {
    // Dynamic import to avoid SSR issues and ensure proper initialization
    import('leaflet').then((L) => {
      // Fix for default marker icons
      delete (L.Icon.Default.prototype as any)._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
        iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      });

      import('react-leaflet').then((RL) => {
        setMapComponents({
          MapContainer: RL.MapContainer,
          TileLayer: RL.TileLayer,
          Marker: RL.Marker,
          Popup: RL.Popup,
          useMap: RL.useMap,
        });
      });
    });
  }, []);

  if (!MapComponents) {
    return (
      <div className="relative w-full h-[400px] rounded-lg overflow-hidden bg-muted flex items-center justify-center">
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup } = MapComponents;

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-glow">
      <MapContainer
        center={[lat, lon]}
        zoom={12}
        style={{ height: '100%', width: '100%' }}
        key={`${lat}-${lon}`}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          <Popup>{location || 'Your Location'}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
};

export default Map;
