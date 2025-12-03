import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/mesas';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Obtener todas las mesas
export const getMesas = async () => {
  const response = await axios.get(`${BASE_URL}`, { headers: getAuthHeader() });
  // Si la respuesta es {data: mesas}, devolver solo el array
  if (response.data && Array.isArray(response.data.data)) {
    return response.data.data;
  }
  return response.data;
};

// Actualizar los datos de una mesa
export const updateMesa = async (id, mesa) => {
  const response = await axios.put(`${BASE_URL}/${id}`, mesa, { headers: getAuthHeader() });
  return response.data;
};

// Cambiar el estado de una mesa (reservar, liberar, etc.)
export const cambiarEstadoMesa = async (id, estado) => {
  // El backend espera body: { estado: 'LIBRE', usuarioId: ... }
  // Buscar usuarioId en localStorage (currentUser)
  let usuarioId = null;
  try {
    const user = localStorage.getItem('currentUser');
    if (user) {
      const parsed = JSON.parse(user);
      usuarioId = parsed.id || parsed.usuarioId || parsed.userId || (parsed.usuario && parsed.usuario.id);
    }
  } catch (e) {
    console.error('Error parseando currentUser:', e);
  }
  if (!usuarioId) {
    alert('No se encontró el usuarioId en localStorage. currentUser=' + localStorage.getItem('currentUser'));
    throw new Error('No se encontró el usuarioId en localStorage');
  }
  const estadoParam = (estado || '').toUpperCase();
  const body = { estado: estadoParam, usuarioId };
  console.log('Enviando cambio de estado de mesa:', body);
  try {
    const response = await axios.put(
      `${BASE_URL}/${id}/estado`,
      body,
      { headers: getAuthHeader() }
    );
    return response.data;
  } catch (err) {
    if (err.response && err.response.data) {
      alert('Error backend: ' + JSON.stringify(err.response.data));
    }
    throw err;
  }
};