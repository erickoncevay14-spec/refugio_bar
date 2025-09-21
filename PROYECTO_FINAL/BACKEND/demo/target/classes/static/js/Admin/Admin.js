// admin.js - ARCHIVO COMPLETO FINAL

// Variables globales
let productos = [];
let pedidos = [];
let usuarios = [];
let mesas = [];
let reservas = [];
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

// ===============================
// VERIFICACIÓN DE AUTENTICACIÓN
// ===============================
function verificarAutenticacion() {
    console.log('🛡️ INICIANDO VERIFICACIÓN DE ADMIN...');
    
    let userString = localStorage.getItem('currentUser');
    console.log('📦 localStorage principal:', userString);
    
    // Si no hay en localStorage, intentar recuperar de URL
    if (!userString) {
        console.log('🔄 Intentando recuperar desde URL...');
        
        const urlParams = new URLSearchParams(window.location.search);
        const userFromUrl = urlParams.get('user');
        
        if (userFromUrl) {
            try {
                userString = decodeURIComponent(userFromUrl);
                console.log('✅ Datos recuperados desde URL');
                
                // Restaurar en localStorage para futuras visitas
                localStorage.setItem('currentUser', userString);
                
            } catch (error) {
                console.error('💥 Error al decodificar datos de URL:', error);
            }
        }
    }
    
    // LIMPIAR URL inmediatamente (antes de verificar otros backups)
    if (window.location.search) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        console.log('🧹 URL limpiada:', cleanUrl);
    }
    
    // Si aún no hay datos, intentar otros backups
    if (!userString) {
        console.log('🔄 Intentando otros backups...');
        
        userString = localStorage.getItem('userBackup') || sessionStorage.getItem('currentUser');
        
        if (userString) {
            console.log('✅ Backup encontrado, restaurando...');
            localStorage.setItem('currentUser', userString);
        }
    }
    
    if (!userString) {
        console.error('❌ No se encontró sesión en ningún lugar');
        alert('Debe iniciar sesión primero');
        window.location.href = '/login';
        return;
    }
    
    let user;
    try {
        user = JSON.parse(userString);
        console.log('✅ Usuario parseado correctamente:', user);
    } catch (error) {
        console.error('💥 Error al parsear JSON:', error);
        localStorage.clear();
        sessionStorage.clear();
        alert('Sesión inválida. Debe iniciar sesión nuevamente');
        window.location.href = '/login';
        return;
    }
    
    // Verificar que tenga los campos necesarios
    if (!user.rol || !user.nombre) {
        console.error('❌ DATOS INCOMPLETOS:', { rol: user.rol, nombre: user.nombre });
        alert('Datos de sesión incompletos. Debe iniciar sesión nuevamente');
        window.location.href = '/login';
        return;
    }
    
    // Verificar que sea ADMIN
    const esAdmin = user.rol === 'ADMIN' || user.rol === 'Admin' || user.rol?.toUpperCase() === 'ADMIN';
    console.log('🎯 ¿Es Admin?', esAdmin);
    
    if (!esAdmin) {
        console.error('❌ NO ES ADMIN:', { rol: user.rol, esperado: 'ADMIN' });
        alert(`Acceso no autorizado. Solo administradores pueden acceder. Su rol actual: ${user.rol}`);
        
        // Redirigir según su rol real
        switch(user.rol?.toUpperCase()) {
            case 'MOZO':
                window.location.href = '/mozo';
                break;
            case 'BARTENDER':
                window.location.href = '/bartender';
                break;
            default:
                window.location.href = '/login';
        }
        return;
    }
    
    // Si llegó hasta aquí, está autorizado
    console.log('✅ ADMIN AUTORIZADO EXITOSAMENTE');
    
    // Actualizar UI
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
        const modoLocal = user.esLocal ? ' (Local)' : '';
        userInfoElement.textContent = `Admin: ${user.nombre}${modoLocal}`;
        console.log('✅ UI actualizada');
    }
    
    console.log('🎉 VERIFICACIÓN COMPLETADA CON ÉXITO');
}

// ===============================
// NAVEGACIÓN
// ===============================
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

