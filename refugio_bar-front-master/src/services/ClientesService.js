

import axios from 'axios';
import { getRoles } from './rolesService';

const API_URL = 'http://localhost:8080/api/usuarios';
const getAuthHeader = () => {
  let token = localStorage.getItem('token') || localStorage.getItem('jwtToken');
  if (!token) {
    const maybeUser = localStorage.getItem('currentUser') || localStorage.getItem('user');
    if (maybeUser) {
      try {
        const parsed = JSON.parse(maybeUser);
        token = parsed?.token || parsed?.jwt || parsed?.accessToken || token;
      } catch (e) {}
    }
  }
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const getClientes = async () => {
  try {
    // Usar el endpoint de usuarios con filtro de rol CLIENTE
    const response = await axios.get(`${API_URL}?rol=CLIENTE`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los clientes:', error);
    throw error;
  }
};


// Crear cliente (como usuario con rol CLIENTE)
export const crearCliente = async (cliente) => {
  try {
    // Obtener el rol CLIENTE para obtener su id
    const roles = await getRoles();
    const rolCliente = Array.isArray(roles)
      ? roles.find(r => (r.nombre || '').toUpperCase() === 'CLIENTE')
      : null;
    if (!rolCliente) throw new Error('No se encontró el rol CLIENTE');

    // El backend espera: nombre, apellido, email, telefono, password, direccion, activo, rol_id
    const payload = {
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      password: cliente.password,
      direccion: cliente.direccion || '-',
      activo: typeof cliente.activo === 'boolean' ? cliente.activo : true,
      rol_id: rolCliente.id
    };
    const response = await axios.post(API_URL, payload, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al crear cliente:', error);
    throw error;
  }
};

// Editar cliente (como usuario)
export const editarCliente = async (id, cliente) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, cliente, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al editar cliente:', error);
    throw error;
  }
};

// Eliminar cliente (como usuario)
export const eliminarCliente = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar cliente:', error);
    throw error;
  }
};

// Activar/Inactivar cliente (igual que usuario)
export const cambiarEstadoCliente = async (id, activo) => {
  try {
    const boolActivo = Boolean(activo);
    const response = await axios.put(`${API_URL}/${id}`, { activo: boolActivo }, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al cambiar estado del cliente:', error);
    throw error;
  }
};
