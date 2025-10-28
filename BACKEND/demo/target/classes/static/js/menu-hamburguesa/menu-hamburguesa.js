// Seleccionamos el botón y el menú 
const hamburger = document.getElementById("hamburger"); 
const navLinks = document.getElementById("nav-links"); 
 
// Cada vez que hago click en el botón 
hamburger.addEventListener("click", () => { 
    // Activo o desactivo la clase "active" 
    navLinks.classList.toggle("active"); 
});

// Cerrar el menú al hacer click en un enlace (en móvil)
const links = navLinks.querySelectorAll('a');
links.forEach(link => {
    link.addEventListener('click', () => {
        navLinks.classList.remove('active');
    });
});