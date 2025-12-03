import axios from 'axios';

const API_URL = 'http://localhost:8080/api/roles'; // Cambia la URL según tu backend

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

const getRoles = async () => {
  try {
    const response = await axios.get(API_URL, { headers: getAuthHeader() });
    return response.data;
  } catch (error) {
    console.error('Error al obtener los roles:', error);
    throw error;
  }
};

export { getRoles };