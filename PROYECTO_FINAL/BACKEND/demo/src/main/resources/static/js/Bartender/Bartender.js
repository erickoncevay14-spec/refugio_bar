function CerrarSesion() {

    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    // Redirigir al login
    window.location.href = '/login';
}
// bartender.js - Gestión de bebidas en preparación
let pedidosPendientes = [];

// Cargar pedidos pendientes de bebidas
async function cargarPedidosBebidas() {
    try {
        const response = await fetch('http://localhost:8080/api/pedidos/pendientes', {
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        const todos = await response.json();
        
        // Filtrar solo pedidos con bebidas
        pedidosPendientes = todos.filter(pedido => 
            pedido.detalles && pedido.detalles.some(d => 
                d.producto.categoria === 'BEBIDA'
            )
        );
        
        mostrarPedidosPendientes();
    } catch (error) {
        console.error('Error:', error);
    }
}

// Marcar bebida como preparada
async function marcarPreparado(pedidoId) {
    await actualizarEstadoPedido(pedidoId, 'LISTO');
}

// Actualizar estado
async function actualizarEstadoPedido(pedidoId, estado) {
    try {
        const response = await fetch(`http://localhost:8080/api/pedidos/${pedidoId}/estado?estado=${estado}`, {
            method: 'PUT',
            headers: {
                'Authorization': 'Bearer ' + localStorage.getItem('token')
            }
        });
        
        if (response.ok) {
            alert('Bebida lista para servir');
            cargarPedidosBebidas();
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

// Cargar al iniciar
document.addEventListener('DOMContentLoaded', cargarPedidosBebidas);