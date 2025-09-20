// Función de login que conecta con el backend
async function validarLogin() {
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    
    if (!usuario || !password) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    try {
        // Conectar con el backend Spring Boot
        const response = await fetch('http://localhost:8080/api/auth/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ 
                usuario: usuario, 
                password: password 
            })
        });
        
        const data = await response.json();
        
        if (response.ok && data.token) {
            // Login exitoso
            alert(`Bienvenido ${data.nombre} ✅`);
            console.log("Login exitoso", data);
            
            // Guardar datos en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('currentUser', JSON.stringify({
                id: data.id,
                usuario: data.usuario,
                nombre: data.nombre,
                rol: data.rol
            }));
            
            // Redirigir según el rol
            switch(data.rol) {
                case 'ADMIN':
                    window.location.href = '/admin';
                    break;
                case 'MESERO':
                    window.location.href = '/mozo';
                    break;
                case 'BARTENDER':
                    window.location.href = '/bartender';
                    break;
                default:
                    window.location.href = '/index';
            }
        } else {
            // Login fallido
            alert('❌ Credenciales incorrectas');
            console.error('Login fallido:', data.error);
        }
        
    } catch (error) {
        console.error('Error de conexión:', error);
        alert('❌ Error al conectar con el servidor. Asegúrate de que el backend esté corriendo.');
    }
}

// Función para cerrar sesión
function cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('currentUser');
    window.location.href = '/login';
}

// Función para verificar si hay sesión activa
function verificarSesion() {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('currentUser');
    
    if (!token || !user) {
        return false;
    }
    return true;
}