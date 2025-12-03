import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "./AdminSidebar.css";

const ICON_BASE_PATH = '/assets/icons/icons/icons-sidebar-navbar/icons/';

const menuItems = [
  { name: 'Dashboard', icon: ICON_BASE_PATH + 'file.svg', path: '/admin' },
  { name: 'Productos', icon: ICON_BASE_PATH + 'file.svg', path: '/admin/productos' },
  { name: 'Pedidos', icon: ICON_BASE_PATH + 'file.svg', path: '/admin/pedidos' },

  { name: 'Usuarios', icon: ICON_BASE_PATH + 'file.svg', path: '/admin/usuarios' },
  { name: 'Clientes', icon: ICON_BASE_PATH + 'file.svg', path: '/admin/clientes' },
  { name: 'Reservas', icon: ICON_BASE_PATH + 'file.svg', path: '/admin/reservas' },
  { name: 'Reportes (Looker)', icon: ICON_BASE_PATH + 'file.svg', path: '/admin/reportes' },
  { name: 'Mesas', icon: ICON_BASE_PATH + 'file.svg', path: '/admin/mesas' },
];

const AdminSidebar = ({ onToggle }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState('');

  useEffect(() => {
    try {
      const raw = localStorage.getItem('currentUser');
      if (raw) {
        const parsed = JSON.parse(raw);
        const name = parsed.nombre || parsed.name || parsed.username || parsed.email;
        if (name) { setUserName(name); return; }
      }
      const fallbackName = localStorage.getItem('userName') || localStorage.getItem('username') || localStorage.getItem('name');
      if (fallbackName) { setUserName(fallbackName); return; }
    } catch (e) {}
    setUserName('Admin');
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
    if (onToggle) onToggle(!isOpen);
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onToggle) onToggle(false);
    setIsOpen(false);
  };

  return (
    <div className={`sidebar ${isOpen ? "menu-toggle" : ""}`} id="sidebar">
      <nav>
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <a
                href={item.path}
                className={`${item.path === location.pathname ? "selected" : ""}`}
                onClick={(e) => { e.preventDefault(); handleNavigation(item.path); }}
              >
                <img src={item.icon} alt={item.name} className="icon" />
                <span>{item.name}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminSidebar;
