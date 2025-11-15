import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, User, Phone, Mail, MapPin, Box, Network, Home, GitBranch } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { ClienteMap } from '../components/clientes/ClienteMap';
import { CircuitoMap } from '../components/clientes/CircuitoMap';
import * as api from '../services/api';
import type { Cliente, FibraConectada, PortaConectada, Circuito } from '../types';

export default function ClienteDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [cliente, setCliente] = useState<Cliente | null>(null);
  const [fibras, setFibras] = useState<FibraConectada[]>([]);
  const [portas, setPortas] = useState<PortaConectada[]>([]);
  const [circuito, setCircuito] = useState<Circuito | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      const fetchData = async () => {
        setIsLoading(true);
        const [clienteData, fibrasData, portasData, circuitoData] = await Promise.all([
          api.getClienteById(id),
          api.findFibrasByClienteId(id),
          api.findPortasByClienteId(id),
          api.getCircuitoByClienteId(id),
        ]);
        setCliente(clienteData || null);
        setFibras(fibrasData);
        setPortas(portasData);
        setCircuito(circuitoData || null);
        setIsLoading(false);
      };
      fetchData();
    }
  }, [id]);

  if (isLoading) {
    return <div className="p-8 text-center">Carregando detalhes do cliente...</div>;
  }

  if (!cliente) {
    return <div className="p-8 text-center">Cliente não encontrado.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Button asChild variant="ghost" className="mb-4">
        <Link to="/clientes"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a lista</Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="h-5 w-5 text-brand-600" />{cliente.nome}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              {cliente.documento && <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><strong>Doc:</strong> {cliente.documento}</p>}
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><Phone className="h-4 w-4 text-gray-400"/> {cliente.contato.telefone}</p>
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><Mail className="h-4 w-4 text-gray-400"/> {cliente.contato.email}</p>
              <p className="flex items-center gap-2 text-gray-700 dark:text-gray-300"><MapPin className="h-4 w-4 text-gray-400"/> {cliente.endereco}</p>
            </CardContent>
          </Card>
        </div>
        <div className="lg:col-span-2">
            <ClienteMap latitude={cliente.latitude} longitude={cliente.longitude} nome={cliente.nome} />
        </div>
      </div>

      <Tabs defaultValue="resumo">
        <TabsList>
          <TabsTrigger value="resumo">Resumo</TabsTrigger>
          <TabsTrigger value="fibras">Fibras</TabsTrigger>
          <TabsTrigger value="portas">Portas de Switch</TabsTrigger>
          <TabsTrigger value="circuito">Circuito</TabsTrigger>
          <TabsTrigger value="chamados">Chamados</TabsTrigger>
        </TabsList>

        <TabsContent value="resumo">
            <Card className="mt-4">
                <CardHeader><CardTitle>Resumo do Cliente</CardTitle></CardHeader>
                <CardContent>
                    <p>Esta área exibirá um resumo dos serviços, status e principais informações do cliente. (Em breve)</p>
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="fibras">
          <Card className="mt-4">
            <CardHeader><CardTitle className="flex items-center gap-2"><Box className="h-5 w-5 text-yellow-600"/>Fibras Conectadas</CardTitle></CardHeader>
            <CardContent>
              {fibras.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Caixa</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Lado</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Cabo</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Grupo</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Fibra</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                      {fibras.map(fibra => (
                        <tr key={fibra.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm"><Link to={`/caixas/${fibra.caixa.id}`} className="text-brand-600 hover:underline">{fibra.caixa.codigo}</Link></td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm capitalize">{fibra.cabo.lado}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{fibra.cabo.identificacao}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{fibra.numero_conjunto} ({fibra.cor_conjunto})</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{fibra.numero_fibra_no_conjunto} ({fibra.cor_fibra})</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="text-center text-gray-500 py-4">Nenhuma fibra associada a este cliente.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="portas">
          <Card className="mt-4">
            <CardHeader><CardTitle className="flex items-center gap-2"><Network className="h-5 w-5 text-brand-700"/>Portas de Switch Conectadas</CardTitle></CardHeader>
            <CardContent>
              {portas.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                    <thead className="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Switch</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Porta</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">VLAN</th>
                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">IP Cliente</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                      {portas.map(porta => (
                        <tr key={porta.id}>
                          <td className="px-4 py-2 whitespace-nowrap text-sm"><Link to={`/switches/${porta.switch.id}`} className="text-brand-600 hover:underline">{porta.switch.nome}</Link></td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{porta.numero_porta}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{porta.vlan || '-'}</td>
                          <td className="px-4 py-2 whitespace-nowrap text-sm">{porta.ip_cliente || '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : <p className="text-center text-gray-500 py-4">Nenhuma porta de switch associada a este cliente.</p>}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="circuito">
            <Card className="mt-4">
                <CardHeader><CardTitle className="flex items-center gap-2"><GitBranch className="h-5 w-5 text-purple-600"/>Circuito do Cliente</CardTitle></CardHeader>
                <CardContent>
                    {circuito ? (
                        <CircuitoMap circuito={circuito} />
                    ) : (
                        <p className="text-center text-gray-500 py-4">Nenhum circuito definido para este cliente.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="chamados">
            <Card className="mt-4">
                <CardHeader><CardTitle>Histórico de Chamados</CardTitle></CardHeader>
                <CardContent>
                    <p>Esta área exibirá todos os chamados técnicos abertos para este cliente. (Em breve)</p>
                </CardContent>
            </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
