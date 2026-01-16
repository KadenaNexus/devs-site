import { MapContainer, TileLayer, ZoomControl } from 'react-leaflet';
import { useEffect, useState } from 'react';

interface NodeMapProps {
  theme?: 'dark' | 'light';
}

export function NodeMap({ theme = 'dark' }: NodeMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div className="w-full h-full bg-card/50 animate-pulse rounded-lg" />;

  const tileUrl = theme === 'dark' 
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";

  return (
    <div className="w-full h-[600px] rounded-xl overflow-hidden relative z-0">
      <MapContainer 
        center={[20, 0]} 
        zoom={2} 
        scrollWheelZoom={true} 
        style={{ height: '100%', width: '100%', background: 'transparent' }}
        zoomControl={false}
      >
        <ZoomControl position="bottomright" />
        <TileLayer url={tileUrl} />
      </MapContainer>

      {/* Info overlay */}
      <div className="absolute bottom-4 left-4 bg-card/80 backdrop-blur-sm rounded-lg px-4 py-2 border border-border/50">
        <p className="text-xs text-muted-foreground">
          Kadena Network • Global Coverage
        </p>
      </div>
    </div>
  );
}
