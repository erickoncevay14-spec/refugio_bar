// mozo.js - Con WebSocket bidireccional

let pedidos = [];
let mesas = [];
let productos = [];
let stompClient = null;
const API_BASE = 'http://localhost:8080/api';

// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacionMozo();
    conectarWebSocket(); // ACTUALIZADA
    configurarEventos();
    cargarDatosMozo();
});

// ===============================
// WEBSOCKET CONNECTION (ACTUALIZADA)
// ===============================
function conectarWebSocket() {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    
    // Desactivar logs de debug de STOMP
    stompClient.debug = null;
    
    stompClient.connect({}, function(frame) {
        // Suscribirse a pedidos listos para recoger
        stompClient.subscribe('/topic/pedidos/listos', function(message) {
            const pedidoListo = JSON.parse(message.body);
            mostrarNotificacionPedidoListo(pedidoListo);
            cargarPedidos();
        });
        
        // Suscribirse a actualizaciones generales de pedidos
        stompClient.subscribe('/topic/pedidos/actualizado', function(message) {
            const pedidoActualizado = JSON.parse(message.body);
            cargarPedidos();
        });

        // NUEVO: Suscribirse a cambios de mesas
        stompClient.subscribe('/topic/mesas/actualizado', function(message) {
            const mesaActualizada = JSON.parse(message.body);

            // Actualizar el array de mesas local
            const index = mesas.findIndex(m => m.id === mesaActualizada.id);
            if (index !== -1) {
                mesas[index] = mesaActualizada;
            } else {
                mesas.push(mesaActualizada);
            }

            // Refrescar vista
            mostrarMesasMozo();

            // Mostrar notificación visual
            mostrarNotificacionMesa(mesaActualizada);
        });

    }, function(error) {
        console.error('Error WebSocket:', error);
        // Intentar reconexión automática
        setTimeout(conectarWebSocket, 5000);
    });
}

// ===============================
// NOTIFICACIONES PARA MOZO
// ===============================
function mostrarNotificacionPedidoListo(pedido) {
    // Notificación del navegador
    if ("Notification" in window && Notification.permission === "granted") {
        new Notification("Pedido Listo para Recoger", {
            body: `Mesa ${pedido.mesa?.numero || 'N/A'} - ${pedido.numeroPedido}`,
            icon: '/img/imegen.png.png'
        });
    }
    
    // Notificación visual
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-success alert-dismissible fade show position-fixed top-0 end-0 m-3';
    alerta.style.zIndex = '9999';
    alerta.innerHTML = `
        <strong> Pedido Listo</strong><br>
        Mesa: ${pedido.mesa?.numero || 'N/A'}<br>
        Número: ${pedido.numeroPedido}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alerta);
    
    setTimeout(() => alerta.remove(), 5000);
    reproducirSonido();
}

// NUEVA FUNCIÓN: Notificación visual de cambio de mesa
function mostrarNotificacionMesa(mesa) {
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-info alert-dismissible fade show position-fixed';
    alerta.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 250px;';
    alerta.innerHTML = `
        <strong>Mesa ${mesa.numero} actualizada</strong><br>
        Nuevo estado: <span class="badge bg-secondary">${mesa.estado}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alerta);

    setTimeout(() => alerta.remove(), 3000);
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
// VERIFICACIÓN DE AUTENTICACIÓN
// ===============================
function verificarAutenticacionMozo() {
    // Limpiar URL
    if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
    }
    
    // Priorizar sessionStorage
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
    
    // Aceptamos tanto 'mozo' (minúsculas) como 'MOZO' (mayúsculas)
    // según la información de la base de datos
    const rolUpperCase = user.rol?.toUpperCase() || '';
    const esMozo = rolUpperCase === 'MOZO' || rolUpperCase === 'MESERO' || 
                 user.rol === 'mozo' || user.rol === 'Mozo';
    
    if (!esMozo) {
        alert('Acceso no autorizado. Solo mozos pueden acceder.');
        switch(rolUpperCase) {
            case 'ADMIN':
                window.location.href = '/admin';
                break;
            case 'BARTENDER':
                window.location.href = '/bartender';
                break;
            default:
                window.location.href = '/login';
        }
        return;
    }
    
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
        userInfoElement.textContent = `Mozo: ${user.nombre}`;
    }
}

