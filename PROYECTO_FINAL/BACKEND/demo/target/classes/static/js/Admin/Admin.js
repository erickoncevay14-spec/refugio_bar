function CerrarSesion() {

    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    
    // Redirigir al login
    window.location.href = '/login';
}