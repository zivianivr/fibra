import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import type { Switch } from '../../types';
import { SWITCH_PORTA_OPTIONS } from '../../types';

interface AddEditSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  switchData?: Switch | null;
  isLoading: boolean;
}

export function AddEditSwitchModal({ isOpen, onClose, onSave, switchData, isLoading }: AddEditSwitchModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const isEditing = !!switchData;

  useEffect(() => {
    if (isOpen) {
      if (switchData) {
        reset(switchData);
      } else {
        reset({
          nome: '',
          modelo: '',
          ip_gestao: '',
          total_portas: '24',
          latitude: '',
          longitude: '',
          foto: ''
        });
      }
    }
  }, [isOpen, switchData, reset]);

  const onSubmit = (data: any) => {
    onSave({
        ...data,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
        total_portas: parseInt(data.total_portas, 10),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar Switch' : 'Adicionar Novo Switch'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="nome">Nome</Label>
                <Input id="nome" {...register('nome', { required: 'Nome é obrigatório' })} />
                {errors.nome && <p className="text-sm text-red-500 mt-1">{errors.nome.message as string}</p>}
            </div>
            <div>
                <Label htmlFor="modelo">Modelo</Label>
                <Input id="modelo" {...register('modelo', { required: 'Modelo é obrigatório' })} />
                {errors.modelo && <p className="text-sm text-red-500 mt-1">{errors.modelo.message as string}</p>}
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="ip_gestao">IP de Gestão</Label>
                <Input id="ip_gestao" {...register('ip_gestao', { required: 'IP é obrigatório' })} />
                {errors.ip_gestao && <p className="text-sm text-red-500 mt-1">{errors.ip_gestao.message as string}</p>}
            </div>
            <div>
                <Label htmlFor="total_portas">Total de Portas</Label>
                <Select id="total_portas" {...register('total_portas')} disabled={isEditing}>
                    {SWITCH_PORTA_OPTIONS.map(opt => (
                        <option key={opt} value={opt}>{opt} Portas</option>
                    ))}
                </Select>
                {isEditing && <p className="text-xs text-gray-500 mt-1">Não é possível alterar o total de portas de um switch existente.</p>}
            </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
                <Label htmlFor="latitude">Latitude</Label>
                <Input id="latitude" type="number" step="any" {...register('latitude', { required: 'Latitude é obrigatória' })} />
                {errors.latitude && <p className="text-sm text-red-500 mt-1">{errors.latitude.message as string}</p>}
            </div>
            <div>
                <Label htmlFor="longitude">Longitude</Label>
                <Input id="longitude" type="number" step="any" {...register('longitude', { required: 'Longitude é obrigatória' })} />
                {errors.longitude && <p className="text-sm text-red-500 mt-1">{errors.longitude.message as string}</p>}
            </div>
        </div>
        <div>
          <Label htmlFor="foto">URL da Foto</Label>
          <Input id="foto" {...register('foto')} placeholder="https://exemplo.com/foto.jpg" />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={isLoading}>Salvar</Button>
        </div>
      </form>
    </Modal>
  );
}
