
window.API_BASE = 'http://localhost:8080/api';

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
// INICIALIZACIÓN
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacion();
    configurarNavegacion();
    cargarDashboard();
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    const nombreInput = document.getElementById('filtroNombre');
    const rolInput = document.getElementById('filtroRol');
    const formFiltro = document.getElementById('formFiltroUsuarios');
    if (formFiltro) {
        formFiltro.addEventListener('submit', function(e) {
            e.preventDefault(); // Evita recarga al presionar Enter
        });
    }
    if (nombreInput && rolInput) {
        function filtrarUsuariosAuto() {
            const texto = (nombreInput.value || '').toLowerCase();
            const rol = (rolInput.value || '').trim().toLowerCase();
            let filtrados = window.usuarios.filter(u => {
                // Buscar coincidencia en nombre o usuario, siempre en minúsculas
                let nombre = (u.nombre || '').toLowerCase();
                let usuario = (u.usuario || '').toLowerCase();
                let matchNombre = !texto || nombre.includes(texto) || usuario.includes(texto);
                // Normalizar rol del usuario, siempre en minúsculas
                let rolUsuario = '';
                if (u.rol) {
                    if (typeof u.rol === 'string') {
                        rolUsuario = u.rol.trim().toLowerCase();
                    } else if (typeof u.rol === 'object' && u.rol.nombre) {
                        rolUsuario = u.rol.nombre.trim().toLowerCase();
                    }
                }
                let matchRol = !rol || rolUsuario === rol;
                return matchNombre && matchRol;
            });
            window.mostrarUsuariosFiltrados(filtrados);
        }
        nombreInput.addEventListener('input', filtrarUsuariosAuto);
        rolInput.addEventListener('change', filtrarUsuariosAuto);
    }
});

// Función para mostrar solo los usuarios filtrados
window.mostrarUsuariosFiltrados = function(filtrados) {
    const tbody = document.getElementById('tablaUsuariosAjax');
    if (!tbody) return;
    tbody.innerHTML = '';
    filtrados.forEach(usuario => {
        const apellido = usuario.apellido ? usuario.apellido : (usuario.apellido === null ? 'null' : '');
        const email = usuario.email ? usuario.email : (usuario.email === null ? 'null' : '');
        let rol = 'Sin rol';
        if (usuario.rol) {
            if (typeof usuario.rol === 'object' && usuario.rol.nombre) rol = usuario.rol.nombre;
            else if (typeof usuario.rol === 'string') rol = usuario.rol;
        }
        const rolesDisponibles = ['cliente', 'admin', 'mozo', 'bartender'];
        let selectRol = `<div class='d-flex align-items-center gap-2'>`;
        selectRol += `<select class='form-select form-select-sm' id='selectRol_${usuario.id}'>`;
        rolesDisponibles.forEach(r => {
            selectRol += `<option value='${r}' ${rol.toLowerCase() === r ? 'selected' : ''}>${r.toUpperCase()}</option>`;
        });
        selectRol += `</select>`;
        selectRol += `<button class='btn btn-sm btn-outline-info' onclick='cambiarRolUsuario(${usuario.id}, document.getElementById("selectRol_${usuario.id}").value)'>Cambiar</button>`;
        selectRol += `</div>`;
        row = document.createElement('tr');
        row.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.usuario || ''}</td>
            <td>${usuario.nombre || ''}</td>
            <td>${apellido}</td>
            <td>${email}</td>
            <td>${selectRol}</td>
            <td><span class="badge ${usuario.activo ? 'bg-success' : 'bg-danger'}">${usuario.activo ? 'ACTIVO' : 'INACTIVO'}</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editarUsuario(${usuario.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-${usuario.activo ? 'warning' : 'success'}" 
                            onclick="toggleEstadoUsuario(${usuario.id})" 
                            title="${usuario.activo ? 'Desactivar' : 'Activar'}">
                        <i class="bi bi-${usuario.activo ? 'pause' : 'play'}"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

// Verificar autenticacion
function verificarAutenticacion() {
    console.log('Verificando autenticación Admin...');
    
    // Limpiar URL si tiene parámetros
    if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
        console.log('URL limpiada');
    }
    
    // Priorizar sessionStorage sobre localStorage
    let userString = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    
    if (!userString) {
        alert('Acceso no autorizado');
        window.location.href = '/login';
        return;
    }
    
    let user;
    try {
        user = JSON.parse(userString);
    } catch (error) {
        console.error('Error al parsear usuario:', error);
        alert('Sesión inválida');
        window.location.href = '/login';
        return;
    }
    
    if (!user || (user.rol && user.rol.toUpperCase() !== 'ADMIN')) {
        alert('Acceso no autorizado. Solo administradores.');
        window.location.href = '/login';
        return;
    }
    
    document.getElementById('userInfo').textContent = `Admin: ${user.nombre}`;
    console.log('Usuario admin verificado correctamente');
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

