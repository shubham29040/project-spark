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

interface RiskData {
  flood: string;
  heatwave: string;
  airQuality: string;
  storm: string;
}

interface MapProps {
  latitude?: number;
  longitude?: number;
  location?: string;
  risks?: RiskData;
}

const getRiskColor = (level: string): string => {
  switch (level.toLowerCase()) {
    case 'high':
      return '#ef4444'; // red
    case 'moderate':
      return '#f59e0b'; // amber
    case 'low':
      return '#22c55e'; // green
    default:
      return '#6b7280'; // gray
  }
};

const getRiskOpacity = (level: string): number => {
  switch (level.toLowerCase()) {
    case 'high':
      return 0.4;
    case 'moderate':
      return 0.3;
    case 'low':
      return 0.2;
    default:
      return 0.1;
  }
};

const Map = ({ latitude, longitude, location, risks }: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<L.Map | null>(null);
  const marker = useRef<L.Marker | null>(null);
  const alertCircles = useRef<L.Circle[]>([]);

  const lat = latitude || 19.8;
  const lon = longitude || 72.76;

  useEffect(() => {
    if (!mapContainer.current) return;

    // Initialize map only once
    if (!map.current) {
      map.current = L.map(mapContainer.current).setView([lat, lon], 11);

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
        alertCircles.current = [];
      }
    };
  }, []);

  // Update marker position when coordinates change
  useEffect(() => {
    if (map.current && marker.current) {
      map.current.setView([lat, lon], 11);
      marker.current.setLatLng([lat, lon]);
      if (location) {
        marker.current.bindPopup(location).openPopup();
      }
    }
  }, [lat, lon, location]);

  // Update alert circles when risks change
  useEffect(() => {
    if (!map.current || !risks) return;

    // Remove existing circles
    alertCircles.current.forEach(circle => circle.remove());
    alertCircles.current = [];

    const alertTypes = [
      { type: 'Flood Risk', level: risks.flood, radius: 5000, offset: [0.02, 0] },
      { type: 'Heatwave Risk', level: risks.heatwave, radius: 4500, offset: [-0.015, 0.015] },
      { type: 'Air Quality', level: risks.airQuality, radius: 4000, offset: [0.015, -0.015] },
      { type: 'Storm Risk', level: risks.storm, radius: 3500, offset: [-0.02, -0.02] },
    ];

    alertTypes.forEach(alert => {
      if (alert.level.toLowerCase() !== 'low') {
        const circle = L.circle([lat + alert.offset[0], lon + alert.offset[1]], {
          color: getRiskColor(alert.level),
          fillColor: getRiskColor(alert.level),
          fillOpacity: getRiskOpacity(alert.level),
          radius: alert.radius,
          weight: 2,
        }).addTo(map.current!);

        circle.bindPopup(`
          <div style="text-align: center; padding: 4px;">
            <strong style="color: ${getRiskColor(alert.level)};">${alert.type}</strong><br/>
            <span style="font-size: 12px;">Level: ${alert.level}</span>
          </div>
        `);

        alertCircles.current.push(circle);
      }
    });

    // Add a main alert circle around the location
    const highestRisk = [risks.flood, risks.heatwave, risks.airQuality, risks.storm]
      .reduce((max, current) => {
        const levels = { high: 3, moderate: 2, low: 1 };
        return (levels[current.toLowerCase() as keyof typeof levels] || 0) > 
               (levels[max.toLowerCase() as keyof typeof levels] || 0) ? current : max;
      }, 'low');

    if (highestRisk.toLowerCase() !== 'low') {
      const mainCircle = L.circle([lat, lon], {
        color: getRiskColor(highestRisk),
        fillColor: getRiskColor(highestRisk),
        fillOpacity: 0.15,
        radius: 8000,
        weight: 3,
        dashArray: '10, 5',
      }).addTo(map.current);

      mainCircle.bindPopup(`
        <div style="text-align: center; padding: 8px;">
          <strong>Alert Zone</strong><br/>
          <span style="color: ${getRiskColor(highestRisk)}; font-weight: bold;">
            Overall Risk: ${highestRisk}
          </span>
        </div>
      `);

      alertCircles.current.push(mainCircle);
    }
  }, [risks, lat, lon]);

  return (
    <div className="relative w-full h-[400px] rounded-lg overflow-hidden shadow-glow">
      <div ref={mapContainer} className="absolute inset-0" />
      
      {/* Legend */}
      {risks && (
        <div className="absolute bottom-4 left-4 z-[1000] bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border">
          <h4 className="text-xs font-semibold mb-2 text-foreground">Alert Levels</h4>
          <div className="space-y-1">
            {[
              { type: 'Flood', level: risks.flood },
              { type: 'Heatwave', level: risks.heatwave },
              { type: 'Air Quality', level: risks.airQuality },
              { type: 'Storm', level: risks.storm },
            ].map(item => (
              <div key={item.type} className="flex items-center gap-2 text-xs">
                <div 
                  className="w-3 h-3 rounded-full border"
                  style={{ 
                    backgroundColor: getRiskColor(item.level),
                    opacity: item.level.toLowerCase() === 'low' ? 0.5 : 1 
                  }}
                />
                <span className="text-muted-foreground">{item.type}:</span>
                <span 
                  className="font-medium"
                  style={{ color: getRiskColor(item.level) }}
                >
                  {item.level}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Map;
