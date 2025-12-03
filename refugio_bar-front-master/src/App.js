import ClienteLayout from './layouts/ClienteLayout';
import ReservaMesa from './pages/Cliente/ReservaMesa';
import Reservas from './pages/Cliente/Reservas';
import React from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';

import PedidosPreparacion from './pages/bartender/PedidosPreparacion';
import ListosParaEntregar from './pages/bartender/ListosParaEntregar';
import BartenderLayout from './layouts/BartenderLayout';


import PedidosActuales from './pages/mozo/PedidosActuales';
import MesasMozo from './pages/mozo/MesasMozo';
import MozoLayout from './layouts/MozoLayout';


import AdminLayout from './layouts/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Productos from './pages/admin/Productos';

import UsuariosAdmin from './pages/admin/Usuarios';
import ReservasAdmin from './pages/admin/Reservas';
import Reportes from './pages/admin/Reportes';
import ClientesAdmin from './pages/admin/Clientes';
import MesasAdmin from './pages/admin/Mesas';

import UsuariosList from './pages/usuarios/UsuariosList';
import UsuarioForm from './pages/usuarios/UsuarioForm';

import ReservasList from './pages/admin/Reservas';
import ReservaForm from './pages/admin/Reservas';

import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Pedidos from './pages/admin/Pedidos';


const App = () => {
  const navigate = useNavigate();

  return (
    <Routes>
        {/* Auth */}
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Bartender (anidado en layout con sidebar + topbar) */}
      <Route path="/bartender" element={<BartenderLayout />}>
        <Route index element={<PedidosPreparacion />} />
        <Route path="listos" element={<ListosParaEntregar />} />
        <Route path="preparacion" element={<PedidosPreparacion />} />
      </Route>

      {/* Mozo: rutas anidadas dentro del layout */}
      <Route path="/mozo" element={<MozoLayout />}>
        <Route index element={<MesasMozo />} />
        <Route path="mesas" element={<MesasMozo />} />
        <Route path="pedidos-actuales" element={<PedidosActuales />} />
      </Route>

      {/* Usuarios */}
      <Route path="/usuarios" element={<UsuariosList />} />
      <Route path="/usuarios/nuevo" element={<UsuarioForm onSuccess={() => navigate('/usuarios')} />} />
      <Route path="/usuarios/editar/:id" element={<UsuarioForm onSuccess={() => navigate('/usuarios')} />} />

      {/* Reservas */}
      <Route path="/reservas" element={<ReservasList />} />
      <Route
        path="/reservas/nueva"
        element={<ReservaForm onSuccess={() => navigate('/reservas')} />}
      />
      <Route
        path="/reservas/editar/:id"
        element={<ReservaForm onSuccess={() => navigate('/reservas')} />}
      />

      {/* Admin */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="productos" element={<Productos />} />

        <Route path="pedidos" element={<Pedidos />} />
        <Route path="usuarios" element={<UsuariosAdmin />} />
        <Route path="clientes" element={<ClientesAdmin />} />
        <Route path="reservas" element={<ReservasAdmin />} />
        <Route path="reportes" element={<Reportes />} />
        <Route path="mesas" element={<MesasAdmin />} />
      </Route>
    
    {/* cliente */}
      <Route path="/cliente" element={<ClienteLayout />}>
        <Route path="reservar" element={<ReservaMesa />} />
        <Route path="reservas" element={<Reservas />} />
      </Route>
    </Routes>
  );
};

export default App;
