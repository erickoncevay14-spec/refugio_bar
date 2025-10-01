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
    console.log('INICIANDO VERIFICACIÓN DE MOZO...');
    
    let userString = localStorage.getItem('currentUser');
    console.log('localStorage principal:', userString);
    
    // Si no hay en localStorage, intentar recuperar de URL
    if (!userString) {
        console.log(' Intentando recuperar desde URL...');
        
        const urlParams = new URLSearchParams(window.location.search);
        const userFromUrl = urlParams.get('user');
        
        if (userFromUrl) {
            try {
                userString = decodeURIComponent(userFromUrl);
                console.log(' Datos recuperados desde URL');
                
                // Restaurar en localStorage para futuras visitas
                localStorage.setItem('currentUser', userString);
                
            } catch (error) {
                console.error(' Error al decodificar datos de URL:', error);
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
        console.log(' Intentando otros backups...');
        
        userString = localStorage.getItem('userBackup') || sessionStorage.getItem('currentUser');
        
        if (userString) {
            console.log(' Backup encontrado, restaurando...');
            localStorage.setItem('currentUser', userString);
        }
    }
    
    if (!userString) {
        console.error(' No se encontró sesión en ningún lugar');
        alert('Debe iniciar sesión primero');
        window.location.href = '/login';
        return;
    }
    
    let user;
    try {
        user = JSON.parse(userString);
        console.log(' Usuario parseado correctamente:', user);
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
    const totalPedido = document.getElementById("totalPedido");
    const categorias = ["BEBIDA", "COMIDA", "POSTRE", "ENTRADA", "SNACK"];
    const ESTADOS = {
      PENDIENTE: "pendiente",
      PREPARANDO: "preparando",
      LISTO: "listo",
      ENTREGADO: "entregado"
    };

    // Cargar mesas desde el backend y poblar el selector
    async function cargarMesas() {
      try {
        const res = await fetch(`${API_BASE}/mesas`);
        if (!res.ok) throw new Error("No se pudo conectar con el backend");
        const data = await res.json();
        mesaSelect.innerHTML = "";
        if (data.data && data.data.length > 0) {
          data.data.forEach(mesa => {
            const opt = document.createElement("option");
            opt.value = mesa.id; // Usar el id real
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
      } catch (err) {
        mesaSelect.innerHTML = "";
        const opt = document.createElement("option");
        opt.value = "";
        opt.textContent = "Error al cargar mesas";
        mesaSelect.appendChild(opt);
        mesaSelect.disabled = true;
        alert("No se pudo cargar la lista de mesas. Verifica el backend o la conexión.");
      }
    }

    // Cargar productos desde el backend y mostrar por categoría
    async function cargarProductos() {
      try {
        const res = await fetch(`${API_BASE}/productos`);
        const data = await res.json();
        productos = data.data || [];
        mostrarSelectorProductos();
      } catch (err) {
        productos = [];
        mostrarSelectorProductos();
      }
    }

    function mostrarSelectorProductos() {
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
      productosLista.parentElement.insertBefore(contenedor, productosLista);
    }

    cargarMesas();

    let seleccionados = [];
    function agregarProductoSeleccionado(producto) {
      seleccionados.push(producto);
      renderProductosSeleccionados();
    }
    function eliminarProductoSeleccionado(idx) {
      seleccionados.splice(idx, 1);
      renderProductosSeleccionados();
    }
    function renderProductosSeleccionados() {
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
      totalPedido.textContent = `Total: S/ ${total.toFixed(2)}`;
    }

    cargarProductos();
  
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
      if (seleccionados.length === 0) {
        alert("Selecciona al menos un producto");
        return;
      }
      // Obtener usuario actual
      let user = null;
      try {
        user = JSON.parse(localStorage.getItem('currentUser'));
      } catch {}
      const pedido = {
        usuarioId: user?.id || null,
        mesaId: mesaSelect?.value ? parseInt(mesaSelect.value) : null, // Usar el id real
        items: seleccionados.map(p => ({
          productoId: p.id,
          cantidad: 1 // Si tienes campo de cantidad, cámbialo aquí
        })),
        notas: document.getElementById("nombre")?.value || ""
      };
      fetch(`${API_BASE}/pedidos`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pedido)
      })
      .then(async res => {
        let resp;
        let text = null;
        try {
          resp = await res.clone().json();
        } catch {
          text = await res.text();
        }
        // Si la respuesta es un objeto con id y mesa, es éxito
        if (resp && resp.id) {
          alert(`Pedido enviado correctamente `);
          // Limpiar formulario y seleccionados
          seleccionados = [];
          renderProductosSeleccionados();
          document.getElementById("nombre").value = "";
          cantidadInput.value = 1;
          mesaSelect.selectedIndex = 0;
          renderPedidos(buscarInput?.value || "");
        } else if (resp && resp.message) {
          alert("Error al enviar pedido: " + resp.message);
        } else if (text) {
          // Si el backend devuelve un objeto JSON, mostrar éxito si tiene id
          try {
            const obj = JSON.parse(text);
            if (obj.id) {
              alert(`Pedido enviado correctamente`);
              seleccionados = [];
              renderProductosSeleccionados();
              document.getElementById("nombre").value = "";
              cantidadInput.value = 1;
              mesaSelect.selectedIndex = 0;
              renderPedidos(buscarInput?.value || "");
              return; // No mostrar ningún error ni mensaje adicional
            }
            if (obj.message) {
              alert("Error al enviar pedido: " + obj.message);
              return;
            }
            // Si no hay id ni message, no mostrar nada ni modal
            return;
          } catch {
            // Si el texto no es JSON válido, solo mostrar error real
            return;
          }
        } else {
          // Si no hay texto, no mostrar ningún error
          return;
        }
      })
      .catch(err => {
        alert("Error de red: " + err);
      });
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
// ===============================
// MOSTRAR MESAS EN VISTA MOZO
// ===============================
async function mostrarMesasMozo() {
  try {
    const res = await fetch(`${API_BASE}/mesas`);
    const data = await res.json();
    const contenedor = document.getElementById('vistaMesasLocal');
    if (!contenedor) return;
    contenedor.innerHTML = '';
    (data.data || []).forEach(mesa => {
      const card = document.createElement('div');
      card.className = 'col-md-3 col-sm-6 mb-3';
      card.innerHTML = `
        <div class="card mesa-card border-primary">
          <div class="card-body text-center">
            <h5 class="card-title">Mesa ${mesa.numero}</h5>
            <p class="card-text">
              <i class="bi bi-people"></i> ${mesa.capacidad} personas<br>
              <span class="badge bg-info">${mesa.estado}</span>
            </p>
            <button class="btn btn-success btn-sm agregar-pedido-btn" data-mesa-id="${mesa.id}">
              <i class="bi bi-plus-circle"></i> Agregar Pedido
            </button>
          </div>
        </div>
      `;
      contenedor.appendChild(card);
    });
    // Eventos para los botones de agregar pedido
    document.querySelectorAll('.agregar-pedido-btn').forEach(btn => {
      btn.addEventListener('click', function() {
        const mesaId = this.getAttribute('data-mesa-id');
        seleccionarMesaParaPedido(mesaId);
      });
    });
  } catch (err) {
    console.error('Error mostrando mesas en mozo:', err);
  }
}

function seleccionarMesaParaPedido(mesaId) {
  // Selecciona la mesa en el select y muestra el formulario
  const mesaSelect = document.getElementById('opciones');
  if (mesaSelect) {
    mesaSelect.value = mesaId;
    mesaSelect.dispatchEvent(new Event('change'));
  }
  // Mostrar el formulario de pedido si está oculto
  const pedidoSection = document.querySelector('.pedido-section');
  if (pedidoSection) {
    pedidoSection.scrollIntoView({ behavior: 'smooth' });
    pedidoSection.classList.remove('d-none');
  }
}

// Llamar al cargar la página
window.addEventListener('DOMContentLoaded', mostrarMesasMozo);
// Refresca las mesas cada 10 segundos para mostrar el estado actualizado
setInterval(mostrarMesasMozo, 10000);
// ===============================
// MÉTODO DE PAGO EN FLUJO MOZO
// ===============================
let metodoPagoSeleccionado = null;

function configurarMetodoPagoMozo() {
  const btnEfectivo = document.getElementById('pagoEfectivo');
  const btnTarjeta = document.getElementById('pagoTarjeta');
  const btnYape = document.getElementById('pagoYape');
  [btnEfectivo, btnTarjeta, btnYape].forEach(btn => {
    if (btn) {
      btn.addEventListener('click', function() {
        metodoPagoSeleccionado = this.id.replace('pago', '').toLowerCase();
        [btnEfectivo, btnTarjeta, btnYape].forEach(b => b.classList.remove('active'));
        this.classList.add('active');
      });
    }
  });
}

// Llamar al mostrar la sección de confirmación
window.addEventListener('DOMContentLoaded', configurarMetodoPagoMozo);

// Al confirmar y enviar pedido, incluir el método de pago
const btnConfirmarEnviar = document.getElementById('btnConfirmarEnviar');
if (btnConfirmarEnviar) {
  btnConfirmarEnviar.addEventListener('click', function() {
    if (!metodoPagoSeleccionado) {
      alert('Selecciona un método de pago');
      return;
    }
    // Aquí envía el pedido al backend incluyendo el método de pago
    // ejemplo:
    // fetch('/api/pedidos', { method: 'POST', body: JSON.stringify({ ...pedido, metodoPago: metodoPagoSeleccionado }) })
  });
}

