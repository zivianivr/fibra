import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, MoreHorizontal, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/Card';
import { AddEditCaixaModal } from '../components/caixas/AddEditCaixaModal';
import * as api from '../services/api';
import type { Caixa } from '../types';

export default function CaixasPage() {
  const [caixas, setCaixas] = useState<Caixa[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCaixa, setEditingCaixa] = useState<Caixa | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCaixas = async () => {
      setIsLoading(true);
      const data = await api.getCaixas();
      setCaixas(data);
      setIsLoading(false);
    };
    fetchCaixas();
  }, []);

  const handleOpenModal = (caixa: Caixa | null = null) => {
    setEditingCaixa(caixa);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCaixa(null);
  };

  const handleSaveCaixa = async (data: any) => {
    setIsSubmitting(true);
    try {
        if (editingCaixa) {
            const updatedCaixa = await api.updateCaixa(editingCaixa.id, data);
            setCaixas(caixas.map(c => c.id === updatedCaixa.id ? updatedCaixa : c));
        } else {
            const newCaixa = await api.addCaixa(data);
            setCaixas([...caixas, newCaixa]);
        }
        handleCloseModal();
    } catch (error) {
        console.error("Failed to save caixa", error);
        // Here you could show an error toast
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteCaixa = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir esta caixa?')) {
        try {
            await api.deleteCaixa(id);
            setCaixas(caixas.filter(c => c.id !== id));
        } catch (error) {
            console.error("Failed to delete caixa", error);
        }
    }
  }

  const filteredCaixas = useMemo(() => {
    return caixas.filter(caixa =>
      caixa.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      caixa.descricao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [caixas, searchTerm]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciamento de Caixas</h1>
        <Button onClick={() => handleOpenModal()} className="mt-4 sm:mt-0">
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Adicionar Caixa
        </Button>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por código ou descrição..."
              className="pl-10 w-full max-w-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-10">Carregando...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-800">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Código</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cabos Entrada</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Cabos Saída</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  {filteredCaixas.map((caixa) => (
                    <tr key={caixa.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{caixa.codigo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{caixa.descricao}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{caixa.latitude.toFixed(4)}, {caixa.longitude.toFixed(4)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-300">{caixa.cabos_entrada.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-300">{caixa.cabos_saida.length}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                            <Button asChild variant="ghost" size="sm">
                                <Link to={`/caixas/${caixa.id}`}>Detalhes</Link>
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleOpenModal(caixa)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteCaixa(caixa.id)}>
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <AddEditCaixaModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCaixa}
        caixa={editingCaixa}
        isLoading={isSubmitting}
      />
    </div>
  );
}
