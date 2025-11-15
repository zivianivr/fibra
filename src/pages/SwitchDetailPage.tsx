import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Network } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { SwitchMap } from '../components/switches/SwitchMap';
import { PortaCard } from '../components/switches/PortaCard';
import * as api from '../services/api';
import type { Switch, Cliente } from '../types';

export default function SwitchDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [switchData, setSwitchData] = useState<Switch | null>(null);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsLoading(true);
        const [swData, cliData] = await Promise.all([
          api.getSwitchById(id),
          api.getClientes()
        ]);
        setSwitchData(swData || null);
        setClientes(cliData);
        setIsLoading(false);
      };
      fetchData();
    }
  }, [id]);

  const handleSavePorta = async (portaId: string, data: any) => {
    if (!id) return;
    try {
      await api.updatePorta(id, portaId, data);
      // Refresh data after saving
      const swData = await api.getSwitchById(id);
      setSwitchData(swData || null);
    } catch (error) {
      console.error("Failed to update port", error);
      // Here you could show an error toast
    }
  };

  if (isLoading) {
    return <div className="p-8 text-center">Carregando detalhes do switch...</div>;
  }

  if (!switchData) {
    return <div className="p-8 text-center">Switch não encontrado.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Button asChild variant="ghost" className="mb-4">
        <Link to="/switches"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a lista</Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <img src={switchData.foto || 'https://img-wrapper.vercel.app/image?url=https://img-wrapper.vercel.app/image?url=https://placehold.co/800x400.png?text=Sem+Foto'} alt={switchData.nome} className="w-full h-48 object-cover rounded-t-lg" />
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Network className="h-5 w-5 text-brand-600" />{switchData.nome}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm"><strong>Modelo:</strong> {switchData.modelo}</p>
              <p className="text-sm"><strong>IP de Gestão:</strong> {switchData.ip_gestao}</p>
              <p className="text-sm"><strong>Total de Portas:</strong> {switchData.total_portas}</p>
            </CardContent>
          </Card>
          <SwitchMap latitude={switchData.latitude} longitude={switchData.longitude} nome={switchData.nome} />
        </div>

        <div className="lg:col-span-2">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Gerenciamento de Portas</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {switchData.portas.sort((a,b) => a.numero_porta - b.numero_porta).map(porta => (
                    <PortaCard 
                        key={porta.id} 
                        porta={porta} 
                        clientes={clientes} 
                        onSave={handleSavePorta}
                    />
                ))}
            </div>
        </div>
      </div>
    </div>
  );
}
