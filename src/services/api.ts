import { faker } from '@faker-js/faker';
import { mockDb, updateDb } from '../lib/mock-data';
import type { Caixa, Cabo, Fibra, Switch, PortaSwitch, Cliente, FibraConectada, PortaConectada } from '../types';
import { FIBER_COLORS, SWITCH_PORTA_OPTIONS } from '../types';

// --- API Simulation ---

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

// --- Clientes ---
export const getClientes = async (): Promise<Cliente[]> => {
    await new Promise(res => setTimeout(res, 100));
    return mockDb.clientes;
}

export const getClienteById = async (id: string): Promise<Cliente | undefined> => {
    await new Promise(res => setTimeout(res, 100));
    return mockDb.clientes.find(c => c.id === id);
}

export const addCliente = async (clienteData: Omit<Cliente, 'id' | 'data_criacao' | 'data_atualizacao'>): Promise<Cliente> => {
    await new Promise(res => setTimeout(res, 300));
    const newCliente: Cliente = {
        ...clienteData,
        id: faker.string.uuid(),
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString(),
    };
    const newDb = { ...mockDb, clientes: [...mockDb.clientes, newCliente] };
    updateDb(newDb);
    return newCliente;
}

export const updateCliente = async (id: string, clienteData: Partial<Cliente>): Promise<Cliente> => {
    await new Promise(res => setTimeout(res, 300));
    let updatedCliente: Cliente | undefined;
    const newClientes = mockDb.clientes.map(c => {
        if (c.id === id) {
            updatedCliente = { ...c, ...clienteData, data_atualizacao: new Date().toISOString() };
            return updatedCliente;
        }
        return c;
    });
    if (!updatedCliente) throw new Error("Cliente not found");
    
    const newDb = { ...mockDb, clientes: newClientes };
    updateDb(newDb);
    return updatedCliente;
}

export const deleteCliente = async (id: string): Promise<void> => {
    await new Promise(res => setTimeout(res, 300));
    
    // Unassign client from caixas
    const newCaixas = mockDb.caixas.map(caixa => {
        caixa.cabos_entrada.forEach(cabo => cabo.fibras.forEach(fibra => {
            if (fibra.cliente_id === id) fibra.cliente_id = undefined;
        }));
        caixa.cabos_saida.forEach(cabo => cabo.fibras.forEach(fibra => {
            if (fibra.cliente_id === id) fibra.cliente_id = undefined;
        }));
        return caixa;
    });

    // Unassign client from switches
    const newSwitches = mockDb.switches.map(sw => {
        sw.portas.forEach(porta => {
            if (porta.cliente_id === id) porta.cliente_id = undefined;
        });
        return sw;
    });

    const newClientes = mockDb.clientes.filter(c => c.id !== id);
    const newDb = { ...mockDb, clientes: newClientes, caixas: newCaixas, switches: newSwitches };
    updateDb(newDb);
}

export const findFibrasByClienteId = async (clienteId: string): Promise<FibraConectada[]> => {
    await new Promise(res => setTimeout(res, 150));
    const fibrasConectadas: FibraConectada[] = [];
    mockDb.caixas.forEach(caixa => {
        const todosCabos = [...caixa.cabos_entrada, ...caixa.cabos_saida];
        todosCabos.forEach(cabo => {
            cabo.fibras.forEach(fibra => {
                if (fibra.cliente_id === clienteId) {
                    fibrasConectadas.push({
                        ...fibra,
                        caixa: { id: caixa.id, codigo: caixa.codigo },
                        cabo: { id: cabo.id, identificacao: cabo.identificacao, lado: cabo.lado }
                    });
                }
            });
        });
    });
    return fibrasConectadas;
}

export const findPortasByClienteId = async (clienteId: string): Promise<PortaConectada[]> => {
    await new Promise(res => setTimeout(res, 150));
    const portasConectadas: PortaConectada[] = [];
    mockDb.switches.forEach(sw => {
        sw.portas.forEach(porta => {
            if (porta.cliente_id === clienteId) {
                portasConectadas.push({
                    ...porta,
                    switch: { id: sw.id, nome: sw.nome }
                });
            }
        });
    });
    return portasConectadas;
}

export const getCircuitoByClienteId = async (clienteId: string) => {
    await new Promise(res => setTimeout(res, 150));
    return mockDb.circuitos.find(c => c.cliente_id === clienteId);
}


// --- Caixas ---
export const getCaixas = async (): Promise<Caixa[]> => {
  await new Promise(res => setTimeout(res, 200)); // Simulate network delay
  return mockDb.caixas;
};

export const getCaixaById = async (id: string): Promise<Caixa | undefined> => {
    await new Promise(res => setTimeout(res, 200));
    return mockDb.caixas.find(c => c.id === id);
};

export const addCaixa = async (caixaData: Omit<Caixa, 'id' | 'data_criacao' | 'data_atualizacao' | 'cabos_entrada' | 'cabos_saida'>): Promise<Caixa> => {
    await new Promise(res => setTimeout(res, 300));
    const newCaixa: Caixa = {
        ...caixaData,
        id: faker.string.uuid(),
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString(),
        cabos_entrada: [],
        cabos_saida: [],
    };
    const newDb = { ...mockDb, caixas: [...mockDb.caixas, newCaixa] };
    updateDb(newDb);
    return newCaixa;
};

