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
    console.log('Ejecutando redirección...');
    console.log('- Rol:', rol);
    const sessionString = JSON.stringify(userSession);
    sessionStorage.setItem('currentUser', sessionString);
    localStorage.setItem('currentUser', sessionString);
    localStorage.setItem('userBackup', sessionString);
    console.log('Datos guardados correctamente');
    let targetUrl;
    // Convertimos el rol a mayúsculas para comparación
    const rolUpperCase = rol?.toUpperCase() || '';
    console.log('- Rol en mayúsculas:', rolUpperCase);
    
    // Añadimos logs adicionales para depurar
    console.log('- Tipo de rol:', typeof rol);
    console.log('- Contenido exacto del rol:', rol);
    
    // Comprobación basada en el contenido real de la base de datos
    if (rolUpperCase === 'ADMIN') {
        targetUrl = '/admin';
        console.log('Redirigiendo a ADMIN');
    } 
    else if (rolUpperCase === 'BARTENDER') {
        targetUrl = '/bartender';
        console.log('Redirigiendo a BARTENDER');
    }
    // Añadimos "mozo" en minúsculas y mayúsculas para asegurar la compatibilidad
    else if (rolUpperCase === 'MOZO' || rolUpperCase === 'MESERO' || 
             rol === 'mozo' || rol === 'Mozo') {
        targetUrl = '/mozo';
        console.log('Redirigiendo a MOZO - rol detectado:', rol);
    }
    else {
        targetUrl = '/index';
        console.log('Redirigiendo a index - Rol no reconocido:', rol);
    }
    console.log('URL destino:', targetUrl);
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 100);
}

// Función wrapper para compatibilidad
function validarLogin() {
    console.log(' validarLogin() llamada - ejecutando versión final');
    return ejecutarLogin();
}

// Función wrapper para redirigirSegunRol (por si algo la llama)
function redirigirSegunRol(rol, userSession) {
    console.log(' redirigirSegunRol() llamada - ejecutando versión final');
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
                console.log('Sesión inválida, mostrando login');
            }
        } catch (error) {
            console.error(' Error al leer sesión existente:', error);
            localStorage.clear();
            sessionStorage.clear();
        }
    } else {
        console.log(' No hay sesión previa - login limpio');
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
        const response = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, password })
        });

        if (!response.ok) {
            throw new Error('Credenciales incorrectas');
        }

        const userData = await response.json();
        if (userData && userData.rol) {
            redirigirSegunRolFinal(userData.rol, userData);
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
    console.log(' Cerrando sesión...');
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
}
