// adminMesas.js
// Gestión de mesas con WebSocket - Estados estandarizados según EstadoMesaRequest

let mesas = [];
let stompClient = null;

function conectarWebSocketMesas() {
    const socket = new SockJS('http://localhost:8080/ws');
    stompClient = Stomp.over(socket);
    
    stompClient.connect({}, function(frame) {
        console.log('WebSocket Admin conectado:', frame);
        
        // Suscribirse a actualizaciones de mesas
        stompClient.subscribe('/topic/mesas/actualizado', function(message) {
            const mesaActualizada = JSON.parse(message.body);
            console.log('Mesa actualizada:', mesaActualizada);
            
            // Actualizar el array
            const index = mesas.findIndex(m => m.id === mesaActualizada.id);
            if (index !== -1) {
                mesas[index] = mesaActualizada;
            } else {
                mesas.push(mesaActualizada);
            }
            
            mostrarMesas();
            mostrarNotificacionMesa(mesaActualizada);
        });
        
        // Suscribirse a eliminaciones
        stompClient.subscribe('/topic/mesas/eliminada', function(message) {
            const data = JSON.parse(message.body);
            mesas = mesas.filter(m => m.id !== data.id);
            mostrarMesas();
        });
    }, function(error) {
        console.error('Error WebSocket:', error);
        setTimeout(conectarWebSocketMesas, 5000);
    });
}

function mostrarNotificacionMesa(mesa) {
    const alerta = document.createElement('div');
    alerta.className = 'alert alert-info alert-dismissible fade show position-fixed';
    alerta.style.cssText = 'top: 80px; right: 20px; z-index: 9999; min-width: 250px;';
    alerta.innerHTML = `
        <strong>Mesa ${mesa.numero} actualizada</strong><br>
        Nuevo estado: <span class="badge ${getMesaEstadoColor(mesa.estado)}">${mesa.estado}</span>
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    document.body.appendChild(alerta);
    setTimeout(() => alerta.remove(), 3000);
}

// ===============================
// CARGAR MESAS
// ===============================
async function cargarMesas() {
    console.log('Cargando mesas...');
    try {
        const response = await fetch(`${API_BASE}/mesas`);
        if (response.ok) {
            const result = await response.json();
            mesas = result.data || [];
            mostrarMesas();
            
            // Conectar WebSocket después de cargar
            if (!stompClient || !stompClient.connected) {
                conectarWebSocketMesas();
            }
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error cargando mesas:', error);
        mostrarError('Error al cargar mesas');
    }
}

// ===============================
// MOSTRAR MESAS
// ===============================
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
                    
                    <!-- Botones de cambio de estado -->
                    <div class="btn-group-vertical w-100 gap-1 mb-2">
                        ${mesa.estado !== 'LIBRE' ? 
                            `<button class="btn btn-sm btn-success" onclick="cambiarEstadoMesa(${mesa.id}, 'LIBRE')">
                                <i class="bi bi-check-circle"></i> Libre
                            </button>` : ''}
                        
                        ${mesa.estado !== 'OCUPADA' ? 
                            `<button class="btn btn-sm btn-danger" onclick="cambiarEstadoMesa(${mesa.id}, 'OCUPADA')">
                                <i class="bi bi-person-fill"></i> Ocupada
                            </button>` : ''}
                        
                        ${mesa.estado !== 'RESERVADA' ? 
                            `<button class="btn btn-sm btn-warning" onclick="cambiarEstadoMesa(${mesa.id}, 'RESERVADA')">
                                <i class="bi bi-calendar-check"></i> Reservada
                            </button>` : ''}
                        
                        ${mesa.estado !== 'LIMPIEZA' ? 
                            `<button class="btn btn-sm btn-info" onclick="cambiarEstadoMesa(${mesa.id}, 'LIMPIEZA')">
                                <i class="bi bi-droplet"></i> Limpieza
                            </button>` : ''}
                    </div>
                    
                    <div class="btn-group btn-group-sm w-100">
                        <button class="btn btn-outline-secondary" onclick="editarMesa(${mesa.id})" title="Editar">
                            <i class="bi bi-pencil"></i>
                        </button>
                        <button class="btn btn-outline-info" onclick="verDetallesMesa(${mesa.id})" title="Detalles">
                            <i class="bi bi-info-circle"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(mesaCard);
    });
    
    // Botón para agregar mesa
    if (mesas.length < 10) {
        const addCard = document.createElement('div');
        addCard.className = 'col-md-3 col-sm-6 mb-3';
        addCard.innerHTML = `
            <div class="card mesa-card border-primary">
                <div class="card-body text-center d-flex flex-column justify-content-center" style="min-height: 200px;">
                    <i class="bi bi-plus-circle display-1 text-primary mb-3"></i>
                    <button class="btn btn-primary" onclick="agregarMesa()">
                        Nueva Mesa
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(addCard);
    }
}

