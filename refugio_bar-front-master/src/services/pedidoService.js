import axios from 'axios';

const API_URL = 'http://localhost:8080/api/pedidos'; // Cambia la URL según tu backend

const getAuthHeader = () => {
  // Soportar múltiples claves posibles donde el token puede guardarse
  let token = localStorage.getItem('token') || localStorage.getItem('jwtToken');
  if (!token) {
    // algunos flows guardan un objeto 'currentUser' o 'currentUser' como JSON
    const maybeUser = localStorage.getItem('currentUser') || localStorage.getItem('currentuser') || localStorage.getItem('user');
    if (maybeUser) {
      try {
        const parsed = JSON.parse(maybeUser);
        token = parsed?.token || parsed?.jwt || parsed?.accessToken || token;
      } catch (e) {
        // no es JSON, ignorar
      }
    }
  }
  if (token) {
    // no loguear el token en consola por seguridad; sólo indicar que se encontró
    console.debug('pedidoService: usando token para Authorization');
    return { Authorization: `Bearer ${token}` };
  }
  console.debug('pedidoService: no se encontró token en localStorage');
  return {};
};

const getPedidos = async (estado, page, size) => {
  try {
    const params = [];
    if (estado) params.push(`estado=${encodeURIComponent(estado)}`);
    if (page !== undefined && size !== undefined) {
      params.push(`page=${encodeURIComponent(page)}`);
      params.push(`size=${encodeURIComponent(size)}`);
    }
    const q = params.length ? `?${params.join('&')}` : '';
    const response = await axios.get(`${API_URL}${q}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los pedidos:', error);
    throw error;
  }
};

const getAllPedidos = async () => {
  try {
    const response = await axios.get(`${API_URL}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los pedidos:', error);
    throw error;
  }
};

const actualizarPedido = async (id, data) => {
  try {
    // Si se pasa un objeto con propiedad 'estado', el backend expone
    // PUT /api/pedidos/{id}/estado?estado=VALOR
    if (data && typeof data === 'object' && data.estado) {
      const estado = data.estado;
      const url = `${API_URL}/${id}/estado?estado=${encodeURIComponent(estado)}`;
      const response = await axios.put(url, null, { headers: getAuthHeader() });
      return response.data;
    }

    // Fallback: intentar PUT al recurso (si se esperaba otro comportamiento)
    const response = await axios.put(`${API_URL}/${id}`, data, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al actualizar el pedido:', error);
    throw error;
  }
};

const crearPedido = async (data) => {
  try {
    const response = await axios.post(API_URL, data, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al crear el pedido:', error);
    throw error;
  }
};

const eliminarPedido = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/${id}`, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el pedido:', error);
    throw error;
  }
};

export { getPedidos, getAllPedidos, actualizarPedido, crearPedido, eliminarPedido };