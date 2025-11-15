import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { mockDb } from '../../lib/mock-data';
import type { Caixa, Cliente, Switch as SwitchType, Circuito } from '../../types';
import { Icon } from 'leaflet';
import { Box, Network, Home } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';

const createIcon = (IconComponent: React.ElementType, color: string) => {
  return new Icon({
    iconUrl: `data:image/svg+xml;base64,${btoa(ReactDOMServer.renderToString(<IconComponent className="h-8 w-8" style={{ color }} />))}`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });
};

const switchIcon = createIcon(Network, '#0284c7');
const caixaIcon = createIcon(Box, '#ca8a04');
const clienteIcon = createIcon(Home, '#16a34a');

function MapFocus({ bounds }: { bounds: [number, number][] }) {
    const map = useMap();
    if (bounds.length > 0) {
        map.fitBounds(bounds, { padding: [50, 50] });
    }
    return null;
}

interface CircuitoMapProps {
    circuito: Circuito;
}

export function CircuitoMap({ circuito }: CircuitoMapProps) {
  const { switches, caixas, clientes } = mockDb;

  const getElemento = (tipo: string, id: string) => {
    switch (tipo) {
        case 'switch': return switches.find(s => s.id === id);
        case 'caixa': return caixas.find(c => c.id === id);
        case 'cliente': return clientes.find(c => c.id === id);
        default: return null;
    }
  }

  const elementosDoCircuito = circuito.elementos
    .map(el => getElemento(el.tipo_elemento, el.elemento_id))
    .filter(Boolean) as (SwitchType | Caixa | Cliente)[];

  const positions = elementosDoCircuito.map(el => [el.latitude, el.longitude] as [number, number]);

  return (
    <div className="h-[500px] w-full rounded-lg overflow-hidden">
      <MapContainer center={[-22.9068, -43.1729]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {elementosDoCircuito.map((el) => {
            let icon, popupContent;
            if ('total_portas' in el) { // Switch
                icon = switchIcon;
                popupContent = <><Network className="h-5 w-5 text-brand-600" />{el.nome}</>;
            } else if ('codigo' in el) { // Caixa
                icon = caixaIcon;
                popupContent = <><Box className="h-5 w-5 text-yellow-600" />{el.codigo}</>;
            } else { // Cliente
                icon = clienteIcon;
                popupContent = <><Home className="h-5 w-5 text-green-600" />{el.nome}</>;
            }
            return (
                <Marker key={el.id} position={[el.latitude, el.longitude]} icon={icon}>
                    <Popup>
                        <Card className="border-none shadow-none">
                            <CardHeader className="p-2">
                                <CardTitle className="flex items-center gap-2 text-base">{popupContent}</CardTitle>
                            </CardHeader>
                        </Card>
                    </Popup>
                </Marker>
            )
        })}

        {positions.length > 0 && <Polyline pathOptions={{ color: 'red', weight: 3 }} positions={positions} />}
        
        <MapFocus bounds={positions} />
      </MapContainer>
    </div>
  );
}
