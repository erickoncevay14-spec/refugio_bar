// Mostrar/Ocultar contraseña
const togglePassword = document.getElementById('togglePassword');
const passwordField = document.getElementById('clave');

if (togglePassword && passwordField) {
    togglePassword.addEventListener('click', () => {
        const type = passwordField.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordField.setAttribute('type', type);
        togglePassword.classList.toggle('bi-eye-slash');
    });
}


// ==================== VALIDACIONES EN TIEMPO REAL ====================

// Validación de contraseña fuerte en tiempo real
const passwordMsg = document.getElementById('passwordMsg');

function validarPasswordFuerte(pw) {
    const requisitos = [];
    if (!pw.match(/[A-Z]/)) requisitos.push('una mayúscula');
    if (!pw.match(/[a-z]/)) requisitos.push('una minúscula');
    if (!pw.match(/[0-9]/)) requisitos.push('un número');
    if (!pw.match(/[!@#$%^&*()_+\[\]{};':"|,.<>/?-]/)) requisitos.push('un símbolo');
    if (pw.length < 8) requisitos.push('mínimo 8 caracteres');
    return requisitos;
}

function nombreValido(nombre) {
    const regex = /^[a-zA-Z\s]+$/;
    return regex.test(nombre);
}

if (passwordField && passwordMsg) {
    passwordField.addEventListener('input', function() {
        const faltantes = validarPasswordFuerte(passwordField.value);
        if (passwordField.value.length > 0) {
            if (faltantes.length > 0) {
                passwordMsg.textContent = ' La contraseña debe tener: ' + faltantes.join(', ');
                passwordMsg.style.color = '#dc3545';
                passwordField.style.borderColor = '#dc3545';
            } else {
                passwordMsg.textContent = 'Contraseña válida';
                passwordMsg.style.color = '#28a745';
                passwordField.style.borderColor = '#28a745';
            }
        } else {
            passwordMsg.textContent = '';
            passwordField.style.borderColor = '';
        }
    });
}

// Validación de nombre (solo letras y espacio y maximo 10 caracteres)
const nombreField = document.getElementById('nombre');
const nombreMsg = document.createElement('div');
nombreMsg.id = 'nombreMsg';
nombreMsg.style.cssText = 'font-size: 0.875em; margin-top: 4px;';

if (nombreField) {
    nombreField.parentElement.appendChild(nombreMsg);
    
    nombreField.addEventListener('input', function() {
        const valor = nombreField.value;
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
        
        if (valor.length > 0) {
            if (!regex.test(valor) || /\d/.test(valor)) {
                nombreMsg.textContent = ' Solo se permiten letras y espacios';
                nombreMsg.style.color = '#dc3545';
                nombreField.style.borderColor = '#dc3545';
            } else if (valor.trim().length >= 2) {
                nombreMsg.textContent = ' Nombre válido';
                nombreMsg.style.color = '#28a745';
                nombreField.style.borderColor = '#28a745';
            }else if (valor.trim().length<2){
                nombreMsg.textContent = ' Mínimo 2 caracteres';
                nombreMsg.style.color = '#ffc107';
                nombreField.style.borderColor = '#ffc107';
            }
            } else if (valor.trim().length<2){
                nombreMsg.textContent = ' Mínimo 2 caracteres';
                nombreMsg.style.color = '#ffc107';
                nombreField.style.borderColor = '#ffc107';
            
        } else {
            nombreMsg.textContent = '';
            nombreField.style.borderColor = '';
        }
    });
}

// Validación de apellido (solo letras y espacios)
const apellidoField = document.getElementById('apellido');
const apellidoMsg = document.createElement('div');
apellidoMsg.id = 'apellidoMsg';
apellidoMsg.style.cssText = 'font-size: 0.875em; margin-top: 4px;';

if (apellidoField) {
    apellidoField.parentElement.appendChild(apellidoMsg);
    
    apellidoField.addEventListener('input', function() {
        const valor = apellidoField.value;
        const regex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]*$/;
        
        if (valor.length > 0) {
            if (!regex.test(valor) || /\d/.test(valor)) {
                apellidoMsg.textContent = ' Solo se permiten letras y espacios';
                apellidoMsg.style.color = '#dc3545';
                apellidoField.style.borderColor = '#dc3545';
            } else if (valor.trim().length >= 2) {
                apellidoMsg.textContent = 'Apellido válido';
                apellidoMsg.style.color = '#28a745';
                apellidoField.style.borderColor = '#28a745';
            } else {
                apellidoMsg.textContent = 'Mínimo 2 caracteres';
                apellidoMsg.style.color = '#ffc107';
                apellidoField.style.borderColor = '#ffc107';
            }
        } else {
            apellidoMsg.textContent = '';
            apellidoField.style.borderColor = '';
        }
    });
}

// Validación de email
const correoField = document.getElementById('correo');
const correoMsg = document.createElement('div');
correoMsg.id = 'correoMsg';
correoMsg.style.cssText = 'font-size: 0.875em; margin-top: 4px;';

if (correoField) {
    correoField.parentElement.appendChild(correoMsg);
    
    correoField.addEventListener('input', function() {
        const valor = correoField.value;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        
        if (valor.length > 0) {
            if (emailRegex.test(valor)) {
                correoMsg.textContent = ' Email válido';
                correoMsg.style.color = '#28a745';
                correoField.style.borderColor = '#28a745';
            } else {
                correoMsg.textContent = ' Email inválido (ejemplo: usuario@gmail.com)';
                correoMsg.style.color = '#dc3545';
                correoField.style.borderColor = '#dc3545';
            }
        } else {
            correoMsg.textContent = '';
            correoField.style.borderColor = '';
        }
    });
}

// Validación de usuario (mínimo 3 caracteres, sin espacios)
const usuarioField = document.getElementById('usuario');
const usuarioMsg = document.createElement('div');
usuarioMsg.id = 'usuarioMsg';
usuarioMsg.style.cssText = 'font-size: 0.875em; margin-top: 4px;';

if (usuarioField) {
    usuarioField.parentElement.appendChild(usuarioMsg);
    
    usuarioField.addEventListener('input', function() {
        const valor = usuarioField.value;
        
        if (valor.length > 0) {
            if (/\s/.test(valor)) {
                usuarioMsg.textContent = ' No se permiten espacios';
                usuarioMsg.style.color = '#dc3545';
                usuarioField.style.borderColor = '#dc3545';
            } else if (valor.length < 3) {
                usuarioMsg.textContent = ' Mínimo 3 caracteres';
                usuarioMsg.style.color = '#ffc107';
                usuarioField.style.borderColor = '#ffc107';
            } else {
                usuarioMsg.textContent = ' Usuario válido';
                usuarioMsg.style.color = '#28a745';
                usuarioField.style.borderColor = '#28a745';
            }
        } else {
            usuarioMsg.textContent = '';
            usuarioField.style.borderColor = '';
        }
    });
}

// Validación de teléfono (solo números, 9-15 dígitos)
const telefonoField = document.getElementById('telefono');
const telefonoMsg = document.createElement('div');
telefonoMsg.id = 'telefonoMsg';
telefonoMsg.style.cssText = 'font-size: 0.875em; margin-top: 4px;';

if (telefonoField) {
    telefonoField.parentElement.appendChild(telefonoMsg);
    
    telefonoField.addEventListener('input', function() {
        const valor = telefonoField.value;
        const numeroRegex = /^[0-9]*$/;
        
        if (valor.length > 0) {
            if (!numeroRegex.test(valor)) {
                telefonoMsg.textContent = ' Solo se permiten números';
                telefonoMsg.style.color = '#dc3545';
                telefonoField.style.borderColor = '#dc3545';
            } else if (valor.length <= 9) {
                telefonoMsg.textContent = ' teléfono  valido ';
                telefonoMsg.style.color = '#0ee255ff';
                telefonoField.style.borderColor = '#12ee30ff';
            }else if (valor.length > 9) {
                telefonoMsg.textContent = ' máximo 9 dígitos';
                telefonoMsg.style.color = '#dc3545';
                telefonoField.style.borderColor = '#dc3545';
            }
        } else {
            telefonoMsg.textContent = '';
            telefonoField.style.borderColor = '';
        }
    });
}

function irALogin(){
    window.location.href= "/login"
}

// ==================== FUNCIÓN PRINCIPAL DE REGISTRO ====================
async function registrar(event) {
    event.preventDefault();
    
    // Limpiar errores previos
    limpiarErrores();
    
    // Recoger datos del formulario
    const formData = {
        usuario: document.getElementById('usuario').value.trim(),
        email: document.getElementById('correo').value.trim(),
        password: document.getElementById('clave').value,
        nombre: document.getElementById('nombre').value.trim(),
        apellido: document.getElementById('apellido').value.trim(),
        telefono: document.getElementById('telefono').value.trim()
    };
    
    try {
        const response = await fetch('http://localhost:8080/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        const data = await response.json();
        
        if (!response.ok) {
            // Si hay errores de validación del backend
            if (data.errors) {
                mostrarErrores(data.errors);
            } else {
                mostrarError('general', data.message || 'Error al registrar usuario');
            }
            return;
        }
        
        // Registro exitoso
        if (data.token) {
            // Guardar token en localStorage
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            localStorage.setItem('role', data.role);
            
            // Redirigir según el rol
            switch(data.role) {
                case 'ADMINISTRADOR':
                    window.location.href = '/admin/admin';
                    break;
                case 'MOZO':
                    window.location.href = '/mozo/mozo';
                    break;
                case 'BARTENDER':
                    window.location.href = '/bartender/bartender';
                    break;
                default:
                    window.location.href = '/';
            }
        }
        
    } catch (error) {
        console.error('Error en registro:', error);
        mostrarError('general', 'Error de conexión. Por favor, intenta de nuevo.');
    }
}

// ==================== MOSTRAR ERRORES DE VALIDACIÓN ====================
function mostrarErrores(errors) {
    // Mapeo de campos del backend al HTML
    const campoMap = {
        'usuario': 'usuario',
        'email': 'correo',
        'password': 'clave',
        'nombre': 'nombre',
        'apellido': 'apellido',
        'telefono': 'telefono'
    };
    
    Object.keys(errors).forEach(campo => {
        const campoId = campoMap[campo] || campo;
        mostrarError(campoId, errors[campo]);
    });
}

// ==================== MOSTRAR UN ERROR ESPECÍFICO ====================
function mostrarError(campoId, mensaje) {
    if (campoId === 'general') {
        // Error general (sin campo específico)
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-message';
        errorDiv.style.cssText = 'color: #dc3545; background: #f8d7da; padding: 10px; border-radius: 5px; margin-bottom: 15px; border: 1px solid #f5c6cb;';
        errorDiv.textContent = mensaje;
        
        const form = document.querySelector('form');
        form.insertBefore(errorDiv, form.firstChild);
        return;
    }
    
    const campo = document.getElementById(campoId);
    if (!campo) return;
    
    // Agregar clase de error al input
    campo.style.borderColor = '#dc3545';
    
    // Crear y agregar mensaje de error
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.style.cssText = 'color: #dc3545; font-size: 0.875em; margin-top: 4px;';
    errorDiv.textContent = mensaje;
    
    // Insertar después del campo o después del contenedor si tiene uno
    const parent = campo.parentElement;
    if (parent.classList.contains('password-container')) {
        parent.parentElement.insertBefore(errorDiv, parent.nextSibling);
    } else {
        parent.insertBefore(errorDiv, campo.nextSibling);
    }
}

// ==================== LIMPIAR TODOS LOS ERRORES ====================
function limpiarErrores() {
    // Remover todos los mensajes de error
    document.querySelectorAll('.error-message').forEach(error => error.remove());
    
    // Restaurar el estilo de los inputs
    document.querySelectorAll('input').forEach(input => {
        input.style.borderColor = '';
    });
}

// ==================== EVENT LISTENERS ====================
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    if (form) {
        form.addEventListener('submit', registrar);
    }
    
    // Limpiar error del campo cuando el usuario empieza a escribir
    ['usuario', 'correo', 'nombre', 'apellido', 'telefono', 'clave'].forEach(id => {
        const campo = document.getElementById(id);
        if (campo) {
            campo.addEventListener('input', function() {
                // Limpiar error de este campo específico
                this.style.borderColor = '';
                const parent = this.parentElement;
                const errorDiv = parent.querySelector('.error-message') || 
                                parent.parentElement.querySelector('.error-message');
                if (errorDiv) {
                    errorDiv.remove();
                }
            });
        }
    });
});