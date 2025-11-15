import { useForm } from 'react-hook-form';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { Label } from '../ui/Label';
import { Input } from '../ui/Input';
import { Select } from '../ui/Select';
import { Button } from '../ui/Button';
import { cn } from '../../lib/utils';
import type { PortaSwitch, Cliente } from '../../types';

interface PortaCardProps {
  porta: PortaSwitch;
  clientes: Cliente[];
  onSave: (portaId: string, data: any) => Promise<void>;
}

export function PortaCard({ porta, clientes, onSave }: PortaCardProps) {
  const { register, handleSubmit, formState: { isSubmitting, isDirty } } = useForm({
    defaultValues: {
      vlan: porta.vlan || '',
      ip_cliente: porta.ip_cliente || '',
      cliente_id: porta.cliente_id || '',
      observacoes: porta.observacoes || '',
    }
  });

  const hasClient = !!porta.cliente_id;

  const onSubmit = async (data: any) => {
    const payload = {
      ...data,
      cliente_id: data.cliente_id === '' ? undefined : data.cliente_id,
    };
    await onSave(porta.id, payload);
  };

  return (
    <Card className={cn(hasClient ? 'bg-green-50 dark:bg-green-950/50 border-green-200 dark:border-green-800' : '')}>
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Porta {porta.numero_porta}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div>
              <Label htmlFor={`vlan-${porta.id}`} className="text-xs">VLAN</Label>
              <Input id={`vlan-${porta.id}`} {...register('vlan')} className="h-8" />
            </div>
            <div>
              <Label htmlFor={`ip_cliente-${porta.id}`} className="text-xs">IP Cliente</Label>
              <Input id={`ip_cliente-${porta.id}`} {...register('ip_cliente')} className="h-8" />
            </div>
          </div>
          <div>
            <Label htmlFor={`cliente_id-${porta.id}`} className="text-xs">Cliente</Label>
            <Select id={`cliente_id-${porta.id}`} {...register('cliente_id')} className="h-8">
              <option value="">Nenhum</option>
              {clientes.map(c => (
                <option key={c.id} value={c.id}>{c.nome}</option>
              ))}
            </Select>
          </div>
          <div>
            <Label htmlFor={`observacoes-${porta.id}`} className="text-xs">Observações</Label>
            <Input id={`observacoes-${porta.id}`} {...register('observacoes')} className="h-8" />
          </div>
          <div className="flex justify-end pt-1">
            <Button type="submit" size="sm" isLoading={isSubmitting} disabled={!isDirty}>
              Salvar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
