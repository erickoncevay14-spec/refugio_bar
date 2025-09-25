// mozo.js - AUTENTICACIÓN CORREGIDA

// Variables globales
let pedidos = [];
let mesas = [];
let productos = [];
let pedidoActual = {};
const API_BASE = 'http://localhost:8080/api';

// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacionMozo();
    configurarNavegacion();
    cargarDatosMozo();
    configurarEventos();
});

function verificarAutenticacionMozo() {
    console.log('🛡️ INICIANDO VERIFICACIÓN DE MOZO...');
    
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
    
    // Verificar que sea MOZO
    const esMozo = user.rol === 'MOZO' || user.rol === 'Mozo' || user.rol?.toUpperCase() === 'MOZO';
    console.log('🎯 ¿Es Mozo?', esMozo);
    
    if (!esMozo) {
        console.error('❌ NO ES MOZO:', { rol: user.rol, esperado: 'MOZO' });
        alert(`Acceso no autorizado. Solo mozos pueden acceder. Su rol actual: ${user.rol}`);
        
        // Redirigir según su rol real
        switch(user.rol?.toUpperCase()) {
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
    
    // Si llegó hasta aquí, está autorizado
    console.log('✅ MOZO AUTORIZADO EXITOSAMENTE');
    
    // Actualizar UI
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
        const modoLocal = user.esLocal ? ' (Local)' : '';
        userInfoElement.textContent = `Mozo: ${user.nombre}${modoLocal}`;
        console.log('✅ UI actualizada');
    }
    
    console.log('🎉 VERIFICACIÓN COMPLETADA CON ÉXITO');
}

// ===============================
// FUNCIONES PLACEHOLDER (para que no de error)
// ===============================

async function cargarDatosMozo() {
    console.log('📊 Cargando datos del mozo...');
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
    console.log('👋 Cerrando sesión desde mozo...');
    
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
    const enviarBtn = document.getElementById("enviarPedido");
    const mesaSelect = document.getElementById("opciones");
    const cantidadInput = document.getElementById("cantidadPersonas");
    const productosLista = document.getElementById("productosSeleccionados");
  
    const listaPorRecoger = document.getElementById("pedidosPorRecoger");
    const listaEntregados = document.getElementById("pedidosEntregados");
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
    }
  
    function renderPedidos(filtro = "") {
      const pedidos = getPedidos();
      listaPorRecoger.innerHTML = "";
      listaEntregados.innerHTML = "";
    
      pedidos.forEach(p => {
        // Filtrar por mesa, id o nombre del cliente
        if (filtro && !`${p.mesa} ${p.id} ${p.nombreCliente}`.toLowerCase().includes(filtro.toLowerCase())) {
          return;
        }
    
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
    
        const left = document.createElement("div");
        left.innerHTML = `
          <strong>Mesa ${p.mesa}</strong> · ${p.productos?.join(", ") || "—"}
          <div class="small text-muted">
            Cliente: ${p.nombreCliente || "-"} · Personas: ${p.personas || "-"} · ID: ${p.id}
            ${p.estado === ESTADOS.ENTREGADO && p.actualizadoEn ? `<br>Entregado: ${new Date(p.actualizadoEn).toLocaleString()}` : ""}
          </div>
        `;
    
        const right = document.createElement("div");
        right.className = "d-flex gap-2 align-items-center";
    
        // Badge de estado
        const badge = document.createElement("span");
        badge.className = "badge rounded-pill";
        badge.textContent = p.estado;
        if (p.estado === ESTADOS.PENDIENTE) badge.classList.add("bg-secondary");
        if (p.estado === ESTADOS.PREPARANDO) badge.classList.add("bg-primary");
        if (p.estado === ESTADOS.LISTO) badge.classList.add("bg-warning", "text-dark");
        if (p.estado === ESTADOS.ENTREGADO) badge.classList.add("bg-success");
    
        right.appendChild(badge);
    
        // Botón "Recoger" solo si está listo
        if (p.estado === ESTADOS.LISTO) {
          const btn = document.createElement("button");
          btn.className = "btn btn-sm btn-outline-success";
          btn.textContent = "Recoger";
          btn.onclick = () => {
            const pedidos = getPedidos().map(item => {
              if (item.id === p.id) {
                return { ...item, estado: ESTADOS.ENTREGADO, actualizadoEn: Date.now() };
              }
              return item;
            });
            savePedidos(pedidos);
            renderPedidos(buscarInput?.value || "");
            alert(`Pedido de ${p.nombreCliente} recogido ✅`);
            window.dispatchEvent(new StorageEvent("storage", { key: "pedidos" }));
          };
          right.appendChild(btn);
        }
    
        li.appendChild(left);
        li.appendChild(right);
    
        // Separación por estado
        if (p.estado === ESTADOS.ENTREGADO) {
          listaEntregados.appendChild(li);
        } else {
          listaPorRecoger.appendChild(li);
        }
      });
    
      // Limitar entregados a los últimos 10
      const entregadosItems = listaEntregados.querySelectorAll("li");
      if (entregadosItems.length > 10) {
        for (let i = 0; i < entregadosItems.length - 10; i++) {
          entregadosItems[i].remove();
        }
      }
    }
    
  
    // 👉 Enviar pedido
    enviarBtn?.addEventListener("click", () => {
      const productos = [];
      productosLista?.querySelectorAll("li").forEach(li => {
        productos.push(li.textContent.replace("Eliminar", "").trim());
      });
  
      if (productos.length === 0) {
        productos.push("Producto genérico");
      }
  
      const pedido = {
        id: Date.now(),
        mesa: mesaSelect?.value || "1",
        nombreCliente: document.getElementById("nombre")?.value || "Cliente sin nombre",
        personas: cantidadInput?.value || 1,
        productos,
        estado: ESTADOS.PENDIENTE,
        creadoEn: Date.now()
      };
  
      const pedidos = getPedidos();
      pedidos.push(pedido);
      savePedidos(pedidos);
  
      alert(`Pedido de ${pedido.nombreCliente} enviado ✅`);
      if (productosLista) productosLista.innerHTML = "";
      renderPedidos(buscarInput?.value || "");
    });
  
    // 👉 Actualizar cuando bartender cambia algo
    window.addEventListener("storage", (e) => {
      if (e.key === "pedidos") {
        console.log("Pedidos actualizados (por bartender).");
        renderPedidos(buscarInput?.value || "");
      }
    });
  
    // 👉 Buscar en tiempo real
    buscarInput?.addEventListener("input", (e) => {
      renderPedidos(e.target.value);
    });
  
    renderPedidos();
  });
  
