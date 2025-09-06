function guardarComentario() {
    const nombre = document.getElementById("nombre").value.trim();
    const comentario = document.getElementById("comentario").value.trim();

    if (nombre === "" || comentario === "") {
      alert("Por favor llena todos los campos.");
      return;
    }

    // Crear nuevo comentario en la lista
    const lista = document.querySelector("#listaComentarios ul");
    const nuevoComentario = document.createElement("li");
    nuevoComentario.className = "list-group-item";
    nuevoComentario.innerHTML = `<strong>${nombre}</strong>: ${comentario}`;

    lista.appendChild(nuevoComentario);

    // Limpiar campos
    document.getElementById("nombre").value = "";
    document.getElementById("comentario").value = "";

    // Cerrar modal
    const modal = bootstrap.Modal.getInstance(document.getElementById("comentarioModal"));
    modal.hide();
  }