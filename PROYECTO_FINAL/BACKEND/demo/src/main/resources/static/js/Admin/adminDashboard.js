
async function cargarDashboard() {
    try {
        await Promise.all([
            cargarEstadisticasProductos(),
            cargarEstadisticasPedidos(),
            cargarEstadisticasUsuarios(),
            cargarEstadisticasMesas()
        ]);
        crearGraficoVentas();
        crearGraficoProductos();
    } catch (error) {
        console.error('Error cargando dashboard:', error);
        mostrarError('Error al cargar el dashboard');
    }
}

async function cargarEstadisticasProductos() {
    try {
        const response = await fetch(`${API_BASE}/productos`);
        if (response.ok) {
            const result = await response.json();
            // Si la respuesta es ApiResponse, toma result.data
            const productos = result.data || [];
            document.getElementById('totalProductos').textContent = productos.length;
        }
    } catch (error) {
        console.error('Error cargando estadísticas de productos:', error);
        document.getElementById('totalProductos').textContent = '---';
    }
}

async function cargarEstadisticasPedidos() {
    try {
        const response = await fetch(`${API_BASE}/pedidos`);
        if (response.ok) {
            const pedidos = await response.json();
            document.getElementById('pedidosHoy').textContent = Array.isArray(pedidos) ? pedidos.length : (pedidos.data ? pedidos.data.length : '---');
        }
    } catch (error) {
        console.error('Error cargando estadísticas de pedidos:', error);
        document.getElementById('pedidosHoy').textContent = '---';
    }
}

async function cargarEstadisticasUsuarios() {
    try {
        const response = await fetch(`${API_BASE}/usuarios`);
        if (response.ok) {
            const usuarios = await response.json();
            document.getElementById('totalUsuarios').textContent = Array.isArray(usuarios) ? usuarios.length : (usuarios.data ? usuarios.data.length : '---');
        }
    } catch (error) {
        console.error('Error cargando estadísticas de usuarios:', error);
        document.getElementById('totalUsuarios').textContent = '---';
    }
}

async function cargarEstadisticasMesas() {
    try {
        const response = await fetch(`${API_BASE}/mesas`);
        if (response.ok) {
            const result = await response.json();
            const mesas = result.data || [];
            const mesasDisponibles = mesas.filter(mesa => mesa.estado === 'DISPONIBLE').length;
            document.getElementById('totalMesas').textContent = mesasDisponibles;
        }
    } catch (error) {
        console.error('Error cargando estadísticas de mesas:', error);
        document.getElementById('totalMesas').textContent = '---';
    }
}

async function crearGraficoVentas() {
    const ctx = document.getElementById('ventasChart').getContext('2d');
    let ventas = [0,0,0,0,0,0,0];
    try {
        const response = await fetch(`${API_BASE}/pedidos/estadisticas/ventas-semanales`);
        if (response.ok) {
            ventas = await response.json();
        }
    } catch (error) {
        console.error('Error cargando ventas semanales:', error);
    }
    new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'],
            datasets: [{
                label: 'Ventas (S/)',
                data: ventas,
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.1
            }]
        },
        options: {
            responsive: true,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
}

async function crearGraficoProductos() {
    const ctx = document.getElementById('productosChart').getContext('2d');
    let categorias = ['Bebidas', 'Comidas', 'Postres', 'Aperitivos'];
    let datos = [0,0,0,0];
    try {
        const response = await fetch(`${API_BASE}/pedidos/estadisticas/productos-mas-vendidos`);
        if (response.ok) {
            const result = await response.json();
            categorias = Object.keys(result);
            datos = Object.values(result);
        }
    } catch (error) {
        console.error('Error cargando productos más vendidos:', error);
    }
    new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: categorias,
            datasets: [{
                data: datos,
                backgroundColor: [
                    'rgba(255, 99, 132, 0.8)',
                    'rgba(54, 162, 235, 0.8)',
                    'rgba(255, 205, 86, 0.8)',
                    'rgba(75, 192, 192, 0.8)'
                ]
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
}
