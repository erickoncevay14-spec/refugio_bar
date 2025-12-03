import React, { useState, useEffect } from "react";
import { getReservas, updateReserva } from '../../services/reservaService';
import { connectSocket, disconnectSocket } from '../../services/websocket/socket';
import ReservaModal from '../../components/ReservaModal';

const Reservas = () => {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [reservaSeleccionada, setReservaSeleccionada] = useState(null);
  useEffect(() => {
    const fetchReservas = async () => {
      setLoading(true);
      try {
        const data = await getReservas();
        setReservas(Array.isArray(data) ? data : []);
      } catch (e) {
        setError('Error al cargar reservas');
      }
      setLoading(false);
    };
    fetchReservas();

    // WebSocket: escuchar nuevas reservas
    connectSocket((nuevaReserva) => {
      if (!nuevaReserva) return;
      setReservas(prev => [nuevaReserva, ...prev]);
    });
    return () => disconnectSocket();
  }, []);

  // Cambiar estado y sincronizar con backend y cliente
  const cambiarEstado = async (id, nuevoEstado) => {
    try {
      const reserva = reservas.find(r => r.id === id);
      if (!reserva) return;
      const actualizada = await updateReserva(id, { ...reserva, estado: nuevoEstado });
      setReservas(reservas.map(r => r.id === id ? actualizada : r));
    } catch (e) {
      alert('Error al actualizar estado');
    }
  };

  const eliminarReserva = (id) => {
    if (window.confirm("¿Seguro que deseas eliminar esta reserva?")) {
      setReservas(reservas.filter((r) => r.id !== id));
    }
  };

  return (
    <section id="reservas" className="content-section p-4">
      <h2 className="fw-bold mb-3">Reservas</h2>
      <ReservaModal reserva={reservaSeleccionada} open={modalOpen} onClose={() => setModalOpen(false)} />
      {error && <div className="text-red-500 mb-2">{error}</div>}
      {loading ? (
        <div className="text-center py-4">Cargando reservas...</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">Cliente</th>
                <th className="py-3 px-4 text-left">Mesa</th>
                <th className="py-3 px-4 text-left">Fecha</th>
                <th className="py-3 px-4 text-left">Hora</th>
                <th className="py-3 px-4 text-left">Personas</th>
                <th className="py-3 px-4 text-left">Estado</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {reservas.length === 0 ? (
                <tr>
                  <td colSpan="8" className="text-center py-4 text-gray-500">
                    No hay reservas registradas
                  </td>
                </tr>
              ) : (
                reservas.map((reserva) => (
                  <tr key={reserva.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4">{reserva.id}</td>
                    <td className="py-2 px-4">{reserva.cliente || reserva.usuario?.nombre || reserva.usuario?.username || reserva.usuario?.email || '-'}</td>
                    <td className="py-2 px-4">{
                      reserva.mesa && typeof reserva.mesa === 'object'
                        ? (reserva.mesa.nombre || reserva.mesa.numero || reserva.mesa.id || JSON.stringify(reserva.mesa))
                        : (typeof reserva.mesa === 'string' || typeof reserva.mesa === 'number')
                          ? reserva.mesa
                          : '-'
                    }</td>
                    <td className="py-2 px-4">{reserva.fecha || (reserva.fechaHora ? reserva.fechaHora.split('T')[0] : '')}</td>
                    <td className="py-2 px-4">{reserva.hora || (reserva.fechaHora ? reserva.fechaHora.split('T')[1]?.substring(0,5) : '')}</td>
                    <td className="py-2 px-4">{reserva.personas}</td>
                    <td className="py-2 px-4">
                      {reserva.estado === "CONFIRMADA" ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">Confirmada</span>
                      ) : reserva.estado === "PENDIENTE" ? (
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">Pendiente</span>
                      ) : (
                        <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">Cancelada</span>
                      )}
                    </td>
                    <td className="py-2 px-4 flex flex-col sm:flex-row gap-2 justify-center">
                      <button
                        className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-xs"
                        onClick={() => { setReservaSeleccionada(reserva); setModalOpen(true); }}
                      >
                        Ver
                      </button>
                      {reserva.estado !== "CONFIRMADA" && reserva.estado !== "CANCELADA" && (
                        <>
                          <button
                            className="bg-green-500 hover:bg-green-600 text-white font-semibold py-1 px-3 rounded text-xs"
                            onClick={() => cambiarEstado(reserva.id, "CONFIRMADA")}
                          >
                            Confirmar
                          </button>
                          <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-1 px-3 rounded text-xs"
                            onClick={() => cambiarEstado(reserva.id, "CANCELADA")}
                          >
                            Cancelar
                          </button>
                          <button
                            className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-xs"
                            onClick={() => eliminarReserva(reserva.id)}
                          >
                            Eliminar
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Reservas;
