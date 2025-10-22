// admin.js
// Archivo de control de lógica general y navegación

window.API_BASE = 'http://localhost:8080/api';

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


// ===============================
// LÓGICA DE ANALYTICS (Looker Studio)
// ===============================

// URLs de inserción (Embed URLs) de tus dashboards de Looker Studio.
// ⚠️ IMPORTANTE: REEMPLAZA ESTOS VALORES POR TUS URLS REALES.
const LOOKER_DASHBOARDS = {
    // URL por defecto para Ventas (se puede sobrescribir con el botón 'Configurar Dashboard')
    ventas: "https://lookerstudio.google.com/embed/reporting/d9caae57-06af-452e-9de1-780bafc69ebf/page/lvicF",
    
    // Otras URLs
    clientes: "https://lookerstudio.google.com/embed/reporting/URL_CLIENTES_POR_DEFECTO/page/p_ABC",
    inventario: "https://lookerstudio.google.com/embed/reporting/URL_INVENTARIO_POR_DEFECTO/page/p_DEF"
};

/**
 * Función principal para la sección de Analytics.
 * Se llama cuando se selecciona la sección 'analytics' en el menú.
 */
function cargarAnalytics() {
    console.log('Cargando sección de Analytics...');
    
    // Por defecto, intenta cargar el dashboard de ventas al entrar a la sección.
    setTimeout(() => {
        cargarDashboardLooker('ventas'); // Llama a la función específica de Looker
    }, 100); 
}

/**
 * Función llamada al hacer click en el botón "Configurar Dashboard" de tu HTML.
 * Este botón ahora SÍ te permite configurar la URL principal.
 */
function configurarLooker() {
    const defaultKey = 'ventas';
    const storageKey = `lookerStudioUrl_${defaultKey}`;
    const urlGuardada = localStorage.getItem(storageKey);

    const nuevaUrl = prompt(
        `Ingresa la URL de inserción (Embed URL) de tu Dashboard de ${defaultKey.toUpperCase()}:`, 
        urlGuardada || LOOKER_DASHBOARDS[defaultKey]
    );

    if (nuevaUrl) {
        localStorage.setItem(storageKey, nuevaUrl);
        mostrarMensaje(`URL de ${defaultKey.toUpperCase()} configurada correctamente.`, 'success');
        cargarDashboardLooker(defaultKey);
    } else {
        mostrarMensaje("Configuración cancelada.", 'info');
    }
}

/**
 * Carga el dashboard de Looker Studio en el iframe.
 * RENOMBRADA para no chocar con la función de estadísticas de adminDashboard.js
 * @param {string} tipo - La clave del dashboard ('ventas', 'clientes', 'inventario').
 */
function cargarDashboardLooker(tipo) {
    const iframe = document.getElementById('lookerDashboard');
    const placeholder = document.getElementById('lookerPlaceholder');
    if (!iframe || !placeholder) {
        console.error('Elementos de Looker Studio no encontrados en el DOM.');
        return;
    }

    let url;
    const storageKey = `lookerStudioUrl_${tipo}`;
    
    if (tipo === 'ventas') {
        url = localStorage.getItem(storageKey) || LOOKER_DASHBOARDS[tipo];
    } else {
        url = LOOKER_DASHBOARDS[tipo];
    }
    
    // Verifica si la URL es válida
    const esUrlValida = url && !url.includes("URL_VENTAS_POR_DEFECTO"); 

    if (esUrlValida) {
        iframe.src = url;
        iframe.style.display = 'block';
        placeholder.style.display = 'none';
        if (tipo !== 'ventas' || localStorage.getItem(storageKey)) {
             mostrarMensaje(`Dashboard de ${tipo.toUpperCase()} cargado.`, 'info');
        }
    } else {
        iframe.style.display = 'none';
        placeholder.style.display = 'block';
        if (tipo === 'ventas') {
            mostrarError("El Dashboard de Ventas requiere configuración. Haz clic en 'Configurar Dashboard'.");
        } else {
            mostrarError(`La URL del dashboard de ${tipo.toUpperCase()} no está configurada.`);
        }
    }
}


// ===============================
// LÓGICA DE USUARIOS Y NAVEGACIÓN
// ===============================

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
    
    if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
        console.log('URL limpiada');
    }
    
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
            // Llama a la función principal renombrada en adminDashboard.js
            if (typeof cargarDashboardPrincipal === 'function') {
                cargarDashboardPrincipal();
            } else {
                console.error("Error: La función cargarDashboardPrincipal no está definida. ¿adminDashboard.js está cargado?");
            }
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
            cargarAnalytics(); // Llama a la nueva función de Looker Studio
            break;
    }
}


// INICIALIZACIÓN
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacion();
    configurarNavegacion();
    actualizarFechaHora();
    setInterval(actualizarFechaHora, 1000);
    const nombreInput = document.getElementById('filtroNombre');
    const rolInput = document.getElementById('filtroRol');
    const formFiltro = document.getElementById('formFiltroUsuarios');
    if (formFiltro) {
        formFiltro.addEventListener('submit', function(e) {
            e.preventDefault(); 
        });
    }
    if (nombreInput && rolInput) {
        function filtrarUsuariosAuto() {
            const texto = (nombreInput.value || '').toLowerCase();
            const rol = (rolInput.value || '').trim().toLowerCase();
            let filtrados = window.usuarios.filter(u => {
                let nombre = (u.nombre || '').toLowerCase();
                let usuario = (u.usuario || '').toLowerCase();
                let matchNombre = !texto || nombre.includes(texto) || usuario.includes(texto);
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