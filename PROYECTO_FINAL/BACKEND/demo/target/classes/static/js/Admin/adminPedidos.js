
let pedidos = [];

async function cargarPedidos() {
    
    try {
        // Usar apiGet en lugar de fetch para incluir el token JWT automáticamente
        const response = await apiGet(`${API_BASE}/pedidos`);
        if (response && response.ok) {
            pedidos = await response.json();
            mostrarPedidos();
        } else {
            throw new Error(`Error ${response?.status}: ${response?.statusText}`);
        }
    } catch (error) {
        console.error('Error cargando pedidos:', error);
        mostrarError('Error al cargar pedidos');
    }
}

function mostrarPedidos() {
    const tbody = document.getElementById('tablaPedidos');
    if (!tbody) return;
    tbody.innerHTML = '';
    pedidos.forEach(pedido => {
        const row = document.createElement('tr');
        // Cliente
        let nombreCliente = '-';
        if (pedido.usuario) {
            if (pedido.usuario.nombre) nombreCliente = pedido.usuario.nombre;
            else if (pedido.usuario.usuario) nombreCliente = pedido.usuario.usuario;
            else if (pedido.usuario.email) nombreCliente = pedido.usuario.email;
        }
        // Mesa
        let numeroMesa = '-';
        if (pedido.mesa) {
            if (pedido.mesa.numero) numeroMesa = pedido.mesa.numero;
        }
        // Total
        let total = '-';
        if (typeof pedido.total === 'number') total = 'S/ ' + pedido.total.toFixed(2);
        // Cantidad
        let cantidad = 0;
        if (Array.isArray(pedido.detalles)) {
            cantidad = pedido.detalles.reduce((sum, d) => sum + (d.cantidad || 0), 0);
        }
        // Producto y categoría (solo el primero, si hay varios)
        let nombreProducto = '-';
        let categoriaProducto = '-';
        if (Array.isArray(pedido.detalles) && pedido.detalles.length > 0 && pedido.detalles[0].producto) {
            nombreProducto = pedido.detalles[0].producto.nombre || '-';
            categoriaProducto = pedido.detalles[0].producto.categoria || '-';
        }
        // Fecha
        let fecha = '-';
        if (pedido.fechaPedido) fecha = new Date(pedido.fechaPedido).toLocaleString();
        // Botón eliminar
        let btnEliminar = `<button class='btn btn-danger btn-sm' onclick='eliminarPedido(${pedido.id})'>Eliminar</button>`;
        row.innerHTML = `
            <td>${pedido.id}</td>
            <td>${nombreCliente}</td>
            <td>${numeroMesa}</td>
            <td>${total}</td>
            <td>${cantidad}</td>
            <td>${fecha}</td>
            <td><span class=\"badge ${getEstadoPedidoColor(pedido.estado)}\">${pedido.estado}</span></td>
            <td>${nombreProducto}</td>
            <td>${categoriaProducto}</td>
            <td>${btnEliminar}</td>
        `;
        tbody.appendChild(row);
    });
}

async function eliminarPedido(id) {
    if (!confirm('¿Seguro que deseas eliminar este pedido?')) return;
    try {
        const response = await fetch(`${API_BASE}/pedidos/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            pedidos = pedidos.filter(p => p.id !== id);
            mostrarPedidos();
            mostrarExito('Pedido eliminado correctamente');
        } else {
            mostrarError('No se pudo eliminar el pedido');
        }
    } catch (error) {
        mostrarError('Error al eliminar el pedido');
    }
}

function getEstadoPedidoColor(estado) {
    const colores = {
        'PENDIENTE': 'bg-warning',
        'EN_PREPARACION': 'bg-info',
        'LISTO': 'bg-primary',
        'ENTREGADO': 'bg-success',
        'CANCELADO': 'bg-danger'
    };
    return colores[estado] || 'bg-secondary';
}

function verDetallesPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (pedido) {
        alert(`Detalles del pedido ${id}:\nCliente: ${pedido.cliente}\nMesa: ${pedido.mesa}\nTotal: S/ ${pedido.total}`);
    }
}

function cambiarEstadoPedido(id) {
    const pedido = pedidos.find(p => p.id === id);
    if (pedido) {
        const estados = ['PENDIENTE', 'EN_PREPARACION', 'LISTO', 'ENTREGADO'];
        const estadoActualIndex = estados.indexOf(pedido.estado);
        if (estadoActualIndex < estados.length - 1) {
            pedido.estado = estados[estadoActualIndex + 1];
            mostrarPedidos();
            mostrarMensaje(`Estado del pedido ${id} actualizado a ${pedido.estado}`, 'success');
        }
    }
}
