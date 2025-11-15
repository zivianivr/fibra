import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { Icon } from 'leaflet';
import { Home } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';

const createIcon = (IconComponent: React.ElementType, color: string) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(ReactDOMServer.renderToString(<IconComponent className="h-8 w-8" style={{ color }} />))}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const clienteIcon = createIcon(Home, '#16a34a');

interface ClienteMapProps {
  latitude: number;
  longitude: number;
  nome: string;
}

export function ClienteMap({ latitude, longitude, nome }: ClienteMapProps) {
  return (
    <div className="h-64 w-full rounded-lg overflow-hidden">
      <MapContainer center={[latitude, longitude]} zoom={16} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker position={[latitude, longitude]} icon={clienteIcon}>
          <Popup>{nome}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}