// ===============================
// CARGAR DATOS
// ===============================
async function cargarDatosMozo() {
    await cargarMesas();
    await cargarProductos();
    await cargarPedidos();
}

async function cargarMesas() {
    try {
        const res = await fetch(`${API_BASE}/mesas`);
        if (!res.ok) throw new Error("No se pudo conectar con el backend");
        const data = await res.json();
        const mesaSelect = document.getElementById("opciones");
        
        if (!mesaSelect) return;
        
        mesaSelect.innerHTML = "";
        if (data.data && data.data.length > 0) {
            data.data.forEach(mesa => {
                const opt = document.createElement("option");
                opt.value = mesa.id;
                opt.textContent = `Mesa ${mesa.numero}`;
                mesaSelect.appendChild(opt);
            });
        } else {
            const opt = document.createElement("option");
            opt.value = "";
            opt.textContent = "No hay mesas disponibles";
            mesaSelect.appendChild(opt);
            mesaSelect.disabled = true;
        }
        
        mesas = data.data || [];
        mostrarMesasMozo();
    } catch (err) {
        console.error('Error cargando mesas:', err);
    }
}

async function cargarProductos() {
    try {
        const res = await fetch(`${API_BASE}/productos`);
        const data = await res.json();
        productos = data.data || [];
        mostrarSelectorProductos();
    } catch (err) {
        console.error('Error cargando productos:', err);
        productos = [];
    }
}

async function cargarPedidos() {
    try {
        const res = await fetch(`${API_BASE}/pedidos`);
        const pedidos = await res.json();
        renderPedidos(pedidos);
    } catch (err) {
        console.error('Error cargando pedidos:', err);
    }
}

function renderPedidos(pedidos) {
    const listaPorRecoger = document.getElementById("pedidosPorRecoger");
    const listaEntregados = document.getElementById("pedidosEntregados");
    
    if (!listaPorRecoger || !listaEntregados) return;
    
    listaPorRecoger.innerHTML = "";
    listaEntregados.innerHTML = "";
    
    pedidos.forEach(p => {
        const productos = p.detalles?.map(d => `${d.producto?.nombre} (x${d.cantidad})`).join(', ') || 'Sin productos';
        const mesaNumero = p.mesa?.numero || 'N/A';
        
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        
        const left = document.createElement("div");
        left.innerHTML = `
            <strong>Mesa ${mesaNumero}</strong> - ${p.numeroPedido}<br>
            <small class="text-muted">${productos}</small><br>
            <small class="text-primary">Total: S/ ${p.total?.toFixed(2) || '0.00'}</small>
        `;
        
        const right = document.createElement("div");
        right.className = "d-flex gap-2 align-items-center";
        
        const badge = document.createElement("span");
        badge.className = "badge rounded-pill";
        badge.textContent = p.estado;
        
        if (p.estado === 'PENDIENTE') badge.classList.add("bg-secondary");
        if (p.estado === 'EN_PREPARACION') badge.classList.add("bg-primary");
        if (p.estado === 'LISTO') badge.classList.add("bg-warning", "text-dark");
        if (p.estado === 'ENTREGADO') badge.classList.add("bg-success");
        
        right.appendChild(badge);
        
        if (p.estado === 'LISTO') {
            const btn = document.createElement("button");
            btn.className = "btn btn-sm btn-success";
            btn.textContent = "Recoger";
            btn.onclick = () => marcarComoEntregado(p.id);
            right.appendChild(btn);
        }
        
        li.appendChild(left);
        li.appendChild(right);
        
        if (p.estado === 'ENTREGADO') {
            listaEntregados.appendChild(li);
        } else {
            listaPorRecoger.appendChild(li);
        }
    });
}

