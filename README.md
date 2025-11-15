# FibraManager - Frontend

Este é o repositório do frontend para o **FibraManager**, um sistema de gestão de redes de fibra óptica, clientes e chamados técnicos. A aplicação foi desenvolvida com React, TypeScript e Tailwind CSS, e está pronta para ser conectada a um backend.

## ✨ Funcionalidades Implementadas

O frontend está 100% funcional com uma API simulada (`mock`).

- **Dashboard Operacional:** Painel de controle com KPIs, mapa interativo da rede (switches, caixas, clientes) e resumo de atividades recentes.
- **Módulo de Caixas:** CRUD completo, gestão de cabos de entrada/saída e visualização de bandejas de fibra com associação de clientes.
- **Módulo de Switches:** CRUD completo, geração automática de portas e gestão individual de cada porta (VLAN, IP, cliente).
- **Módulo de Clientes:** CRUD completo, com página de detalhes exibindo localização, fibras, portas e o circuito completo no mapa.
- **Módulo de Chamados:** CRUD completo, com filtros, página de detalhes com o circuito do cliente, gestão de execução e histórico.

## 🚀 Stack Tecnológica

- **Framework:** React 18
- **Linguagem:** TypeScript
- **Estilização:** Tailwind CSS
- **Roteamento:** React Router
- **Mapas:** React Leaflet
- **Ícones:** Lucide React
- **Build Tool:** Vite

## 📂 Estrutura do Projeto

O código-fonte da aplicação frontend está localizado inteiramente dentro da pasta `/frontend`.

```
.
├── frontend/         # Raiz da aplicação React
│   ├── public/
│   ├── src/          # Código-fonte principal
│   ├── package.json
│   └── ...
├── .gitignore        # Arquivos ignorados pelo Git
└── README.md         # Este arquivo
```

## ⚙️ Instalação e Execução

Para rodar o projeto localmente, siga os passos abaixo.

1.  **Navegue até a pasta do frontend:**
    ```bash
    cd frontend
    ```

2.  **Instale as dependências:**
    É recomendado usar `yarn` como gerenciador de pacotes.
    ```bash
    yarn install
    ```

3.  **Inicie o servidor de desenvolvimento:**
    ```bash
    yarn dev
    ```

A aplicação estará disponível em `http://localhost:5173` (ou outra porta indicada no terminal).

## 🔌 Conexão com o Backend

Atualmente, a aplicação opera com uma **API simulada**. Toda a lógica de comunicação está centralizada no arquivo:

`frontend/src/services/api.ts`

Para conectar a aplicação a um backend real, basta substituir as funções neste arquivo pelas chamadas de API correspondentes (usando `fetch`, `axios`, etc.), apontando para os endpoints do seu servidor. Nenhuma outra parte do código frontend precisará ser alterada.
