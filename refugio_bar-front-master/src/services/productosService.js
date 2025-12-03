import axios from 'axios';

const BASE_URL = 'http://localhost:8080/api/productos';

export const getProductosDisponibles = async () => {
  try {
    const res = await axios.get(`${BASE_URL}/disponibles`);
    // El backend envuelve la respuesta en ApiResponse { success,msg,data }
    return res.data?.data || [];
  } catch (e) {
    console.error('Error al obtener productos disponibles:', e);
    throw e;
  }
};

export const getAllProductos = async () => {
  try {
    const res = await axios.get(`${BASE_URL}`);
    return res.data?.data || [];
  } catch (e) {
    console.error('Error al obtener todos los productos:', e);
    throw e;
  }
};

export const getProductoById = async (id) => {
  try {
    const res = await axios.get(`${BASE_URL}/${id}`);
    return res.data?.data || null;
  } catch (e) {
    console.error('Error al obtener producto por id:', e);
    throw e;
  }
};

export const crearProducto = async (producto) => {
  try {
    const res = await axios.post(BASE_URL, producto);
    return res.data?.data || null;
  } catch (e) {
    console.error('Error al crear producto:', e);
    throw e;
  }
};

export const actualizarProducto = async (id, producto) => {
  try {
    const res = await axios.put(`${BASE_URL}/${id}`, producto);
    return res.data?.data || null;
  } catch (e) {
    console.error('Error al actualizar producto:', e);
    throw e;
  }
};

export const eliminarProducto = async (id) => {
  try {
    const res = await axios.delete(`${BASE_URL}/${id}`);
    return res.data?.data || null;
  } catch (e) {
    console.error('Error al eliminar producto:', e);
    throw e;
  }
};