async function marcarComoEntregado(pedidoId) {
    // 1. Actualizar UI inmediatamente (optimistic update)
    const pedidosList = document.querySelectorAll('#pedidosPorRecoger li, #pedidosEntregados li');
    let pedidoElement = null;
    
    pedidosList.forEach(item => {
        if (item.textContent.includes(`Recoger`) && item.querySelector(`button[onclick*="${pedidoId}"]`)) {
            pedidoElement = item;
        }
    });
    
    if (pedidoElement) {
        const badge = pedidoElement.querySelector('.badge');
        if (badge) {
            badge.classList.remove('bg-warning', 'text-dark');
            badge.classList.add('bg-success');
            badge.textContent = 'ENTREGADO';
        }
        // Remover botón de recoger
        const btnRecoger = pedidoElement.querySelector('button');
        if (btnRecoger) btnRecoger.remove();
        
        // Mover a la sección de entregados
        const listaEntregados = document.getElementById('pedidosEntregados');
        if (listaEntregados) {
            listaEntregados.appendChild(pedidoElement);
        }
    }
    
    // 2. Enviar al backend (sin esperar)
    fetch(`${API_BASE}/pedidos/${pedidoId}/estado?estado=ENTREGADO`, {
        method: 'PUT'
    }).catch(error => {
        console.error('Error al marcar como entregado:', error);
        cargarPedidos(); // Solo recargar si hay error
    });
}

// ===============================
// SELECCIÓN DE PRODUCTOS Y ENVÍO
// ===============================
let seleccionados = [];

function mostrarSelectorProductos() {
    const categorias = ["BEBIDA", "COMIDA", "POSTRE", "ENTRADA", "SNACK"];
    const contenedor = document.createElement("div");
    contenedor.className = "mb-3";
    
    categorias.forEach(cat => {
        const grupo = document.createElement("div");
        grupo.className = "mb-2";
        grupo.innerHTML = `<strong>${cat}</strong>`;
        const lista = document.createElement("ul");
        lista.className = "list-group";
        
        productos.filter(p => p.categoria === cat).forEach(p => {
            const item = document.createElement("li");
            item.className = "list-group-item d-flex justify-content-between align-items-center";
            item.innerHTML = `${p.nombre} <span class='badge bg-primary'>S/ ${p.precio.toFixed(2)}</span>`;
            const btn = document.createElement("button");
            btn.className = "btn btn-sm btn-success";
            btn.textContent = "+";
            btn.onclick = () => agregarProductoSeleccionado(p);
            item.appendChild(btn);
            lista.appendChild(item);
        });
        
        grupo.appendChild(lista);
        contenedor.appendChild(grupo);
    });
    
    const productosLista = document.getElementById("productosSeleccionados");
    if (productosLista && productosLista.parentElement) {
        productosLista.parentElement.insertBefore(contenedor, productosLista);
    }
}

function agregarProductoSeleccionado(producto) {
    seleccionados.push(producto);
    renderProductosSeleccionados();
}

function eliminarProductoSeleccionado(idx) {
    seleccionados.splice(idx, 1);
    renderProductosSeleccionados();
}

function renderProductosSeleccionados() {
    const productosLista = document.getElementById("productosSeleccionados");
    const totalPedido = document.getElementById("totalPedido");
    
    if (!productosLista) return;
    
    productosLista.innerHTML = "";
    let total = 0;
    
    seleccionados.forEach((p, i) => {
        total += p.precio;
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.innerHTML = `${p.nombre} <span class='badge bg-primary'>S/ ${p.precio.toFixed(2)}</span>`;
        const btn = document.createElement("button");
        btn.className = "btn btn-sm btn-danger";
        btn.textContent = "Eliminar";
        btn.onclick = () => eliminarProductoSeleccionado(i);
        li.appendChild(btn);
        productosLista.appendChild(li);
    });
    
    if (totalPedido) {
        totalPedido.textContent = `Total: S/ ${total.toFixed(2)}`;
    }
}

