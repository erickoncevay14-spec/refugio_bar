
/**
 * Obtiene el token JWT del localStorage
 */
function getAuthToken() {
    const token = localStorage.getItem('jwtToken');
    
    // Validar que el token existe y tiene el formato correcto (3 partes separadas por puntos)
    if (token && typeof token === 'string' && token.split('.').length === 3) {
        return token;
    }
    
    // Si el token no es válido, limpiar localStorage
    if (token) {
        console.error('❌ Token JWT malformado detectado:', token);
        localStorage.removeItem('jwtToken');
    }
    
    return null;
}

/**
 * Obtiene los headers con Authorization si hay token
 */
function getAuthHeaders() {
    const token = getAuthToken();
    const headers = {
        'Content-Type': 'application/json'
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    return headers;
}

// Guardar el fetch original
const originalFetch = window.fetch;

/**
 * Interceptor global de fetch que agrega JWT automáticamente
 */
window.fetch = function(url, options = {}) {
    // Solo agregar JWT si la URL es de nuestra API (y NO es login/registro)
    const isApiCall = typeof url === 'string' && url.includes('/api/');
    const isAuthCall = typeof url === 'string' && (url.includes('/jwt-auth/') || url.includes('/api/auth/'));
    
    if (isApiCall && !isAuthCall) {
        // No sobrescribir headers si ya existen
        if (!options.headers) {
            options.headers = {};
        }
        
        // Agregar Authorization si no está ya presente
        const token = getAuthToken();
        if (token && !options.headers['Authorization']) {
            if (options.headers instanceof Headers) {
                options.headers.append('Authorization', `Bearer ${token}`);
            } else {
                options.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        
        // Asegurar Content-Type para POST/PUT/PATCH
        if (['POST', 'PUT', 'PATCH'].includes(options.method?.toUpperCase()) && 
            !options.headers['Content-Type']) {
            if (options.headers instanceof Headers) {
                options.headers.append('Content-Type', 'application/json');
            } else {
                options.headers['Content-Type'] = 'application/json';
            }
        }
    }
    
    // Llamar al fetch original y manejar errores 401
    return originalFetch(url, options).then(response => {
        // Redirigir automáticamente si el token expiró o es inválido
        if (response.status === 401 && 
            isApiCall && 
            !isAuthCall &&
            !window.location.pathname.includes('/login')) {
            console.warn('⚠️ Token inválido o expirado. Redirigiendo a login...');
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('currentUser');
            sessionStorage.clear();
            setTimeout(() => {
                window.location.href = '/login';
            }, 500);
        }
        
        return response;
    });
};

/**
 * Wrapper de fetch que incluye automáticamente el token JWT
 * @param {string} url - URL de la petición
 * @param {object} options - Opciones de fetch (method, body, etc.)
 */
async function fetchWithAuth(url, options = {}) {
    const defaultOptions = {
        headers: getAuthHeaders()
    };
    
    // Merge de opciones
    const finalOptions = {
        ...defaultOptions,
        ...options,
        headers: {
            ...defaultOptions.headers,
            ...(options.headers || {})
        }
    };
    
    try {
        const response = await fetch(url, finalOptions);
        
        // Si es 401, el token expiró o es inválido
        if (response.status === 401) {
            console.warn('⚠️ Token inválido o expirado. Redirigiendo a login...');
            localStorage.removeItem('jwtToken');
            localStorage.removeItem('currentUser');
            sessionStorage.clear();
            window.location.href = '/login';
            return null;
        }
        
        return response;
    } catch (error) {
        console.error('❌ Error en petición:', error);
        throw error;
    }
}

/**
 * GET con autenticación
 */
async function apiGet(url) {
    return fetchWithAuth(url, { method: 'GET' });
}

/**
 * POST con autenticación
 */
async function apiPost(url, data) {
    return fetchWithAuth(url, {
        method: 'POST',
        body: JSON.stringify(data)
    });
}

/**
 * PUT con autenticación
 */
async function apiPut(url, data) {
    return fetchWithAuth(url, {
        method: 'PUT',
        body: JSON.stringify(data)
    });
}

/**
 * DELETE con autenticación
 */
async function apiDelete(url) {
    return fetchWithAuth(url, { method: 'DELETE' });
}

/**
 * PATCH con autenticación
 */
async function apiPatch(url, data) {
    return fetchWithAuth(url, {
        method: 'PATCH',
        body: JSON.stringify(data)
    });
}
