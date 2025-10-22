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

if (passwordField && passwordMsg) {
    passwordField.addEventListener('input', function() {
        const faltantes = validarPasswordFuerte(passwordField.value);
        if (faltantes.length > 0) {
            passwordMsg.textContent = 'La contraseña debe tener: ' + faltantes.join(', ');
        } else {
            passwordMsg.textContent = '';
        }
    });
}

function irALogin(){
    window.location.href= "/login"
}