function configurarEventos() {
    const enviarBtn = document.getElementById("enviarPedido");
    const buscarInput = document.getElementById("buscarPedido");
    
    if (enviarBtn) {
        enviarBtn.addEventListener("click", enviarPedido);
    }
    
    if (buscarInput) {
        buscarInput.addEventListener("input", (e) => {
            const filtro = e.target.value.toLowerCase();
            document.querySelectorAll('#pedidosPorRecoger li, #pedidosEntregados li').forEach(item => {
                const texto = item.textContent.toLowerCase();
                item.style.display = texto.includes(filtro) ? '' : 'none';
            });
        });
    }
}

async function enviarPedido() {
    // Obtener productos del DOM (nuevo HTML)
    const productosLista = document.getElementById('productosSeleccionadosLista');
    if (!productosLista) {
        alert("Error: No se encontró la lista de productos");
        return;
    }
    
    const productosItems = Array.from(productosLista.children).filter(item => item.dataset.productoId);
    
    if (productosItems.length === 0) {
        alert("Selecciona al menos un producto");
        return;
    }
    
    const mesaSelect = document.getElementById("opciones");
    const nombreInput = document.getElementById("nombre");
    const cantidadPersonasInput = document.getElementById("cantidadPersonas");
    
    let user = null;
    try {
        user = JSON.parse(localStorage.getItem('currentUser'));
    } catch {}
    
    // Construir items desde el DOM
    const items = productosItems.map(item => {
        const cantidadInput = item.querySelector('.cantidad-input');
        return {
            productoId: parseInt(item.dataset.productoId),
            cantidad: cantidadInput ? parseInt(cantidadInput.value) : 1
        };
    });

    const pedido = {
        usuarioId: user?.id || null,
        mesaId: mesaSelect?.value ? parseInt(mesaSelect.value) : null,
        items: items,
        notas: nombreInput?.value || ""
    };
    
    try {
        const res = await fetch(`${API_BASE}/pedidos`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(pedido)
        });
        
        if (res.ok) {
            const resp = await res.json();
            if (resp.id) {
                alert("Pedido enviado correctamente");
                
                // Limpiar formulario
                productosLista.innerHTML = '<p class="text-center" style="color: #6e6e73; font-size: 14px; padding: 20px;">No hay productos seleccionados</p>';
                if (nombreInput) nombreInput.value = "";
                if (cantidadPersonasInput) cantidadPersonasInput.value = "1";
                if (mesaSelect) mesaSelect.selectedIndex = 0;
                
                // Actualizar total
                actualizarTotal();
                
                // Volver a la vista de mesas
                showSection('mesas');
            }
        } else {
             const errorData = await res.json();
             console.error('Error del servidor:', errorData);
             console.error('Status:', res.status);
             throw new Error(errorData.message || 'Error desconocido al enviar el pedido');
        }
    } catch (err) {
        console.error('Error completo:', err);
        alert("Error al enviar pedido: " + err.message);
    }
}

