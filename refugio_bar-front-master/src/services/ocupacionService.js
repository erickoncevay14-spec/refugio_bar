import axios from 'axios';

const API_URL = 'http://localhost:8080/api/ocupaciones';

export const ocuparMesa = async (ocupacion) => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.post(API_URL, ocupacion, { headers });
  return response.data;
};

export const liberarOcupacion = async (id) => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.put(`${API_URL}/${id}/liberar`, {}, { headers });
  return response.data;
};

export const getOcupacionesActivas = async () => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.get(`${API_URL}/activas`, { headers });
  return response.data;
};

export const getOcupacionesPorMesaYRango = async (mesaId, inicio, fin) => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const params = { inicio, fin };
  const response = await axios.get(`${API_URL}/mesa/${mesaId}/rango`, { params, headers });
  return response.data;
};
