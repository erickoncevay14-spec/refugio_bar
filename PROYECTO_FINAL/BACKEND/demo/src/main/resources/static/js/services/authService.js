// Servicio de autenticación
class AuthService {
    constructor() {
        this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
    
    // Login
    async login(usuario, password) {
        try {
            const response = await fetch('http://localhost:8080/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ usuario, password })
            });
            
            const data = await response.json();
            
            if (response.ok && data.token) {
                // Guardar datos
                localStorage.setItem('token', data.token);
                localStorage.setItem('currentUser', JSON.stringify({
                    id: data.id,
                    usuario: data.usuario,
                    nombre: data.nombre,
                    rol: data.rol
                }));
                
                this.currentUser = data;
                return { success: true, data };
            } else {
                return { success: false, error: data.error || 'Credenciales incorrectas' };
            }
        } catch (error) {
            return { success: false, error: 'Error de conexión' };
        }
    }
    
    // Logout
    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('currentUser');
        this.currentUser = null;
        window.location.href = '/login';
    }
    
    // Verificar autenticación
    isAuthenticated() {
        return this.currentUser !== null && localStorage.getItem('token') !== null;
    }
    
    // Obtener usuario actual
    getCurrentUser() {
        return this.currentUser;
    }
    
    // Verificar rol
    hasRole(role) {
        return this.currentUser && this.currentUser.rol === role;
    }
}

const authService = new AuthService();