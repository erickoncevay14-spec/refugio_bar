// Mostrar/Ocultar contraseña
document.addEventListener('DOMContentLoaded', function() {
    const togglePassword = document.getElementById('togglePassword');
    const passwordField = document.getElementById('password');
    const usuarioField = document.getElementById('usuario');
    // Limpiar campos usuario y contraseña al cargar
    if (usuarioField) usuarioField.value = '';
    if (passwordField) passwordField.value = '';
    if (togglePassword && passwordField) {
        togglePassword.addEventListener('click', () => {
            const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordField.setAttribute('type', type);
            togglePassword.classList.toggle('bi-eye-slash');
        });
    }
});
         
function redirigirSegunRolFinal(rol, userSession) {
    const sessionString = JSON.stringify(userSession);
    sessionStorage.setItem('currentUser', sessionString);
    localStorage.setItem('currentUser', sessionString);
    localStorage.setItem('userBackup', sessionString);
    
    let targetUrl;
    const rolUpperCase = rol?.toUpperCase() || '';
    
    if (rolUpperCase === 'ADMIN') {
        targetUrl = '/admin';
    } 
    else if (rolUpperCase === 'BARTENDER') {
        targetUrl = '/bartender';
    }
    else if (rolUpperCase === 'MOZO' || rolUpperCase === 'MESERO' || 
             rol === 'mozo' || rol === 'Mozo') {
        targetUrl = '/mozo';
    }
    else {
        targetUrl = '/index';
    }
    
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 100);
}

// Función wrapper para compatibilidad
function validarLogin() {
    return ejecutarLogin();
}

// Función wrapper para redirigirSegunRol (por si algo la llama)
function redirigirSegunRol(rol, userSession) {
    return redirigirSegunRolFinal(rol, userSession);
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        
        loginBtn.onclick = ejecutarLogin;
        // Eliminar submit por Enter para evitar doble ejecución y recarga
        document.getElementById('usuario').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
        document.getElementById('password').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
            }
        });
        
    }
    
    // Si estamos en la página de login, NO REDIRIGIR automáticamente
    // Esto evita el bucle infinito de redirecciones
    if (window.location.pathname.includes('/login')) {
        
        // Limpiar la sesión para permitir un nuevo login
        localStorage.removeItem('currentUser');
        sessionStorage.removeItem('currentUser');
        return;
    }
    
    // Solo verificar sesión existente en páginas que no sean login
    const userString = localStorage.getItem('currentUser');
    if (userString) {
        try {
            const user = JSON.parse(userString);
            // Solo redirigir si el usuario tiene rol válido
            if (user.rol) {
                redirigirSegunRolFinal(user.rol, user);
            } else {
                localStorage.clear();
                sessionStorage.clear();
            }
        } catch (error) {
            console.error(' Error al leer sesión existente:', error);
            localStorage.clear();
            sessionStorage.clear();
        }
    }
});
async function ejecutarLogin() {
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    const loginBtn = document.getElementById('loginBtn');
    const originalText = loginBtn ? loginBtn.textContent : '';

    if (loginBtn) {
        loginBtn.textContent = 'Validando...';
        loginBtn.disabled = true;
    }

    try {
        // Usar JWT real en lugar de token temporal
        const response = await fetch('/jwt-auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario: usuario, password })
        });

        if (!response.ok) {
            throw new Error('Credenciales incorrectas');
        }

        const userData = await response.json();
        
        if (userData && userData.token && userData.rol) {
            // Guardar el token JWT
            const userSession = {
                token: userData.token,
                usuario: userData.username,
                rol: userData.rol,
                id: userData.id,
                nombre: userData.nombre
            };
            
            // Guardar token en localStorage para usarlo en futuras peticiones
            localStorage.setItem('jwtToken', userData.token);
            
            redirigirSegunRolFinal(userData.rol, userSession);
        } else {
            alert('Credenciales incorrectas');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    } finally {
        if (loginBtn) {
            loginBtn.textContent = originalText || 'Iniciar Sesión';
            loginBtn.disabled = false;
        }
    }
}
// Función para cerrar sesión
function cerrarSesion() {
   
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
}