function cambiarSeccion(section) {
    console.log('📄 Cambiando a sección:', section);
    
    // Actualizar nav activo
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    
    const activeLink = document.querySelector(`[data-section="${section}"]`);
    if (activeLink) {
        activeLink.classList.add('active');
    }
    
    // Mostrar sección
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    
    const activeSection = document.getElementById(section);
    if (activeSection) {
        activeSection.classList.add('active');
    }
    
    // Actualizar título
    const titles = {
        dashboard: 'Dashboard',
        productos: 'Gestión de Productos',
        pedidos: 'Gestión de Pedidos',
        usuarios: 'Gestión de Usuarios',
        mesas: 'Gestión de Mesas',
        reservas: 'Gestión de Reservas',
        analytics: 'Analytics - Dashboard Externo'
    };
    
    const titleElement = document.getElementById('sectionTitle');
    if (titleElement) {
        titleElement.textContent = titles[section] || section;
    }
    
    // Cargar datos según la sección
// ===============================
// PRODUCTOS - CRUD CON BACKEND REAL
// ===============================

// Cargar productos desde la API real
async function cargarProductos() {
    console.log('📦 Cargando productos desde backend...');
    
    try {
        const response = await fetch(`${API_BASE}/productos`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
                // No necesitas Authorization por ahora según tu controller
            }
        });
        
        if (response.ok) {
            const apiResponse = await response.json();
            console.log('✅ Respuesta de la API:', apiResponse);
            
            // Tu API devuelve: { success: true, data: [...], message: "..." }
            productos = apiResponse.data || [];
            mostrarProductos();
            console.log(`📊 ${productos.length} productos cargados`);
        } else {
            console.error('❌ Error en la respuesta:', response.status);
            mostrarError('Error al cargar productos desde el servidor');
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        mostrarError('Error de conexión. Verificar que el backend esté corriendo en localhost:8080');
    }
}

// Mostrar productos en la tabla
function mostrarProductos() {
    const tbody = document.getElementById('productosTabla');
    if (!tbody) {
        console.warn('⚠️ Elemento productosTabla no encontrado');
        return;
    }
    
    if (productos.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" class="text-center">No hay productos disponibles</td></tr>';
        return;
    }
    
    tbody.innerHTML = productos.map(producto => `
        <tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion || 'Sin descripción'}</td>
            <td>S/${parseFloat(producto.precio).toFixed(2)}</td>
            <td>
                <span class="badge bg-${getCategoriaColor(producto.categoria)}">
                    ${producto.categoria}
                </span>
            </td>
            <td>
                <span class="badge bg-${getStockColor(producto.stock)}">
                    ${producto.stock}
                </span>
            </td>
            <td>
                <button class="btn btn-sm btn-warning me-1" onclick="editarProducto(${producto.id})" title="Editar">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmarEliminarProducto(${producto.id})" title="Eliminar">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

// Crear nuevo producto
async function crearProducto(datosProducto) {
    console.log('📝 Creando producto:', datosProducto);
    
    try {
        const response = await fetch(`${API_BASE}/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosProducto)
        });
        
        if (response.ok) {
            const apiResponse = await response.json();
            console.log('✅ Producto creado:', apiResponse);
            
            mostrarMensaje('Producto creado exitosamente');
            cerrarModalProducto();
            cargarProductos(); // Recargar la lista
        } else {
            const errorResponse = await response.json();
            console.error('❌ Error al crear:', errorResponse);
            mostrarError(errorResponse.message || 'Error al crear producto');
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        mostrarError('Error de conexión al crear producto');
    }
}

// Actualizar producto existente
async function actualizarProducto(id, datosProducto) {
    console.log('📝 Actualizando producto:', id, datosProducto);
    
    try {
        const response = await fetch(`${API_BASE}/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(datosProducto)
        });
        
        if (response.ok) {
            const apiResponse = await response.json();
            console.log('✅ Producto actualizado:', apiResponse);
            
            mostrarMensaje('Producto actualizado exitosamente');
            cerrarModalProducto();
            cargarProductos(); // Recargar la lista
        } else {
            const errorResponse = await response.json();
            console.error('❌ Error al actualizar:', errorResponse);
            mostrarError(errorResponse.message || 'Error al actualizar producto');
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        mostrarError('Error de conexión al actualizar producto');
    }
}

// Eliminar producto
async function eliminarProducto(id) {
    console.log('🗑️ Eliminando producto:', id);
    
    try {
        const response = await fetch(`${API_BASE}/productos/${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            console.log('✅ Producto eliminado');
            mostrarMensaje('Producto eliminado exitosamente');
            cargarProductos(); // Recargar la lista
        } else {
            const errorResponse = await response.json();
            console.error('❌ Error al eliminar:', errorResponse);
            mostrarError(errorResponse.message || 'Error al eliminar producto');
        }
    } catch (error) {
        console.error('❌ Error de conexión:', error);
        mostrarError('Error de conexión al eliminar producto');
    }
}

// ===============================
// GESTIÓN DE MODALES Y FORMULARIOS
// ===============================

function abrirModalProducto(producto = null) {
    const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
    const titulo = document.getElementById('tituloModalProducto');
    
    if (producto) {
        // Modo edición
        titulo.textContent = 'Editar Producto';
        document.getElementById('productoId').value = producto.id;
        document.getElementById('productoNombre').value = producto.nombre;
        document.getElementById('productoDescripcion').value = producto.descripcion || '';
        document.getElementById('productoPrecio').value = producto.precio;
        document.getElementById('productoStock').value = producto.stock;
        document.getElementById('productoCategoria').value = producto.categoria;
    } else {
        // Modo creación
        titulo.textContent = 'Nuevo Producto';
        document.getElementById('formProducto').reset();
        document.getElementById('productoId').value = '';
    }
    
    modal.show();
}

function cerrarModalProducto() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('modalProducto'));
    if (modal) {
        modal.hide();
    }
}

