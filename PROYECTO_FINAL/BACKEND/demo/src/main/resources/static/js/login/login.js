// login.js - VERSIÓN FINAL SIN CONFLICTOS

console.log('🚀 CARGANDO LOGIN.JS VERSIÓN FINAL...');

// Credenciales de prueba
const usuarios = {
    "admin": { password: "1234", rol: "ADMIN", nombre: "Administrador Local" },
    "mozo": { password: "1234", rol: "MOZO", nombre: "Mesero Local" },
    "bartender": { password: "1234", rol: "BARTENDER", nombre: "Bartender Local" }
};

async function ejecutarLogin() {
    console.log('🚀 EJECUTANDO LOGIN VERSIÓN FINAL...');
    
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    
    console.log('📝 Datos ingresados:', { usuario, password: '***' });
    
    if (!usuario || !password) {
        alert('Por favor complete todos los campos');
        return;
    }
    
    // Mostrar loading
    const loginBtn = document.getElementById('loginBtn');
    const originalText = loginBtn ? loginBtn.textContent : '';
    
    if (loginBtn) {
        loginBtn.textContent = 'Iniciando sesión...';
        loginBtn.disabled = true;
    }
    
    try {
        console.log('🔑 Verificando credenciales locales...');
        
        // Usar credenciales locales
        const userData = usuarios[usuario.toLowerCase()];
        console.log('🔍 Usuario encontrado:', userData ? 'SÍ' : 'NO');
        
        if (userData && userData.password === password) {
            console.log('✅ Login exitoso con credenciales locales');
            console.log('👤 Datos del usuario:', userData);
            
            const userSession = {
                id: Date.now(),
                usuario: usuario,
                nombre: userData.nombre,
                rol: userData.rol,
                token: 'local-token-' + Date.now(),
                fechaLogin: new Date().toISOString(),
                esLocal: true
            };
            
            console.log('💾 Creando sesión:', userSession);
            
            alert(`Bienvenido ${userData.nombre} ✅`);
            
            console.log('🔄 LLAMANDO A redirigirSegunRol FINAL...');
            
            // Llamar a la redirección
            redirigirSegunRolFinal(userData.rol, userSession);
            
        } else {
            alert('❌ Credenciales incorrectas');
            console.error('❌ Login fallido para:', usuario);
        }
        
    } catch (error) {
        console.error('💥 Error en login:', error);
        alert('Error: ' + error.message);
    } finally {
        // Restaurar botón
        if (loginBtn) {
            loginBtn.textContent = originalText || 'Iniciar Sesión';
            loginBtn.disabled = false;
        }
    }
}

function redirigirSegunRolFinal(rol, userSession) {
    console.log('🔄 EJECUTANDO REDIRECCIÓN FINAL...');
    console.log('- Rol recibido:', rol);
    console.log('- UserSession:', userSession);
    
    // Guardar en TODOS los lugares posibles
    const sessionString = JSON.stringify(userSession);
    localStorage.setItem('currentUser', sessionString);
    localStorage.setItem('userBackup', sessionString);
    sessionStorage.setItem('currentUser', sessionString);
    
    console.log('💾 Datos guardados en localStorage:', localStorage.getItem('currentUser'));
    
    // Preparar datos para URL
    const userData = encodeURIComponent(sessionString);
    console.log('🔗 Datos preparados para URL (length):', userData.length);
    
    // Determinar URL destino
    let targetUrl;
    const timestamp = Date.now();
    
    switch(rol?.toUpperCase()) {
        case 'ADMIN':
            targetUrl = `/admin?user=${userData}&t=${timestamp}`;
            console.log('👑 Redirigiendo a ADMIN');
            break;
        case 'MOZO':
            targetUrl = `/mozo?user=${userData}&t=${timestamp}`;
            console.log('🍽️ Redirigiendo a MOZO');
            break;
        case 'BARTENDER':
            targetUrl = `/bartender?user=${userData}&t=${timestamp}`;
            console.log('🍸 Redirigiendo a BARTENDER');
            break;
        default:
            targetUrl = '/index';
            console.log('🏠 Redirigiendo a index (rol desconocido:', rol, ')');
    }
    
    console.log('🚀 URL FINAL:', targetUrl.substring(0, 100) + '...');
    
    // Pequeña pausa para asegurar guardado
    setTimeout(() => {
        console.log('⏰ Ejecutando redirección después de pausa...');
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

// Función para cerrar sesión
function cerrarSesion() {
    console.log('👋 Cerrando sesión...');
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/login';
}

console.log('✅ Login.js versión final cargado completamente');