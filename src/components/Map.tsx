import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
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

// Component to update map center when coordinates change
const MapUpdater = ({ latitude, longitude }: { latitude: number; longitude: number }) => {
  const map = useMap();
  
  useEffect(() => {
    map.setView([latitude, longitude], map.getZoom());
  }, [latitude, longitude, map]);
  
  return null;
};

const Map = ({ latitude, longitude, location }: MapProps) => {
  const lat = latitude || 19.076;
  const lon = longitude || 72.8777;

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-glow">
      <MapContainer
        center={[lat, lon]}
        zoom={12}
        className="absolute inset-0 z-0"
        style={{ height: '100%', width: '100%' }}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[lat, lon]}>
          {location && <Popup>{location}</Popup>}
        </Marker>
        <MapUpdater latitude={lat} longitude={lon} />
      </MapContainer>
    </div>
  );
};

export default Map;
