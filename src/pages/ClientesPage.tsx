import { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardHeader } from '../components/ui/Card';
import { AddEditClienteModal } from '../components/clientes/AddEditClienteModal';
import * as api from '../services/api';
import type { Cliente } from '../types';

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCliente, setEditingCliente] = useState<Cliente | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchClientes = async () => {
    setIsLoading(true);
    const data = await api.getClientes();
    setClientes(data);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchClientes();
  }, []);

  const handleOpenModal = (cliente: Cliente | null = null) => {
    setEditingCliente(cliente);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingCliente(null);
  };

  const handleSaveCliente = async (data: any) => {
    setIsSubmitting(true);
    try {
        if (editingCliente) {
            await api.updateCliente(editingCliente.id, data);
        } else {
            await api.addCliente(data);
        }
        await fetchClientes();
        handleCloseModal();
    } catch (error) {
        console.error("Failed to save cliente", error);
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleDeleteCliente = async (id: string) => {
    if (window.confirm('Tem certeza que deseja excluir este cliente? Esta ação removerá a associação deste cliente de todas as fibras e portas de switch.')) {
        try {
            await api.deleteCliente(id);
            await fetchClientes();
        } catch (error) {
            console.error("Failed to delete cliente", error);
        }
    }
  }

  const filteredClientes = useMemo(() => {
    return clientes.filter(cliente =>
      cliente.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (cliente.documento && cliente.documento.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  }, [clientes, searchTerm]);

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      <div className="sm:flex sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Gerenciamento de Clientes</h1>
        <Button onClick={() => handleOpenModal()} className="mt-4 sm:mt-0">
          <Plus className="-ml-1 mr-2 h-5 w-5" />
          Adicionar Cliente
        </Button>
      </div>

      <Card className="mt-8">
        <CardHeader>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Buscar por nome ou documento..."
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
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Contato</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
                    <th scope="col" className="relative px-6 py-3"><span className="sr-only">Ações</span></th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                  {filteredClientes.map((cliente) => (
                    <tr key={cliente.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">{cliente.nome}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">{cliente.documento}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <div>{cliente.contato.telefone}</div>
                        <div>{cliente.contato.email}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300 max-w-xs truncate">{cliente.endereco}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <div className="flex items-center justify-end gap-2">
                            <Button asChild variant="ghost" size="sm">
                                <Link to={`/clientes/${cliente.id}`}>Detalhes</Link>
                            </Button>
                            <Button variant="outline" size="icon" onClick={() => handleOpenModal(cliente)}>
                                <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="destructive" size="icon" onClick={() => handleDeleteCliente(cliente.id)}>
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

      <AddEditClienteModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCliente}
        cliente={editingCliente}
        isLoading={isSubmitting}
      />
    </div>
  );
}
