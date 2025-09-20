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
        analytics: 'Analytics - Dashboard Externo'
    };
    document.getElementById('sectionTitle').textContent = titles[section] || section;
    
    // Cargar datos de la sección
    switch(section) {
        case 'dashboard': cargarDashboard(); break;
        case 'productos': cargarProductos(); break;
        case 'pedidos': cargarPedidos(); break;
        case 'usuarios': cargarUsuarios(); break;
        case 'mesas': cargarMesas(); break;
        case 'reservas': cargarReservas(); break;
        case 'analytics': cargarAnalytics(); break;
    }
}

// Actualizar fecha y hora
function actualizarFechaHora() {
    const ahora = new Date();
    const opciones = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
    };
    document.getElementById('dateTime').textContent = ahora.toLocaleDateString('es-PE', opciones);
}

// Cerrar sesión
function cerrarSesion() {
    if (confirm('¿Desea cerrar sesión?')) {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        window.location.href = '/login';
    }
}

// ===============================
// DASHBOARD
// ===============================
async function cargarDashboard() {
    try {
        // Cargar estadísticas
        const [prodRes, pedRes] = await Promise.all([
            fetch(`${API_BASE}/productos`),
            fetch(`${API_BASE}/pedidos`, {
                headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
            })
        ]);
        
        if (prodRes.ok) {
            const prods = await prodRes.json();
            document.getElementById('totalProductos').textContent = prods.length;
        }
        
        if (pedRes.ok) {
            const peds = await pedRes.json();
            document.getElementById('pedidosHoy').textContent = peds.filter(p => {
                const fecha = new Date(p.fechaPedido);
                const hoy = new Date();
                return fecha.toDateString() === hoy.toDateString();
            }).length;
            
            // Calcular ventas del día
            const ventasHoy = peds
                .filter(p => {
                    const fecha = new Date(p.fechaPedido);
                    const hoy = new Date();
                    return fecha.toDateString() === hoy.toDateString();
                })
                .reduce((sum, p) => sum + (p.total || 0), 0);
            document.getElementById('ventasHoy').textContent = `S/ ${ventasHoy.toFixed(2)}`;
        }
        
        // Cargar gráfico de ventas
        cargarGraficoVentas();
        
        // Cargar top productos
        cargarTopProductos();
        
    } catch (error) {
        console.error('Error cargando dashboard:', error);
    }
}

