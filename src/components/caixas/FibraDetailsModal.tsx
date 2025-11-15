import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import type { Fibra, Cliente } from '../../types';
import * as api from '../../services/api';

interface FibraDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  fibra: Fibra | null;
  isLoading: boolean;
}

export function FibraDetailsModal({ isOpen, onClose, onSave, fibra, isLoading }: FibraDetailsModalProps) {
  const { register, handleSubmit, reset } = useForm();
  const [clientes, setClientes] = useState<Cliente[]>([]);

  useEffect(() => {
    if (isOpen) {
      api.getClientes().then(setClientes);
      reset({
        cliente_id: fibra?.cliente_id || '',
        observacoes: fibra?.observacoes || '',
      });
    }
  }, [isOpen, fibra, reset]);

  if (!fibra) return null;

  const onSubmit = (data: any) => {
    onSave({
        ...data,
        cliente_id: data.cliente_id === '' ? undefined : data.cliente_id,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detalhes da Fibra`}>
        <div className="mb-4 space-y-2">
            <p><strong>Cabo:</strong> {fibra.cabo_id.substring(0,8)}...</p>
            <p><strong>Grupo:</strong> {fibra.numero_conjunto} ({fibra.cor_conjunto})</p>
            <p><strong>Fibra:</strong> {fibra.numero_fibra_no_conjunto} ({fibra.cor_fibra})</p>
        </div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="cliente_id">Cliente Associado</Label>
          <Select id="cliente_id" {...register('cliente_id')}>
            <option value="">Nenhum</option>
            {clientes.map(c => (
              <option key={c.id} value={c.id}>{c.nome}</option>
            ))}
          </Select>
        </div>
        <div>
          <Label htmlFor="observacoes">Observações</Label>
          <Input id="observacoes" {...register('observacoes')} />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={isLoading}>Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}
