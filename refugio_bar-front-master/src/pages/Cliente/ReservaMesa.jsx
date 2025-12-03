
import React, { useState } from "react";
import { createReserva, getReservas } from "../../services/reservaService";
import { sendNuevaReserva } from "../../services/websocket/socket";
import { getMesas } from "../../services/mesasService";
import { getOcupacionesActivas } from "../../services/ocupacionService";

const ReservaMesa = () => {
  const [form, setForm] = useState({
    fecha: "",
    hora: "",
    personas: 1,
    mesaId: ""
  });
  const [mesas, setMesas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reservas, setReservas] = useState([]);
  const [checkingReservas, setCheckingReservas] = useState(false);
  const [ocupaciones, setOcupaciones] = useState([]);

  React.useEffect(() => {
    getMesas().then(res => {
      let lista = Array.isArray(res) ? res : (res.data || []);
      setMesas(lista);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);
  // Limpiar selección de mesa si ya no está disponible al cambiar fecha/hora
  React.useEffect(() => {
    if (!form.mesaId) return;
    const mesaSel = mesas.find(m => String(m.id) === String(form.mesaId));
    if (mesaSel && !esDisponible(mesaSel)) {
      setForm(f => ({ ...f, mesaId: "" }));
    }
  }, [form.mesaId, form.fecha, form.hora, reservas, mesas]);
  // Cargar reservas y ocupaciones cuando cambia fecha/hora
  React.useEffect(() => {
    if (!form.fecha || !form.hora) {
      setReservas([]);
      setOcupaciones([]);
      return;
    }
    setCheckingReservas(true);
    Promise.all([
      getReservas(),
      getOcupacionesActivas()
    ]).then(([res, ocup]) => {
      setReservas(Array.isArray(res) ? res : (res.data || []));
      setOcupaciones(Array.isArray(ocup) ? ocup : (ocup.data || []));
      setCheckingReservas(false);
    }).catch(() => setCheckingReservas(false));
  }, [form.fecha, form.hora]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const userId = localStorage.getItem("userId");
      if (!userId) throw new Error("No autenticado");
      if (!form.mesaId) throw new Error("Selecciona una mesa");
      // Combinar fecha y hora en un solo Date
      const fechaHora = new Date(`${form.fecha}T${form.hora}`);
      // Validar que no exista reserva para esa mesa y horario
      const reservas = await getReservas();
      const existeReserva = reservas.some(r => {
        const mismaMesa = (r.mesa?.id || r.mesa) == form.mesaId;
        const estadoValido = r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA';
        // Considerar reservas en la misma hora exacta (puedes mejorar con rango si lo deseas)
        const mismaHora = new Date(r.fechaHora).getTime() === fechaHora.getTime();
        return mismaMesa && estadoValido && mismaHora;
      });
      if (existeReserva) throw new Error("Ya existe una reserva para esa mesa y horario");
      const reservaPayload = {
        usuario: { id: userId },
        mesa: { id: form.mesaId },
        fechaHora,
        personas: Number(form.personas),
        estado: "PENDIENTE"
      };
      const reservaCreada = await createReserva(reservaPayload);
      sendNuevaReserva(reservaCreada); // Notifica al mozo
      alert("Reserva realizada correctamente");
      setForm({ fecha: "", hora: "", personas: 1, mesaId: "" });
    } catch (err) {
      setError(err.message || "Error al reservar");
    }
  };

  // Colores por estado y reservas
  const estadoColor = (mesa, reservada) => {
    if (reservada) return 'bg-yellow-200 border-yellow-500 text-yellow-900';
    const s = (mesa.estado || '').toLowerCase();
    if (s === 'libre' || s === 'disponible') return 'bg-green-200 border-green-500 text-green-900';
    if (s === 'ocupada' || s === 'ocupado') return 'bg-red-200 border-red-500 text-red-900';
    return 'bg-gray-200 border-gray-400 text-gray-700';
  };

  // Lógica de traslape de reservas y ocupaciones (1 hora)
  const mesaReservadaEnHorario = (mesa) => {
    if (!form.fecha || !form.hora) return false;
    const fechaSeleccionada = new Date(`${form.fecha}T${form.hora}`);
    // Reservas
    const reservada = reservas.some(r => {
      if (!r.mesa) return false;
      const idMesa = r.mesa.id || r.mesa;
      if (String(idMesa) !== String(mesa.id)) return false;
      if (!(r.estado === 'PENDIENTE' || r.estado === 'CONFIRMADA')) return false;
      const inicio = new Date(r.fechaHora);
      const fin = new Date(inicio.getTime() + 60 * 60 * 1000); // +1 hora
      return fechaSeleccionada >= inicio && fechaSeleccionada < fin;
    });
    // Ocupaciones
    const ocupada = ocupaciones.some(o => {
      if (!o.mesa) return false;
      const idMesa = o.mesa.id || o.mesa;
      if (String(idMesa) !== String(mesa.id)) return false;
      if (o.estado !== 'ACTIVA') return false;
      const inicio = new Date(o.fechaHoraInicio);
      const fin = new Date(o.fechaHoraFin);
      return fechaSeleccionada >= inicio && fechaSeleccionada < fin;
    });
    return reservada || ocupada;
  };

  const esDisponible = (mesa) => {
    // Si la mesa está reservada en ese horario, no está disponible
    if (mesaReservadaEnHorario(mesa)) return false;
    const s = (mesa.estado || '').toLowerCase();
    return s === 'libre' || s === 'disponible';
  };

  return (
    <section className="p-4 max-w-lg mx-auto">
      <h2 className="text-xl font-bold mb-4">Reservar Mesa</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="text-red-500 text-sm">{error}</div>}
        <div>
          <label className="block mb-2 font-semibold">Selecciona una mesa:</label>
          {loading || checkingReservas ? (
            <div className="text-gray-500">Cargando mesas...</div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              {mesas.map(m => {
                const reservada = mesaReservadaEnHorario(m);
                // Buscar ocupación activa para mostrar rango
                let ocupacionMsg = null;
                if (!esDisponible(m)) {
                  // Buscar ocupación activa para este horario
                  const fechaSeleccionada = form.fecha && form.hora ? new Date(`${form.fecha}T${form.hora}`) : null;
                  const ocup = ocupaciones.find(o => {
                    if (!o.mesa) return false;
                    const idMesa = o.mesa.id || o.mesa;
                    if (String(idMesa) !== String(m.id)) return false;
                    if (o.estado !== 'ACTIVA') return false;
                    const inicio = new Date(o.fechaHoraInicio);
                    const fin = new Date(o.fechaHoraFin);
                    return fechaSeleccionada && fechaSeleccionada >= inicio && fechaSeleccionada < fin;
                  });
                  if (ocup) {
                    const inicio = new Date(ocup.fechaHoraInicio);
                    const fin = new Date(ocup.fechaHoraFin);
                    ocupacionMsg = `Ocupada: ${inicio.toLocaleDateString()} ${inicio.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${fin.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
                  }
                }
                return (
                  <div key={m.id} className="flex flex-col items-center w-full">
                    <button
                      type="button"
                      className={`border rounded-xl p-5 flex flex-col items-center justify-center cursor-pointer transition-all duration-150 w-full h-32 min-h-[7rem] max-h-40
                        ${estadoColor(m, reservada)}
                        ${esDisponible(m) ? 'hover:ring-2 ring-green-400' : 'opacity-60 cursor-not-allowed'}
                        ${String(form.mesaId) === String(m.id) ? 'ring-4 ring-blue-400' : ''}`}
                      style={{ minWidth: '120px', maxWidth: '180px' }}
                      disabled={!esDisponible(m)}
                      onClick={() => esDisponible(m) && setForm(f => ({ ...f, mesaId: m.id }))}
                    >
                      <span className="font-bold text-xl mb-1">Mesa {m.numero}</span>
                      <span className="text-sm">Capacidad: {m.capacidad}</span>
                      <span className="text-sm mt-1">Estado: {reservada ? 'Reservada' : m.estado}</span>
                      {String(form.mesaId) === String(m.id) && <span className="mt-1 text-blue-700 font-semibold text-xs">Seleccionada</span>}
                    </button>
                    {/* Mensaje de ocupación si aplica */}
                    {ocupacionMsg && (
                      <span className="text-xs text-red-600 font-semibold mt-1 text-center w-full">{ocupacionMsg}</span>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
        <input
          name="fecha"
          type="date"
          value={form.fecha}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
          disabled={!form.mesaId}
        />
        <input
          name="hora"
          type="time"
          value={form.hora}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
          disabled={!form.mesaId}
        />
        <input
          name="personas"
          type="number"
          min="1"
          value={form.personas}
          onChange={handleChange}
          className="w-full px-3 py-2 border rounded"
          required
          disabled={!form.mesaId}
        />
        {/* Validación de capacidad */}
        {form.mesaId && (() => {
          const mesaSel = mesas.find(m => String(m.id) === String(form.mesaId));
          if (mesaSel && Number(form.personas) > Number(mesaSel.capacidad)) {
            return <div className="text-red-600 text-sm font-semibold">La mesa seleccionada solo admite hasta {mesaSel.capacidad} personas.</div>;
          }
          return null;
        })()}
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded w-full"
          disabled={
            loading ||
            checkingReservas ||
            !form.mesaId ||
            !esDisponible(mesas.find(m => String(m.id) === String(form.mesaId))) ||
            (form.mesaId && (() => {
              const mesaSel = mesas.find(m => String(m.id) === String(form.mesaId));
              return mesaSel && Number(form.personas) > Number(mesaSel.capacidad);
            })())
          }
        >
          Reservar
        </button>
      </form>
    </section>
  );
};

export default ReservaMesa;
