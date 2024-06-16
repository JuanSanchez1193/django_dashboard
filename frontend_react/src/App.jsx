import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SolicitudesPage } from './pages/SolicitudesPage';
import { Principal } from './pages/Principal';
import { ProductosPage } from './pages/ProductosPage';
import { Detalle } from './components/Detalle';
import { ProveedoresPage } from './pages/ProveedoresPage';
import ClientesPage from './pages/ClientesPage';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/principal" />} />
        <Route path="/solicitudes" element={<SolicitudesPage />} />
        <Route path="/principal" element={<Principal />} />
        <Route path="/productos" element={<ProductosPage />} />
        <Route path="/Proveedores" element={<ProveedoresPage />} />
        <Route path="/Clientes" element={<ClientesPage />} />
        <Route path="/codigo/:codigo" element={<Detalle />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
