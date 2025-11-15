export interface Caixa {
  id: string;
  codigo: string;
  descricao: string;
  latitude: number;
  longitude: number;
  endereco?: string;
  foto?: string;
  data_criacao: string;
  data_atualizacao: string;
  cabos_entrada: Cabo[];
  cabos_saida: Cabo[];
}

export interface Cabo {
  id: string;
  caixa_id: string;
  lado: 'entrada' | 'saida';
  ordem_no_lado: number;
  quantidade_fibras: 12 | 24 | 36 | 48 | 60 | 72 | 96 | 120 | 144;
  identificacao: string;
  observacoes?: string;
  fibras: Fibra[];
}

export interface Fibra {
  id: string;
  cabo_id: string;
  numero_conjunto: number;
  cor_conjunto: string;
  numero_fibra_no_conjunto: number;
  cor_fibra: string;
  cliente_id?: string;
  observacoes?: string;
}

export interface Cliente {
  id: string;
  nome: string;
  razao_social?: string;
  documento?: string;
  contato: { telefone: string; email: string };
  endereco: string;
  latitude: number;
  longitude: number;
  observacoes?: string;
  foto?: string;
  data_criacao: string;
  data_atualizacao: string;
}

export interface Switch {
  id: string;
  nome: string;
  modelo: string;
  ip_gestao: string;
  latitude: number;
  longitude: number;
  foto?: string;
  total_portas: 8 | 12 | 16 | 24 | 48;
  data_criacao: string;
  data_atualizacao: string;
  portas: PortaSwitch[];
}

export interface PortaSwitch {
  id: string;
  switch_id: string;
  numero_porta: number;
  vlan?: string;
  ip_cliente?: string;
  cliente_id?: string;
  observacoes?: string;
}

export interface Tecnico {
  id: string;
  nome: string;
  telefone: string;
  email: string;
  observacoes?: string;
}

export interface Chamado {
  id: string;
  cliente_id: string;
  tecnico_id: string;
  titulo: string;
  descricao: string;
  status: 'aberto' | 'em execução' | 'pendente' | 'fechado';
  prioridade: 'baixa' | 'normal' | 'alta';
  data_abertura: string;
  data_inicio_execucao?: string;
  data_fechamento?: string;
  materiais_utilizados?: string;
  observacoes?: string;
  foto_antes?: string;
  foto_depois?: string;
}

export interface CircuitoElemento {
  id: string;
  tipo_elemento: 'switch' | 'caixa' | 'cliente';
  elemento_id: string;
  ordem: number;
}

export interface Circuito {
  id: string;
  cliente_id: string;
  descricao: string;
  elementos: CircuitoElemento[];
}

export const FIBER_COLORS = [
  'Azul', 'Laranja', 'Verde', 'Marrom', 'Cinza', 'Branco',
  'Vermelho', 'Preto', 'Amarelo', 'Violeta', 'Rosa', 'Aqua'
];

export const CABO_FIBRAS_OPTIONS: Cabo['quantidade_fibras'][] = [12, 24, 36, 48, 60, 72, 96, 120, 144];
export const SWITCH_PORTA_OPTIONS: Switch['total_portas'][] = [8, 12, 16, 24, 48];

// Tipos para dados agregados
export interface FibraConectada extends Fibra {
  caixa: Pick<Caixa, 'id' | 'codigo'>;
  cabo: Pick<Cabo, 'id' | 'identificacao' | 'lado'>;
}

export interface PortaConectada extends PortaSwitch {
  switch: Pick<Switch, 'id' | 'nome'>;
}
