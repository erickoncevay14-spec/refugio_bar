// bartender.js - AUTENTICACIÓN CORREGIDA

// Variables globales
let pedidosBebidas = [];
let inventarioBebidas = [];
let recetas = [];
let estadisticasBartender = {};
const API_BASE = 'http://localhost:8080/api';

// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacionBartender();
    configurarNavegacion();
    cargarDatosBartender();
    configurarEventos();
});

function verificarAutenticacionBartender() {
    console.log('🛡️ INICIANDO VERIFICACIÓN DE BARTENDER...');
    
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
    
    // LIMPIAR URL inmediatamente
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
  
 