import axios from 'axios';

const API_URL = 'http://localhost:8080/api/auth'; // Base URL para las rutas de autenticación

// Función para iniciar sesión
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email,
      password,
    });
    // Guardar token y datos útiles en localStorage para uso del frontend
    const data = response.data;
    try {
      if (data?.token) {
        localStorage.setItem('token', data.token);
        // Also set default header for axios so subsequent requests include Authorization
        try {
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
        } catch (e) {
          console.warn('No se pudo establecer header Authorization por defecto en axios', e);
        }
      }
      if (data?.nombre) localStorage.setItem('userName', data.nombre);
      if (data?.rol) localStorage.setItem('role', data.rol);
      if (data?.userId) localStorage.setItem('userId', String(data.userId));
      // Guardar el usuario completo para compatibilidad con cambio de estado de mesa
      localStorage.setItem('currentUser', JSON.stringify(data));
    } catch (e) {
      console.warn('No se pudo guardar datos de sesión en localStorage', e);
    }

    return data; // Devuelve el token y otros datos del usuario
  } catch (error) {
    throw error.response?.data?.message || 'Error al iniciar sesión';
  }
};

// Función para registrar un nuevo usuario
export const register = async (usuario, password, nombre, rol) => {
  try {
    const response = await axios.post(`${API_URL}/registro`, {
      usuario,
      password,
      nombre,
      rol,
    });
    return response.data; // Devuelve el token y otros datos del usuario
  } catch (error) {
    throw error.response?.data?.message || 'Error al registrar usuario';
  }
};