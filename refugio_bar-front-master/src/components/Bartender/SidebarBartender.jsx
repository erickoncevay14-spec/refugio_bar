import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "./SidebarBartender.css";

const ICON_BASE_PATH = '/assets/icons/icons/icons-sidebar-navbar/icons/';

const menuItems = [
  { name: 'En Preparación', icon: ICON_BASE_PATH + 'file.svg', path: '/bartender/preparacion' },
  { name: 'Listos para Entregar', icon: ICON_BASE_PATH + 'file.svg', path: '/bartender/listos' },
];

const SidebarBartender = ({ onToggle }) => {
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
        if (name) {
          setUserName(name);
          return;
        }
      }
      const fallbackName = localStorage.getItem('userName') || localStorage.getItem('username') || localStorage.getItem('name');
      if (fallbackName) {
        setUserName(fallbackName);
        return;
      }
    } catch (e) {
      // ignore
    }
    setUserName('Usuario');
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
    <>
      <header>
        <div className="left">
          <div className="menu-container" onClick={toggleMenu}>
            <div className={`menu ${isOpen ? "menu-toggle" : ""}`} id="menu">
              <img
                src={encodeURI('/assets/icons/icons/icons-sidebar-navbar/icons/menu (1).png')}
                alt="menu"
                className="menu-icon"
              />
            </div>
          </div>
          <div className="brand">
            <img src={ICON_BASE_PATH + 'udemy.svg'} alt="Refugio Logo" className="logo" />
            <span>RefugioBar</span>
          </div>
        </div>
        <div className="right">
          <a href="#" className="icons-header">
            <img src={ICON_BASE_PATH + 'chart.svg'} alt="Gráficas" className="chat" />
          </a>
          <a href="#" className="icons-header">
            <img src={ICON_BASE_PATH + 'question.svg'} alt="Ayuda" className="chat" />
          </a>
          <a href="#" className="icons-header">
            <img src={ICON_BASE_PATH + 'notification.svg'} alt="Notificaciones" className="chat" />
          </a>
          <div className="user-block">
            <img src={ICON_BASE_PATH + 'img.png'} alt="User Profile" className="user" />
            <span className="user-name">{userName}</span>
          </div>
          <button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>
            Cerrar sesión
          </button>
        </div>
      </header>

      <div className={`sidebar ${isOpen ? "menu-toggle" : ""}`} id="sidebar">
        <nav>
          <ul>
            {menuItems.map((item) => (
              <li key={item.name}>
                <a
                  href={item.path}
                  className={`${item.isSearch ? "search" : ""} ${item.path === location.pathname ? "selected" : ""}`}
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
    </>
  );
};

export default SidebarBartender;