// ===============================
// MOSTRAR MESAS CON CONTROLES DE ESTADO (ACTUALIZADA)
// ===============================
async function mostrarMesasMozo() {
    const contenedor = document.getElementById('vistaMesasLocal');
    if (!contenedor) return;
    
    contenedor.innerHTML = '';
    mesas.forEach(mesa => {
        const mesaCard = document.createElement('div');
        
        // Determinar clase de estado para el diseño
        let estadoClass = 'disponible';
        let estadoTexto = 'DISPONIBLE';
        
        if (mesa.estado === 'OCUPADA') {
            estadoClass = 'ocupada';
            estadoTexto = 'OCUPADA';
        } else if (mesa.estado === 'RESERVADA') {
            estadoClass = 'reservada';
            estadoTexto = 'RESERVADA';
        } else if (mesa.estado === 'LIMPIEZA') {
            estadoClass = 'limpieza';
            estadoTexto = 'LIMPIEZA';
        } else if (mesa.estado === 'LIBRE') {
            estadoClass = 'disponible';
            estadoTexto = 'DISPONIBLE';
        }
        
        // Usar el diseño limpio con botones de control
        mesaCard.className = `mesa-card-container`;
        mesaCard.setAttribute('data-mesa-id', mesa.id);
        
        mesaCard.innerHTML = `
            <div class="mesa-card ${estadoClass}" data-estado="${mesa.estado}">
                <div class="mesa-header">
                    <div class="mesa-number">${mesa.numero}</div>
                    <div class="mesa-capacity"><i class="bi bi-people"></i> ${mesa.capacidad} personas</div>
                    <div class="mesa-status-badge">${estadoTexto}</div>
                </div>
                
                <div class="mesa-actions">
                    <button class="btn-estado btn-libre" onclick="cambiarEstadoMesa(${mesa.id}, 'LIBRE')" ${mesa.estado === 'LIBRE' ? 'disabled' : ''}>
                        <i class="bi bi-check-circle"></i> Libre
                    </button>
                    <button class="btn-estado btn-ocupada" onclick="cambiarEstadoMesa(${mesa.id}, 'OCUPADA')" ${mesa.estado === 'OCUPADA' ? 'disabled' : ''}>
                        <i class="bi bi-person-fill"></i> Ocupada
                    </button>
                    <button class="btn-estado btn-reservada" onclick="cambiarEstadoMesa(${mesa.id}, 'RESERVADA')" ${mesa.estado === 'RESERVADA' ? 'disabled' : ''}>
                        <i class="bi bi-calendar-check"></i> Reservada
                    </button>
                    <button class="btn-estado btn-limpieza" onclick="cambiarEstadoMesa(${mesa.id}, 'LIMPIEZA')" ${mesa.estado === 'LIMPIEZA' ? 'disabled' : ''}>
                        <i class="bi bi-droplet"></i> Limpieza
                    </button>
                </div>
            </div>
        `;
        
        contenedor.appendChild(mesaCard);
    });
}

// ===============================
// CAMBIAR ESTADO DE MESA (OPTIMIZADA)
// ===============================
async function cambiarEstadoMesa(mesaId, nuevoEstado) {
    const mesaContainer = document.querySelector(`[data-mesa-id="${mesaId}"]`);
    if (!mesaContainer) return;
    
    const mesaCard = mesaContainer.querySelector('.mesa-card');
    const statusBadge = mesaContainer.querySelector('.mesa-status-badge');
    const buttons = mesaContainer.querySelectorAll('.btn-estado');
    
    // 1. Actualizar UI INSTANTÁNEAMENTE
    if (mesaCard) {
        // Remover clases anteriores
        mesaCard.classList.remove('disponible', 'ocupada', 'reservada', 'limpieza');
        // Agregar nueva clase según estado
        const claseEstado = nuevoEstado === 'LIBRE' ? 'disponible' : nuevoEstado.toLowerCase();
        mesaCard.classList.add(claseEstado);
        mesaCard.setAttribute('data-estado', nuevoEstado);
    }
    
    // Actualizar badge
    if (statusBadge) {
        statusBadge.textContent = nuevoEstado === 'LIBRE' ? 'DISPONIBLE' : nuevoEstado;
    }
    
    // Actualizar botones (deshabilitar el seleccionado)
    buttons.forEach(btn => {
        btn.disabled = false;
        if (btn.onclick.toString().includes(`'${nuevoEstado}'`)) {
            btn.disabled = true;
        }
    });
    
    // 2. Enviar al backend (sin esperar)
    fetch(`${API_BASE}/mesas/${mesaId}/estado`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ estado: nuevoEstado })
    }).catch(error => {
        console.error('Error al actualizar mesa:', error);
        mostrarMesasMozo(); // Solo recargar si hay error
    });
}

