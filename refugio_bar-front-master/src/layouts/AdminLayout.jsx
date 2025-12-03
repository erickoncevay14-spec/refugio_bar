import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AdminSidebar from '../components/Admin/AdminSidebar';
import AdminTopBar from '../components/Admin/AdminTopBar';
import '../styles/bartender.css';

const titleMap = {
	'/admin': 'Dashboard',
	'/admin/productos': 'Productos',
	'/admin/pedidos': 'Pedidos',
	'/admin/ventas': 'Ventas',
	'/admin/clientes':'Clientes',
	'/admin/usuarios': 'Usuarios',
	'/admin/reservas': 'Reservas',
	'/admin/reportes': 'Reportes',
	'/admin/mesas': 'Mesas',
};

const AdminLayout = () => {
	const location = useLocation();
	const basePath = location.pathname.split("/").slice(0,3).join('/');
	const title = titleMap[location.pathname] || titleMap[basePath] || 'Admin';

	return (
		<div className="bartender-page">
			<AdminSidebar />
			<div className="main-content">
				<AdminTopBar title={title} userName={localStorage.getItem('userName') || 'Admin'} />
				<div className="content-area">
					<Outlet />
				</div>
			</div>
		</div>
	);
};

export default AdminLayout;

