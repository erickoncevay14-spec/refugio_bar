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
    
    stompClient.connect({}, function(frame) {
        console.log('WebSocket conectado - Mozo:', frame);
        
        // Suscribirse a pedidos listos para recoger
        stompClient.subscribe('/topic/pedidos/listos', function(message) {
            const pedidoListo = JSON.parse(message.body);
            console.log('Pedido listo para recoger:', pedidoListo);
            mostrarNotificacionPedidoListo(pedidoListo);
            cargarPedidos();
        });
        
        // Suscribirse a actualizaciones generales de pedidos
        stompClient.subscribe('/topic/pedidos/actualizado', function(message) {
            const pedidoActualizado = JSON.parse(message.body);
            console.log('Pedido actualizado:', pedidoActualizado);
            cargarPedidos();
        });

        // NUEVO: Suscribirse a cambios de mesas
        stompClient.subscribe('/topic/mesas/actualizado', function(message) {
            const mesaActualizada = JSON.parse(message.body);
            console.log('Mesa actualizada:', mesaActualizada);

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
        <strong>✅ Pedido Listo</strong><br>
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
    console.log('Verificando autenticación Mozo...');
    
    // Limpiar URL
    if (window.location.search) {
        window.history.replaceState({}, document.title, window.location.pathname);
        console.log('URL limpiada');
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
    
    if (!user.rol || !user.nombre) {
        alert('Datos de sesión incompletos. Debe iniciar sesión nuevamente');
        window.location.href = '/login';
        return;
    }
    
    // Aceptamos tanto 'mozo' (minúsculas) como 'MOZO' (mayúsculas)
    // según la información de la base de datos
    console.log('Rol del usuario actual:', user.rol);
    const rolUpperCase = user.rol?.toUpperCase() || '';
    const esMozo = rolUpperCase === 'MOZO' || rolUpperCase === 'MESERO' || 
                 user.rol === 'mozo' || user.rol === 'Mozo';
    
    if (!esMozo) {
        alert(`Acceso no autorizado. Solo mozos pueden acceder. Su rol actual: ${user.rol}`);
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
    
    console.log('Usuario mozo verificado correctamente');
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
    try {
        await fetch(`${API_BASE}/pedidos/${pedidoId}/estado?estado=ENTREGADO`, {
            method: 'PUT'
        });
        // El WebSocket actualizará automáticamente
    } catch (error) {
        console.error('Error al marcar como entregado:', error);
        alert('Error al actualizar el pedido');
    }
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

// ===============================
// CONFIGURAR EVENTOS
// ===============================
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
    if (seleccionados.length === 0) {
        alert("Selecciona al menos un producto");
        return;
    }
    
    const mesaSelect = document.getElementById("opciones");
    let user = null;
    
    try {
        user = JSON.parse(localStorage.getItem('currentUser'));
    } catch {}
    
    const itemsGrouped = seleccionados.reduce((acc, p) => {
        const item = acc.find(i => i.productoId === p.id);
        if (item) {
            item.cantidad++;
        } else {
            acc.push({
                productoId: p.id,
                cantidad: 1
            });
        }
        return acc;
    }, []);

    const pedido = {
        usuarioId: user?.id || null,
        mesaId: mesaSelect?.value ? parseInt(mesaSelect.value) : null,
        items: itemsGrouped, // Usar items agrupados
        notas: document.getElementById("nombre")?.value || ""
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
                seleccionados = [];
                renderProductosSeleccionados();
                document.getElementById("nombre").value = "";
                if (mesaSelect) mesaSelect.selectedIndex = 0;
            }
        } else {
             const errorData = await res.json();
             throw new Error(errorData.message || 'Error desconocido al enviar el pedido');
        }
    } catch (err) {
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
        const card = document.createElement('div');
        card.className = 'col-md-3 col-sm-6 mb-3';
        
        // Color del badge según estado
        let badgeClass = 'bg-success';
        let cardBorder = 'border-success';
        if (mesa.estado === 'OCUPADA') {
            badgeClass = 'bg-danger';
            cardBorder = 'border-danger';
        }
        if (mesa.estado === 'RESERVADA') {
            badgeClass = 'bg-warning text-dark';
            cardBorder = 'border-warning';
        }
        if (mesa.estado === 'LIMPIEZA') {
            badgeClass = 'bg-info';
            cardBorder = 'border-info';
        }
        
        card.innerHTML = `
            <div class="card mesa-card ${cardBorder}">
                <div class="card-body text-center">
                    <h5 class="card-title">Mesa ${mesa.numero}</h5>
                    <p class="card-text">
                        <i class="bi bi-people"></i> ${mesa.capacidad} personas<br>
                        <span class="badge ${badgeClass}">${mesa.estado}</span>
                    </p>
                    
                    <div class="btn-group-vertical w-100 gap-1">
                        ${mesa.estado !== 'LIBRE' ? 
                            `<button class="btn btn-sm btn-success" onclick="cambiarEstadoMesa(${mesa.id}, 'LIBRE')">
                                <i class="bi bi-check-circle"></i> Libre
                            </button>` : ''}
                            
                        ${mesa.estado !== 'OCUPADA' ? 
                            `<button class="btn btn-sm btn-danger" onclick="cambiarEstadoMesa(${mesa.id}, 'OCUPADA')">
                                <i class="bi bi-person-fill"></i> Ocupar
                            </button>` : ''}
                            
                        ${mesa.estado !== 'RESERVADA' ? 
                            `<button class="btn btn-sm btn-warning text-dark" onclick="cambiarEstadoMesa(${mesa.id}, 'RESERVADA')">
                                <i class="bi bi-calendar-check"></i> Reservar
                            </button>` : ''}
                            
                        ${mesa.estado !== 'LIMPIEZA' ? 
                            `<button class="btn btn-sm btn-info" onclick="cambiarEstadoMesa(${mesa.id}, 'LIMPIEZA')">
                                <i class="bi bi-droplet"></i> Limpieza
                            </button>` : ''}
                            
                        <button class="btn btn-sm btn-outline-primary mt-2" onclick="seleccionarMesaParaPedido(${mesa.id})">
                            <i class="bi bi-plus-circle"></i> Agregar Pedido
                        </button>
                    </div>
                </div>
            </div>
        `;
        contenedor.appendChild(card);
    });
}

// ===============================
// CAMBIAR ESTADO DE MESA (NUEVA FUNCIÓN)
// ===============================
async function cambiarEstadoMesa(mesaId, nuevoEstado) {
    try {
        const response = await fetch(`${API_BASE}/mesas/${mesaId}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        
        if (response.ok) {
            // El WebSocket actualizará automáticamente
            console.log(`Mesa ${mesaId} actualizada a: ${nuevoEstado}`);
        } else {
            alert('Error al actualizar estado de la mesa');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('Error de conexión al actualizar mesa');
    }
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