function guardarProducto() {
    const form = document.getElementById('formProducto');
    
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const datosProducto = {
        nombre: document.getElementById('productoNombre').value.trim(),
        descripcion: document.getElementById('productoDescripcion').value.trim(),
        precio: parseFloat(document.getElementById('productoPrecio').value),
        stock: parseInt(document.getElementById('productoStock').value),
        categoria: document.getElementById('productoCategoria').value,
        disponible: true
    };
    
    const productoId = document.getElementById('productoId').value;
    
    if (productoId) {
        // Actualizar producto existente
        actualizarProducto(productoId, datosProducto);
    } else {
        // Crear nuevo producto
        crearProducto(datosProducto);
    }
}

function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (producto) {
        abrirModalProducto(producto);
    } else {
        mostrarError('Producto no encontrado');
    }
}

function confirmarEliminarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) {
        mostrarError('Producto no encontrado');
        return;
    }
    
    if (confirm(`¿Está seguro de eliminar el producto "${producto.nombre}"?\n\nEsta acción no se puede deshacer.`)) {
        eliminarProducto(id);
    }
}

    // ===============================
    // UTILIDADES PARA PRODUCTOS
    // ===============================

    function getCategoriaColor(categoria) {
        const colores = {
            'BEBIDA': 'primary',
            'COMIDA': 'success', 
            'POSTRE': 'warning',
            'ENTRADA': 'info',
            'SNACK': 'secondary'
        };
        return colores[categoria] || 'secondary';
    }

    function getStockColor(stock) {
        if (stock <= 0) return 'danger';
        if (stock <= 10) return 'warning';
        return 'success';
    }

    // Mejorar las funciones de mensajes
    function mostrarMensaje(mensaje) {
        // Crear toast de Bootstrap
        const toastContainer = document.getElementById('toast-container') || createToastContainer();
        const toastElement = document.createElement('div');
        toastElement.className = 'toast';
        toastElement.innerHTML = `
            <div class="toast-header bg-success text-white">
                <strong class="me-auto">Éxito</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${mensaje}</div>
        `;
        
        toastContainer.appendChild(toastElement);
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        
        // Limpiar después de 5 segundos
        setTimeout(() => toastElement.remove(), 5000);
    }

    function mostrarError(error) {
        const toastContainer = document.getElementById('toast-container') || createToastContainer();
        const toastElement = document.createElement('div');
        toastElement.className = 'toast';
        toastElement.innerHTML = `
            <div class="toast-header bg-danger text-white">
                <strong class="me-auto">Error</strong>
                <button type="button" class="btn-close btn-close-white" data-bs-dismiss="toast"></button>
            </div>
            <div class="toast-body">${error}</div>
        `;
        
        toastContainer.appendChild(toastElement);
        const toast = new bootstrap.Toast(toastElement);
        toast.show();
        
        setTimeout(() => toastElement.remove(), 5000);
    }

    function createToastContainer() {
        const container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'position-fixed top-0 end-0 p-3';
        container.style.zIndex = '9999';
        document.body.appendChild(container);
        return container;
    }
}

// ===============================
// DASHBOARD
// ===============================
async function cargarDashboard() {
    console.log('📊 Cargando dashboard...');
    
    try {
        const response = await fetch(`${API_BASE}/dashboard/stats`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            actualizarDashboard(data.data || data);
        } else {
            console.error('Error al cargar dashboard desde backend');
            cargarDashboardLocal(); // Fallback a datos locales
        }
    } catch (error) {
        console.error('Error de conexión al cargar dashboard:', error);
        cargarDashboardLocal(); // Fallback a datos locales
    }
}

function cargarDashboardLocal() {
    // Datos ficticios para el dashboard
    const statsLocal = {
        totalProductos: 25,
        pedidosHoy: 12,
        ventasHoy: 450.50,
        mesasOcupadas: 6,
        totalClientes: 35
    };
    
    actualizarDashboard(statsLocal);
}

function actualizarDashboard(stats) {
    const elementos = {
        'totalProductos': stats.totalProductos || 0,
        'pedidosHoy': stats.pedidosHoy || 0,
        'ventasHoy': `S/${stats.ventasHoy || 0}`,
        'mesasOcupadas': stats.mesasOcupadas || 0,
        'totalClientes': stats.totalClientes || 0
    };
    
    Object.entries(elementos).forEach(([id, valor]) => {
        const elemento = document.getElementById(id);
        if (elemento) {
            elemento.textContent = valor;
        }
    });
}

