import React, { useEffect, useState } from "react";
import { getClientes, crearCliente, editarCliente, eliminarCliente, cambiarEstadoCliente } from "../../services/ClientesService";
import { getRoles } from "../../services/rolesService";
import { actualizarUsuario } from "../../services/usuariosService";

const ClientesAdmin = () => {
  const [clientes, setClientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editCliente, setEditCliente] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', telefono: '', activo: true, password: '' });
  const [saving, setSaving] = useState(false);
  const [roles, setRoles] = useState([]);
  const [editRolId, setEditRolId] = useState(null); // id del cliente que está editando rol
  const [rolSeleccionado, setRolSeleccionado] = useState({}); // { [clienteId]: rolId }

  const fetchClientes = () => {
    setLoading(true);
    getClientes()
      .then(res => {
        // Asegura que siempre sea un array
        let data = Array.isArray(res) ? res : (Array.isArray(res.data) ? res.data : []);
        setClientes(data);
        setLoading(false);
      })
      .catch(() => {
        setError("Error al cargar clientes");
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchClientes();
    getRoles().then(setRoles).catch(() => setRoles([]));
  }, []);

  // Eliminar cliente
  const handleDelete = async (id) => {
    if (!window.confirm('¿Seguro que deseas eliminar este cliente?')) return;
    try {
      await eliminarCliente(id);
      fetchClientes();
    } catch (err) {
      setError('Error al eliminar cliente');
    }
  };

  const handleEdit = (cliente) => {
    setEditCliente(cliente);
    setForm({
      nombre: cliente.nombre,
      apellido: cliente.apellido,
      email: cliente.email,
      telefono: cliente.telefono,
      activo: cliente.activo !== false,
      password: '', // No se edita contraseña
    });
    setShowModal(true);
  };

  const handleAdd = () => {
    setEditCliente(null);
    setForm({ nombre: '', apellido: '', email: '', telefono: '', activo: true, password: '' });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  // Crear o editar cliente
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      if (editCliente) {
        // Editar
        await editarCliente(editCliente.id, { ...form, password: undefined });
      } else {
        // Crear
        await crearCliente(form);
      }
      setShowModal(false);
      fetchClientes();
    } catch (err) {
      setError('Error al guardar cliente');
    }
    setSaving(false);
  };

  // Activar/Inactivar cliente
  const handleToggleActivo = async (cliente) => {
    try {
      await cambiarEstadoCliente(cliente.id, !cliente.activo);
      fetchClientes();
    } catch (err) {
      setError('Error al cambiar estado del cliente');
    }
  };

  // Cambiar rol de cliente
  const handleRolChange = (clienteId, newRolId) => {
    setRolSeleccionado(prev => ({ ...prev, [clienteId]: newRolId }));
  };

  const guardarCambioRol = async (cliente) => {
    const nuevoRolId = rolSeleccionado[cliente.id];
    if (!nuevoRolId) return;
    try {
      await actualizarUsuario(cliente.id, { rol_id: nuevoRolId });
      fetchClientes();
      setEditRolId(null);
    } catch (err) {
      setError('Error al cambiar el rol');
    }
  };

  return (
    <section className="p-4">
      <h2 className="text-xl font-bold mb-4">Clientes</h2>
      <div className="mb-4 flex justify-end">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700" onClick={handleAdd}>
          Agregar Cliente
        </button>
      </div>
      {loading ? (
        <p>Cargando...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Nombre</th>
                <th className="py-3 px-4 text-left">Apellido</th>
                <th className="py-3 px-4 text-left">Email</th>
                <th className="py-3 px-4 text-left">Teléfono</th>
                <th className="py-3 px-4 text-left">Fecha Registro</th>
                <th className="py-3 px-4 text-center">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {clientes.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No hay clientes registrados
                  </td>
                </tr>
              ) : (
                clientes.map((c) => (
                  <tr key={c.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{c.id}</td>
                    <td className="py-2 px-4">{c.nombre}</td>
                    <td className="py-2 px-4">{typeof c.apellido === 'object' ? JSON.stringify(c.apellido) : c.apellido}</td>
                    <td className="py-2 px-4">{typeof c.email === 'object' ? JSON.stringify(c.email) : c.email}</td>
                    <td className="py-2 px-4">{typeof c.telefono === 'object' ? JSON.stringify(c.telefono) : c.telefono}</td>
                    <td className="py-2 px-4">{c.fechaRegistro ? (typeof c.fechaRegistro === 'object' ? JSON.stringify(c.fechaRegistro) : new Date(c.fechaRegistro).toLocaleDateString()) : ""}</td>
                    <td className="py-2 px-4 text-center">
                      <span className={`inline-block px-2 py-1 text-xs font-semibold rounded ${c.activo !== false ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {c.activo !== false ? 'Habilitado' : 'Inhabilitado'}
                      </span>
                    </td>
                    <td className="py-2 px-4 flex flex-col sm:flex-row gap-2 justify-center">
                      <button className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-1 px-3 rounded text-xs" onClick={() => handleEdit(c)}>
                        Editar
                      </button>
                      <button className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-xs" onClick={() => handleDelete(c.id)}>
                        Eliminar
                      </button>
                      <button className={`font-semibold py-1 px-3 rounded text-xs ${c.activo !== false ? 'bg-gray-400 hover:bg-gray-500 text-white' : 'bg-green-500 hover:bg-green-600 text-white'}`} onClick={() => handleToggleActivo(c)}>
                        {c.activo !== false ? 'Inhabilitar' : 'Habilitar'}
                      </button>
                      {/* Opción para cambiar rol */}
                      {editRolId === c.id ? (
                        <div className="flex gap-2 items-center">
                          <select
                            value={rolSeleccionado[c.id] || (c.rol && c.rol.id) || ''}
                            onChange={e => handleRolChange(c.id, e.target.value)}
                            className="border rounded px-2 py-1 text-xs"
                          >
                            <option value="">Selecciona rol</option>
                            {roles.map(r => (
                              <option key={r.id} value={r.id}>{r.nombre}</option>
                            ))}
                          </select>
                          <button className="bg-blue-500 hover:bg-blue-600 text-white px-2 py-1 rounded text-xs" onClick={() => guardarCambioRol(c)}>
                            Guardar
                          </button>
                          <button className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-2 py-1 rounded text-xs" onClick={() => setEditRolId(null)}>
                            Cancelar
                          </button>
                        </div>
                      ) : (
                        <button className="bg-indigo-500 hover:bg-indigo-600 text-white px-2 py-1 rounded text-xs" onClick={() => setEditRolId(c.id)}>
                          Cambiar rol
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* Modal para agregar/editar cliente */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn border border-gray-200">
            <div className="border-b px-6 py-4 flex justify-between items-center bg-gray-100 rounded-t-xl">
              <h5 className="font-bold text-lg text-gray-800">{editCliente ? 'Editar Cliente' : 'Agregar Cliente'}</h5>
              <button className="text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowModal(false)} aria-label="Cerrar">&times;</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleSubmit}>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nombre</label>
                <input type="text" name="nombre" value={form.nombre} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Apellido</label>
                <input type="text" name="apellido" value={form.apellido} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" name="email" value={form.email} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                <input type="text" name="telefono" value={form.telefono} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
              </div>
              <div className="flex items-center mb-2">
                <input type="checkbox" name="activo" checked={form.activo} onChange={handleChange} id="clienteActivo" className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded" />
                <label htmlFor="clienteActivo" className="ml-2 block text-sm text-gray-700">Cliente activo</label>
              </div>
              {!editCliente && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Contraseña</label>
                  <input type="password" name="password" value={form.password} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400" />
                </div>
              )}
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold" disabled={saving}>{saving ? 'Guardando...' : 'Guardar'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default ClientesAdmin;
