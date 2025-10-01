// adminMesas.js
// Lógica de gestión de mesas en el panel de administración

let mesas = [];

async function cargarMesas() {
    console.log(' Cargando mesas...');
    try {
        const response = await fetch(`${API_BASE}/mesas`);
        if (response.ok) {
            const result = await response.json();
            mesas = result.data || [];
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
                        <button class="btn btn-outline-success" onclick="editarMesa(${mesa.id})" title="Editar mesa">
                            <i class="bi bi-pencil"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        grid.appendChild(mesaCard);
    });
    // Botón para agregar mesa si hay menos de 10
    if (mesas.length < 10) {
        const addCard = document.createElement('div');
        addCard.className = 'col-md-3 col-sm-6 mb-3';
        addCard.innerHTML = `
            <div class="card mesa-card border-primary">
                <div class="card-body text-center">
                    <h5 class="card-title">Agregar Mesa</h5>
                    <button class="btn btn-success" onclick="agregarMesa()">
                        <i class="bi bi-plus-circle"></i> Nueva Mesa
                    </button>
                </div>
            </div>
        `;
        grid.appendChild(addCard);
    }
}

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
                        <div class="mb-2">
                            <label class="form-label">Número</label>
                            <input type="number" class="form-control" id="mesaNumero">
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Capacidad</label>
                            <input type="number" class="form-control" id="mesaCapacidad">
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Ubicación</label>
                            <input type="text" class="form-control" id="mesaUbicacion">
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Estado</label>
                            <select class="form-select" id="mesaEstado">
                                <option value="DISPONIBLE">DISPONIBLE</option>
                                <option value="OCUPADA">OCUPADA</option>
                                <option value="RESERVADA">RESERVADA</option>
                                <option value="MANTENIMIENTO">MANTENIMIENTO</option>
                            </select>
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btnGuardarMesa">Guardar</button>
                </div>
            </div>
        </div>`;
        document.body.appendChild(modal);
    }
    // Rellenar datos si es edición
    document.getElementById('mesaNumero').value = mesa ? mesa.numero : '';
    document.getElementById('mesaCapacidad').value = mesa ? mesa.capacidad : '';
    document.getElementById('mesaUbicacion').value = mesa ? mesa.ubicacion || '' : '';
    document.getElementById('mesaEstado').value = mesa ? mesa.estado : 'DISPONIBLE';
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
            await agregarMesa(mesaData);
        }
        bsModal.hide();
    };
}

async function agregarMesa(mesaData = null) {
    // Si no se pasa mesaData, mostrar el modal
    if (!mesaData) {
        mostrarModalMesa();
        return;
    }
    try {
        const response = await fetch(`${API_BASE}/mesas`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(mesaData)
        });
        if (response.ok) {
            mostrarMensaje('Mesa agregada correctamente', 'success');
            await cargarMesas();
        } else {
            mostrarError('No se pudo agregar la mesa');
        }
    } catch (error) {
        mostrarError('Error al agregar la mesa');
    }
}

async function cambiarEstadoMesa(id) {
    const mesa = mesas.find(m => m.id === id);
    if (mesa) {
        const estados = ['DISPONIBLE', 'OCUPADA', 'RESERVADA', 'MANTENIMIENTO'];
        const estadoActualIndex = estados.indexOf(mesa.estado);
        const nuevoEstado = estados[(estadoActualIndex + 1) % estados.length];
        try {
            const response = await fetch(`${API_BASE}/mesas/${id}/estado`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ estado: nuevoEstado })
            });
            if (response.ok) {
                mostrarMensaje(`Mesa ${mesa.numero} cambiada a ${nuevoEstado}`, 'success');
                // Actualiza solo la mesa cambiada en el array y DOM
                mesa.estado = nuevoEstado;
                mostrarMesas();
            } else {
                mostrarError('No se pudo cambiar el estado de la mesa');
            }
        } catch (error) {
            mostrarError('Error al cambiar el estado de la mesa');
        }
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
            await cargarMesas();
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
        alert(`Mesa ${mesa.numero}\nCapacidad: ${mesa.capacidad} personas\nEstado: ${mesa.estado}`);
    }
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

document.addEventListener('DOMContentLoaded', function() {
    // Solo cargar mesas si la sección está visible
    if (document.getElementById('mesas')) {
        cargarMesas();
    }
});