// ===============================
// CAMBIAR ESTADO DE MESA
// ===============================
async function cambiarEstadoMesa(id, nuevoEstado) {
    try {
        const response = await fetch(`${API_BASE}/mesas/${id}/estado`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ estado: nuevoEstado })
        });
        
        if (response.ok) {
            // No mostrar alerta, WebSocket se encarga
            console.log(`Mesa ${id} actualizada a: ${nuevoEstado}`);
        } else {
            mostrarError('No se pudo cambiar el estado de la mesa');
        }
    } catch (error) {
        console.error('Error:', error);
        mostrarError('Error al cambiar el estado de la mesa');
    }
}

// ===============================
// MODAL DE MESA
// ===============================
function mostrarModalMesa(mesa = null) {
    let modal = document.getElementById('modalMesa');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalMesa';
        modal.className = 'modal fade';
        modal.tabIndex = -1;
        modal.innerHTML = `
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">${mesa ? 'Editar Mesa' : 'Agregar Mesa'}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <form id="formMesa">
                            <div class="mb-3">
                                <label class="form-label">Número</label>
                                <input type="number" class="form-control" id="mesaNumero" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Capacidad</label>
                                <input type="number" class="form-control" id="mesaCapacidad" required>
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Ubicación</label>
                                <input type="text" class="form-control" id="mesaUbicacion">
                            </div>
                            <div class="mb-3">
                                <label class="form-label">Estado</label>
                                <select class="form-select" id="mesaEstado">
                                    <option value="LIBRE">LIBRE</option>
                                    <option value="OCUPADA">OCUPADA</option>
                                    <option value="RESERVADA">RESERVADA</option>
                                    <option value="LIMPIEZA">LIMPIEZA</option>
                                </select>
                            </div>
                        </form>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                        <button type="button" class="btn btn-primary" id="btnGuardarMesa">Guardar</button>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    // Rellenar datos
    document.getElementById('mesaNumero').value = mesa ? mesa.numero : '';
    document.getElementById('mesaCapacidad').value = mesa ? mesa.capacidad : '';
    document.getElementById('mesaUbicacion').value = mesa ? (mesa.ubicacion || '') : '';
    document.getElementById('mesaEstado').value = mesa ? mesa.estado : 'LIBRE';
    
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    
    document.getElementById('btnGuardarMesa').onclick = async function() {
        const numero = parseInt(document.getElementById('mesaNumero').value);
        const capacidad = parseInt(document.getElementById('mesaCapacidad').value);
        const ubicacion = document.getElementById('mesaUbicacion').value;
        const estado = document.getElementById('mesaEstado').value;
        
        const mesaData = { numero, capacidad, ubicacion, estado };
        
        if (mesa) {
            await actualizarMesa(mesa.id, mesaData);
        } else {
            await crearMesa(mesaData);
        }
        bsModal.hide();
    };
}

// ===============================
// CRUD MESAS
// ===============================
async function agregarMesa() {
    mostrarModalMesa();
}

async function crearMesa(mesaData) {
    try {
        const response = await fetch(`${API_BASE}/mesas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mesaData)
        });
        
        if (response.ok) {
            mostrarMensaje('Mesa creada correctamente', 'success');
            // WebSocket actualizará automáticamente
        } else {
            mostrarError('No se pudo crear la mesa');
        }
    } catch (error) {
        mostrarError('Error al crear la mesa');
    }
}

function editarMesa(id) {
    const mesa = mesas.find(m => m.id === id);
    if (!mesa) return;
    mostrarModalMesa(mesa);
}

async function actualizarMesa(id, cambios) {
    const mesa = mesas.find(m => m.id === id);
    if (!mesa) return;
    
    const mesaActualizada = { ...mesa, ...cambios };
    
    try {
        const response = await fetch(`${API_BASE}/mesas/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mesaActualizada)
        });
        
        if (response.ok) {
            mostrarMensaje('Mesa actualizada correctamente', 'success');
            // WebSocket actualizará automáticamente
        } else {
            mostrarError('No se pudo actualizar la mesa');
        }
    } catch (error) {
        mostrarError('Error al actualizar la mesa');
    }
}

function verDetallesMesa(id) {
    const mesa = mesas.find(m => m.id === id);
    if (mesa) {
        alert(`Mesa ${mesa.numero}\nCapacidad: ${mesa.capacidad} personas\nEstado: ${mesa.estado}\nUbicación: ${mesa.ubicacion || 'No especificada'}`);
    }
}

// ===============================
// UTILIDADES - Estados estandarizados
// ===============================
function getMesaColorClass(estado) {
    const clases = {
        'LIBRE': 'border-success',
        'OCUPADA': 'border-danger',
        'RESERVADA': 'border-warning',
        'LIMPIEZA': 'border-info'
    };
    return clases[estado] || 'border-secondary';
}

function getMesaEstadoColor(estado) {
    const colores = {
        'LIBRE': 'bg-success',
        'OCUPADA': 'bg-danger',
        'RESERVADA': 'bg-warning text-dark',
        'LIMPIEZA': 'bg-info'
    };
    return colores[estado] || 'bg-secondary';
}

// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('mesas')) {
        cargarMesas();
    }
});