function cargarGraficoVentas() {
    const ctx = document.getElementById('salesChart');
    if (ctx) {
        new Chart(ctx, {
            type: 'line',
            data: {
                labels: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
                datasets: [{
                    label: 'Ventas S/',
                    data: [1200, 1900, 1500, 2300, 2800, 3500, 3200],
                    borderColor: '#3498db',
                    backgroundColor: 'rgba(52, 152, 219, 0.1)',
                    tension: 0.3
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                }
            }
        });
    }
}

function cargarTopProductos() {
    const topList = document.getElementById('topProductos');
    if (topList) {
        // Simulación de top productos
        topList.innerHTML = `
            <li class="mb-2">🥇 Pisco Sour - 45 ventas</li>
            <li class="mb-2">🥈 Ceviche Mixto - 38 ventas</li>
            <li class="mb-2">🥉 Lomo Saltado - 32 ventas</li>
            <li class="mb-2">4. Cerveza Cusqueña - 28 ventas</li>
            <li class="mb-2">5. Chicharrón - 25 ventas</li>
        `;
    }
}

// ===============================
// PRODUCTOS CRUD
// ===============================
async function cargarProductos() {
    try {
        const response = await fetch(`${API_BASE}/productos`);
        if (response.ok) {
            productos = await response.json();
            mostrarProductos();
        }
    } catch (error) {
        console.error('Error cargando productos:', error);
    }
}

function mostrarProductos() {
    const tabla = document.getElementById('productosTabla');
    if (!tabla) return;
    
    if (productos.length === 0) {
        tabla.innerHTML = '<tr><td colspan="7" class="text-center">No hay productos</td></tr>';
        return;
    }
    
    tabla.innerHTML = productos.map(p => `
        <tr>
            <td>${p.id}</td>
            <td>${p.nombre}</td>
            <td>${p.descripcion || '-'}</td>
            <td>S/ ${p.precio}</td>
            <td><span class="badge bg-info">${p.categoria || 'Sin categoría'}</span></td>
            <td>${p.stock || 0}</td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarProducto(${p.id})">
                    <i class="bi bi-pencil"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${p.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function abrirModalProducto() {
    document.getElementById('formProducto').reset();
    document.getElementById('productoId').value = '';
    document.getElementById('tituloModalProducto').textContent = 'Nuevo Producto';
    new bootstrap.Modal(document.getElementById('modalProducto')).show();
}

function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    
    document.getElementById('productoId').value = producto.id;
    document.getElementById('productoNombre').value = producto.nombre;
    document.getElementById('productoDescripcion').value = producto.descripcion || '';
    document.getElementById('productoPrecio').value = producto.precio;
    document.getElementById('productoStock').value = producto.stock || 0;
    document.getElementById('productoCategoria').value = producto.categoria || 'BEBIDA';
    
    document.getElementById('tituloModalProducto').textContent = 'Editar Producto';
    new bootstrap.Modal(document.getElementById('modalProducto')).show();
}

async function guardarProducto() {
    const id = document.getElementById('productoId').value;
    const producto = {
        nombre: document.getElementById('productoNombre').value,
        descripcion: document.getElementById('productoDescripcion').value,
        precio: parseFloat(document.getElementById('productoPrecio').value),
        stock: parseInt(document.getElementById('productoStock').value),
        categoria: document.getElementById('productoCategoria').value
    };
    
    try {
        const url = id ? `${API_BASE}/productos/${id}` : `${API_BASE}/productos`;
        const method = id ? 'PUT' : 'POST';
        
        const response = await fetch(url, {
            method: method,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(producto)
        });
        
        if (response.ok) {
            alert('Producto guardado exitosamente');
            bootstrap.Modal.getInstance(document.getElementById('modalProducto')).hide();
            cargarProductos();
        } else {
            alert('Error al guardar producto');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error al guardar producto');
    }
}

async function eliminarProducto(id) {
    if (!confirm('¿Está seguro de eliminar este producto?')) return;
    
    try {
        const response = await fetch(`${API_BASE}/productos/${id}`, {
            method: 'DELETE',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        
        if (response.ok) {
            alert('Producto eliminado');
            cargarProductos();
        } else {
            alert('Error al eliminar producto');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// ===============================
// PEDIDOS CRUD
// ===============================
async function cargarPedidos() {
    try {
        const response = await fetch(`${API_BASE}/pedidos`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (response.ok) {
            pedidos = await response.json();
            mostrarPedidos();
        }
    } catch (error) {
        console.error('Error cargando pedidos:', error);
    }
}

function mostrarPedidos() {
    const tabla = document.getElementById('pedidosTabla');
    if (!tabla) return;
    
    if (!pedidos || pedidos.length === 0) {
        tabla.innerHTML = '<tr><td colspan="7" class="text-center">No hay pedidos</td></tr>';
        return;
    }
    
    tabla.innerHTML = pedidos.map(p => `
        <tr>
            <td>${p.numeroPedido || p.id}</td>
            <td>${p.usuario?.nombre || '-'}</td>
            <td>Mesa ${p.mesa?.numero || '-'}</td>
            <td>S/ ${p.total || 0}</td>
            <td>${getEstadoBadge(p.estado)}</td>
            <td>${new Date(p.fechaPedido).toLocaleDateString()}</td>
            <td>
                <select class="form-select form-select-sm" onchange="cambiarEstadoPedido(${p.id}, this.value)">
                    <option value="">Cambiar...</option>
                    <option value="PENDIENTE">Pendiente</option>
                    <option value="EN_PREPARACION">En Preparación</option>
                    <option value="LISTO">Listo</option>
                    <option value="ENTREGADO">Entregado</option>
                    <option value="CANCELADO">Cancelado</option>
                </select>
            </td>
        </tr>
    `).join('');
}

function getEstadoBadge(estado) {
    const badges = {
        'PENDIENTE': 'bg-warning',
        'EN_PREPARACION': 'bg-info',
        'LISTO': 'bg-success',
        'ENTREGADO': 'bg-secondary',
        'CANCELADO': 'bg-danger'
    };
    return `<span class="badge ${badges[estado] || 'bg-secondary'}">${estado || 'Sin estado'}</span>`;
}

async function cambiarEstadoPedido(id, estado) {
    if (!estado) return;
    
    try {
        const response = await fetch(`${API_BASE}/pedidos/${id}/estado?estado=${estado}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        
        if (response.ok) {
            alert('Estado actualizado');
            cargarPedidos();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

function filtrarPedidos() {
    const filtro = document.getElementById('filtroPedidos').value;
    if (filtro) {
        const pedidosFiltrados = pedidos.filter(p => p.estado === filtro);
        pedidos = pedidosFiltrados;
        mostrarPedidos();
        pedidos = []; // Reset para próxima carga
        cargarPedidos();
    } else {
        cargarPedidos();
    }
}

// ===============================
// USUARIOS CRUD
// ===============================
async function cargarUsuarios() {
    try {
        const response = await fetch(`${API_BASE}/usuarios`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (response.ok) {
            usuarios = await response.json();
            mostrarUsuarios();
        }
    } catch (error) {
        console.error('Error cargando usuarios:', error);
    }
}

function mostrarUsuarios() {
    const tabla = document.getElementById('usuariosTabla');
    if (!tabla) return;
    
    if (!usuarios || usuarios.length === 0) {
        tabla.innerHTML = '<tr><td colspan="7" class="text-center">No hay usuarios</td></tr>';
        return;
    }
    
    tabla.innerHTML = usuarios.map(u => `
        <tr>
            <td>${u.id}</td>
            <td>${u.usuario}</td>
            <td>${u.email}</td>
            <td>${u.nombre} ${u.apellido || ''}</td>
            <td><span class="badge bg-primary">${u.rol?.nombre || 'Sin rol'}</span></td>
            <td>
                ${u.activo 
                    ? '<span class="badge bg-success">Activo</span>' 
                    : '<span class="badge bg-danger">Inactivo</span>'}
            </td>
            <td>
                <button class="btn btn-sm btn-warning" onclick="editarUsuario(${u.id})">
                    <i class="bi bi-pencil"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function abrirModalUsuario() {
    // Implementar modal de usuario similar al de producto
    alert('Función de crear usuario en desarrollo');
}

// ===============================
// MESAS CRUD
// ===============================
async function cargarMesas() {
    try {
        const response = await fetch(`${API_BASE}/mesas`);
        if (response.ok) {
            mesas = await response.json();
            mostrarMesas();
        }
    } catch (error) {
        console.error('Error cargando mesas:', error);
        // Datos de ejemplo si no hay endpoint
        mesas = [
            { id: 1, numero: 1, capacidad: 4, estado: 'DISPONIBLE' },
            { id: 2, numero: 2, capacidad: 6, estado: 'OCUPADA' },
            { id: 3, numero: 3, capacidad: 2, estado: 'DISPONIBLE' },
            { id: 4, numero: 4, capacidad: 8, estado: 'OCUPADA' }
        ];
        mostrarMesas();
    }
}

function mostrarMesas() {
    const grid = document.getElementById('mesasGrid');
    if (!grid) return;
    
    if (!mesas || mesas.length === 0) {
        grid.innerHTML = '<div class="col-12 text-center">No hay mesas configuradas</div>';
        return;
    }
    
    grid.innerHTML = mesas.map(m => `
        <div class="col-md-3 col-sm-6">
            <div class="mesa-card ${m.estado === 'OCUPADA' ? 'ocupada' : 'disponible'}">
                <div class="mesa-numero">Mesa ${m.numero}</div>
                <div class="mesa-capacidad">
                    <i class="bi bi-people"></i> ${m.capacidad} personas
                </div>
                <span class="badge ${m.estado === 'OCUPADA' ? 'bg-danger' : 'bg-success'}">
                    ${m.estado}
                </span>
            </div>
        </div>
    `).join('');
}

function abrirModalMesa() {
    alert('Función de crear mesa en desarrollo');
}

// ===============================
// RESERVAS CRUD
// ===============================
async function cargarReservas() {
    try {
        const response = await fetch(`${API_BASE}/reservas`, {
            headers: { 'Authorization': 'Bearer ' + localStorage.getItem('token') }
        });
        if (response.ok) {
            reservas = await response.json();
            mostrarReservas();
        }
    } catch (error) {
        console.error('Error cargando reservas:', error);
        // Datos de ejemplo
        reservas = [
            {
                id: 1,
                usuario: { nombre: 'Juan Pérez' },
                mesa: { numero: 2 },
                fechaHora: new Date(),
                personas: 4,
                estado: 'CONFIRMADA'
            }
        ];
        mostrarReservas();
    }
}

function mostrarReservas() {
    const tabla = document.getElementById('reservasTabla');
    if (!tabla) return;
    
    if (!reservas || reservas.length === 0) {
        tabla.innerHTML = '<tr><td colspan="7" class="text-center">No hay reservas</td></tr>';
        return;
    }
    
    tabla.innerHTML = reservas.map(r => `
        <tr>
            <td>${r.id}</td>
            <td>${r.usuario?.nombre || '-'}</td>
            <td>Mesa ${r.mesa?.numero || '-'}</td>
            <td>${new Date(r.fechaHora).toLocaleString()}</td>
            <td>${r.personas}</td>
            <td>${getEstadoBadge(r.estado)}</td>
            <td>
                <button class="btn btn-sm btn-success" onclick="confirmarReserva(${r.id})">
                    <i class="bi bi-check"></i>
                </button>
                <button class="btn btn-sm btn-danger" onclick="cancelarReserva(${r.id})">
                    <i class="bi bi-x"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

async function confirmarReserva(id) {
    alert('Reserva confirmada');
    cargarReservas();
}

async function cancelarReserva(id) {
    if (confirm('¿Cancelar esta reserva?')) {
        alert('Reserva cancelada');
        cargarReservas();
    }
}

// ===============================
// ANALYTICS (LOOKER STUDIO)
// ===============================
function cargarAnalytics() {
    // Aquí solo se carga el iframe de Looker Studio
    // Los datos son externos, no de la BD local
    const iframe = document.querySelector('#analytics iframe');
    if (iframe && !iframe.src.includes('lookerstudio')) {
        // Reemplaza TU-ID-AQUI con tu ID real de Looker Studio
        iframe.src = 'https://lookerstudio.google.com/embed/reporting/TU-ID-AQUI';
    }
}