function seleccionarMesaParaPedido(mesaId) {
    const mesaSelect = document.getElementById('opciones');
    if (mesaSelect) {
        mesaSelect.value = mesaId;
    }
    const pedidoSection = document.querySelector('.pedido-section');
    if (pedidoSection) {
        pedidoSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// ===============================
// CERRAR SESIÓN
// ===============================
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
// FUNCIONES DE NAVEGACIÓN Y UI
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
            'mesas': 'Mesas',
            'nuevo-pedido': 'Nuevo Pedido',
            'pedidos-activos': 'Pedidos Activos',
            'historial': 'Historial'
        };
        pageTitle.textContent = titles[sectionName] || 'Mozo';
    }
    
    // Actualizar nav links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('onclick')?.includes(sectionName)) {
            link.classList.add('active');
        }
    });
    
    // Cargar datos según la sección
    if (sectionName === 'mesas') {
        cargarMesas();
    } else if (sectionName === 'pedidos-activos' || sectionName === 'historial') {
        cargarPedidos();
    }
}

function selectMesa(mesaId) {
    // Cambiar a la sección de nuevo pedido
    showSection('nuevo-pedido');
    
    // Seleccionar la mesa en el dropdown
    const mesaSelect = document.getElementById('opciones');
    if (mesaSelect) {
        mesaSelect.value = mesaId;
    }
    
    // Scroll al formulario
    setTimeout(() => {
        const nuevoPedidoSection = document.getElementById('section-nuevo-pedido');
        if (nuevoPedidoSection) {
            nuevoPedidoSection.scrollIntoView({ behavior: 'smooth' });
        }
    }, 100);
}

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

function buscarProducto() {
    const searchInput = document.getElementById('buscarProducto');
    const resultadosDiv = document.getElementById('resultadosBusqueda');
    const listaResultados = document.getElementById('listaResultados');
    
    if (!searchInput || !resultadosDiv || !listaResultados) return;
    
    const query = searchInput.value.toLowerCase().trim();
    
    if (query.length === 0) {
        resultadosDiv.style.display = 'none';
        return;
    }
    
    // Filtrar productos
    const productosFiltrados = productos.filter(p => 
        p.nombre?.toLowerCase().includes(query) || 
        p.categoria?.toLowerCase().includes(query)
    );
    
    if (productosFiltrados.length === 0) {
        listaResultados.innerHTML = '<div class="list-group-item text-center text-muted">No se encontraron productos</div>';
        resultadosDiv.style.display = 'block';
        return;
    }
    
    // Mostrar resultados
    listaResultados.innerHTML = '';
    productosFiltrados.forEach(producto => {
        const item = document.createElement('div');
        item.className = 'list-group-item list-group-item-action d-flex justify-content-between align-items-center';
        item.style.cursor = 'pointer';
        item.innerHTML = `
            <div>
                <strong>${producto.nombre}</strong><br>
                <small class="text-muted">${producto.categoria || 'Sin categoría'}</small>
            </div>
            <div class="text-end">
                <span class="badge bg-primary">S/ ${producto.precio?.toFixed(2) || '0.00'}</span>
            </div>
        `;
        
        item.onclick = () => agregarProductoAlPedido(producto);
        listaResultados.appendChild(item);
    });
    
    resultadosDiv.style.display = 'block';
}

