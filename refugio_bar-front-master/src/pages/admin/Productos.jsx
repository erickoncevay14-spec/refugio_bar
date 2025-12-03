import React, { useState, useEffect } from "react";
import {
  getAllProductos,
  crearProducto,
  actualizarProducto,
  eliminarProducto
} from "../../services/productosService";

const Productos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [buscar, setBuscar] = useState("");
  const [categoria, setCategoria] = useState("");

  // Modal
  const [showModal, setShowModal] = useState(false);
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    descripcion: "",
    precio: "",
    stock: "",
    categoria: "",
    disponible: true,
  });

  useEffect(() => {
    cargarProductos();
  }, []);

  const cargarProductos = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAllProductos();
      setProductos(data);
    } catch (e) {
      setError("Error al cargar productos");
    } finally {
      setLoading(false);
    }
  };

  // FILTROS
  const productosFiltrados = productos.filter((p) => {
    const coincideNombre = p.nombre.toLowerCase().includes(buscar.toLowerCase());
    const coincideCategoria = categoria === "" || p.categoria === categoria;
    return coincideNombre && coincideCategoria;
  });

  const abrirModalProducto = () => {
    setNuevoProducto({
      nombre: "",
      descripcion: "",
      precio: "",
      stock: "",
      categoria: "",
      disponible: true,
    });
    setShowModal(true);
  };

  const cerrarModalProducto = () => setShowModal(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setNuevoProducto((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const productoRequest = {
      nombre: nuevoProducto.nombre,
      descripcion: nuevoProducto.descripcion,
      precio: Number(nuevoProducto.precio),
      categoria: nuevoProducto.categoria.toUpperCase(),
      stock: Number(nuevoProducto.stock),
      disponible: Boolean(nuevoProducto.disponible)
    };
    try {
      await crearProducto(productoRequest);
      setShowModal(false);
      cargarProductos();
      // Lanzar evento para refrescar dashboard
      window.dispatchEvent(new Event('dashboard-refresh'));
    } catch (e) {
      alert("Error al crear producto");
    }
  };

  const handleEliminar = async (id) => {
    if (!window.confirm("¿Seguro que deseas eliminar este producto?")) return;
    try {
      await eliminarProducto(id);
      cargarProductos();
    } catch (e) {
      alert("Error al eliminar producto");
    }
  };

  const handleEditar = (prod) => {
    setNuevoProducto({ ...prod });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const productoRequest = {
      nombre: nuevoProducto.nombre,
      descripcion: nuevoProducto.descripcion,
      precio: Number(nuevoProducto.precio),
      categoria: nuevoProducto.categoria.toUpperCase(),
      stock: Number(nuevoProducto.stock),
      disponible: Boolean(nuevoProducto.disponible)
    };
    try {
      await actualizarProducto(nuevoProducto.id, productoRequest);
      setShowModal(false);
      cargarProductos();
    } catch (e) {
      alert("Error al actualizar producto");
    }
  };

  return (
    <section className="content-section p-4">
      {/* Botón Nuevo Producto */}
      <div className="d-flex justify-content-end align-items-center mb-3">
        <button className="btn btn-primary" onClick={abrirModalProducto}>
          <i className="bi bi-plus"></i> Nuevo Producto
        </button>
      </div>

      {/* Modal Producto */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-fadeIn border border-gray-200">
            <div className="border-b px-6 py-4 flex justify-between items-center bg-gray-100 rounded-t-xl">
              <h5 className="font-bold text-lg text-gray-800">
                {nuevoProducto.id ? "Editar Producto" : "Nuevo Producto"}
              </h5>
              <button
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold"
                onClick={cerrarModalProducto}
                aria-label="Cerrar"
              >
                &times;
              </button>
            </div>
            <form
              className="p-6 space-y-4"
              onSubmit={nuevoProducto.id ? handleUpdate : handleSubmit}
            >
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nombre
                </label>
                <input
                  type="text"
                  name="nombre"
                  value={nuevoProducto.nombre}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Descripción
                </label>
                <textarea
                  name="descripcion"
                  value={nuevoProducto.descripcion}
                  onChange={handleChange}
                  rows="3"
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
                />
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    name="precio"
                    value={nuevoProducto.precio}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={nuevoProducto.stock}
                    onChange={handleChange}
                    required
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Categoría
                </label>
                <select
                  name="categoria"
                  value={nuevoProducto.categoria}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Seleccionar categoría</option>
                  <option value="BEBIDA">BEBIDA</option>
                  <option value="COMIDA">COMIDA</option>
                  <option value="POSTRE">POSTRE</option>
                  <option value="ENTRADA">ENTRADA</option>
                  <option value="SNACK">SNACK</option>
                </select>
              </div>
              <div className="flex items-center mb-2">
                <input
                  type="checkbox"
                  name="disponible"
                  checked={nuevoProducto.disponible}
                  onChange={handleChange}
                  id="productoDisponible"
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="productoDisponible"
                  className="ml-2 block text-sm text-gray-700"
                >
                  Producto activo
                </label>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
                  onClick={cerrarModalProducto}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Filtros */}
      <div className="row mb-4">
        <div className="col-md-4">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar producto..."
            value={buscar}
            onChange={(e) => setBuscar(e.target.value)}
          />
        </div>

        <div className="col-md-3">
          <select
            className="form-select"
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
          >
            <option value="">Todas las categorías</option>
            <option value="BEBIDAS">Bebidas</option>
            <option value="COMIDAS">Comidas</option>
            <option value="POSTRES">Postres</option>
            <option value="APERITIVOS">Aperitivos</option>
          </select>
        </div>
      </div>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Categoría</th>
              <th className="py-3 px-4 text-left">Precio</th>
              <th className="py-3 px-4 text-left">Stock</th>
              <th className="py-3 px-4 text-left">Estado</th>
              <th className="py-3 px-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {productosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center py-4 text-gray-500">
                  No se encontraron productos
                </td>
              </tr>
            ) : (
              productosFiltrados.map((prod) => (
                <tr key={prod.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{typeof prod.id === 'object' ? JSON.stringify(prod.id) : prod.id}</td>
                  <td className="py-2 px-4">{typeof prod.nombre === 'object' ? JSON.stringify(prod.nombre) : prod.nombre}</td>
                  <td className="py-2 px-4">{typeof prod.categoria === 'object' ? JSON.stringify(prod.categoria) : prod.categoria}</td>
                  <td className="py-2 px-4">{
                    typeof prod.precio === 'object'
                      ? JSON.stringify(prod.precio)
                      : 'S/ ' + Number(prod.precio).toFixed(2)
                  }</td>
                  <td className="py-2 px-4">{typeof prod.stock === 'object' ? JSON.stringify(prod.stock) : prod.stock}</td>
                  <td className="py-2 px-4">
                    {prod.disponible ? (
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">
                        Activo
                      </span>
                    ) : (
                      <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-gray-200 text-gray-600">
                        Inactivo
                      </span>
                    )}
                  </td>
                  <td className="py-2 px-4 flex flex-col sm:flex-row gap-2 justify-center">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-1 px-3 rounded text-xs"
                      onClick={() => handleEditar(prod)}
                    >
                      Editar
                    </button>
                    <button
                      className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-xs"
                      onClick={() => handleEliminar(prod.id)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Productos;