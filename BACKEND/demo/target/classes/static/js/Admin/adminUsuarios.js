// adminUsuarios.js
// Lógica de gestión de usuarios en el panel de administración

let usuarios = [];

async function cargarUsuarios() {
    console.log('Cargando usuarios...');
    try {
        const response = await fetch(`${API_BASE}/usuarios`);
        if (response.ok) {
            usuarios = await response.json();
            window.usuarios = usuarios; // Actualiza la variable global
            mostrarUsuarios();
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error cargando usuarios:', error);
        mostrarError('Error al cargar usuarios');
        cargarUsuariosLocal();
    }
}

function cargarUsuariosLocal() {
    usuarios = [
        { id: 1, nombre: 'Admin', email: 'admin@refugiobar.com', rol: 'ADMIN', estado: 'ACTIVO' },
        { id: 2, nombre: 'Carlos Mesero', email: 'carlos@refugiobar.com', rol: 'EMPLEADO', estado: 'ACTIVO' },
        { id: 3, nombre: 'Ana Cliente', email: 'ana@email.com', rol: 'CLIENTE', estado: 'ACTIVO' }
    ];
    window.usuarios = usuarios; // Actualiza la variable global
    mostrarUsuarios();
}

function mostrarUsuarios() {
    const tbody = document.getElementById('tablaUsuariosAjax');
    if (!tbody) return;
    tbody.innerHTML = '';
    usuarios.forEach(usuario => {
        const apellido = usuario.apellido ? usuario.apellido : (usuario.apellido === null ? 'null' : '');
        const email = usuario.email ? usuario.email : (usuario.email === null ? 'null' : '');
        let rol = 'Sin rol';
        if (usuario.rol) {
            if (typeof usuario.rol === 'object' && usuario.rol.nombre) rol = usuario.rol.nombre;
            else if (typeof usuario.rol === 'string') rol = usuario.rol;
        }
        // Lista de roles disponibles
        const rolesDisponibles = ['cliente', 'admin', 'mozo', 'bartender'];
        let selectRol = `<div class='d-flex align-items-center gap-2'>`;
        selectRol += `<select class='form-select form-select-sm' id='selectRol_${usuario.id}'>`;
        rolesDisponibles.forEach(r => {
            selectRol += `<option value='${r}' ${rol.toLowerCase() === r ? 'selected' : ''}>${r.toUpperCase()}</option>`;
        });
        selectRol += `</select>`;
        selectRol += `<button class='btn btn-sm btn-outline-info' onclick='cambiarRolUsuario(${usuario.id}, document.getElementById("selectRol_${usuario.id}").value)'>Cambiar</button>`;
        selectRol += `</div>`;
        row = document.createElement('tr');
        row.innerHTML = `
            <td>${usuario.id}</td>
            <td>${usuario.usuario || ''}</td>
            <td>${usuario.nombre || ''}</td>
            <td>${apellido}</td>
            <td>${email}</td>
            <td>${selectRol}</td>
            <td><span class="badge ${usuario.activo ? 'bg-success' : 'bg-danger'}">${usuario.activo ? 'ACTIVO' : 'INACTIVO'}</span></td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editarUsuario(${usuario.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-${usuario.activo ? 'warning' : 'success'}" 
                            onclick="toggleEstadoUsuario(${usuario.id})" 
                            title="${usuario.activo ? 'Desactivar' : 'Activar'}">
                        <i class="bi bi-${usuario.activo ? 'pause' : 'play'}"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
    window.usuarios = usuarios; // Siempre actualiza la variable global después de mostrar
}

// Asegura que la variable global usuarios esté disponible para el filtro automático
window.usuarios = usuarios;

function getRolColor(rol) {
    const colores = {
        'ADMIN': 'bg-danger',
        'EMPLEADO': 'bg-warning',
        'CLIENTE': 'bg-info'
    };
    return colores[rol] || 'bg-secondary';
}

function editarUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;
    let modal = document.getElementById('modalEditarUsuario');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'modalEditarUsuario';
        modal.className = 'modal fade';
        modal.tabIndex = -1;
        modal.innerHTML = `
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Editar Usuario</h5>
                    <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                </div>
                <div class="modal-body">
                    <form id="formEditarUsuario">
                        <div class="mb-2">
                            <label class="form-label">Nombre</label>
                            <input type="text" class="form-control" id="editNombre">
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Apellido</label>
                            <input type="text" class="form-control" id="editApellido">
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Email</label>
                            <input type="email" class="form-control" id="editEmail">
                        </div>
                        <div class="mb-2">
                            <label class="form-label">Teléfono</label>
                            <input type="text" class="form-control" id="editTelefono">
                        </div>
                    </form>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
                    <button type="button" class="btn btn-primary" id="btnGuardarUsuario">Guardar</button>
                </div>
            </div>
        </div>`;
        document.body.appendChild(modal);
    }
    document.getElementById('editNombre').value = usuario.nombre || '';
    document.getElementById('editApellido').value = usuario.apellido || '';
    document.getElementById('editEmail').value = usuario.email || '';
    document.getElementById('editTelefono').value = usuario.telefono || '';
    const bsModal = new bootstrap.Modal(modal);
    bsModal.show();
    document.getElementById('btnGuardarUsuario').onclick = async function() {
        const nombre = document.getElementById('editNombre').value;
        const apellido = document.getElementById('editApellido').value;
        const email = document.getElementById('editEmail').value;
        const telefono = document.getElementById('editTelefono').value;
        // Mantener los campos obligatorios y no editables
        const usuarioEdit = {
            usuario: usuario.usuario,
            email,
            password: usuario.password || '',
            nombre,
            apellido,
            telefono,
            rol_id: usuario.rol && usuario.rol.id ? usuario.rol.id : null,
            activo: usuario.activo,
            fecha_registro: usuario.fecha_registro || null
        };
        try {
            const response = await fetch(`${API_BASE}/usuarios/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(usuarioEdit)
            });
            if (response.ok) {
                mostrarMensaje('Usuario actualizado correctamente', 'success');
                await cargarUsuarios();
                bsModal.hide();
            } else {
                mostrarError('No se pudo actualizar el usuario');
            }
        } catch (error) {
            mostrarError('Error al actualizar el usuario');
        }
    };
}

function toggleEstadoUsuario(id) {
    const usuario = usuarios.find(u => u.id === id);
    if (usuario) {
        usuario.estado = usuario.estado === 'ACTIVO' ? 'INACTIVO' : 'ACTIVO';
        mostrarUsuarios();
        mostrarMensaje(`Usuario ${usuario.nombre} ${usuario.estado.toLowerCase()}`, 'success');
    }
}

async function cambiarRolUsuario(id, nuevoRol) {
    try {
        const response = await fetch(`${API_BASE}/usuarios/${id}/rol`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ rol: nuevoRol.toLowerCase() })
        });
        if (response.ok) {
            mostrarMensaje(`Rol de usuario actualizado a ${nuevoRol}`, 'success');
            await cargarUsuarios(); // Recarga la lista desde el backend
        } else {
            mostrarError('No se pudo cambiar el rol del usuario');
        }
    } catch (error) {
        mostrarError('Error al cambiar el rol del usuario');
    }
}
