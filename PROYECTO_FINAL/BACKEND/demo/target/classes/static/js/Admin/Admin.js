// admin.js - FUNCIÓN verificarAutenticacion LIMPIA

function verificarAutenticacion() {
    console.log('🛡️ INICIANDO VERIFICACIÓN DE ADMIN...');
    
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
    
    // LIMPIAR URL inmediatamente (antes de verificar otros backups)
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
    
    // Verificar que sea ADMIN
    const esAdmin = user.rol === 'ADMIN' || user.rol === 'Admin' || user.rol?.toUpperCase() === 'ADMIN';
    console.log('🎯 ¿Es Admin?', esAdmin);
    
    if (!esAdmin) {
        console.error('❌ NO ES ADMIN:', { rol: user.rol, esperado: 'ADMIN' });
        alert(`Acceso no autorizado. Solo administradores pueden acceder. Su rol actual: ${user.rol}`);
        
        // Redirigir según su rol real
        switch(user.rol?.toUpperCase()) {
            case 'MOZO':
                window.location.href = '/mozo';
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
    console.log('✅ ADMIN AUTORIZADO EXITOSAMENTE');
    
    // Actualizar UI
    const userInfoElement = document.getElementById('userInfo');
    if (userInfoElement) {
        const modoLocal = user.esLocal ? ' (Local)' : '';
        userInfoElement.textContent = `Admin: ${user.nombre}${modoLocal}`;
        console.log('✅ UI actualizada');
    }
    
    console.log('🎉 VERIFICACIÓN COMPLETADA CON ÉXITO');
}