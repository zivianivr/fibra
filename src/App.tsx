import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/Layout';
import DashboardPage from './pages/DashboardPage';
import CaixasPage from './pages/CaixasPage';
import SwitchesPage from './pages/SwitchesPage';
import ClientesPage from './pages/ClientesPage';
import ChamadosPage from './pages/ChamadosPage';
import CaixaDetailPage from './pages/CaixaDetailPage';
import SwitchDetailPage from './pages/SwitchDetailPage';
import ClienteDetailPage from './pages/ClienteDetailPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<DashboardPage />} />
          <Route path="caixas" element={<CaixasPage />} />
          <Route path="caixas/:id" element={<CaixaDetailPage />} />
          <Route path="switches" element={<SwitchesPage />} />
          <Route path="switches/:id" element={<SwitchDetailPage />} />
          <Route path="clientes" element={<ClientesPage />} />
          <Route path="clientes/:id" element={<ClienteDetailPage />} />
          <Route path="chamados" element={<ChamadosPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
