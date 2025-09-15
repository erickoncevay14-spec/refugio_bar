const user = "hh";
const pass = "hh";

function validarLogin() {
    const usuario = document.getElementById("usuario").value;
    const password = document.getElementById("password").value;
    if (usuario === user && password === pass) {
        alert("login exitozop");
        console.log("login exitoso");
        window.location.href = "../HTML/index.html";
    } else {
        alert("Credenciales incorrectas");
    }
}