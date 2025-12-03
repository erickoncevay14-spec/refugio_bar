import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarCliente from '../components/Cliente/SidebarCliente';
import TopBarCliente from '../components/Cliente/TopBarCliente';
import '../styles/bartender.css';

const titleMap = {
  '/cliente/ReservaMesa': 'Reservar Mesa',
  '/cliente/reservas': 'Mis Reservas',
};

const ClienteLayout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const basePath = location.pathname.split("/").slice(0,3).join('/');
  const title = titleMap[location.pathname] || titleMap[basePath] || 'Cliente';

  return (
    <div className={`bartender-page ${sidebarOpen ? 'sidebar-open' : ''}`}>
      
      <SidebarCliente onToggle={setSidebarOpen} />

      <div className="main-content">
        <TopBarCliente 
          title={title} 
          userName={localStorage.getItem('userName') || 'Cliente'} 
        />

        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default ClienteLayout;

