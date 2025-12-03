
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from 'react-router-dom';
import "./ClienteSidebar.css";

const ICON_BASE_PATH = '/assets/icons/icons/icons-sidebar-navbar/icons/';

const menuItems = [
	{ name: 'Reservar Mesa', icon: ICON_BASE_PATH + 'file.svg', path: '/cliente/reservar' },
	{ name: 'Mis Reservas', icon: ICON_BASE_PATH + 'file.svg', path: '/cliente/reservas' },
];

const SidebarCliente = ({ onToggle }) => {
	const navigate = useNavigate();
	const location = useLocation();
	const [isOpen, setIsOpen] = useState(false);
	const [userName, setUserName] = useState('');

	// Cierra el sidebar al cambiar de ruta
	useEffect(() => {
		setIsOpen(false);
	}, [location.pathname]);

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
		setUserName('Cliente');
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

export default SidebarCliente;
