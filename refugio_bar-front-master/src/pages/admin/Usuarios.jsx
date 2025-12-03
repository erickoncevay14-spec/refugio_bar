import React, { useState, useEffect } from "react";
import { getUsuariosSinClientes, actualizarUsuario, cambiarEstadoUsuario } from "../../services/usuariosService";
import { getRoles } from "../../services/rolesService";

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  useEffect(() => {
    getUsuariosSinClientes()
      .then(res => {
        let data = [];
        if (Array.isArray(res)) {
          data = res;
        } else if (res && typeof res === 'object') {
          // Busca la primera propiedad tipo array
          const arrProp = Object.values(res).find(v => Array.isArray(v));
          data = arrProp || [];
        }
        setUsuarios(data);
      })
      .catch(() => {
        // Manejo de error si lo deseas
      });
  }, []);

  const [filtroNombre, setFiltroNombre] = useState("");
  const [filtroRol, setFiltroRol] = useState("");

  // FILTROS
  let usuariosFiltrados = Array.isArray(usuarios) ? usuarios : [];
  usuariosFiltrados = usuariosFiltrados.filter((u) => {
    const coincideNombre =
      (u.nombre || "").toLowerCase().includes(filtroNombre.toLowerCase()) ||
      (u.apellido || "").toLowerCase().includes(filtroNombre.toLowerCase()) ||
      (u.usuario || "").toLowerCase().includes(filtroNombre.toLowerCase());

    const coincideRol = filtroRol === "" || u.rol === filtroRol.toUpperCase();

    return coincideNombre && coincideRol;
  });

  // Cambiar estado activo/inactivo en backend
  const cambiarEstado = async (id) => {
    const usuario = usuarios.find((u) => u.id === id);
    if (!usuario) return;
    const nuevoActivo = !(usuario.activo === true);
    try {
      await cambiarEstadoUsuario(id, nuevoActivo);
      // Refrescar lista desde backend
      const actualizados = await getUsuariosSinClientes();
      let dataArr = Array.isArray(actualizados) ? actualizados : (Array.isArray(actualizados.data) ? actualizados.data : []);
      setUsuarios(dataArr);
    } catch (err) {
      alert("Error al cambiar el estado del usuario");
    }
  };

  // Modal de edición
  const [showModal, setShowModal] = useState(false);
  const [editUser, setEditUser] = useState(null);
  const [form, setForm] = useState({ nombre: '', apellido: '', email: '', telefono: '', rol: '' });
  const [roles, setRoles] = useState([]);

  useEffect(() => {
    getRoles().then(setRoles).catch(() => setRoles([]));
  }, []);

  const editarUsuario = (id) => {
    const usuario = usuarios.find(u => u.id === id);
    if (!usuario) return;
    setEditUser(usuario);
    setForm({
      nombre: usuario.nombre || '',
      apellido: usuario.apellido || '',
      email: usuario.email || '',
      telefono: usuario.telefono || '',
      rol: (typeof usuario.rol === 'object' && usuario.rol !== null) ? usuario.rol.id : ''
    });
    setShowModal(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!editUser) return;
    try {
      // Buscar el objeto rol por id
      const rolObj = roles.find(r => String(r.id) === String(form.rol));
      const data = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        telefono: form.telefono,
        rol_id: rolObj ? rolObj.id : null
      };
      await actualizarUsuario(editUser.id, data);
      // Refrescar lista desde backend
      const actualizados = await getUsuariosSinClientes();
      let dataArr = Array.isArray(actualizados) ? actualizados : (Array.isArray(actualizados.data) ? actualizados.data : []);
      setUsuarios(dataArr);
      setShowModal(false);
      setEditUser(null);
    } catch (err) {
      alert('Error al actualizar usuario');
    }
  };

  return (
    <section id="usuarios" className="content-section p-4">

      {/* Filtros */}
      <form
        className="mb-4 flex flex-col sm:flex-row gap-2"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="text"
          id="filtroNombre"
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          placeholder="Buscar por nombre"
          value={filtroNombre}
          onChange={(e) => setFiltroNombre(e.target.value)}
        />

        <select
          id="filtroRol"
          className="w-full sm:w-auto px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={filtroRol}
          onChange={(e) => setFiltroRol(e.target.value)}
        >
          <option value="">Todos los roles</option>
          <option value="cliente">CLIENTE</option>
          <option value="mozo">MOZO</option>
          <option value="bartender">BARTENDER</option>
          <option value="admin">ADMIN</option>
        </select>
      </form>

      {/* Tabla */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-800 text-white">
              <th className="py-3 px-4 text-left">ID</th>
              <th className="py-3 px-4 text-left">Usuario</th>
              <th className="py-3 px-4 text-left">Nombre</th>
              <th className="py-3 px-4 text-left">Apellido</th>
              <th className="py-3 px-4 text-left">Email</th>
              <th className="py-3 px-4 text-left">Rol</th>
              <th className="py-3 px-4 text-left">Acción</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No se encontraron usuarios
                </td>
              </tr>
            ) : (
              usuariosFiltrados.map((u) => (
                <tr key={u.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-4">{u.id}</td>
                  <td className="py-2 px-4">{u.usuario}</td>
                  <td className="py-2 px-4">{typeof u.nombre === 'object' ? JSON.stringify(u.nombre) : u.nombre}</td>
                  <td className="py-2 px-4">{typeof u.apellido === 'object' ? JSON.stringify(u.apellido) : u.apellido}</td>
                  <td className="py-2 px-4">{typeof u.email === 'object' ? JSON.stringify(u.email) : u.email}</td>
                  <td className="py-2 px-4">{
                    typeof u.rol === 'object' && u.rol !== null
                      ? u.rol.nombre
                      : u.rol
                  }</td>
                  <td className="py-2 px-4 flex flex-col sm:flex-row gap-2">
                    <button
                      className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-1 px-3 rounded text-xs"
                      onClick={() => editarUsuario(u.id)}
                    >
                      Editar
                    </button>
                    <button
                      className={
                        u.activo
                          ? "bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded text-xs"
                          : "bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-xs"
                      }
                      onClick={() => cambiarEstado(u.id)}
                      title={u.activo ? "Desactivar" : "Activar"}
                    >
                      {u.activo ? "Desactivar" : "Activar"}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {/* Modal de edición de usuario */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-md animate-fadeIn border border-gray-200">
            <div className="border-b px-6 py-4 flex justify-between items-center bg-gray-100 rounded-t-xl">
              <h5 className="font-bold text-lg text-gray-800">Editar Usuario</h5>
              <button className="text-gray-400 hover:text-gray-700 text-2xl font-bold" onClick={() => setShowModal(false)} aria-label="Cerrar">&times;</button>
            </div>
            <form className="p-6 space-y-4" onSubmit={handleSave}>
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
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rol</label>
                <select name="rol" value={form.rol} onChange={handleChange} required className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400">
                  <option value="">Selecciona un rol</option>
                  {roles.map(r => (
                    <option key={r.id} value={r.id}>{r.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold" onClick={() => setShowModal(false)}>Cancelar</button>
                <button type="submit" className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </section>
  );
};

export default Usuarios;
