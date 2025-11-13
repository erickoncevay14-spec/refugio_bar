
let productos = [];

async function cargarProductos() {

    try {
        const response = await fetch(`${API_BASE}/productos`);
        if (response.ok) {
            const resp = await response.json();
            productos = resp.data || [];
            mostrarProductos();
            configurarFiltrosProductos();
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error cargando productos:', error);
        mostrarError('Error al cargar productos');
        cargarProductosLocal();
    }
}

function cargarProductosLocal() {
    productos = [
        { id: 1, nombre: 'Cerveza Pilsen', categoria: 'BEBIDAS', precio: 8.50, stock: 50, activo: true },
        { id: 2, nombre: 'Anticucho', categoria: 'COMIDAS', precio: 15.00, stock: 20, activo: true },
        { id: 3, nombre: 'Suspiro Limeño', categoria: 'POSTRES', precio: 12.00, stock: 10, activo: true }
    ];
    mostrarProductos();
    configurarFiltrosProductos();
}

function mostrarProductos() {
    const tbody = document.getElementById('tablaProductos');
    if (!tbody) return;
    tbody.innerHTML = '';
    const productosOrdenados = [...productos].sort((a, b) => a.id - b.id);
    productosOrdenados.forEach(producto => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${producto.id}</td>
            <td>
                <strong>${producto.nombre}</strong>
                ${producto.descripcion ? `<br><small class="text-muted">${producto.descripcion}</small>` : ''}
            </td>
            <td>
                <span class="badge ${getCategoriaColor(producto.categoria)}">${producto.categoria}</span>
            </td>
            <td>S/ ${producto.precio.toFixed(2)}</td>
            <td>
                <span class="badge ${getStockColor(producto.stock)}">${producto.stock}</span>
            </td>
            <td>
                <span class="badge ${producto.disponible ? 'bg-success' : 'bg-danger'}">
                    ${producto.disponible ? 'Activo' : 'Inactivo'}
                </span>
            </td>
            <td>
                <div class="btn-group btn-group-sm">
                    <button class="btn btn-outline-primary" onclick="editarProducto(${producto.id})" title="Editar">
                        <i class="bi bi-pencil"></i>
                    </button>
                    <button class="btn btn-outline-danger" onclick="eliminarProducto(${producto.id})" title="Eliminar">
                        <i class="bi bi-trash"></i>
                    </button>
                </div>
            </td>
        `;
        tbody.appendChild(row);
    });
}

function configurarFiltrosProductos() {
    const buscarInput = document.getElementById('buscarProducto');
    const filtroCategoria = document.getElementById('filtroCategoria');
    if (buscarInput) {
        buscarInput.addEventListener('input', filtrarProductos);
    }
    if (filtroCategoria) {
        filtroCategoria.addEventListener('change', filtrarProductos);
    }
}

function filtrarProductos() {
    const buscar = document.getElementById('buscarProducto').value.toLowerCase();
    const categoria = document.getElementById('filtroCategoria').value;
    const filas = document.querySelectorAll('#tablaProductos tr');
    filas.forEach(fila => {
        const nombre = fila.querySelector('td:nth-child(2)').textContent.toLowerCase();
        const categoriaBadge = fila.querySelector('td:nth-child(3) .badge');
        let categoriaProducto = categoriaBadge ? categoriaBadge.textContent.trim().toUpperCase() : '';
        // Normalizar singular/plural para comparar
        const normalizar = cat => cat.replace(/S$/, '');
        const coincideNombre = nombre.includes(buscar);
        const coincideCategoria = !categoria || normalizar(categoriaProducto) === normalizar(categoria.toUpperCase());
        fila.style.display = (coincideNombre && coincideCategoria) ? '' : 'none';
    });
}

async function crearProducto(productoData) {
    try {
        const response = await fetch(`${API_BASE}/productos`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productoData)
        });
        if (response.ok) {
            const nuevoProducto = await response.json();
            productos.push(nuevoProducto);
            mostrarProductos();
            mostrarMensaje('Producto creado exitosamente', 'success');
            return nuevoProducto;
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error creando producto:', error);
        mostrarError('Error al crear producto');
        throw error;
    }
}

async function actualizarProducto(id, productoData) {
    try {
        const response = await fetch(`${API_BASE}/productos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(productoData)
        });
        if (response.ok) {
            const productoActualizado = await response.json();
            const index = productos.findIndex(p => p.id === id);
            if (index !== -1) {
                productos[index] = productoActualizado;
            }
            mostrarProductos();
            mostrarMensaje('Producto actualizado exitosamente', 'success');
            return productoActualizado;
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
    } catch (error) {
        console.error('Error actualizando producto:', error);
        mostrarError('Error al actualizar producto');
        throw error;
    }
}

