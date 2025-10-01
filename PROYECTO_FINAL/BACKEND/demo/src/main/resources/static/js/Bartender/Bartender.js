// bartender.js
// Lógica para mostrar y gestionar pedidos desde el backend en tiempo real

document.addEventListener('DOMContentLoaded', () => {
  cargarPedidos();
  setInterval(cargarPedidos, 5000); // Actualización automática cada 5 segundos
});

async function cargarPedidos() {
  try {
    const response = await fetch('/api/pedidos');
    const pedidos = await response.json();
    renderizarPedidos(pedidos);
  } catch (error) {
    console.error('Error al cargar pedidos:', error);
  }
}

function renderizarPedidos(pedidos) {
  document.getElementById('listaPendientes').innerHTML = '';
  document.getElementById('listaPreparacion').innerHTML = '';
  document.getElementById('listaEntregados').innerHTML = '';

  pedidos.forEach(pedido => {
    const item = crearItemPedido(pedido);
    if (pedido.estado === 'PENDIENTE') {
      document.getElementById('listaPendientes').appendChild(item);
    } else if (pedido.estado === 'PREPARACION' || pedido.estado === 'LISTO') {
      document.getElementById('listaPreparacion').appendChild(item);
    } else if (pedido.estado === 'ENTREGADO') {
      document.getElementById('listaEntregados').appendChild(item);
    }
  });
}

function crearItemPedido(pedido) {
  const li = document.createElement('li');
  li.className = 'list-group-item';
  li.innerHTML = `
    <div>
      <span class="fw-bold">#${pedido.id}</span> - ${pedido.productoNombre} <span class="badge bg-secondary ms-2">${pedido.cantidad}</span>
      <span class="badge bg-info ms-2">${pedido.estado}</span>
    </div>
    <div>
      ${botonesEstado(pedido)}
    </div>
  `;
  return li;
}

function botonesEstado(pedido) {
  let html = '';
  if (pedido.estado === 'PENDIENTE') {
    html += `<button class="btn btn-preparar" onclick="cambiarEstado(${pedido.id}, 'PREPARACION')">Preparar</button>`;
  } else if (pedido.estado === 'PREPARACION') {
    html += `<button class="btn btn-listo" onclick="cambiarEstado(${pedido.id}, 'LISTO')">Listo</button>`;
  } else if (pedido.estado === 'LISTO') {
    html += `<button class="btn btn-entregado" onclick="cambiarEstado(${pedido.id}, 'ENTREGADO')">Entregar</button>`;
  }
  return html;
}

async function cambiarEstado(id, nuevoEstado) {
  try {
    await fetch(`/api/pedidos/${id}/estado`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    });
    cargarPedidos();
  } catch (error) {
    console.error('Error al cambiar estado:', error);
  }
}

function cerrarSesion() {
  window.location.href = '/login';
}
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
    
    // Verificar que sea BARTENDER
    const esBartender = user.rol === 'BARTENDER' || user.rol === 'Bartender' || user.rol?.toUpperCase() === 'BARTENDER';
    console.log('🎯 ¿Es Bartender?', esBartender);
    
    if (!esBartender) {
        console.error('❌ NO ES BARTENDER:', { rol: user.rol, esperado: 'BARTENDER' });
        alert(`Acceso no autorizado. Solo bartenders pueden acceder. Su rol actual: ${user.rol}`);
        
        // Redirigir según su rol real
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
    
    // Si llegó hasta aquí, está autorizado
    console.log('✅ BARTENDER AUTORIZADO EXITOSAMENTE');
    
    // Actualizar UI
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
        const modoLocal = user.esLocal ? ' (Local)' : '';
        userInfoElement.textContent = `Bartender: ${user.nombre}${modoLocal}`;
        console.log('✅ UI actualizada');
    }
    
    console.log('🎉 VERIFICACIÓN COMPLETADA CON ÉXITO');
}

// ===============================
// FUNCIONES PLACEHOLDER (para que no de error)
// ===============================

async function cargarDatosBartender() {
    console.log('🍸 Cargando datos del bartender...');
    // Implementar después
}

function configurarNavegacion() {
    console.log('🧭 Configurando navegación...');
    // Implementar después
}

function configurarEventos() {
    console.log('⚡ Configurando eventos...');
    // Implementar después
}

