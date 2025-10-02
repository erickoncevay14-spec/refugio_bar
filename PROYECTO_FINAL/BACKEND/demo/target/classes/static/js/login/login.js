// login.js - Solo funciones de UI, sin validación local

console.log('🚀 CARGANDO LOGIN.JS VERSIÓN FINAL...');

// Mostrar/Ocultar contraseña
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('password');

togglePassword.addEventListener('click', () => {
    const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
    passwordField.setAttribute('type', type);
    togglePassword.classList.toggle('bi-eye-slash');
});
         
function redirigirSegunRolFinal(rol, userSession) {
    console.log('Ejecutando redirección...');
    console.log('- Rol:', rol);
    
    const sessionString = JSON.stringify(userSession);
    
    // Guardar en sessionStorage (específico de cada pestaña)
    sessionStorage.setItem('currentUser', sessionString);
    
    // Backup en localStorage
    localStorage.setItem('currentUser', sessionString);
    localStorage.setItem('userBackup', sessionString);
    
    console.log('Datos guardados correctamente');
    
    // Determinar URL destino SIN parámetros
    let targetUrl;
    
    switch(rol?.toUpperCase()) {
        case 'ADMIN':
            targetUrl = '/admin';
            console.log('Redirigiendo a ADMIN');
            break;
        case 'MOZO':
            targetUrl = '/mozo';
            console.log('Redirigiendo a MOZO');
            break;
        case 'BARTENDER':
            targetUrl = '/bartender';
            console.log('Redirigiendo a BARTENDER');
            break;
        default:
            targetUrl = '/index';
            console.log('Redirigiendo a index');
    }
    
    console.log('URL destino:', targetUrl);
    
    // Redirección limpia sin parámetros
    setTimeout(() => {
        window.location.href = targetUrl;
    }, 100);
}

// Función wrapper para compatibilidad
function validarLogin() {
    console.log('📞 validarLogin() llamada - ejecutando versión final');
    return ejecutarLogin();
}

// Función wrapper para redirigirSegunRol (por si algo la llama)
function redirigirSegunRol(rol, userSession) {
    console.log('📞 redirigirSegunRol() llamada - ejecutando versión final');
    return redirigirSegunRolFinal(rol, userSession);
}

// Al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 Login page loaded - versión final');
    
    // IMPORTANTE: Asegurar que el botón esté conectado correctamente
    const loginBtn = document.getElementById('loginBtn');
    if (loginBtn) {
        console.log('✅ Botón loginBtn encontrado');
        
        // Limpiar cualquier event listener previo
        loginBtn.onclick = ejecutarLogin;
        
        // También manejar Enter en los inputs
        document.getElementById('usuario').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                ejecutarLogin();
            }
        });
        
        document.getElementById('password').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                ejecutarLogin();
            }
        });
        
        console.log('✅ Event listeners configurados');
    }
    
    // Verificar sesión existente
    const userString = localStorage.getItem('currentUser');
    if (userString) {
        try {
            const user = JSON.parse(userString);
            console.log('👤 Usuario existente encontrado:', user);
            console.log('🔄 Auto-redirigiendo...');
            redirigirSegunRolFinal(user.rol, user);
        } catch (error) {
            console.error('💥 Error al leer sesión existente:', error);
            localStorage.clear();
            sessionStorage.clear();
        }
    } else {
        console.log('🆕 No hay sesión previa - login limpio');
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
            alert('❌ Credenciales incorrectas');
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
    console.log('👋 Cerrando sesión...');
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
}

console.log('✅ Login.js versión final cargado completamente');