async function eliminarProducto(id) {
    if (!confirm('¿Seguro que deseas eliminar este producto?')) return;
    fetch(`/api/productos/${id}`, {
        method: 'DELETE'
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.success) {
            alert('Producto eliminado');
            cargarProductos(); // Actualiza la tabla automáticamente
        } else {
            let msg = resp.message || resp.error || JSON.stringify(resp);
            alert('Error: ' + msg);
        }
    })
    .catch(err => {
        console.error('Error en fetch:', err);
        alert('Error de red o formato: ' + err);
    });
}

function abrirModalProducto(id = null) {
    const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
    const titulo = document.getElementById('modalProductoTitulo');
    const form = document.getElementById('formProducto');
    form.reset();
    if (id) {
        titulo.textContent = 'Editar Producto';
        const producto = productos.find(p => p.id === id);
        if (producto) {
            document.getElementById('productoId').value = producto.id;
            document.getElementById('productoNombre').value = producto.nombre;
            document.getElementById('productoDescripcion').value = producto.descripcion || '';
            document.getElementById('productoPrecio').value = producto.precio;
            document.getElementById('productoStock').value = producto.stock;
            document.getElementById('productoCategoria').value = producto.categoria;
            document.getElementById('productoActivo').checked = producto.activo;
        }
    } else {
        titulo.textContent = 'Nuevo Producto';
        document.getElementById('productoId').value = '';
    }
    modal.show();
}

function editarProducto(id) {
    const producto = productos.find(p => p.id === id);
    if (!producto) return;
    document.getElementById('productoId').value = producto.id;
    document.getElementById('productoNombre').value = producto.nombre;
    document.getElementById('productoDescripcion').value = producto.descripcion || '';
    document.getElementById('productoPrecio').value = producto.precio;
    document.getElementById('productoStock').value = producto.stock;
    document.getElementById('productoCategoria').value = producto.categoria;
    document.getElementById('productoActivo').checked = !!producto.disponible;
    // Mostrar el modal
    const modal = new bootstrap.Modal(document.getElementById('modalProducto'));
    modal.show();
}

function guardarProducto() {
    const id = document.getElementById('productoId').value;
    const nombre = document.getElementById('productoNombre').value.trim();
    const descripcion = document.getElementById('productoDescripcion').value.trim();
    const precio = parseFloat(document.getElementById('productoPrecio').value);
    const stock = parseInt(document.getElementById('productoStock').value);
    const categoria = document.getElementById('productoCategoria').value;
    const disponible = document.getElementById('productoActivo').checked;
    // Validación de campos obligatorios
    if (!nombre || isNaN(precio) || isNaN(stock) || !categoria) {
        alert('Por favor completa todos los campos obligatorios y selecciona una categoría válida.');
        return;
    }
    // Validar categoría válida
    const categoriasValidas = ['BEBIDA', 'COMIDA', 'POSTRE', 'ENTRADA', 'SNACK'];
    if (!categoriasValidas.includes(categoria)) {
        alert('Selecciona una categoría válida.');
        return;
    }
    const data = {
        nombre,
        descripcion,
        precio,
        stock,
        categoria,
        disponible
    };
    let url = '/api/productos';
    let method = 'POST';
    if (id) {
        url = `/api/productos/${id}`;
        method = 'PUT';
    }
    fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    })
    .then(res => res.json())
    .then(resp => {
        if (resp.success) {
            alert('Producto guardado');
            document.getElementById('modalProducto').classList.remove('show');
            document.body.classList.remove('modal-open');
            document.querySelector('.modal-backdrop')?.remove();
            cargarProductos();
            document.getElementById('productoId').value = '';
        } else {
            let msg = resp.message || resp.error || JSON.stringify(resp);
            alert('Error: ' + msg);
        }
    })
    .catch(err => {
        console.error('Error en fetch:', err);
        alert('Error de red o formato: ' + err);
    });
}

function getCategoriaColor(categoria) {
    const colores = {
        'BEBIDAS': 'bg-primary',
        'COMIDAS': 'bg-success',
        'POSTRES': 'bg-warning',
        'APERITIVOS': 'bg-info'
    };
    return colores[categoria] || 'bg-secondary';
}

function getStockColor(stock) {
    if (stock === 0) return 'bg-danger';
    if (stock < 10) return 'bg-warning';
    return 'bg-success';
}
