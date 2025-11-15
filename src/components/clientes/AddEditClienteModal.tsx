import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Modal } from '../ui/Modal';
import type { Cliente } from '../../types';

interface AddEditClienteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  cliente?: Cliente | null;
  isLoading: boolean;
}

export function AddEditClienteModal({ isOpen, onClose, onSave, cliente, isLoading }: AddEditClienteModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();
  const isEditing = !!cliente;

  useEffect(() => {
    if (isOpen) {
      if (cliente) {
        reset({
          ...cliente,
          telefone: cliente.contato.telefone,
          email: cliente.contato.email,
        });
      } else {
        reset({
          nome: '',
          documento: '',
          telefone: '',
          email: '',
          endereco: '',
          latitude: '',
          longitude: '',
          observacoes: '',
          foto: ''
        });
      }
    }
  }, [isOpen, cliente, reset]);

  const onSubmit = (data: any) => {
    onSave({
      nome: data.nome,
      documento: data.documento,
      contato: {
        telefone: data.telefone,
        email: data.email,
      },
      endereco: data.endereco,
      latitude: parseFloat(data.latitude),
      longitude: parseFloat(data.longitude),
      observacoes: data.observacoes,
      foto: data.foto,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={isEditing ? 'Editar Cliente' : 'Adicionar Novo Cliente'} size="lg">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="nome">Nome</Label>
          <Input id="nome" {...register('nome', { required: 'Nome é obrigatório' })} />
          {errors.nome && <p className="text-sm text-red-500 mt-1">{errors.nome.message as string}</p>}
        </div>
        <div>
          <Label htmlFor="documento">Documento (CPF/CNPJ)</Label>
          <Input id="documento" {...register('documento')} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="telefone">Telefone</Label>
            <Input id="telefone" {...register('telefone', { required: 'Telefone é obrigatório' })} />
            {errors.telefone && <p className="text-sm text-red-500 mt-1">{errors.telefone.message as string}</p>}
          </div>
          <div>
            <Label htmlFor="email">E-mail</Label>
            <Input id="email" type="email" {...register('email', { required: 'E-mail é obrigatório' })} />
            {errors.email && <p className="text-sm text-red-500 mt-1">{errors.email.message as string}</p>}
          </div>
        </div>
        <div>
          <Label htmlFor="endereco">Endereço</Label>
          <Input id="endereco" {...register('endereco', { required: 'Endereço é obrigatório' })} />
          {errors.endereco && <p className="text-sm text-red-500 mt-1">{errors.endereco.message as string}</p>}
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
