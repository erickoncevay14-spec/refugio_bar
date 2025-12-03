import axios from 'axios';

const API_URL = 'http://localhost:8080/api/dashboard';
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

export const getDashboardStats = async () => {
  const response = await axios.get(`${API_URL}/resumen`, { headers: getAuthHeader() });
  return response.data;
};

export const getVentasSemanales = async () => {
  const response = await axios.get(`${API_URL}/ventas-semanales`, { headers: getAuthHeader() });
  return response.data;
};

export const getProductosTop = async () => {
  const response = await axios.get(`${API_URL}/top-productos`, { headers: getAuthHeader() });
  return response.data;
};
