import { faker } from '@faker-js/faker';
import type { Caixa, Cliente, Switch, Circuito, Cabo, Fibra, PortaSwitch } from '../types';
import { FIBER_COLORS, CABO_FIBRAS_OPTIONS, SWITCH_PORTA_OPTIONS } from '../types';

faker.locale = 'pt_BR';

const generateFibras = (caboId: string, quantidade: number): Fibra[] => {
  const fibras: Fibra[] = [];
  const numGrupos = quantidade / 12;
  for (let i = 0; i < numGrupos; i++) {
    const grupoCor = FIBER_COLORS[i % 12];
    for (let j = 0; j < 12; j++) {
      fibras.push({
        id: faker.string.uuid(),
        cabo_id: caboId,
        numero_conjunto: i + 1,
        cor_conjunto: grupoCor,
        numero_fibra_no_conjunto: j + 1,
        cor_fibra: FIBER_COLORS[j],
      });
    }
  }
  return fibras;
};

const generatePortas = (switchId: string, quantidade: Switch['total_portas']): PortaSwitch[] => {
    return Array.from({ length: quantidade }, (_, i) => ({
        id: faker.string.uuid(),
        switch_id: switchId,
        numero_porta: i + 1,
    }));
};

const createMockClientes = (count: number): Cliente[] => {
  return Array.from({ length: count }, () => ({
    id: faker.string.uuid(),
    nome: faker.company.name(),
    endereco: faker.address.streetAddress(),
    latitude: parseFloat(faker.address.latitude(-22.90, -22.92)),
    longitude: parseFloat(faker.address.longitude(-43.17, -43.22)),
    contato: { email: faker.internet.email(), telefone: faker.phone.number() },
    data_criacao: faker.date.past().toISOString(),
    data_atualizacao: faker.date.recent().toISOString(),
  }));
};

const createMockCaixas = (count: number, clientes: Cliente[]): Caixa[] => {
  const caixas = Array.from({ length: count }, (_, i) => {
    const caixaId = faker.string.uuid();
    
    // Create input cable
    const caboEntradaId = faker.string.uuid();
    const qtdFibrasEntrada = faker.helpers.arrayElement(CABO_FIBRAS_OPTIONS);
    const fibrasEntrada = generateFibras(caboEntradaId, qtdFibrasEntrada);
    // Assign a random client to a fiber
    if (clientes.length > 0) {
      const randomFiberIndex = faker.datatype.number({ min: 0, max: fibrasEntrada.length - 1 });
      const randomClientIndex = faker.datatype.number({ min: 0, max: clientes.length - 1 });
      fibrasEntrada[randomFiberIndex].cliente_id = clientes[randomClientIndex].id;
      fibrasEntrada[randomFiberIndex].observacoes = `Conexão principal ${clientes[randomClientIndex].nome}`;
    }
    const caboEntrada: Cabo = {
        id: caboEntradaId,
        caixa_id: caixaId,
        lado: 'entrada',
        ordem_no_lado: 1,
        quantidade_fibras: qtdFibrasEntrada,
        identificacao: `Cabo Principal ${qtdFibrasEntrada}FO`,
        fibras: fibrasEntrada,
    };

    // Create output cable
    const caboSaidaId = faker.string.uuid();
    const qtdFibrasSaida = faker.helpers.arrayElement(CABO_FIBRAS_OPTIONS);
    const caboSaida: Cabo = {
        id: caboSaidaId,
        caixa_id: caixaId,
        lado: 'saida',
        ordem_no_lado: 1,
        quantidade_fibras: qtdFibrasSaida,
        identificacao: `Derivação ${faker.address.streetName()}`,
        fibras: generateFibras(caboSaidaId, qtdFibrasSaida),
    };

    return {
      id: caixaId,
      codigo: `CX-${String(i).padStart(3, '0')}`,
      descricao: `Caixa de Emenda ${faker.address.streetName()}`,
      latitude: parseFloat(faker.address.latitude(-22.90, -22.92)),
      longitude: parseFloat(faker.address.longitude(-43.17, -43.22)),
      endereco: faker.address.streetAddress(true),
      foto: `https://picsum.photos/seed/${i}/800/400`,
      data_criacao: faker.date.past().toISOString(),
      data_atualizacao: faker.date.recent().toISOString(),
      cabos_entrada: [caboEntrada],
      cabos_saida: [caboSaida],
    };
  });
  return caixas;
};

const createMockSwitches = (count: number, clientes: Cliente[]): Switch[] => {
  return Array.from({ length: count }, (_, i) => {
    const switchId = faker.string.uuid();
    const totalPortas = faker.helpers.arrayElement(SWITCH_PORTA_OPTIONS);
    const portas = generatePortas(switchId, totalPortas);

    // Assign a random client to a port
    if (clientes.length > 0) {
        const randomPortIndex = faker.datatype.number({ min: 0, max: portas.length - 1 });
        const randomClientIndex = faker.datatype.number({ min: 0, max: clientes.length - 1 });
        portas[randomPortIndex].cliente_id = clientes[randomClientIndex].id;
        portas[randomPortIndex].vlan = faker.datatype.number({ min: 100, max: 200 }).toString();
        portas[randomPortIndex].ip_cliente = faker.internet.ipv4();
        portas[randomPortIndex].observacoes = `Cliente ${clientes[randomClientIndex].nome}`;
    }

    return {
        id: switchId,
        nome: `SW-${String(i).padStart(2, '0')} ${faker.address.city()}`,
        modelo: faker.helpers.arrayElement(['Cisco Catalyst 2960', 'Juniper EX2300', 'HPE Aruba 2530']),
        ip_gestao: faker.internet.ip(),
        latitude: parseFloat(faker.address.latitude(-22.90, -22.92)),
        longitude: parseFloat(faker.address.longitude(-43.17, -43.22)),
        foto: `https://picsum.photos/seed/sw${i}/800/400`,
        total_portas: totalPortas,
        data_criacao: faker.date.past().toISOString(),
        data_atualizacao: faker.date.recent().toISOString(),
        portas: portas,
    }
  });
};

export const mockClientes = createMockClientes(25);
export const mockCaixas = createMockCaixas(8, mockClientes);
export const mockSwitches = createMockSwitches(3, mockClientes);

// Create a mock circuit
const clienteCircuito = mockClientes[0];
const switchCircuito = mockSwitches[0];
const caixa1Circuito = mockCaixas[0];
const caixa2Circuito = mockCaixas[1];

export const mockCircuitos: Circuito[] = [
  {
    id: faker.string.uuid(),
    cliente_id: clienteCircuito.id,
    descricao: `Circuito para ${clienteCircuito.nome}`,
    elementos: [
      { id: faker.string.uuid(), tipo_elemento: 'switch', elemento_id: switchCircuito.id, ordem: 1 },
      { id: faker.string.uuid(), tipo_elemento: 'caixa', elemento_id: caixa1Circuito.id, ordem: 2 },
      { id: faker.string.uuid(), tipo_elemento: 'caixa', elemento_id: caixa2Circuito.id, ordem: 3 },
      { id: faker.string.uuid(), tipo_elemento: 'cliente', elemento_id: clienteCircuito.id, ordem: 4 },
    ],
  },
];

export let mockDb = {
  clientes: mockClientes,
  caixas: mockCaixas,
  switches: mockSwitches,
  circuitos: mockCircuitos,
};

// Function to allow mutation of the mock DB
export const updateDb = (newDb: typeof mockDb) => {
    mockDb = newDb;
}
