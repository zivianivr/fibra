import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Plus } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/Tabs';
import { CaixaMap } from '../components/caixas/CaixaMap';
import { FibraTray } from '../components/caixas/FibraTray';
import { AddCaboModal } from '../components/caixas/AddCaboModal';
import { FibraDetailsModal } from '../components/caixas/FibraDetailsModal';
import * as api from '../services/api';
import type { Caixa, Cabo, Fibra } from '../types';

export default function CaixaDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [caixa, setCaixa] = useState<Caixa | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAddCaboModalOpen, setIsAddCaboModalOpen] = useState(false);
  const [isFibraModalOpen, setIsFibraModalOpen] = useState(false);
  const [selectedFibra, setSelectedFibra] = useState<Fibra | null>(null);
  const [selectedCabo, setSelectedCabo] = useState<Cabo | null>(null);
  const [ladoCabo, setLadoCabo] = useState<'entrada' | 'saida'>('entrada');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchCaixa = async () => {
        setIsLoading(true);
        const data = await api.getCaixaById(id);
        setCaixa(data || null);
        setIsLoading(false);
      };
      fetchCaixa();
    }
  }, [id]);

  const refreshCaixa = async () => {
    if (id) {
        const data = await api.getCaixaById(id);
        setCaixa(data || null);
    }
  }

  const handleAddCabo = (lado: 'entrada' | 'saida') => {
    setLadoCabo(lado);
    setIsAddCaboModalOpen(true);
  };

  const handleSaveCabo = async (data: any) => {
    if (!id) return;
    setIsSubmitting(true);
    try {
        await api.addCaboToCaixa(id, data);
        await refreshCaixa();
        setIsAddCaboModalOpen(false);
    } catch(error) {
        console.error("Failed to add cabo", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleFibraClick = (fibra: Fibra, cabo: Cabo) => {
    setSelectedFibra(fibra);
    setSelectedCabo(cabo);
    setIsFibraModalOpen(true);
  };

  const handleSaveFibra = async (data: any) => {
    if (!id || !selectedCabo || !selectedFibra) return;
    setIsSubmitting(true);
    try {
        await api.updateFibraInCaixa(id, selectedCabo.id, selectedFibra.id, data);
        await refreshCaixa();
        setIsFibraModalOpen(false);
    } catch (error) {
        console.error("Failed to update fibra", error);
    } finally {
        setIsSubmitting(false);
    }
  }

  if (isLoading) {
    return <div className="p-8 text-center">Carregando detalhes da caixa...</div>;
  }

  if (!caixa) {
    return <div className="p-8 text-center">Caixa não encontrada.</div>;
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <Button asChild variant="ghost" className="mb-4">
        <Link to="/caixas"><ArrowLeft className="mr-2 h-4 w-4" /> Voltar para a lista</Link>
      </Button>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <img src={caixa.foto || 'https://img-wrapper.vercel.app/image?url=https://placehold.co/800x400.png?text=Sem+Foto'} alt={caixa.descricao} className="w-full h-48 object-cover rounded-t-lg" />
            <CardHeader>
              <CardTitle>{caixa.codigo} - {caixa.descricao}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 dark:text-gray-300">{caixa.endereco}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{caixa.latitude}, {caixa.longitude}</p>
            </CardContent>
          </Card>
          <CaixaMap latitude={caixa.latitude} longitude={caixa.longitude} codigo={caixa.codigo} />
        </div>

        <div className="lg:col-span-2">
          <Tabs defaultValue="entrada">
            <TabsList>
              <TabsTrigger value="entrada">Cabos de Entrada</TabsTrigger>
              <TabsTrigger value="saida">Cabos de Saída</TabsTrigger>
            </TabsList>
            <TabsContent value="entrada">
              <div className="flex justify-end mb-4">
                <Button onClick={() => handleAddCabo('entrada')}>
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Adicionar Cabo de Entrada
                </Button>
              </div>
              {caixa.cabos_entrada.length > 0 ? (
                caixa.cabos_entrada.map(cabo => <FibraTray key={cabo.id} cabo={cabo} onFibraClick={(fibra) => handleFibraClick(fibra, cabo)} />)
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhum cabo de entrada cadastrado.</p>
              )}
            </TabsContent>
            <TabsContent value="saida">
              <div className="flex justify-end mb-4">
                <Button onClick={() => handleAddCabo('saida')}>
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  Adicionar Cabo de Saída
                </Button>
              </div>
              {caixa.cabos_saida.length > 0 ? (
                caixa.cabos_saida.map(cabo => <FibraTray key={cabo.id} cabo={cabo} onFibraClick={(fibra) => handleFibraClick(fibra, cabo)} />)
              ) : (
                <p className="text-center text-gray-500 py-8">Nenhum cabo de saída cadastrado.</p>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <AddCaboModal 
        isOpen={isAddCaboModalOpen}
        onClose={() => setIsAddCaboModalOpen(false)}
        onSave={handleSaveCabo}
        lado={ladoCabo}
        isLoading={isSubmitting}
      />
      <FibraDetailsModal
        isOpen={isFibraModalOpen}
        onClose={() => setIsFibraModalOpen(false)}
        onSave={handleSaveFibra}
        fibra={selectedFibra}
        isLoading={isSubmitting}
      />
    </div>
  );
}
