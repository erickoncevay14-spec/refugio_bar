
import axios from 'axios';

// Cambiar estado activo/inactivo asegurando booleano
const cambiarEstadoUsuario = async (id, activo) => {
  try {
    // Forzar booleano real
    const boolActivo = Boolean(activo);
    const response = await axios.put(`${API_URL}/${id}`, { activo: boolActivo }, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al cambiar el estado del usuario:', error);
    throw error;
  }
};

const API_URL = 'http://localhost:8080/api/usuarios'; // Cambia la URL según tu backend

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

const getUsuarios = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los usuarios:', error);
    throw error;
  }
};

const crearUsuario = async (data) => {
  try {
    const response = await axios.post(API_URL, data, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al crear el usuario:', error);
    throw error;
  }
};

const actualizarUsuario = async (id, data) => {
  try {
    const response = await axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el usuario:', error);
    throw error;
  }
};

const eliminarUsuario = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el usuario:', error);
    throw error;
  }
};

const getUsuariosSinClientes = async () => {
  try {
    // Suponiendo que el backend soporta filtro por rol vía query param
    const response = await axios.get(API_URL + '?sinRol=CLIENTE', { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los usuarios sin clientes:', error);
    throw error;
  }
};

export { getUsuarios, crearUsuario, actualizarUsuario, eliminarUsuario, getUsuariosSinClientes, cambiarEstadoUsuario };