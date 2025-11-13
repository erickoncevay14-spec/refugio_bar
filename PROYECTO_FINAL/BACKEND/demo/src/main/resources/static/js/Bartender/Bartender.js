// Bartender.js - Con WebSocket en tiempo real

const API_BASE = 'http://localhost:8080/api';
let stompClient = null;

// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener('DOMContentLoaded', () => {
    verificarAutenticacionBartender();
    conectarWebSocket();
    cargarPedidos();
    configurarBusqueda();
});

// ===============================
// WEBSOCKET CONNECTION
// ===============================
function conectarWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    
    // Desactivar logs de debug de STOMP
    stompClient.debug = null;
    
    stompClient.connect({}, function(frame) {
        // Suscribirse a nuevos pedidos
        stompClient.subscribe('/topic/pedidos', function(message) {
            const nuevoPedido = JSON.parse(message.body);
            mostrarNotificacion(nuevoPedido);
            cargarPedidos(); // Recargar lista
        });
        
        // Suscribirse a actualizaciones de estado
        stompClient.subscribe('/topic/pedidos/actualizado', function(message) {
            const pedidoActualizado = JSON.parse(message.body);
            // console.log('🔄 Pedido actualizado:', pedidoActualizado); // Eliminado para no mostrar en consola
            cargarPedidos(); // Recargar lista
        });
    }, function(error) {
        console.error(' Error WebSocket:', error);
        // Reconectar después de 5 segundos
        setTimeout(conectarWebSocket, 5000);
    });
}

