import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/reservas';

// Obtener todas las reservas
export const getReservas = async () => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.get(`${BASE_URL}`, { headers });
  return response.data;
};

// Crear una nueva reserva
export const createReserva = async (reserva) => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.post(`${BASE_URL}`, reserva, { headers });
  return response.data;
};

// Actualizar una reserva existente
export const updateReserva = async (id, reserva) => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.put(`${BASE_URL}/${id}`, reserva, { headers });
  return response.data;
};

// Eliminar una reserva
export const deleteReserva = async (id) => {
  const token = localStorage.getItem('token');
  const headers = token ? { Authorization: `Bearer ${token}` } : {};
  const response = await axios.delete(`${BASE_URL}/${id}`, { headers });
  return response.data;
};