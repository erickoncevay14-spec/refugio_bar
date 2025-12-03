import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import SidebarMozo from '../components/Mozo/SidebarMozo';
import TopBar from '../components/topBar/TopBar';
import '../styles/mozo.css';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const titleMap = {
  '/mozo': 'Mesas',
  '/mozo/mesas': 'Mesas',
  '/mozo/pedidos-actuales': 'Pedidos Actuales',
};

const MozoLayout = () => {
  const location = useLocation();
  const basePath = location.pathname.split("/").slice(0,3).join('/');
  const title = titleMap[location.pathname] || titleMap[basePath] || 'Mozo';

  const validPaths = ['/mozo', '/mozo/mesas', '/mozo/pedidos-actuales'];
  const navigate = useNavigate();
  useEffect(() => {
    if (!validPaths.includes(location.pathname)) {
      navigate('/mozo/mesas', { replace: true });
    }
  }, [location.pathname, navigate]);

  return (
    <div className="mozo-page">
      <SidebarMozo />
      <div className="main-content">
        <TopBar title={title} userName={localStorage.getItem('userName') || 'Mozo'} />
        <div className="content-area">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MozoLayout;
