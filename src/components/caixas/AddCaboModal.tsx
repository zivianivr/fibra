import { useForm } from 'react-hook-form';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Label } from '../ui/Label';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { CABO_FIBRAS_OPTIONS, type Cabo } from '../../types';

interface AddCaboModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
  lado: 'entrada' | 'saida';
  isLoading: boolean;
}

export function AddCaboModal({ isOpen, onClose, onSave, lado, isLoading }: AddCaboModalProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = (data: any) => {
    onSave({
        ...data,
        quantidade_fibras: parseInt(data.quantidade_fibras, 10),
        lado,
        ordem_no_lado: 1, // Placeholder
    });
    reset();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Adicionar Cabo de ${lado}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <Label htmlFor="quantidade_fibras">Quantidade de Fibras</Label>
          <Select id="quantidade_fibras" {...register('quantidade_fibras', { required: 'Campo obrigatório' })}>
            {CABO_FIBRAS_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt} FO</option>
            ))}
          </Select>
          {errors.quantidade_fibras && <p className="text-sm text-red-500 mt-1">{errors.quantidade_fibras.message as string}</p>}
        </div>
        <div>
          <Label htmlFor="identificacao">Identificação do Cabo</Label>
          <Input id="identificacao" {...register('identificacao', { required: 'Campo obrigatório' })} />
          {errors.identificacao && <p className="text-sm text-red-500 mt-1">{errors.identificacao.message as string}</p>}
        </div>
        <div>
          <Label htmlFor="observacoes">Observações</Label>
          <Input id="observacoes" {...register('observacoes')} />
        </div>
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button type="submit" isLoading={isLoading}>Salvar Cabo</Button>
        </div>
      </form>
    </Modal>
  );
}
