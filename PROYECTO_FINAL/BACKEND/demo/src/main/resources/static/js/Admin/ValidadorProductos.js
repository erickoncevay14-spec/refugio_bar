// Inicializa validaciones cada vez que se abre el modal
const modalProducto = document.getElementById('modalProducto');

function inicializarValidacionesProducto() {
    // Elimina mensajes viejos
    document.querySelectorAll('#nombreProductoMsg,#descripcionProductoMsg,#precioProductoMsg,#stockProductoMsg,#categoriaProductoMsg').forEach(m => m.remove());

    // Validación de nombre
    const productoNombre = document.getElementById('productoNombre');
    const nombreMsg = document.createElement('div');
    nombreMsg.id = 'nombreProductoMsg';
    nombreMsg.style.cssText = 'font-size: 0.875em; margin-top: 4px;';
    if (productoNombre) {
        productoNombre.parentElement.appendChild(nombreMsg);
        productoNombre.addEventListener('input', function() {
            const valor = productoNombre.value;
            const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
            if (valor.length > 0) {
                if (!regex.test(valor)) {
                    nombreMsg.textContent = ' Solo se permiten letras y espacios';
                    nombreMsg.style.color = '#dc3545';
                    productoNombre.style.borderColor = '#dc3545';
                } else if (valor.trim().length >= 2) {
                    nombreMsg.textContent = ' Nombre válido';
                    nombreMsg.style.color = '#28a745';
                    productoNombre.style.borderColor = '#28a745';
                } else {
                    nombreMsg.textContent = ' Mínimo 2 caracteres';
                    nombreMsg.style.color = '#ffc107';
                    productoNombre.style.borderColor = '#ffc107';
                }
            } else {
                nombreMsg.textContent = '';
                productoNombre.style.borderColor = '';
            }
        });
    }

    // Validación de descripción
    const productoDescripcion = document.getElementById('productoDescripcion');
    const descripcionMsg = document.createElement('div');
    descripcionMsg.id = 'descripcionProductoMsg';
    descripcionMsg.style.cssText = 'font-size: 0.875em; margin-top: 4px;';
    if (productoDescripcion) {
        productoDescripcion.parentElement.appendChild(descripcionMsg);
        productoDescripcion.addEventListener('input', function() {
            const valor = productoDescripcion.value;
            if (valor.length > 255) {
                descripcionMsg.textContent = ' Máximo 255 caracteres';
                descripcionMsg.style.color = '#dc3545';
                productoDescripcion.style.borderColor = '#dc3545';
            } else {
                descripcionMsg.textContent = '';
                productoDescripcion.style.borderColor = '';
            }
        });
    }

    // Validación de precio
    const productoPrecio = document.getElementById('productoPrecio');
    const precioMsg = document.createElement('div');
    precioMsg.id = 'precioProductoMsg';
    precioMsg.style.cssText = 'font-size: 0.875em; margin-top: 4px;';
    if (productoPrecio) {
        productoPrecio.parentElement.appendChild(precioMsg);
        productoPrecio.addEventListener('input', function() {
            const valor = productoPrecio.value;
            const numero = parseFloat(valor);
            if (valor.length > 0) {
                if (isNaN(numero)) {
                    precioMsg.textContent = ' Solo se permiten números';
                    precioMsg.style.color = '#dc3545';
                    productoPrecio.style.borderColor = '#dc3545';
                } else if (numero <= 0) {
                    precioMsg.textContent = ' El precio debe ser mayor a 0';
                    precioMsg.style.color = '#dc3545';
                    productoPrecio.style.borderColor = '#dc3545';
                } else {
                    precioMsg.textContent = ' Precio válido';
                    precioMsg.style.color = '#28a745';
                    productoPrecio.style.borderColor = '#28a745';
                }
            } else {
                precioMsg.textContent = '';
                productoPrecio.style.borderColor = '';
            }
        });
    }

    // Validación de stock
    const productoStock = document.getElementById('productoStock');
    const stockMsg = document.createElement('div');
    stockMsg.id = 'stockProductoMsg';
    stockMsg.style.cssText = 'font-size: 0.875em; margin-top: 4px;';
    if (productoStock) {
        productoStock.parentElement.appendChild(stockMsg);
        productoStock.addEventListener('input', function() {
            const valor = productoStock.value;
            const numero = parseInt(valor);
            if (valor.length > 0) {
                if (isNaN(numero)) {
                    stockMsg.textContent = ' Solo se permiten números';
                    stockMsg.style.color = '#dc3545';
                    productoStock.style.borderColor = '#dc3545';
                } else if (numero < 0) {
                    stockMsg.textContent = ' El stock no puede ser negativo';
                    stockMsg.style.color = '#dc3545';
                    productoStock.style.borderColor = '#dc3545';
                } else {
                    stockMsg.textContent = ' Stock válido';
                    stockMsg.style.color = '#28a745';
                    productoStock.style.borderColor = '#28a745';
                }
            } else {
                stockMsg.textContent = '';
                productoStock.style.borderColor = '';
            }
        });
    }

    // Validación de categoría
    const productoCategoria = document.getElementById('productoCategoria');
    const categoriaMsg = document.createElement('div');
    categoriaMsg.id = 'categoriaProductoMsg';
    categoriaMsg.style.cssText = 'font-size: 0.875em; margin-top: 4px;';
    if (productoCategoria) {
        productoCategoria.parentElement.appendChild(categoriaMsg);
        productoCategoria.addEventListener('change', function() {
            const valor = productoCategoria.value;
            if (!valor || valor === '') {
                categoriaMsg.textContent = ' La categoría es obligatoria';
                categoriaMsg.style.color = '#dc3545';
                productoCategoria.style.borderColor = '#dc3545';
            } else {
                categoriaMsg.textContent = ' Categoría válida';
                categoriaMsg.style.color = '#28a745';
                productoCategoria.style.borderColor = '#28a745';
            }
        });
    }
}

if (modalProducto) {
    modalProducto.addEventListener('shown.bs.modal', inicializarValidacionesProducto);
}
