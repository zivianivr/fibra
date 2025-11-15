import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { AddEditSwitchModal } from '../components/switches/AddEditSwitchModal';
import * as api from '../services/api';
import type { Switch } from '../types';

export default function SwitchesPage() {
  const [switches, setSwitches] = useState<Switch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSwitch, setEditingSwitch] = useState<Switch | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchSwitches = async () => {
      setIsLoading(true);
      const data = await api.getSwitches();
      setSwitches(data);
      setIsLoading(false);
    };
    fetchSwitches();
  }, []);

  const handleOpenModal = (sw: Switch | null = null) => {
    setEditingSwitch(sw);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingSwitch(null);
  };

  const handleSaveSwitch = async (data: any) => {
    setIsSubmitting(true);
    try {
        if (editingSwitch) {
            const updatedSwitch = await api.updateSwitch(editingSwitch.id, data);
            setSwitches(switches.map(s => s.id === updatedSwitch.id ? updatedSwitch : s));
        } else {
            const newSwitch = await api.addSwitch(data);
            setSwitches([...switches, newSwitch]);
        }
        handleCloseModal();
    } catch (error) {
        console.error("Failed to save switch", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteSwitch = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este switch? As portas associadas também serão removidas.')) {
        try {
            await api.deleteSwitch(id);
            setSwitches(switches.filter(s => s.id !== id));
        } catch (error) {
            console.error("Failed to delete switch", error);
        }
    }
  }

  const filteredSwitches = useMemo(() => {
    return switches.filter(sw =>
      sw.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sw.modelo.toLowerCase().includes(searchTerm.toLowerCase()) ||
      sw.ip_gestao.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [switches, searchTerm]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciamento de Switches</h1>
        <Button onClick={() => handleOpenModal()} className="mt-4 sm:mt-0">
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Adicionar Switch
        </Button>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome, modelo ou IP..."
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Modelo</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">IP Gestão</th>
                    <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Portas</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  {filteredSwitches.map((sw) => (
                    <tr key={sw.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{sw.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{sw.modelo}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{sw.ip_gestao}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm text-gray-500 dark:text-gray-300">{sw.total_portas}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                            <Button asChild variant="ghost" size="sm">
                                <Link to={`/switches/${sw.id}`}>Detalhes</Link>
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleOpenModal(sw)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteSwitch(sw.id)}>
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

      <AddEditSwitchModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveSwitch}
        switchData={editingSwitch}
        isLoading={isSubmitting}
      />
    </div>
  );
}
