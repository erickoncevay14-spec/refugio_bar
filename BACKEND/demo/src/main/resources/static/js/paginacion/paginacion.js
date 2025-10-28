// Variables de paginación
const itemsPorPagina = 6; // cuantos productos por página
let paginaActual = 1;

// Seleccionar productos y contenedor
const productos = document.querySelectorAll(".tequilas");
const totalPaginas = Math.ceil(productos.length / itemsPorPagina);

function mostrarPagina(pagina) {
  paginaActual = pagina;

  // Ocultar todos
  productos.forEach((item, index) => {
    item.style.display = "none";
    if (index >= (pagina - 1) * itemsPorPagina && index < pagina * itemsPorPagina) {
      item.style.display = "block";
    }
  });

  // Actualizar botones activos
  document.querySelectorAll(".pagination .page-item").forEach((btn) => {
    btn.classList.remove("active");
  });

  const pageButtons = document.querySelectorAll(".pagination .page-item:not(:first-child):not(:last-child)");
  if (pageButtons[pagina - 1]) {
    pageButtons[pagina - 1].classList.add("active");
  }
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
