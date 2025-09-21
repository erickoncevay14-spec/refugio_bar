// mozo.js - AUTENTICACIÓN CORREGIDA

// Variables globales
let pedidos = [];
let mesas = [];
let productos = [];
let pedidoActual = {};
const API_BASE = 'http://localhost:8080/api';

// ===============================
// INICIALIZACIÓN
// ===============================
document.addEventListener('DOMContentLoaded', function() {
    verificarAutenticacionMozo();
    configurarNavegacion();
    cargarDatosMozo();
    configurarEventos();
});

function verificarAutenticacionMozo() {
    console.log('🛡️ INICIANDO VERIFICACIÓN DE MOZO...');
    
    let userString = localStorage.getItem('currentUser');
    console.log('📦 localStorage principal:', userString);
    
    // Si no hay en localStorage, intentar recuperar de URL
    if (!userString) {
        console.log('🔄 Intentando recuperar desde URL...');
        
        const urlParams = new URLSearchParams(window.location.search);
        const userFromUrl = urlParams.get('user');
        
        if (userFromUrl) {
            try {
                userString = decodeURIComponent(userFromUrl);
                console.log('✅ Datos recuperados desde URL');
                
                // Restaurar en localStorage para futuras visitas
                localStorage.setItem('currentUser', userString);
                
            } catch (error) {
                console.error('💥 Error al decodificar datos de URL:', error);
            }
        }
    }
    
    // LIMPIAR URL inmediatamente
    if (window.location.search) {
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
        console.log('🧹 URL limpiada:', cleanUrl);
    }
    
    // Si aún no hay datos, intentar otros backups
    if (!userString) {
        console.log('🔄 Intentando otros backups...');
        
        userString = localStorage.getItem('userBackup') || sessionStorage.getItem('currentUser');
        
        if (userString) {
            console.log('✅ Backup encontrado, restaurando...');
            localStorage.setItem('currentUser', userString);
        }
    }
    
    if (!userString) {
        console.error('❌ No se encontró sesión en ningún lugar');
        alert('Debe iniciar sesión primero');
        window.location.href = '/login';
        return;
    }
    
    let user;
    try {
        user = JSON.parse(userString);
        console.log('✅ Usuario parseado correctamente:', user);
    } catch (error) {
        console.error('💥 Error al parsear JSON:', error);
        localStorage.clear();
        sessionStorage.clear();
        alert('Sesión inválida. Debe iniciar sesión nuevamente');
        window.location.href = '/login';
        return;
    }
    
    // Verificar que tenga los campos necesarios
    if (!user.rol || !user.nombre) {
        console.error('❌ DATOS INCOMPLETOS:', { rol: user.rol, nombre: user.nombre });
        alert('Datos de sesión incompletos. Debe iniciar sesión nuevamente');
        window.location.href = '/login';
        return;
    }
    
    // Verificar que sea MOZO
    const esMozo = user.rol === 'MOZO' || user.rol === 'Mozo' || user.rol?.toUpperCase() === 'MOZO';
    console.log('🎯 ¿Es Mozo?', esMozo);
    
    if (!esMozo) {
        console.error('❌ NO ES MOZO:', { rol: user.rol, esperado: 'MOZO' });
        alert(`Acceso no autorizado. Solo mozos pueden acceder. Su rol actual: ${user.rol}`);
        
        // Redirigir según su rol real
        switch(user.rol?.toUpperCase()) {
            case 'ADMIN':
                window.location.href = '/admin';
                break;
            case 'BARTENDER':
                window.location.href = '/bartender';
                break;
            default:
                window.location.href = '/login';
        }
        return;
    }
    
    // Si llegó hasta aquí, está autorizado
    console.log('✅ MOZO AUTORIZADO EXITOSAMENTE');
    
    // Actualizar UI
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
        const modoLocal = user.esLocal ? ' (Local)' : '';
        userInfoElement.textContent = `Mozo: ${user.nombre}${modoLocal}`;
        console.log('✅ UI actualizada');
    }
    
    console.log('🎉 VERIFICACIÓN COMPLETADA CON ÉXITO');
}

// ===============================
// FUNCIONES PLACEHOLDER (para que no de error)
// ===============================

async function cargarDatosMozo() {
    console.log('📊 Cargando datos del mozo...');
    // Implementar después
}

function configurarNavegacion() {
    console.log('🧭 Configurando navegación...');
    // Implementar después
}

function configurarEventos() {
    console.log('⚡ Configurando eventos...');
    // Implementar después
}

// Función para cerrar sesión
function cerrarSesion() {
    console.log('👋 Cerrando sesión desde mozo...');
    
    if (confirm('¿Está seguro que desea cerrar sesión?')) {
        // Limpiar todos los storages
        localStorage.clear();
        sessionStorage.clear();
        
        console.log('🧹 Sesión limpiada');
        
        // Redirigir al login
        window.location.href = '/login';
    }
}