// Función para cerrar sesión
function cerrarSesion() {
    console.log('👋 Cerrando sesión desde bartender...');
    
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        // Limpiar todos los storages
        localStorage.clear();
        sessionStorage.clear();
        
        console.log('🧹 Sesión limpiada');
        
        // Redirigir al login
        window.location.href = '/login';
    }
}
document.addEventListener("DOMContentLoaded", () => {
    const listaPendientes = document.getElementById("listaPendientes");
    const listaPreparacion = document.getElementById("listaPreparacion");
    const listaEntregados = document.getElementById("listaEntregados");
    const buscarInput = document.getElementById("buscarPedido");
  
    const ESTADOS = {
      PENDIENTE: "pendiente",
      PREPARANDO: "preparando",
      LISTO: "listo",
      ENTREGADO: "entregado"
    };
  
    function getPedidos() {
      return JSON.parse(localStorage.getItem("pedidos") || "[]");
    }
    function savePedidos(pedidos) {
      localStorage.setItem("pedidos", JSON.stringify(pedidos));
      console.log("[bartender] guardado pedidos:", pedidos);
    }
  
    function actualizarEstado(id, nuevoEstado) {
      const pedidos = getPedidos().map(p => {
        if (String(p.id) === String(id)) return { ...p, estado: nuevoEstado, actualizadoEn: Date.now() };
        return p;
      });
      savePedidos(pedidos);
      renderPedidos(buscarInput.value);
    }
  
    function crearItem(pedido) {
      const li = document.createElement("li");
      li.className = "list-group-item d-flex justify-content-between align-items-center";
      li.dataset.id = pedido.id;
  
      const left = document.createElement("div");
      left.innerHTML = `<strong>Mesa ${pedido.mesa}</strong> · ${pedido.productos?.join(", ") || "—"} 
                        <div class="small text-muted">Personas: ${pedido.personas || "-"} · ID:${pedido.id}</div>`;
  
      const right = document.createElement("div");
      right.className = "d-flex gap-2 align-items-center";
  
      const badge = document.createElement("span");
      badge.className = "badge rounded-pill";
      badge.textContent = pedido.estado;
  
      if (pedido.estado === ESTADOS.PENDIENTE) badge.classList.add("bg-secondary");
      if (pedido.estado === ESTADOS.PREPARANDO) badge.classList.add("bg-primary");
      if (pedido.estado === ESTADOS.LISTO) badge.classList.add("bg-warning", "text-dark");
      if (pedido.estado === ESTADOS.ENTREGADO) badge.classList.add("bg-success");
  
      right.appendChild(badge);
  
      if (pedido.estado === ESTADOS.PENDIENTE) {
        const btn = document.createElement("button");
        btn.className = "btn btn-sm btn-outline-primary";
        btn.textContent = "Preparar";
        btn.onclick = () => actualizarEstado(pedido.id, ESTADOS.PREPARANDO);
        right.appendChild(btn);
      } else if (pedido.estado === ESTADOS.PREPARANDO) {
        const btn = document.createElement("button");
        btn.className = "btn btn-sm btn-outline-warning";
        btn.textContent = "Marcar Listo";
        btn.onclick = () => actualizarEstado(pedido.id, ESTADOS.LISTO);
        right.appendChild(btn);
      }
  
      li.appendChild(left);
      li.appendChild(right);
      return li;
    }
  
    function renderPedidos(filtro = "") {
      let pedidos = getPedidos();
  
      // 🔎 Aplicar filtro por mesa o ID
      if (filtro.trim() !== "") {
        const lower = filtro.toLowerCase();
        pedidos = pedidos.filter(p =>
          String(p.id).includes(lower) ||
          String(p.mesa).toLowerCase().includes(lower)
        );
      }
  
      // 👉 Solo mostrar los últimos 10 pedidos
      pedidos = pedidos.slice(-10);
  
      if (!listaPendientes || !listaPreparacion || !listaEntregados) {
        console.warn("[bartender] faltan elementos en el DOM para renderizar las listas.");
        return;
      }
      listaPendientes.innerHTML = "";
      listaPreparacion.innerHTML = "";
      listaEntregados.innerHTML = "";
  
      pedidos.forEach(p => {
        const li = crearItem(p);
        if (p.estado === ESTADOS.PENDIENTE) listaPendientes.appendChild(li);
        if (p.estado === ESTADOS.PREPARANDO || p.estado === ESTADOS.LISTO) listaPreparacion.appendChild(li);
        if (p.estado === ESTADOS.ENTREGADO) listaEntregados.appendChild(li);
      });
    }
  
    // 🔄 Actualizar en tiempo real cuando cambia localStorage
    window.addEventListener("storage", (e) => {
      if (e.key === "pedidos") {
        console.log("[bartender] storage recibido, re-renderizando");
        renderPedidos(buscarInput.value);
      }
    });
  
    // 🔎 Escuchar filtro
    buscarInput.addEventListener("input", e => {
      renderPedidos(e.target.value);
    });
  
    renderPedidos();
  });
  
 