// ===============================
// PRODUCTOS
// ===============================
async function cargarProductos() {
    console.log('📦 Cargando productos...');
    
    try {
        const response = await fetch(`${API_BASE}/productos`, {
            headers: { 'Authorization': `Bearer ${getToken()}` }
        });
        
        if (response.ok) {
            const data = await response.json();
            productos = data.data || data;
            mostrarProductos();
        } else {
            console.error('Error al cargar productos desde backend');
            cargarProductosLocal();
        }
    } catch (error) {
        console.error('Error de conexión al cargar productos:', error);
        cargarProductosLocal();
    }
}

function cargarProductosLocal() {
    // Productos ficticios para demostración
    productos = [
        { id: 1, nombre: 'Pisco Sour', descripcion: 'Cóctel peruano tradicional', precio: 25.00, categoria: 'BEBIDA', stock: 20 },
        { id: 2, nombre: 'Ceviche', descripcion: 'Pescado fresco marinado', precio: 35.00, categoria: 'COMIDA', stock: 15 },
        { id: 3, nombre: 'Lomo Saltado', descripcion: 'Plato tradicional peruano', precio: 32.00, categoria: 'COMIDA', stock: 10 },
        { id: 4, nombre: 'Chicha Morada', descripcion: 'Bebida tradicional', precio: 12.00, categoria: 'BEBIDA', stock: 30 }
    ];
    mostrarProductos();
}

function mostrarProductos() {
    const tbody = document.getElementById('productosTabla');
    if (!tbody) return;
    
    tbody.innerHTML = productos.map(producto => `
        <tr>
            <td>${producto.id}</td>
            <td>${producto.nombre}</td>
            <td>${producto.descripcion || ''}</td>
            <td>S/${producto.precio}</td>
            <td>${producto.categoria}</td>
            <td>${producto.stock}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarProducto(${producto.id})">
                    Editar
                </button>
                <button class="btn btn-sm btn-danger" onclick="confirmarEliminarProducto(${producto.id})">
                    Eliminar
                </button>
            </td>
        </tr>
    `).join('');
}

// ===============================
// PEDIDOS
// ===============================
async function cargarPedidos() {
    console.log('📋 Cargando pedidos...');
    // Implementar después
}

// ===============================
// USUARIOS
// ===============================
async function cargarUsuarios() {
    console.log('👥 Cargando usuarios...');
    // Implementar después
}

// ===============================
// MESAS
// ===============================
async function cargarMesas() {
    console.log('🪑 Cargando mesas...');
    // Implementar después
}

// ===============================
// RESERVAS
// ===============================
async function cargarReservas() {
    console.log('📅 Cargando reservas...');
    // Implementar después
}

// ===============================
// UTILIDADES
// ===============================
function actualizarFechaHora() {
    const ahora = new Date();
    const element = document.getElementById('dateTime');
    if (element) {
        const opciones = { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        };
        element.textContent = ahora.toLocaleDateString('es-PE', opciones);
    }
}

function getToken() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    return user ? user.token : '';
}

function mostrarMensaje(mensaje) {
    alert(mensaje); // Implementar toast mejor después
}

function mostrarError(error) {
    alert('Error: ' + error);
}

// ===============================
// GESTIÓN DE PRODUCTOS
// ===============================
function abrirModalProducto() {
    // Implementar modal de producto
    console.log('Abriendo modal de producto');
}

function editarProducto(id) {
    console.log('Editando producto:', id);
    // Implementar edición
}

function confirmarEliminarProducto(id) {
    if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
        eliminarProducto(id);
    }
}

function eliminarProducto(id) {
    console.log('Eliminando producto:', id);
    // Implementar eliminación
}

function guardarProducto() {
    console.log('Guardando producto');
    // Implementar guardado
}

// ===============================
// OTRAS FUNCIONES DE GESTIÓN
// ===============================
function abrirModalUsuario() {
    console.log('Abriendo modal de usuario');
}

function abrirModalMesa() {
    console.log('Abriendo modal de mesa');
}

function filtrarPedidos() {
    const filtro = document.getElementById('filtroPedidos').value;
    console.log('Filtrando pedidos por:', filtro);
}

// ===============================
// CERRAR SESIÓN
// ===============================
function cerrarSesion() {
    console.log('👋 Cerrando sesión desde admin...');
    
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        // Limpiar todos los storages
        localStorage.clear();
        sessionStorage.clear();
        
        console.log('🧹 Sesión limpiada');
        
        // Redirigir al login
        window.location.href = '/login';
    }
}

console.log('✅ Admin.js cargado completamente');