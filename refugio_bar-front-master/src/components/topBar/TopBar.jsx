// src/components/topBar/TopBar.jsx

import React from 'react';
// No necesita estilos propios, usará los de Sidebar.css para el contenedor principal.

const TopBar = ({ title, userName }) => {
  return (
    <div className="topbar">
      {/* Aquí puedes agregar un diseño simple si lo necesitas, 
            pero por ahora el título y el usuario están en el Header principal, 
            así que este componente se omite o se usa solo para el título del MAIN CONTENT */}
      <h1 className="topbar-title" style={{ color: '#053d4e', fontSize: '1.5rem', marginBottom: '1rem' }}>{title}</h1>
    </div>
  );
};

export default TopBar;