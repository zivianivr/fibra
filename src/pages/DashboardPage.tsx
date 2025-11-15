import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import { mockDb } from '../lib/mock-data';
import type { Caixa, Cliente, Switch as SwitchType } from '../types';
import { Icon } from 'leaflet';
import { Box, Network, Home } from 'lucide-react';
import ReactDOMServer from 'react-dom/server';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';

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

function MapFocus({ circuit }: { circuit: any }) {
    const map = useMap();
    if (circuit && circuit.elementos.length > 0) {
        const bounds = circuit.elementos.map((el: any) => {
            const item = mockDb.switches.find(s => s.id === el.elemento_id) ||
                         mockDb.caixas.find(c => c.id === el.elemento_id) ||
                         mockDb.clientes.find(c => c.id === el.elemento_id);
            return [item.latitude, item.longitude];
        });
        if (bounds.length > 0) {
            map.fitBounds(bounds, { padding: [50, 50] });
        }
    }
    return null;
}

export default function DashboardPage() {
  const { switches, caixas, clientes, circuitos } = mockDb;

  const getCircuitPositions = (circuito: any) => {
    return circuito.elementos.map((el: any) => {
      const item = [...switches, ...caixas, ...clientes].find(e => e.id === el.elemento_id);
      return item ? [item.latitude, item.longitude] : null;
    }).filter(Boolean);
  };

  const circuitPositions = getCircuitPositions(circuitos[0]);

  return (
    <div className="h-full w-full">
      <MapContainer center={[-22.9068, -43.1729]} zoom={13} scrollWheelZoom={true} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {switches.map((s: SwitchType) => (
          <Marker key={s.id} position={[s.latitude, s.longitude]} icon={switchIcon}>
            <Popup>
              <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Network className="h-5 w-5 text-brand-600" />{s.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p><strong>Modelo:</strong> {s.modelo}</p>
                  <p><strong>IP:</strong> {s.ip_gestao}</p>
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        ))}

        {caixas.map((c: Caixa) => (
          <Marker key={c.id} position={[c.latitude, c.longitude]} icon={caixaIcon}>
            <Popup>
               <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Box className="h-5 w-5 text-yellow-600" />{c.codigo}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{c.descricao}</p>
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        ))}

        {clientes.map((c: Cliente) => (
          <Marker key={c.id} position={[c.latitude, c.longitude]} icon={clienteIcon}>
            <Popup>
               <Card className="border-none shadow-none">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Home className="h-5 w-5 text-green-600" />{c.nome}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{c.endereco}</p>
                </CardContent>
              </Card>
            </Popup>
          </Marker>
        ))}

        {circuitPositions.length > 0 && <Polyline pathOptions={{ color: 'red', weight: 3 }} positions={circuitPositions} />}
        
        <MapFocus circuit={circuitos[0]} />
      </MapContainer>
    </div>
  );
}