function agregarProductoAlPedido(producto) {
    const productosLista = document.getElementById('productosSeleccionadosLista');
    if (!productosLista) return;
    
    // Verificar si el producto ya está en la lista
    const productoExistente = Array.from(productosLista.children).find(item => 
        item.dataset.productoId == producto.id
    );
    
    if (productoExistente) {
        // Incrementar cantidad
        const cantidadInput = productoExistente.querySelector('.cantidad-input');
        if (cantidadInput) {
            cantidadInput.value = parseInt(cantidadInput.value) + 1;
            actualizarTotal();
        }
        return;
    }
    
    // Limpiar mensaje de "no hay productos"
    if (productosLista.children.length === 1 && productosLista.children[0].tagName === 'P') {
        productosLista.innerHTML = '';
    }
    
    // Agregar nuevo producto
    const item = document.createElement('div');
    item.className = 'selected-product-item';
    item.dataset.productoId = producto.id;
    item.dataset.precio = producto.precio;
    item.innerHTML = `
        <div class="d-flex justify-content-between align-items-center mb-2 p-2 border rounded">
            <div>
                <strong>${producto.nombre}</strong><br>
                <small class="text-muted">S/ ${producto.precio?.toFixed(2)}</small>
            </div>
            <div class="d-flex align-items-center gap-2">
                <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${producto.id}, -1)">-</button>
                <input type="number" class="form-control form-control-sm cantidad-input" style="width: 60px; text-align: center;" 
                    value="1" min="1" data-producto-id="${producto.id}" onchange="actualizarTotal()">
                <button class="btn btn-sm btn-outline-secondary" onclick="cambiarCantidad(${producto.id}, 1)">+</button>
                <button class="btn btn-sm btn-danger" onclick="eliminarProducto(${producto.id})">
                    <i class="bi bi-trash"></i>
                </button>
            </div>
        </div>
    `;
    
    productosLista.appendChild(item);
    actualizarTotal();
    
    // Limpiar búsqueda
    const searchInput = document.getElementById('buscarProducto');
    if (searchInput) {
        searchInput.value = '';
    }
    document.getElementById('resultadosBusqueda').style.display = 'none';
}

function cambiarCantidad(productoId, cambio) {
    const productosLista = document.getElementById('productosSeleccionadosLista');
    if (!productosLista) return;
    
    const productoItem = Array.from(productosLista.children).find(item => 
        item.dataset.productoId == productoId
    );
    
    if (!productoItem) return;
    
    const cantidadInput = productoItem.querySelector('.cantidad-input');
    if (!cantidadInput) return;
    
    const nuevaCantidad = parseInt(cantidadInput.value) + cambio;
    
    if (nuevaCantidad < 1) {
        eliminarProducto(productoId);
        return;
    }
    
    cantidadInput.value = nuevaCantidad;
    actualizarTotal();
}

function eliminarProducto(productoId) {
    const productosLista = document.getElementById('productosSeleccionadosLista');
    if (!productosLista) return;
    
    const productoItem = Array.from(productosLista.children).find(item => 
        item.dataset.productoId == productoId
    );
    
    if (productoItem) {
        productoItem.remove();
    }
    
    // Si no quedan productos, mostrar mensaje
    if (productosLista.children.length === 0) {
        productosLista.innerHTML = '<p class="text-center" style="color: #6e6e73; font-size: 14px; padding: 20px;">No hay productos seleccionados</p>';
    }
    
    actualizarTotal();
}

function actualizarTotal() {
    const productosLista = document.getElementById('productosSeleccionadosLista');
    const totalSpan = document.getElementById('totalPedido');
    
    if (!productosLista || !totalSpan) return;
    
    let total = 0;
    
    Array.from(productosLista.children).forEach(item => {
        if (item.dataset.productoId) {
            const precio = parseFloat(item.dataset.precio) || 0;
            const cantidadInput = item.querySelector('.cantidad-input');
            const cantidad = cantidadInput ? parseInt(cantidadInput.value) : 1;
            total += precio * cantidad;
        }
    });
    
    totalSpan.textContent = total.toFixed(2);
}