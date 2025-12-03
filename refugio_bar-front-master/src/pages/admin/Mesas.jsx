import React, { useState, useEffect } from "react";
import { getMesas, updateMesa, cambiarEstadoMesa } from "../../services/mesasService";
import { ocuparMesa, getOcupacionesActivas, liberarOcupacion } from "../../services/ocupacionService";
import { crearMesa, eliminarMesa as eliminarMesaApi } from "../../services/mesasCrudService";

const Mesas = () => {
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMesas = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getMesas();
        setMesas(Array.isArray(data) ? data : []);
      } catch (e) {
        setError("Error al cargar mesas");
      }
      setLoading(false);
    };
    fetchMesas();
  }, []);

  const [busqueda, setBusqueda] = useState("");
  const [nuevaMesa, setNuevaMesa] = useState({ numero: "", capacidad: "" });
  const [editMesaId, setEditMesaId] = useState(null);
  const [editMesa, setEditMesa] = useState({ numero: "", capacidad: "", estado: "DISPONIBLE" });
  // Modal de ocupación
  const [modalOcupar, setModalOcupar] = useState({ open: false, mesa: null });
  const [ocuparForm, setOcuparForm] = useState({ fecha: "", hora: "", duracion: 1 });
  const [ocupando, setOcupando] = useState(false);
  // Ocupaciones activas por mesa
  const [ocupaciones, setOcupaciones] = useState({});
    // Cargar ocupaciones activas
    useEffect(() => {
      const fetchOcupaciones = async () => {
        try {
          const data = await getOcupacionesActivas();
          // Agrupar por mesaId
          const agrupadas = {};
          (Array.isArray(data) ? data : []).forEach(oc => {
            if (!agrupadas[oc.mesa.id]) agrupadas[oc.mesa.id] = [];
            agrupadas[oc.mesa.id].push(oc);
          });
          setOcupaciones(agrupadas);
        } catch (e) {
          setOcupaciones({});
        }
      };
      fetchOcupaciones();
    }, [mesas]);
  // Abrir modal ocupar
  const abrirModalOcupar = (mesa) => {
    // Si hay ocupación activa, precargar datos
    const ocup = ocupaciones[mesa.id]?.[0];
    if (ocup) {
      const inicio = new Date(ocup.fechaHoraInicio);
      const fin = new Date(ocup.fechaHoraFin);
      const duracion = (fin - inicio) / (60 * 60 * 1000);
      setOcuparForm({
        fecha: inicio.toISOString().slice(0, 10),
        hora: inicio.toTimeString().slice(0, 5),
        duracion: duracion > 0 ? duracion : 1
      });
    } else {
      setOcuparForm({ fecha: "", hora: "", duracion: 1 });
    }
    setModalOcupar({ open: true, mesa });
  };
  const cerrarModalOcupar = () => {
    setModalOcupar({ open: false, mesa: null });
  };
  const handleOcuparChange = (e) => {
    setOcuparForm({ ...ocuparForm, [e.target.name]: e.target.value });
  };
  const confirmarOcupar = async () => {
    if (!ocuparForm.fecha || !ocuparForm.hora || !ocuparForm.duracion) {
      alert("Completa fecha, hora y duración");
      return;
    }
    setOcupando(true);
    try {
      const inicio = new Date(`${ocuparForm.fecha}T${ocuparForm.hora}`);
      const fin = new Date(inicio.getTime() + Number(ocuparForm.duracion) * 60 * 60 * 1000);
      // Si hay ocupación activa, liberar primero
      const ocup = ocupaciones[modalOcupar.mesa.id]?.[0];
      if (ocup) {
        await liberarOcupacion(ocup.id);
      }
      await ocuparMesa({
        mesa: { id: modalOcupar.mesa.id },
        fechaHoraInicio: inicio.toISOString(),
        fechaHoraFin: fin.toISOString(),
        estado: "ACTIVA"
      });
      cerrarModalOcupar();
      const data = await getMesas();
      setMesas(Array.isArray(data) ? data : []);
    } catch (e) {
      alert("Error al ocupar/editar mesa");
    }
    setOcupando(false);
  };

  const liberarOcupacionMesa = async () => {
    const ocup = ocupaciones[modalOcupar.mesa.id]?.[0];
    if (!ocup) return;
    setOcupando(true);
    try {
      await liberarOcupacion(ocup.id);
      cerrarModalOcupar();
      const data = await getMesas();
      setMesas(Array.isArray(data) ? data : []);
    } catch (e) {
      alert("Error al liberar ocupación");
    }
    setOcupando(false);
  };

  // Agregar mesa
  const agregarMesa = async () => {
    if (!nuevaMesa.numero || !nuevaMesa.capacidad) {
      alert("Completa todos los campos");
      return;
    }
    try {
      const nueva = {
        numero: Number(nuevaMesa.numero),
        capacidad: Number(nuevaMesa.capacidad),
        estado: "DISPONIBLE"
      };
      const res = await crearMesa(nueva);
      setNuevaMesa({ numero: "", capacidad: "" });
      // Recargar mesas tras crear
      const data = await getMesas();
      setMesas(Array.isArray(data) ? data : []);
    } catch (e) {
      alert("Error al agregar mesa. Verifica que el backend acepte POST /api/mesas y que los campos sean correctos.");
    }
  };

  // Eliminar mesa
  const eliminarMesa = async (id) => {
    if (window.confirm("¿Seguro de eliminar esta mesa?")) {
      try {
        await eliminarMesaApi(id);
        const data = await getMesas();
        setMesas(Array.isArray(data) ? data : []);
      } catch (e) {
        alert("Error al eliminar mesa");
      }
    }
  };

  // Editar mesa
  const iniciarEdicion = (mesa) => {
    setEditMesaId(mesa.id);
    setEditMesa({
      numero: mesa.numero,
      capacidad: mesa.capacidad,
      estado: mesa.estado
    });
  };

  const cancelarEdicion = () => {
    setEditMesaId(null);
    setEditMesa({ numero: "", capacidad: "", estado: "DISPONIBLE" });
  };

  const guardarEdicion = async (id) => {
    try {
      await updateMesa(id, {
        numero: Number(editMesa.numero),
        capacidad: Number(editMesa.capacidad),
        estado: editMesa.estado
      });
      setEditMesaId(null);
      setEditMesa({ numero: "", capacidad: "", estado: "DISPONIBLE" });
      const data = await getMesas();
      setMesas(Array.isArray(data) ? data : []);
    } catch (e) {
      alert("Error al editar mesa");
    }
  };

  // Cambiar estado de la mesa
  const handleEstadoChange = async (id, nuevoEstado) => {
    try {
      await cambiarEstadoMesa(id, nuevoEstado);
      const data = await getMesas();
      setMesas(Array.isArray(data) ? data : []);
    } catch (e) {
      alert("Error al cambiar estado de la mesa");
    }
  };

  const mesasFiltradas = mesas.filter(
    (m) =>
      m.numero?.toString().includes(busqueda) ||
      (m.estado || '').toLowerCase().includes(busqueda.toLowerCase())
  );

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-2 text-gray-700">Administración de Mesas</h2>
      <p className="text-gray-400 mb-6">El administrador puede agregar, editar y eliminar mesas.</p>

      {/* FORMULARIO AGREGAR MESA */}
      <div className="rounded-xl shadow bg-white p-4 mb-6">
        <h5 className="font-semibold mb-3 text-gray-700">Agregar Nueva Mesa</h5>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <input
            type="number"
            placeholder="Número de mesa"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            value={nuevaMesa.numero}
            onChange={(e) => setNuevaMesa({ ...nuevaMesa, numero: e.target.value })}
          />
          <input
            type="number"
            placeholder="Capacidad"
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
            value={nuevaMesa.capacidad}
            onChange={(e) => setNuevaMesa({ ...nuevaMesa, capacidad: e.target.value })}
          />
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded w-full md:col-span-1"
            onClick={agregarMesa}
          >
            Agregar Mesa
          </button>
        </div>
      </div>

      {/* BUSCADOR */}
      <div className="mb-4">
        <input
          type="text"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          placeholder="Buscar por número o estado (disponible, ocupada...)"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
        />
      </div>

      {/* TABLA DE MESAS */}
      <div className="overflow-x-auto rounded-lg shadow">
        {loading ? (
          <div className="text-center py-4">Cargando mesas...</div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">{error}</div>
        ) : (
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-800 text-white text-center">
                <th className="py-3 px-4">ID</th>
                <th className="py-3 px-4">Número</th>
                <th className="py-3 px-4">Capacidad</th>
                <th className="py-3 px-4">Estado</th>
                <th className="py-3 px-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {mesasFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="text-center text-gray-400 py-4">
                    No hay mesas que coincidan
                  </td>
                </tr>
              ) : (
                mesasFiltradas.map((m) => (
                  <tr key={m.id} className="border-b hover:bg-gray-50 text-center">
                    <td className="py-2 px-4">{m.id}</td>
                    <td className="py-2 px-4">
                      {editMesaId === m.id ? (
                        <input
                          type="number"
                          value={editMesa.numero}
                          onChange={e => setEditMesa({ ...editMesa, numero: e.target.value })}
                          className="px-2 py-1 border rounded w-16 text-center"
                        />
                      ) : (
                        m.numero
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editMesaId === m.id ? (
                        <input
                          type="number"
                          value={editMesa.capacidad}
                          onChange={e => setEditMesa({ ...editMesa, capacidad: e.target.value })}
                          className="px-2 py-1 border rounded w-16 text-center"
                        />
                      ) : (
                        m.capacidad
                      )}
                    </td>
                    <td className="py-2 px-4">
                      {editMesaId === m.id ? (
                        <select
                          value={editMesa.estado}
                          onChange={e => setEditMesa({ ...editMesa, estado: e.target.value })}
                          className="px-2 py-1 border rounded"
                        >
                          <option value="DISPONIBLE">DISPONIBLE</option>
                          <option value="OCUPADA">OCUPADA</option>
                          <option value="RESERVADA">RESERVADA</option>
                        </select>
                      ) : (
                        <div>
                          <span
                            className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                              m.estado === "DISPONIBLE"
                                ? "bg-green-100 text-green-800"
                                : m.estado === "OCUPADA"
                                ? "bg-red-100 text-red-800"
                                : "bg-yellow-100 text-yellow-800"
                            }`}
                          >
                            {m.estado}
                          </span>
                          {/* Mostrar ocupaciones activas */}
                          {ocupaciones[m.id] && ocupaciones[m.id].length > 0 && (
                            <div className="text-xs mt-1 text-red-600 font-semibold">
                              {ocupaciones[m.id].map((oc, idx) => {
                                const inicio = new Date(oc.fechaHoraInicio);
                                const fin = new Date(oc.fechaHoraFin);
                                const f = (d) => d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
                                return (
                                  <div key={oc.id || idx}>
                                    OCUPADA<br />
                                    {f(inicio)} - {f(fin)}
                                  </div>
                                );
                              })}
                            </div>
                          )}
                        </div>
                      )}
                    </td>
                    <td className="py-2 px-4">
                      <div className="flex flex-row gap-2 justify-center">
                        {editMesaId === m.id ? (
                          <>
                            <button
                              className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded text-xs"
                              onClick={() => guardarEdicion(m.id)}
                            >
                              Guardar
                            </button>
                            <button
                              className="bg-gray-400 hover:bg-gray-500 text-white font-semibold py-1 px-3 rounded text-xs"
                              onClick={cancelarEdicion}
                            >
                              Cancelar
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-1 px-3 rounded text-xs"
                              onClick={() => iniciarEdicion(m)}
                            >
                              Editar
                            </button>
                            <button
                              className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-xs"
                              onClick={() => abrirModalOcupar(m)}
                            >
                              Ocupar
                            </button>
                            <button
                              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-xs"
                              onClick={() => eliminarMesa(m.id)}
                            >
                              Eliminar
                            </button>
                          </>
                        )}
                            {/* MODAL OCUPAR MESA */}
                            {modalOcupar.open && (
                              <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">

                                <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-xs relative">
                                  <button className="absolute top-2 right-2 text-gray-500 hover:text-gray-700" onClick={cerrarModalOcupar}>&times;</button>
                                  <h3 className="text-lg font-bold mb-2">{ocupaciones[modalOcupar.mesa.id]?.[0] ? 'Editar Ocupación' : 'Ocupar Mesa'} {modalOcupar.mesa.numero}</h3>
                                  <div className="mb-2">
                                    <label className="block text-sm mb-1">Fecha:</label>
                                    <input type="date" name="fecha" value={ocuparForm.fecha} onChange={handleOcuparChange} className="w-full border rounded px-2 py-1" />
                                  </div>
                                  <div className="mb-2">
                                    <label className="block text-sm mb-1">Hora de inicio:</label>
                                    <input type="time" name="hora" value={ocuparForm.hora} onChange={handleOcuparChange} className="w-full border rounded px-2 py-1" />
                                  </div>
                                  <div className="mb-4">
                                    <label className="block text-sm mb-1">Duración (horas):</label>
                                    <input type="number" name="duracion" min="1" max="8" value={ocuparForm.duracion} onChange={handleOcuparChange} className="w-full border rounded px-2 py-1" />
                                  </div>
                                  <div className="flex flex-col gap-2">
                                    <button
                                      className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded w-full"
                                      onClick={confirmarOcupar}
                                      disabled={ocupando || !ocuparForm.fecha || !ocuparForm.hora || !ocuparForm.duracion}
                                    >
                                      {ocupaciones[modalOcupar.mesa.id]?.[0] ? (ocupando ? 'Guardando...' : 'Guardar Cambios') : (ocupando ? 'Ocupando...' : 'Confirmar Ocupación')}
                                    </button>
                                    {ocupaciones[modalOcupar.mesa.id]?.[0] && (
                                      <button
                                        className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded w-full"
                                        onClick={liberarOcupacionMesa}
                                        disabled={ocupando}
                                      >
                                        {ocupando ? 'Liberando...' : 'Liberar y poner disponible'}
                                      </button>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>
    </section>
  );
};

export default Mesas;
