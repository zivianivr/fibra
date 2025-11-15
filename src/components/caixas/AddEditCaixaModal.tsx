import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Modal } from '../ui/Modal';
import type { Caixa } from '../../types';

interface AddEditCaixaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  caixa?: Caixa | null;
  isLoading: boolean;
}

export function AddEditCaixaModal({ isOpen, onClose, onSave, caixa, isLoading }: AddEditCaixaModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  useEffect(() => {
    if (isOpen) {
      if (caixa) {
        reset(caixa);
      } else {
        reset({
          codigo: '',
          descricao: '',
          latitude: '',
          longitude: '',
          endereco: '',
          foto: ''
        });
      }
    }
  }, [isOpen, caixa, reset]);

  const onSubmit = (data: any) => {
    onSave({
        ...data,
        latitude: parseFloat(data.latitude),
        longitude: parseFloat(data.longitude),
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={caixa ? 'Editar Caixa' : 'Adicionar Nova Caixa'}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="codigo">Código</Label>
          <Input id="codigo" {...register('codigo', { required: 'Código é obrigatório' })} />
          {errors.codigo && <p className="text-sm text-red-500 mt-1">{errors.codigo.message as string}</p>}
        </div>
        <div>
          <Label htmlFor="descricao">Descrição</Label>
          <Input id="descricao" {...register('descricao', { required: 'Descrição é obrigatória' })} />
           {errors.descricao && <p className="text-sm text-red-500 mt-1">{errors.descricao.message as string}</p>}
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
          <Label htmlFor="endereco">Endereço</Label>
          <Input id="endereco" {...register('endereco')} />
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
