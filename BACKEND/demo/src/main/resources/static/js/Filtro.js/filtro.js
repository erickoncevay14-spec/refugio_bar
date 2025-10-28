function filtrarProductos() {
    const categoriaSeleccionada = document.getElementById("categoria").value;
    const precioMaximo = parseInt(document.getElementById("precio").value);
  
    // CORREGIDO: ahora busca dentro de .tequilas-container
    const productos = document.querySelectorAll(".tequilas-container .tequilas");
  
    productos.forEach(producto => {
      const categoria = producto.getAttribute("data-categoria");
      const precio = parseInt(producto.getAttribute("data-precio"));
  
      // Mostrar/ocultar según filtro
      if (
        (categoriaSeleccionada === "" || categoria === categoriaSeleccionada) &&
        precio >= precioMaximo
      ) {
        producto.style.display = "block";
      } else {
        producto.style.display = "none";
      }
    });
  }
  
  // Actualiza el texto del precio máximo en tiempo real
  document.getElementById("precio").addEventListener("input", function () {
    document.getElementById("precioMax").textContent = "S/ " + this.value;
  });
  