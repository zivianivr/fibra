import { useMemo } from 'react';
import type { Cabo, Fibra } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { cn } from '../../lib/utils';

const fiberColorMap: { [key: string]: string } = {
    'Azul': 'bg-blue-500',
    'Laranja': 'bg-orange-500',
    'Verde': 'bg-green-500',
    'Marrom': 'bg-brown-500', // Custom color needed
    'Cinza': 'bg-gray-500',
    'Branco': 'bg-gray-200 border border-gray-400',
    'Vermelho': 'bg-red-500',
    'Preto': 'bg-black',
    'Amarelo': 'bg-yellow-400',
    'Violeta': 'bg-violet-500',
    'Rosa': 'bg-pink-500',
    'Aqua': 'bg-cyan-400',
};

interface FibraBadgeProps {
    fibra: Fibra;
    onClick: () => void;
}

function FibraBadge({ fibra, onClick }: FibraBadgeProps) {
    const colorClass = fiberColorMap[fibra.cor_fibra] || 'bg-gray-300';
    const hasClient = !!fibra.cliente_id;

    return (
        <button 
            onClick={onClick}
            className={cn(
                "w-full flex items-center justify-between p-1.5 rounded-md text-xs font-mono hover:ring-2 hover:ring-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500 transition-all",
                hasClient ? 'bg-gray-100 dark:bg-gray-700' : 'bg-gray-50 dark:bg-gray-800'
            )}
        >
            <div className="flex items-center gap-2">
                <span className={cn("h-4 w-4 rounded-full inline-block", colorClass)}></span>
                <span className="text-gray-600 dark:text-gray-300">{String(fibra.numero_fibra_no_conjunto).padStart(2, '0')}</span>
            </div>
            {hasClient && <span className="text-green-600 font-bold">C</span>}
        </button>
    )
}

interface FibraTrayProps {
    cabo: Cabo;
    onFibraClick: (fibra: Fibra) => void;
}

export function FibraTray({ cabo, onFibraClick }: FibraTrayProps) {
    const grupos = useMemo(() => {
        const g: Fibra[][] = [];
        for (let i = 0; i < cabo.fibras.length; i += 12) {
            g.push(cabo.fibras.slice(i, i + 12));
        }
        return g;
    }, [cabo.fibras]);

    return (
        <Card className="mt-4">
            <CardHeader>
                <CardTitle className="text-base">{cabo.identificacao} ({cabo.quantidade_fibras}FO)</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
                    {grupos.map((grupo, index) => (
                        <div key={index} className="space-y-1 p-2 rounded-lg bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
                            <h4 className="font-semibold text-sm text-center mb-2">
                                Grupo {grupo[0].numero_conjunto} ({grupo[0].cor_conjunto})
                            </h4>
                            {grupo.map(fibra => (
                                <FibraBadge key={fibra.id} fibra={fibra} onClick={() => onFibraClick(fibra)} />
                            ))}
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}
