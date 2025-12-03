
import React from 'react';
import './TopBarCliente.css';

const TopBarCliente = ({ title, userName, actions }) => {
	const toggleSidebar = () => {
		const sb = document.getElementById('sidebar');
		if (!sb) return;
		sb.classList.toggle('menu-toggle');
	};

	return (
		<>
			<header className="admin-header">
				<div className="left">
					<div className="menu-container" onClick={toggleSidebar}>
						<div className={`menu`} id="menu">
							<img
								src={encodeURI('/assets/icons/icons/icons-sidebar-navbar/icons/menu (1).png')}
								alt="menu"
								className="menu-icon"
							/>
						</div>
					</div>
					<div className="brand">
						<img src={'/assets/icons/icons/icons-sidebar-navbar/icons/udemy.svg'} alt="Logo" className="logo" />
						<span>RefugioBar</span>
					</div>
				</div>
				<div className="right">
					<a href="#" className="icons-header"><img src={'/assets/icons/icons/icons-sidebar-navbar/icons/chart.svg'} alt="chart"/></a>
					<a href="#" className="icons-header"><img src={'/assets/icons/icons/icons-sidebar-navbar/icons/question.svg'} alt="help"/></a>
					<a href="#" className="icons-header"><img src={'/assets/icons/icons/icons-sidebar-navbar/icons/notification.svg'} alt="noti"/></a>
					<div className="user-block">
						<img src={'/assets/icons/icons/icons-sidebar-navbar/icons/img.png'} alt="User" className="user" />
						<span className="user-name">{userName}</span>
					</div>
					<button className="logout-btn" onClick={() => { localStorage.clear(); window.location.href = '/login'; }}>Cerrar sesión</button>
				</div>
			</header>

			<div className="admin-topbar">
				<div className="admin-topbar-header">
					<h1 className="admin-topbar-title">{title}</h1>
					<div className="admin-topbar-right">
						<span className="admin-topbar-user">{userName}</span>
					</div>
				</div>
				<div className="admin-topbar-actions">
					{actions && actions.map((a, i) => (
						<button key={i} className="admin-topbar-action" onClick={a.onClick}>{a.label}</button>
					))}
				</div>
			</div>
		</>
	);
};

export default TopBarCliente;
