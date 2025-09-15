// Variables de paginación

let paginaActual = 1;

// Seleccionar productos y contenedor
const productos = document.querySelectorAll(".tequilas");
const totalPaginas = Math.ceil(productos.length / itemsPorPagina);

function mostrarPagina(pagina) {
  paginaActual = pagina;

  // Ocultar todos
  productos.forEach((item, index) => {
    item.style.display = "none";
    // Calcular rango visible
    if (index >= (pagina - 1) * itemsPorPagina && index < pagina * itemsPorPagina) {
      item.style.display = "block";
    }
  });

  // Actualizar botones activos
  document.querySelectorAll(".pagination .page-item").forEach((btn, i) => {
    btn.classList.remove("active");
    if (i === pagina) btn.classList.add("active"); // ojo: i=0 es el botón "Prev"
  });
}

// Navegación siguiente/anterior
function siguientePagina() {
  if (paginaActual < totalPaginas) {
    mostrarPagina(paginaActual + 1);
  }
}
function anteriorPagina() {
  if (paginaActual > 1) {
    mostrarPagina(paginaActual - 1);
  }
}

// Inicializar
mostrarPagina(1);