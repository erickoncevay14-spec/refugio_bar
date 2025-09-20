function CerrarSesion() {

    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    // Redirigir al login
    window.location.href = '/login';
}
// moso.js - Gestión de pedidos
let pedidos = [];
let productos = [];

// Cargar datos al iniciar
async function inicializar() {
    await cargarProductos();
    await cargarPedidos();
}

// Cargar productos disponibles
async function cargarProductos() {
    try {
        const response = await fetch('http://localhost:8080/api/productos');
        productos = await response.json();
        mostrarProductosParaPedido();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Cargar pedidos del día
async function cargarPedidos() {
    try {
        const response = await fetch('http://localhost:8080/api/pedidos/pendientes', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        pedidos = await response.json();
        mostrarPedidos();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Crear nuevo pedido
async function crearPedido() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    
    const items = [];
    document.querySelectorAll('.item-pedido').forEach(item => {
        const productoId = item.dataset.productoId;
        const cantidad = parseInt(item.querySelector('.cantidad').value);
        if (cantidad > 0) {
            items.push({ productoId, cantidad });
        }
    });
    
    if (items.length === 0) {
        alert('Seleccione al menos un producto');
        return;
    }
    
    const pedidoData = {
        usuarioId: user.id,
        mesaId: parseInt(document.getElementById('mesaSelect').value),
        items: items
    };
    
    try {
        const response = await fetch('http://localhost:8080/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            },
            body: JSON.stringify(pedidoData)
        });
        
        if (response.ok) {
            const pedido = await response.json();
            alert(`Pedido ${pedido.numeroPedido} creado exitosamente`);
            cargarPedidos();
        } else {
            alert('Error al crear pedido');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Actualizar estado del pedido
async function actualizarEstadoPedido(pedidoId, nuevoEstado) {
    try {
        const response = await fetch(`http://localhost:8080/api/pedidos/${pedidoId}/estado?estado=${nuevoEstado}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        
        if (response.ok) {
            alert('Estado actualizado');
            cargarPedidos();
        } else {
            alert('Error al actualizar estado');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Inicializar al cargar
document.addEventListener('DOMContentLoaded', inicializar);