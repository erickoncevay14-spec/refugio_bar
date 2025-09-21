// admin.js - Lógica completa del Panel de Administración

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

// Verificar autenticación
function verificarAutenticacion() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user || user.rol !== 'ADMIN') {
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
    // Actualizar nav activo
    document.querySelectorAll('.nav-link').forEach(link => {
        link.classList.remove('active');
    });
    document.querySelector(`[data-section="${section}"]`).classList.add('active');
    
    // Mostrar sección
    document.querySelectorAll('.content-section').forEach(sec => {
        sec.classList.remove('active');
    });
    document.getElementById(section).classList.add('active');
    
    // Actualizar título
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
    
    // Cargar datos de la sección
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
// DASHBOARD
// ===============================
async function cargarDashboard() {
    console.log('📊 Cargando dashboard...');
    
    try {
        // Cargar estadísticas desde el backend
        await Promise.all([
            cargarEstadisticasProductos(),
            cargarEstadisticasPedidos(),
            cargarEstadisticasUsuarios(),
            cargarEstadisticasMesas()
        ]);
        
        // Cargar gráficos
        crearGraficoVentas();
        crearGraficoProductos();
        
    } catch (error) {
        console.error('Error cargando dashboard:', error);
        mostrarError('Error al cargar el dashboard');
    }
}

async function cargarEstadisticasProductos() {
    try {
        const response = await fetch(`${API_BASE}/productos`);
        if (response.ok) {
            const productos = await response.json();
            document.getElementById('totalProductos').textContent = productos.length;
        }
    } catch (error) {
        console.error('Error cargando estadísticas de productos:', error);
        document.getElementById('totalProductos').textContent = '---';
    }
}

async function cargarEstadisticasPedidos() {
    try {
        const response = await fetch(`${API_BASE}/pedidos/hoy`);
        if (response.ok) {
            const pedidos = await response.json();
            document.getElementById('pedidosHoy').textContent = pedidos.length;
        }
    } catch (error) {
        console.error('Error cargando estadísticas de pedidos:', error);
        document.getElementById('pedidosHoy').textContent = '---';
    }
}

async function cargarEstadisticasUsuarios() {
    try {
        const response = await fetch(`${API_BASE}/usuarios`);
        if (response.ok) {
            const usuarios = await response.json();
            document.getElementById('totalUsuarios').textContent = usuarios.length;
        }
    } catch (error) {
        console.error('Error cargando estadísticas de usuarios:', error);
        document.getElementById('totalUsuarios').textContent = '---';
    }
}

async function cargarEstadisticasMesas() {
    try {
        const response = await fetch(`${API_BASE}/mesas`);
        if (response.ok) {
            const mesas = await response.json();
            const mesasDisponibles = mesas.filter(mesa => mesa.estado === 'DISPONIBLE').length;
            document.getElementById('totalMesas').textContent = mesasDisponibles;
        }
    } catch (error) {
        console.error('Error cargando estadísticas de mesas:', error);
        document.getElementById('totalMesas').textContent = '---';
    }
}

function crearGraficoVentas() {
    const ctx = document.getElementById('ventasChart').getContext('2d');
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            datasets: [{
                label: 'Ventas (S/)',
                data: [1200, 1900, 3000, 5000, 2300, 3200, 4100],
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

function crearGraficoProductos() {
    const ctx = document.getElementById('productosChart').getContext('2d');
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Bebidas', 'Comidas', 'Postres', 'Aperitivos'],
            datasets: [{
                data: [30, 40, 15, 15],
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}

// ===============================
// PRODUCTOS
// ===============================
async function cargarProductos() {
    console.log('📦 Cargando productos...');
    
    try {
        const response = await fetch(`${API_BASE}/productos`);
        if (response.ok) {
            productos = await response.json();
            mostrarProductos();
            configurarFiltrosProductos();
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error cargando productos:', error);
        mostrarError('Error al cargar productos');
        // Cargar datos de ejemplo si falla la conexión
        cargarProductosLocal();
    }
}

function cargarProductosLocal() {
    productos = [
        { id: 1, nombre: 'Cerveza Pilsen', categoria: 'BEBIDAS', precio: 8.50, stock: 50, activo: true },
        { id: 2, nombre: 'Anticucho', categoria: 'COMIDAS', precio: 15.00, stock: 20, activo: true },
        { id: 3, nombre: 'Suspiro Limeño', categoria: 'POSTRES', precio: 12.00, stock: 10, activo: true }
    ];
    mostrarProductos();
    configurarFiltrosProductos();
}

function mostrarProductos() {
    const tbody = document.getElementById('tablaProductos');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    productos.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.id}</td>
            <td>
                <div class="d-flex align-items-center">
                    ${producto.imagen ? `<img src="${producto.imagen}" alt="${producto.nombre}" style="width: 40px; height: 40px; object-fit: cover; margin-right: 10px; border-radius: 4px;">` : ''}
                    <div>
                        <strong>${producto.nombre}</strong>
                        ${producto.descripcion ? `<br><small class="text-muted">${producto.descripcion}</small>` : ''}
                    </div>
                </div>
            </td>
            <td>
                <span class="badge ${getCategoriaColor(producto.categoria)}">${producto.categoria}</span>
            </td>
            <td>S/ ${producto.precio.toFixed(2)}</td>
            <td>
                <span class="badge ${getStockColor(producto.stock)}">${producto.stock}</span>
            </td>
            <td>
                <span class="badge ${producto.activo ? 'bg-success' : 'bg-danger'}">
                    ${producto.activo ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editarProducto(${producto.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="eliminarProducto(${producto.id})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function configurarFiltrosProductos() {
    const buscarInput = document.getElementById('buscarProducto');
    const filtroCategoria = document.getElementById('filtroCategoria');
    
    if (buscarInput) {
        buscarInput.addEventListener('input', filtrarProductos);
    }
    
    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', filtrarProductos);
    }
}

function filtrarProductos() {
    const buscar = document.getElementById('buscarProducto').value.toLowerCase();
    const categoria = document.getElementById('filtroCategoria').value;
    
    const filas = document.querySelectorAll('#tablaProductos tr');
    
    filas.forEach(fila => {
        const nombre = fila.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const categoriaProducto = fila.querySelector('td:nth-child(3)').textContent;
        
        const coincideNombre = nombre.includes(buscar);
        const coincideCategoria = !categoria || categoriaProducto === categoria;
        
        fila.style.display = (coincideNombre && coincideCategoria) ? '' : 'none';
    });
}

// CRUD Productos
async function crearProducto(productoData) {
    try {
        const response = await fetch(`${API_BASE}/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productoData)
        });
        
        if (response.ok) {
            const nuevoProducto = await response.json();
            productos.push(nuevoProducto);
            mostrarProductos();
            mostrarMensaje('Producto creado exitosamente', 'success');
            return nuevoProducto;
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error creando producto:', error);
        mostrarError('Error al crear producto');
        throw error;
    }
}

async function actualizarProducto(id, productoData) {
    try {
        const response = await fetch(`${API_BASE}/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productoData)
        });
        
        if (response.ok) {
            const productoActualizado = await response.json();
            const index = productos.findIndex(p => p.id === id);
            if (index !== -1) {
                productos[index] = productoActualizado;
            }
            mostrarProductos();
            mostrarMensaje('Producto actualizado exitosamente', 'success');
            return productoActualizado;
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error actualizando producto:', error);
        mostrarError('Error al actualizar producto');
        throw error;
    }
}

async function eliminarProducto(id) {
    if (!confirm('¿Estás seguro de eliminar este producto?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/productos/${id}`, {
            method: 'DELETE'
        });
        
        if (response.ok) {
            productos = productos.filter(p => p.id !== id);
            mostrarProductos();
            mostrarMensaje('Producto eliminado exitosamente', 'success');
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error eliminando producto:', error);
        mostrarError('Error al eliminar producto');
    }
}

// Modales y formularios
function abrirModalProducto(id = null) {
    const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
    const titulo = document.getElementById('modalProductoTitulo');
    const form = document.getElementById('formProducto');
    
    form.reset();
    
    if (id) {
        titulo.textContent = 'Editar Producto';
        const producto = productos.find(p => p.id === id);
        if (producto) {
            document.getElementById('productoId').value = producto.id;
            document.getElementById('productoNombre').value = producto.nombre;
            document.getElementById('productoDescripcion').value = producto.descripcion || '';
            document.getElementById('productoPrecio').value = producto.precio;
            document.getElementById('productoStock').value = producto.stock;
            document.getElementById('productoCategoria').value = producto.categoria;
            document.getElementById('productoImagen').value = producto.imagen || '';
            document.getElementById('productoActivo').checked = producto.activo;
        }
    } else {
        titulo.textContent = 'Nuevo Producto';
        document.getElementById('productoId').value = '';
    }
    
    modal.show();
}

function editarProducto(id) {
    abrirModalProducto(id);
}

async function guardarProducto() {
    const form = document.getElementById('formProducto');
    if (!form.checkValidity()) {
        form.reportValidity();
        return;
    }
    
    const productoData = {
        nombre: document.getElementById('productoNombre').value,
        descripcion: document.getElementById('productoDescripcion').value,
        precio: parseFloat(document.getElementById('productoPrecio').value),
        stock: parseInt(document.getElementById('productoStock').value),
        categoria: document.getElementById('productoCategoria').value,
        imagen: document.getElementById('productoImagen').value,
        activo: document.getElementById('productoActivo').checked
    };
    
    const id = document.getElementById('productoId').value;
    
    try {
        if (id) {
            await actualizarProducto(parseInt(id), productoData);
        } else {
            await crearProducto(productoData);
        }
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalProducto'));
        modal.hide();
        
    } catch (error) {
        console.error('Error guardando producto:', error);
    }
}

// Funciones auxiliares
function getCategoriaColor(categoria) {
    const colores = {
        'BEBIDAS': 'bg-primary',
        'COMIDAS': 'bg-success',
        'POSTRES': 'bg-warning',
        'APERITIVOS': 'bg-info'
    };
    return colores[categoria] || 'bg-secondary';
}

function getStockColor(stock) {
    if (stock === 0) return 'bg-danger';
    if (stock < 10) return 'bg-warning';
    return 'bg-success';
}

// ===============================
// PEDIDOS
// ===============================
async function cargarPedidos() {
    console.log('📝 Cargando pedidos...');
    
    try {
        const response = await fetch(`${API_BASE}/pedidos`);
        if (response.ok) {
            pedidos = await response.json();
            mostrarPedidos();
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error cargando pedidos:', error);
        mostrarError('Error al cargar pedidos');
        cargarPedidosLocal();
    }
}

function cargarPedidosLocal() {
    pedidos = [
        { 
            id: 1, 
            cliente: 'Juan Pérez', 
            mesa: 5, 
            fecha: '2024-03-15', 
            total: 45.50, 
            estado: 'PENDIENTE' 
        },
        { 
            id: 2, 
            cliente: 'María García', 
            mesa: 3, 
            fecha: '2024-03-15', 
            total: 32.00, 
            estado: 'COMPLETADO' 
        }
    ];
    mostrarPedidos();
}

function mostrarPedidos() {
    const tbody = document.getElementById('tablaPedidos');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    pedidos.forEach(pedido => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pedido.id}</td>
            <td>${pedido.cliente}</td>
            <td>Mesa ${pedido.mesa}</td>
            <td>${new Date(pedido.fecha).toLocaleDateString()}</td>
            <td>S/ ${pedido.total.toFixed(2)}</td>
            <td>
                <span class="badge ${getEstadoPedidoColor(pedido.estado)}">${pedido.estado}</span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-info" onclick="verDetallesPedido(${pedido.id})" title="Ver detalles">
                        <i class="bi bi-eye"></i>
                    </button>
                    <button class="btn btn-outline-warning" onclick="cambiarEstadoPedido(${pedido.id})" title="Cambiar estado">
                        <i class="bi bi-arrow-repeat"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getEstadoPedidoColor(estado) {
    const colores = {
        'PENDIENTE': 'bg-warning',
        'EN_PREPARACION': 'bg-info',
        'LISTO': 'bg-primary',
        'ENTREGADO': 'bg-success',
        'CANCELADO': 'bg-danger'
    };
    return colores[estado] || 'bg-secondary';
}

function verDetallesPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (pedido) {
        alert(`Detalles del pedido ${id}:\nCliente: ${pedido.cliente}\nMesa: ${pedido.mesa}\nTotal: S/ ${pedido.total}`);
    }
}

function cambiarEstadoPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (pedido) {
        const estados = ['PENDIENTE', 'EN_PREPARACION', 'LISTO', 'ENTREGADO'];
        const estadoActualIndex = estados.indexOf(pedido.estado);
        if (estadoActualIndex < estados.length - 1) {
            pedido.estado = estados[estadoActualIndex + 1];
            mostrarPedidos();
            mostrarMensaje(`Estado del pedido ${id} actualizado a ${pedido.estado}`, 'success');
        }
    }
}

// ===============================
// USUARIOS
// ===============================
async function cargarUsuarios() {
    console.log('👥 Cargando usuarios...');
    
    try {
        const response = await fetch(`${API_BASE}/usuarios`);
        if (response.ok) {
            usuarios = await response.json();
            mostrarUsuarios();
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        mostrarError('Error al cargar usuarios');
        cargarUsuariosLocal();
    }
}

function cargarUsuariosLocal() {
    usuarios = [
        { id: 1, nombre: 'Admin', email: 'admin@refugiobar.com', rol: 'ADMIN', estado: 'ACTIVO' },
        { id: 2, nombre: 'Carlos Mesero', email: 'carlos@refugiobar.com', rol: 'EMPLEADO', estado: 'ACTIVO' },
        { id: 3, nombre: 'Ana Cliente', email: 'ana@email.com', rol: 'CLIENTE', estado: 'ACTIVO' }
    ];
    mostrarUsuarios();
}

function mostrarUsuarios() {
    const tbody = document.getElementById('tablaUsuarios');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    usuarios.forEach(usuario => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.nombre}</td>
            <td>${usuario.email}</td>
            <td>
                <span class="badge ${getRolColor(usuario.rol)}">${usuario.rol}</span>
            </td>
            <td>
                <span class="badge ${usuario.estado === 'ACTIVO' ? 'bg-success' : 'bg-danger'}">${usuario.estado}</span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editarUsuario(${usuario.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-${usuario.estado === 'ACTIVO' ? 'warning' : 'success'}" 
                            onclick="toggleEstadoUsuario(${usuario.id})" 
                            title="${usuario.estado === 'ACTIVO' ? 'Desactivar' : 'Activar'}">
                        <i class="bi bi-${usuario.estado === 'ACTIVO' ? 'pause' : 'play'}"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getRolColor(rol) {
    const colores = {
        'ADMIN': 'bg-danger',
        'EMPLEADO': 'bg-warning',
        'CLIENTE': 'bg-info'
    };
    return colores[rol] || 'bg-secondary';
}

function editarUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
        alert(`Editar usuario: ${usuario.nombre}`);
        // Implementar modal de edición
    }
}

function toggleEstadoUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
        usuario.estado = usuario.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
        mostrarUsuarios();
        mostrarMensaje(`Usuario ${usuario.nombre} ${usuario.estado.toLowerCase()}`, 'success');
    }
}

// ===============================
// MESAS
// ===============================
async function cargarMesas() {
    console.log('🪑 Cargando mesas...');
    
    try {
        const response = await fetch(`${API_BASE}/mesas`);
        if (response.ok) {
            mesas = await response.json();
            mostrarMesas();
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error cargando mesas:', error);
        mostrarError('Error al cargar mesas');
        cargarMesasLocal();
    }
}

function cargarMesasLocal() {
    mesas = [
        { id: 1, numero: 1, capacidad: 4, estado: 'DISPONIBLE' },
        { id: 2, numero: 2, capacidad: 2, estado: 'OCUPADA' },
        { id: 3, numero: 3, capacidad: 6, estado: 'RESERVADA' },
        { id: 4, numero: 4, capacidad: 4, estado: 'DISPONIBLE' },
        { id: 5, numero: 5, capacidad: 8, estado: 'MANTENIMIENTO' }
    ];
    mostrarMesas();
}

function mostrarMesas() {
    const grid = document.getElementById('gridMesas');
    if (!grid) return;
    
    grid.innerHTML = '';
    
    mesas.forEach(mesa => {
        const mesaCard = document.createElement('div');
        mesaCard.className = 'col-md-3 col-sm-6 mb-3';
        mesaCard.innerHTML = `
            <div class="card mesa-card ${getMesaColorClass(mesa.estado)}">
                <div class="card-body text-center">
                    <h5 class="card-title">Mesa ${mesa.numero}</h5>
                    <p class="card-text">
                        <i class="bi bi-people"></i> ${mesa.capacidad} personas<br>
                        <span class="badge ${getMesaEstadoColor(mesa.estado)}">${mesa.estado}</span>
                    </p>
                    <div class="btn-group btn-group-sm">
                        <button class="btn btn-outline-primary" onclick="cambiarEstadoMesa(${mesa.id})" title="Cambiar estado">
                            <i class="bi bi-arrow-repeat"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="verDetallesMesa(${mesa.id})" title="Ver detalles">
                            <i class="bi bi-info-circle"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(mesaCard);
    });
}

function getMesaColorClass(estado) {
    const clases = {
        'DISPONIBLE': 'border-success',
        'OCUPADA': 'border-danger',
        'RESERVADA': 'border-warning',
        'MANTENIMIENTO': 'border-secondary'
    };
    return clases[estado] || '';
}

function getMesaEstadoColor(estado) {
    const colores = {
        'DISPONIBLE': 'bg-success',
        'OCUPADA': 'bg-danger',
        'RESERVADA': 'bg-warning',
        'MANTENIMIENTO': 'bg-secondary'
    };
    return colores[estado] || 'bg-secondary';
}

function cambiarEstadoMesa(id) {
    const mesa = mesas.find(m => m.id === id);
    if (mesa) {
        const estados = ['DISPONIBLE', 'OCUPADA', 'RESERVADA', 'MANTENIMIENTO'];
        const estadoActualIndex = estados.indexOf(mesa.estado);
        const nuevoEstado = estados[(estadoActualIndex + 1) % estados.length];
        mesa.estado = nuevoEstado;
        mostrarMesas();
        mostrarMensaje(`Mesa ${mesa.numero} cambiada a ${nuevoEstado}`, 'success');
    }
}

function verDetallesMesa(id) {
    const mesa = mesas.find(m => m.id === id);
    if (mesa) {
        alert(`Mesa ${mesa.numero}\nCapacidad: ${mesa.capacidad} personas\nEstado: ${mesa.estado}`);
    }
}

// ===============================
// RESERVAS
// ===============================
async function cargarReservas() {
    console.log('📅 Cargando reservas...');
    
    try {
        const response = await fetch(`${API_BASE}/reservas`);
        if (response.ok) {
            reservas = await response.json();
            mostrarReservas();
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error cargando reservas:', error);
        mostrarError('Error al cargar reservas');
        cargarReservasLocal();
    }
}

function cargarReservasLocal() {
    reservas = [
        { 
            id: 1, 
            cliente: 'Pedro Rodríguez', 
            mesa: 3, 
            fecha: '2024-03-16', 
            hora: '20:00', 
            personas: 4, 
            estado: 'CONFIRMADA' 
        },
        { 
            id: 2, 
            cliente: 'Lucía Morales', 
            mesa: 1, 
            fecha: '2024-03-16', 
            hora: '19:30', 
            personas: 2, 
            estado: 'PENDIENTE' 
        }
    ];
    mostrarReservas();
}

function mostrarReservas() {
    const tbody = document.getElementById('tablaReservas');
    if (!tbody) return;
    
    tbody.innerHTML = '';
    
    reservas.forEach(reserva => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${reserva.id}</td>
            <td>${reserva.cliente}</td>
            <td>Mesa ${reserva.mesa}</td>
            <td>${new Date(reserva.fecha).toLocaleDateString()}</td>
            <td>${reserva.hora}</td>
            <td>${reserva.personas}</td>
            <td>
                <span class="badge ${getEstadoReservaColor(reserva.estado)}">${reserva.estado}</span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-success" onclick="confirmarReserva(${reserva.id})" title="Confirmar">
                        <i class="bi bi-check"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="cancelarReserva(${reserva.id})" title="Cancelar">
                        <i class="bi bi-x"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function getEstadoReservaColor(estado) {
    const colores = {
        'PENDIENTE': 'bg-warning',
        'CONFIRMADA': 'bg-success',
        'CANCELADA': 'bg-danger',
        'COMPLETADA': 'bg-info'
    };
    return colores[estado] || 'bg-secondary';
}

function confirmarReserva(id) {
    const reserva = reservas.find(r => r.id === id);
    if (reserva && reserva.estado === 'PENDIENTE') {
        reserva.estado = 'CONFIRMADA';
        mostrarReservas();
        mostrarMensaje(`Reserva ${id} confirmada`, 'success');
    }
}

function cancelarReserva(id) {
    if (confirm('¿Estás seguro de cancelar esta reserva?')) {
        const reserva = reservas.find(r => r.id === id);
        if (reserva) {
            reserva.estado = 'CANCELADA';
            mostrarReservas();
            mostrarMensaje(`Reserva ${id} cancelada`, 'warning');
        }
    }
}

// ===============================
// ANALYTICS - LOOKER STUDIO
// ===============================
function cargarAnalytics() {
    console.log('📊 Cargando analytics...');
    
    // Verificar si hay URL configurada
    const lookerUrl = localStorage.getItem('lookerStudioUrl');
    const iframe = document.getElementById('lookerDashboard');
    const placeholder = document.getElementById('lookerPlaceholder');
    
    if (lookerUrl) {
        iframe.src = lookerUrl;
        iframe.style.display = 'block';
        placeholder.style.display = 'none';
    } else {
        iframe.style.display = 'none';
        placeholder.style.display = 'block';
    }
}

function configurarLooker() {
    const modal = new bootstrap.Modal(document.getElementById('modalLooker'));
    const urlInput = document.getElementById('lookerUrl');
    
    // Cargar URL actual si existe
    const currentUrl = localStorage.getItem('lookerStudioUrl');
    if (currentUrl) {
        urlInput.value = currentUrl;
    }
    
    modal.show();
}

function guardarConfigLooker() {
    const url = document.getElementById('lookerUrl').value;
    
    if (url) {
        localStorage.setItem('lookerStudioUrl', url);
        cargarAnalytics();
        mostrarMensaje('Configuración de Looker Studio guardada', 'success');
        
        const modal = bootstrap.Modal.getInstance(document.getElementById('modalLooker'));
        modal.hide();
    } else {
        mostrarError('Por favor ingresa una URL válida');
    }
}

function cargarDashboard(tipo) {
    // URLs de ejemplo para diferentes tipos de dashboards
    const dashboardUrls = {
        'ventas': 'https://lookerstudio.google.com/embed/reporting/your-sales-dashboard-id',
        'clientes': 'https://lookerstudio.google.com/embed/reporting/your-customers-dashboard-id',
        'inventario': 'https://lookerstudio.google.com/embed/reporting/your-inventory-dashboard-id'
    };
    
    const url = dashboardUrls[tipo];
    if (url) {
        const iframe = document.getElementById('lookerDashboard');
        iframe.src = url;
        iframe.style.display = 'block';
        document.getElementById('lookerPlaceholder').style.display = 'none';
        mostrarMensaje(`Dashboard de ${tipo} cargado`, 'info');
    } else {
        mostrarError(`Dashboard de ${tipo} no configurado`);
    }
}

// ===============================
// UTILIDADES
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
    // Crear toast notification
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
    
    // Remover el toast después de que se oculte
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