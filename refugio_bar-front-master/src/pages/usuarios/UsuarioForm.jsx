import React, { useState } from 'react';
import { crearUsuario, actualizarUsuario } from "../../services/usuariosService";
import './UsuarioForm.css';

const UsuarioForm = ({ usuario, onSuccess }) => {
  const [formData, setFormData] = useState(
    usuario || { nombre: '', email: '', rol: '' }
  );

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (usuario) {
        // EDITAR
        await actualizarUsuario(usuario.id, formData);
      } else {
        // CREAR
        await crearUsuario(formData);
      }
      onSuccess();
    } catch (error) {
      console.error('Error al guardar el usuario:', error);
    }
  };

  return (
    <form className="usuario-form" onSubmit={handleSubmit}>
      <label>
        Nombre:
        <input
          type="text"
          name="nombre"
          value={formData.nombre}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Email:
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </label>

      <label>
        Rol:
        <select
          name="rol"
          value={formData.rol}
          onChange={handleChange}
          required
        >
          <option value="">Seleccionar</option>
          <option value="admin">Administrador</option>
          <option value="bartender">Bartender</option>
          <option value="mozo">Mozo</option>
        </select>
      </label>

      <button type="submit">Guardar</button>
    </form>
  );
};

export default UsuarioForm;