// ===============================
// NOTIFICACIONES
// ===============================
function mostrarNotificacion(pedido) {
    // Notificación del navegador
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Nuevo Pedido", {
            body: `Mesa ${pedido.mesa?.numero || 'N/A'} - ${pedido.numeroPedido}`,
            icon: '/img/imegen.png.png'
        });
    }
    
    // Notificación visual en la página
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-info alert-dismissible fade show position-fixed top-0 end-0 m-3';
    alerta.style.zIndex = '9999';
    alerta.innerHTML = `
        <strong>🔔 Nuevo Pedido</strong><br>
        Mesa: ${pedido.mesa?.numero || 'N/A'}<br>
        Total: S/ ${pedido.total?.toFixed(2) || '0.00'}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alerta);
    
    // Auto-cerrar después de 5 segundos
    setTimeout(() => {
        alerta.remove();
    }, 5000);
    
    // Reproducir sonido (opcional)
    reproducirSonido();
}

function reproducirSonido() {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZSA0PVqzn77BdGAg+lt7yt2YhBSyAzvLciTgIGGi8+t2gTQwMUKjj8LdjHAU7ktfyzHksBSN3x/DdkEAKE160+PCoVRQJSJ/h8r1sIAU0h9Hy1IIzBhtuv+3jmUgND1Wr5vKsXRgHPpbe8rhlIQUugM7y3Ik4CBdnvPrdoE0MCk+o4/C4Yx0FOJHX8sx5LAYidsjw3ZBACQ9et+nyqFUVCkef4fK8bCAENIfR8tSCMwYbbb/u5JlIDQ1Wq+bypF0YBj2V3vK4Zh8ELocNAG2DwgINdw==');
    audio.play().catch(e => console.log('No se pudo reproducir sonido'));
}

// Solicitar permiso de notificaciones
if ("Notification" in window && Notification.permission === "default") {
    Notification.requestPermission();
}

// ===============================
// CARGAR PEDIDOS
// ===============================
async function cargarPedidos() {
    try {
        const response = await fetch(`${API_BASE}/pedidos`);
        const pedidos = await response.json();
        renderizarPedidos(pedidos);
    } catch (error) {
        console.error('Error al cargar pedidos:', error);
    }
}

function renderizarPedidos(pedidos) {
    const listaPendientes = document.getElementById('listaPendientes');
    const listaPreparacion = document.getElementById('listaPreparacion');
    const listaEntregados = document.getElementById('listaEntregados');
    
    if (!listaPendientes || !listaPreparacion || !listaEntregados) return;
    
    listaPendientes.innerHTML = '';
    listaPreparacion.innerHTML = '';
    listaEntregados.innerHTML = '';

    pedidos.forEach(pedido => {
        const item = crearItemPedido(pedido);
        
        if (pedido.estado === 'PENDIENTE') {
            listaPendientes.appendChild(item);
        } else if (pedido.estado === 'EN_PREPARACION' || pedido.estado === 'LISTO') {
            listaPreparacion.appendChild(item);
        } else if (pedido.estado === 'ENTREGADO') {
            listaEntregados.appendChild(item);
        }
    });
}

function crearItemPedido(pedido) {
    const li = document.createElement('li');
    li.className = 'list-group-item';
    li.setAttribute('data-pedido-id', pedido.id);
    li.setAttribute('data-estado', pedido.estado);
    
    const productos = pedido.detalles?.map(d => `${d.producto?.nombre} (x${d.cantidad})`).join(', ') || 'Sin productos';
    const mesaNumero = pedido.mesa?.numero || 'N/A';
    
    li.innerHTML = `
        <div class="d-flex justify-content-between align-items-center">
            <div>
                <span class="fw-bold">${pedido.numeroPedido}</span> - Mesa ${mesaNumero}<br>
                <small class="text-muted">${productos}</small><br>
                <small class="text-primary">Total: S/ ${pedido.total?.toFixed(2) || '0.00'}</small>
            </div>
            <div class="d-flex gap-2 align-items-center">
                ${crearBotonesEstado(pedido)}
            </div>
        </div>
    `;
    return li;
}

function crearBotonesEstado(pedido) {
    let html = `<span class="badge bg-secondary">${pedido.estado}</span>`;
    
    if (pedido.estado === 'PENDIENTE') {
        html += `<button class="btn btn-sm btn-primary" onclick="cambiarEstado(${pedido.id}, 'EN_PREPARACION')">
            <i class="bi bi-play-circle"></i> Preparar
        </button>`;
    } else if (pedido.estado === 'EN_PREPARACION') {
        html += `<button class="btn btn-sm btn-warning" onclick="cambiarEstado(${pedido.id}, 'LISTO')">
            <i class="bi bi-check-circle"></i> Marcar Listo
        </button>`;
    } else if (pedido.estado === 'LISTO') {
        html += `<button class="btn btn-sm btn-success" onclick="cambiarEstado(${pedido.id}, 'ENTREGADO')">
            <i class="bi bi-truck"></i> Entregar
        </button>`;
    }
    
    return html;
}

// ===============================
// ACTUALIZACIÓN OPTIMIZADA DE PEDIDOS
// ===============================
function agregarPedidoALista(pedido) {
    const item = crearItemPedido(pedido);
    const listaPendientes = document.getElementById('listaPendientes');
    if (listaPendientes && pedido.estado === 'PENDIENTE') {
        listaPendientes.insertBefore(item, listaPendientes.firstChild);
    }
}

function actualizarPedidoEnLista(pedido) {
    // Buscar el pedido existente
    const pedidoElement = document.querySelector(`[data-pedido-id="${pedido.id}"]`);
    
    if (!pedidoElement) {
        // Si no existe, agregarlo
        agregarPedidoALista(pedido);
        return;
    }
    
    const estadoAnterior = pedidoElement.getAttribute('data-estado');
    
    // Si el estado cambió, moverlo a la lista correcta
    if (estadoAnterior !== pedido.estado) {
        pedidoElement.remove();
        
        const nuevoItem = crearItemPedido(pedido);
        
        if (pedido.estado === 'PENDIENTE') {
            const listaPendientes = document.getElementById('listaPendientes');
            if (listaPendientes) listaPendientes.appendChild(nuevoItem);
        } else if (pedido.estado === 'EN_PREPARACION' || pedido.estado === 'LISTO') {
            const listaPreparacion = document.getElementById('listaPreparacion');
            if (listaPreparacion) listaPreparacion.appendChild(nuevoItem);
        } else if (pedido.estado === 'ENTREGADO') {
            const listaEntregados = document.getElementById('listaEntregados');
            if (listaEntregados) listaEntregados.appendChild(nuevoItem);
        }
    } else {
        // Solo actualizar el contenido sin mover
        const nuevoItem = crearItemPedido(pedido);
        pedidoElement.innerHTML = nuevoItem.innerHTML;
    }
}

async function cambiarEstado(id, nuevoEstado) {
    // Actualizar UI inmediatamente (optimistic update)
    const pedidoElement = document.querySelector(`[data-pedido-id="${id}"]`);
    if (pedidoElement) {
        const badge = pedidoElement.querySelector('.badge');
        const btnContainer = pedidoElement.querySelector('.d-flex.gap-2');
        
        if (badge) {
            badge.textContent = nuevoEstado;
            badge.className = 'badge';
            if (nuevoEstado === 'EN_PREPARACION') badge.classList.add('bg-primary');
            if (nuevoEstado === 'LISTO') badge.classList.add('bg-warning');
            if (nuevoEstado === 'ENTREGADO') badge.classList.add('bg-success');
        }
        
        // Remover botón inmediatamente
        if (btnContainer) {
            const btn = btnContainer.querySelector('button');
            if (btn) btn.remove();
        }
    }
    
    // Enviar al backend (sin esperar)
    fetch(`${API_BASE}/pedidos/${id}/estado?estado=${nuevoEstado}`, {
        method: 'PUT'
    }).catch(error => {
        console.error('Error al cambiar estado:', error);
        cargarPedidos(); // Solo recargar si hay error
    });
}

// ===============================
// BÚSQUEDA
// ===============================
function configurarBusqueda() {
    const buscarInput = document.getElementById('buscarPedido');
    if (buscarInput) {
        buscarInput.addEventListener('input', (e) => {
            const filtro = e.target.value.toLowerCase();
            document.querySelectorAll('#listaPendientes li, #listaPreparacion li, #listaEntregados li').forEach(item => {
                const texto = item.textContent.toLowerCase();
                item.style.display = texto.includes(filtro) ? '' : 'none';
            });
        });
    }
}

// ===============================
// AUTENTICACIÓN
// ===============================
function verificarAutenticacionBartender() {
    // Limpiar URL
    if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    let userString = sessionStorage.getItem('currentUser') || localStorage.getItem('currentUser');
    
    if (!userString) {
        alert('Debe iniciar sesión primero');
        window.location.href = '/login';
        return;
    }
    
    let user;
    try {
        user = JSON.parse(userString);
    } catch (error) {
        console.error('Error al parsear usuario:', error);
        sessionStorage.clear();
        localStorage.clear();
        alert('Sesión inválida. Debe iniciar sesión nuevamente');
        window.location.href = '/login';
        return;
    }
    
    if (!user.rol || (!user.nombre && !user.usuario)) {
        alert('Datos de sesión incompletos. Debe iniciar sesión nuevamente');
        window.location.href = '/login';
        return;
    }
    
    const esBartender = user.rol?.toUpperCase() === 'BARTENDER';
    
    if (!esBartender) {
        alert('Acceso no autorizado. Solo bartenders pueden acceder.');
        switch(user.rol?.toUpperCase()) {
            case 'ADMIN':
                window.location.href = '/admin';
                break;
            case 'MOZO':
                window.location.href = '/mozo';
                break;
            default:
                window.location.href = '/login';
        }
        return;
    }
    
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
        userInfoElement.textContent = `Bartender: ${user.nombre || user.usuario}`;
    }
}

function cerrarSesion() {
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        if (stompClient) {
            stompClient.disconnect();
        }
        localStorage.clear();
        sessionStorage.clear();
        window.location.href = '/login';
    }
}

// ===============================
// FUNCIONES DE NAVEGACIÓN
// ===============================
function showSection(sectionName) {
    // Ocultar todas las secciones
    const sections = document.querySelectorAll('.content-section');
    sections.forEach(section => {
        section.style.display = 'none';
    });
    
    // Mostrar la sección seleccionada
    const targetSection = document.getElementById(`section-${sectionName}`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Actualizar título de la página
    const pageTitle = document.getElementById('pageTitle');
    if (pageTitle) {
        const titles = {
            'pedidos-pendientes': 'Pedidos por Preparar',
            'pedidos-preparacion': 'En Preparación',
            'pedidos-entregados': 'Pedidos Entregados'
        };
        pageTitle.textContent = titles[sectionName] || 'Bartender';
    }
    
    // Actualizar nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(sectionName)) {
            link.classList.add('active');
        }
    });
}