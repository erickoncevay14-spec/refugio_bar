import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarBartender from '../components/SidebarBartender';
import BartenderTopBar from '../components/Bartender/BartenderTopBar';
import '../styles/bartender.css';

const titleMap = {
  '/bartender': 'Pedidos por Preparar',
  '/bartender/pendientes': 'Pedidos por Preparar',
  '/bartender/preparacion': 'Pedidos en Preparación',
  '/bartender/entregados': 'Pedidos Entregados',
  '/bartender/lista': 'Lista de Pedidos',
};

const BartenderLayout = () => {
  const location = useLocation();
  const basePath = location.pathname.split("/").slice(0,3).join('/');
  const title = titleMap[location.pathname] || titleMap[basePath] || 'Bartender';

  return (
    <div className="bartender-page">
      <SidebarBartender />
      <div className="main-content">
        <BartenderTopBar title={title} userName={localStorage.getItem('userName') || 'Bartender'} />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default BartenderLayout;
