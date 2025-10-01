// Admin.js
// Inicialización y utilidades generales del panel de administración

const API_BASE = 'http://localhost:8080/api';

// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacion();
    configurarNavegacion();
    cargarDashboard();
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
});

// Verificar autenticacion
function verificarAutenticacion() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || (user.rol && user.rol.toUpperCase() !== 'ADMIN')) {
        alert('Acceso no autorizado');
        window.location.href = '/login';
        return;
    }
    document.getElementById('userInfo').textContent = `Admin: ${user.nombre}`;
}

// Configurar navegación
function configurarNavegacion() {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const section = this.dataset.section;
            if (section) {
                cambiarSeccion(section);
            }
        });
    });
}

// Cambiar sección activa
function cambiarSeccion(section) {
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');
    const titles = {
        dashboard: 'Dashboard',
        productos: 'Gestión de Productos',
        pedidos: 'Gestión de Pedidos',
        usuarios: 'Gestión de Usuarios',
        mesas: 'Gestión de Mesas',
        reservas: 'Gestión de Reservas',
        analytics: 'Analytics - Looker Studio'
    };
    document.getElementById('pageTitle').textContent = titles[section];
    switch(section) {
        case 'dashboard':
            cargarDashboard();
            break;
        case 'productos':
            cargarProductos();
            break;
        case 'pedidos':
            cargarPedidos();
            break;
        case 'usuarios':
            cargarUsuarios();
            break;
        case 'mesas':
            cargarMesas();
            break;
        case 'reservas':
            cargarReservas();
            break;
        case 'analytics':
            cargarAnalytics();
            break;
    }
}

// ===============================
// UTILIDADES GENERALES
// ===============================
function actualizarFechaHora() {
    const ahora = new Date();
    const opciones = { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit',
        second: '2-digit'
    };
    document.getElementById('fechaHora').textContent = ahora.toLocaleDateString('es-PE', opciones);
}

function mostrarMensaje(mensaje, tipo = 'info') {
    const toastContainer = document.querySelector('.toast-container') || crearToastContainer();
    const toast = document.createElement('div');
    toast.className = `toast align-items-center text-bg-${tipo} border-0`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
        <div class="d-flex">
            <div class="toast-body">${mensaje}</div>
            <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
        </div>
    `;
    toastContainer.appendChild(toast);
    const bsToast = new bootstrap.Toast(toast);
    bsToast.show();
    toast.addEventListener('hidden.bs.toast', () => {
        toast.remove();
    });
}

function mostrarError(mensaje) {
    mostrarMensaje(mensaje, 'danger');
}

function crearToastContainer() {
    const container = document.createElement('div');
    container.className = 'toast-container position-fixed top-0 end-0 p-3';
    container.style.zIndex = '11';
    document.body.appendChild(container);
    return container;
}

function cerrarSesion() {
    if (confirm('¿Estás seguro de cerrar sesión?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
    }
}