export const updateCaixa = async (id: string, caixaData: Partial<Caixa>): Promise<Caixa> => {
    await new Promise(res => setTimeout(res, 300));
    let updatedCaixa: Caixa | undefined;
    const newCaixas = mockDb.caixas.map(c => {
        if (c.id === id) {
            updatedCaixa = { ...c, ...caixaData, data_atualizacao: new Date().toISOString() };
            return updatedCaixa;
        }
        return c;
    });
    if (!updatedCaixa) throw new Error("Caixa not found");
    
    const newDb = { ...mockDb, caixas: newCaixas };
    updateDb(newDb);
    return updatedCaixa;
};

export const deleteCaixa = async (id: string): Promise<void> => {
    await new Promise(res => setTimeout(res, 300));
    const newCaixas = mockDb.caixas.filter(c => c.id !== id);
    const newDb = { ...mockDb, caixas: newCaixas };
    updateDb(newDb);
};

export const addCaboToCaixa = async (caixaId: string, caboData: Omit<Cabo, 'id' | 'caixa_id' | 'fibras'>): Promise<Cabo> => {
    await new Promise(res => setTimeout(res, 300));
    const newCaboId = faker.string.uuid();
    const newCabo: Cabo = {
        ...caboData,
        id: newCaboId,
        caixa_id: caixaId,
        fibras: generateFibras(newCaboId, caboData.quantidade_fibras),
    };

    const newCaixas = mockDb.caixas.map(c => {
        if (c.id === caixaId) {
            const newCaixa = { ...c };
            if (newCabo.lado === 'entrada') {
                newCaixa.cabos_entrada.push(newCabo);
            } else {
                newCaixa.cabos_saida.push(newCabo);
            }
            return newCaixa;
        }
        return c;
    });

    const newDb = { ...mockDb, caixas: newCaixas };
    updateDb(newDb);
    return newCabo;
};

export const updateFibraInCaixa = async (caixaId: string, caboId: string, fibraId: string, fibraData: Partial<Fibra>): Promise<Fibra> => {
    await new Promise(res => setTimeout(res, 200));
    let updatedFibra: Fibra | undefined;
    const newCaixas = mockDb.caixas.map(caixa => {
        if (caixa.id === caixaId) {
            const newCaixa = { ...caixa };
            const cabos = newCaixa.cabos_entrada.concat(newCaixa.cabos_saida);
            const cabo = cabos.find(c => c.id === caboId);
            if (cabo) {
                const newFibras = cabo.fibras.map(fibra => {
                    if (fibra.id === fibraId) {
                        updatedFibra = { ...fibra, ...fibraData };
                        return updatedFibra;
                    }
                    return fibra;
                });
                cabo.fibras = newFibras;
            }
            return newCaixa;
        }
        return caixa;
    });

    if (!updatedFibra) throw new Error("Fibra not found");

    const newDb = { ...mockDb, caixas: newCaixas };
    updateDb(newDb);
    return updatedFibra;
};

// --- Switches ---
export const getSwitches = async (): Promise<Switch[]> => {
    await new Promise(res => setTimeout(res, 200));
    return mockDb.switches;
};

export const getSwitchById = async (id: string): Promise<Switch | undefined> => {
    await new Promise(res => setTimeout(res, 200));
    return mockDb.switches.find(s => s.id === id);
};

export const addSwitch = async (switchData: Omit<Switch, 'id' | 'data_criacao' | 'data_atualizacao' | 'portas'>): Promise<Switch> => {
    await new Promise(res => setTimeout(res, 300));
    const newSwitchId = faker.string.uuid();
    const newSwitch: Switch = {
        ...switchData,
        id: newSwitchId,
        data_criacao: new Date().toISOString(),
        data_atualizacao: new Date().toISOString(),
        portas: generatePortas(newSwitchId, switchData.total_portas),
    };
    const newDb = { ...mockDb, switches: [...mockDb.switches, newSwitch] };
    updateDb(newDb);
    return newSwitch;
};

export const updateSwitch = async (id: string, switchData: Partial<Omit<Switch, 'portas'>>): Promise<Switch> => {
    await new Promise(res => setTimeout(res, 300));
    let updatedSwitch: Switch | undefined;
    const newSwitches = mockDb.switches.map(s => {
        if (s.id === id) {
            // Note: total_portas change is not handled here, as it would require regenerating ports.
            // This should be handled with a specific warning/logic in the UI.
            updatedSwitch = { ...s, ...switchData, data_atualizacao: new Date().toISOString() };
            return updatedSwitch;
        }
        return s;
    });
    if (!updatedSwitch) throw new Error("Switch not found");
    
    const newDb = { ...mockDb, switches: newSwitches };
    updateDb(newDb);
    return updatedSwitch;
};

export const deleteSwitch = async (id: string): Promise<void> => {
    await new Promise(res => setTimeout(res, 300));
    const newSwitches = mockDb.switches.filter(s => s.id !== id);
    const newDb = { ...mockDb, switches: newSwitches };
    updateDb(newDb);
};

export const updatePorta = async (switchId: string, portaId: string, portaData: Partial<PortaSwitch>): Promise<PortaSwitch> => {
    await new Promise(res => setTimeout(res, 200));
    let updatedPorta: PortaSwitch | undefined;
    const newSwitches = mockDb.switches.map(s => {
        if (s.id === switchId) {
            const newPortas = s.portas.map(p => {
                if (p.id === portaId) {
                    updatedPorta = { ...p, ...portaData };
                    return updatedPorta;
                }
                return p;
            });
            return { ...s, portas: newPortas, data_atualizacao: new Date().toISOString() };
        }
        return s;
    });
    if (!updatedPorta) throw new Error("Porta not found");

    const newDb = { ...mockDb, switches: newSwitches };
    updateDb(newDb);
    return updatedPorta;
};
