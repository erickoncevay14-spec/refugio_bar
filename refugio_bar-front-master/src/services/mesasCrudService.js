import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/mesas';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Crear una nueva mesa
export const crearMesa = async (mesa) => {
  const response = await axios.post(`${BASE_URL}`, mesa, { headers: getAuthHeader() });
  return response.data;
};

// Eliminar una mesa
export const eliminarMesa = async (id) => {
  const response = await axios.delete(`${BASE_URL}/${id}`, { headers: getAuthHeader() });
  return response.data;
};
