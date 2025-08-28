const  usuario="franco";
const contrseña="1234";
function login(){
    const UsusarioN=document.getElementById('usuario').value;
    const ContraseñaN=document.getElementById('password').value;

    if(usuario==UsusarioN && contrseña==ContraseñaN){
        alert("bienvenido"+usuario);

    }else{
        alert("error de contraseña intenetelo de nuevo")
    }
}

