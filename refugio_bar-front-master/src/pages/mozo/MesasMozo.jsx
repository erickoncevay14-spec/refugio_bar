import React, { useEffect, useState } from "react";
import { getMesas, cambiarEstadoMesa } from "../../services/mesasService";
import { getReservas } from "../../services/reservaService";
import PedidoModal from "../../components/Mozo/PedidoModal";

// Modal simple para mostrar reservas del día
const ReservasModal = ({ open, reservas, onClose, mesa }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 w-screen h-screen z-[100] bg-black bg-opacity-40 flex items-center justify-center">
      <div
        className="bg-white rounded-2xl shadow-2xl p-4 sm:p-6 w-[95vw] max-w-md sm:max-w-lg md:max-w-xl relative animate-fadein"
        style={{ minWidth: '0', boxSizing: 'border-box' }}
      >
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-2xl sm:text-xl"
          onClick={onClose}
          aria-label="Cerrar"
        >
          &times;
        </button>
        <h3 className="text-lg sm:text-xl font-bold mb-4 text-center">Reservas de Mesa {mesa?.numero}</h3>
        {reservas.length === 0 ? (
          <div className="text-gray-500 text-center">No hay reservas para hoy.</div>
        ) : (
          <ul className="divide-y">
            {reservas.map((r) => (
              <li key={r.id} className="py-2 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div className="font-semibold truncate max-w-xs">
                  {r.usuario?.nombre || r.usuario?.username || r.usuario?.email}
                </div>
                <div className="text-sm text-gray-600 whitespace-nowrap">
                  {new Date(r.fechaHora).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })} - {r.estado}
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>
      <style>{`
        @media (max-width: 640px) {
          .animate-fadein { animation: fadein .2s; }
          @keyframes fadein { from { opacity: 0; transform: scale(.95);} to { opacity: 1; transform: scale(1);} }
        }
      `}</style>
    </div>
  );
};

const MesasMozo = () => {
  const [mesas, setMesas] = useState([]);
  const [reservas, setReservas] = useState([]);
  const [ocupaciones, setOcupaciones] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [pedidoModal, setPedidoModal] = useState({ open: false, mesa: null });
  const [reservasModal, setReservasModal] = useState({
    open: false,
    reservas: [],
    mesa: null,
  });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const mesasData = await getMesas();
        const reservasData = await getReservas();
        const { getOcupacionesActivas } = await import("../../services/ocupacionService");
        const ocupacionesData = await getOcupacionesActivas();
        setMesas(Array.isArray(mesasData) ? mesasData : []);
        setReservas(Array.isArray(reservasData) ? reservasData : []);
        // Agrupar ocupaciones por mesaId
        const agrupadas = {};
        (Array.isArray(ocupacionesData) ? ocupacionesData : []).forEach(oc => {
          if (!agrupadas[oc.mesa.id]) agrupadas[oc.mesa.id] = [];
          agrupadas[oc.mesa.id].push(oc);
        });
        setOcupaciones(agrupadas);
      } catch (e) {
        setError("Error al cargar datos");
      }
      setLoading(false);
    };
    fetchData();
  }, []);

  const getReservasHoyMesa = (mesaId) => {
    const hoy = new Date();
    return reservas.filter((r) => {
      const idMesa = r.mesa?.id || r.mesa;
      if (idMesa !== mesaId) return false;
      const fecha = new Date(r.fechaHora);
      return (
        fecha.getFullYear() === hoy.getFullYear() &&
        fecha.getMonth() === hoy.getMonth() &&
        fecha.getDate() === hoy.getDate()
      );
    });
  };

  const handleCambiarEstado = async (id, estado) => {
    try {
      await cambiarEstadoMesa(id, estado);
      setMesas(mesas.map((m) => (m.id === id ? { ...m, estado } : m)));
    } catch (e) {
      alert("Error al cambiar estado de la mesa");
    }
  };

  return (
    <section className="p-4 md:p-6">
      <h2 className="text-2xl font-bold mb-4">Mesas</h2>

      {loading ? (
        <p>Cargando mesas...</p>
      ) : error ? (
        <p className="text-red-500">{error}</p>
      ) : mesas.length === 0 ? (
        <p className="text-gray-600 text-lg">No hay mesas registradas.</p>
      ) : (
        <>
          {/* Desktop table */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full text-base">
              <thead>
                <tr>
                  <th className="px-4 py-3 text-left">Número</th>
                  <th className="px-4 py-3 text-left">Capacidad</th>
                  <th className="px-4 py-3 text-left">Estado</th>
                  <th className="px-4 py-3 text-left">Reservas hoy</th>
                  <th className="px-4 py-3 text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {mesas.map((m) => {
                  const reservasHoy = getReservasHoyMesa(m.id);
                  return (
                    <tr key={m.id} className="align-top">
                      <td className="px-4 py-3 font-semibold text-lg">{m.numero}</td>
                      <td className="px-4 py-3">{m.capacidad}</td>
                      <td className="px-4 py-3">
                        <div>{m.estado}</div>
                        {ocupaciones && ocupaciones[m.id] && ocupaciones[m.id].length > 0 && (
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
                      </td>
                      <td className="px-4 py-3">
                        {reservasHoy.length > 0 ? (
                          <button
                            className="inline-flex items-center gap-2 px-3 py-1 rounded bg-blue-100 text-blue-800 font-semibold text-sm hover:bg-blue-200 focus:outline-none"
                            onClick={() =>
                              setReservasModal({
                                open: true,
                                reservas: reservasHoy,
                                mesa: m,
                              })
                            }
                          >
                            <span className="font-bold">{reservasHoy.length}</span>{" "}
                            reserva
                            {reservasHoy.length > 1 ? "s" : ""}
                          </button>
                        ) : (
                          <span className="text-gray-400">-</span>
                        )}
                      </td>
                      <td className="px-4 py-3 flex flex-wrap gap-2 md:gap-3">
                        {["Libre", "Ocupada", "Reservada", "Limpieza"].map(
                          (estado) => (
                            <button
                              key={estado}
                              className={`px-3 py-2 rounded text-sm md:text-base font-semibold ${
                                m.estado === estado
                                  ? "bg-gray-400 text-white"
                                  : "bg-blue-500 hover:bg-blue-600 text-white"
                              }`}
                              onClick={() =>
                                handleCambiarEstado(m.id, estado)
                              }
                              disabled={m.estado === estado}
                            >
                              {estado}
                            </button>
                          )
                        )}
                        <button
                          className="px-3 py-2 rounded bg-green-500 hover:bg-green-600 text-white text-sm md:text-base font-semibold"
                          onClick={() =>
                            setPedidoModal({ open: true, mesa: m })
                          }
                        >
                          Iniciar Pedido
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {/* Mobile/Tablet cards */}
          <div className="md:hidden flex flex-col gap-4">
            {mesas.map((m) => {
              const reservasHoy = getReservasHoyMesa(m.id);
              return (
                <div key={m.id} className="rounded border border-gray-200 shadow-sm p-3 bg-white flex flex-col gap-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-base">Mesa {m.numero}</span>
                    <span className="text-xs text-gray-500">Cap: {m.capacidad}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs px-2 py-1 rounded bg-gray-100 font-semibold">{m.estado}</span>
                  </div>
                  {ocupaciones && ocupaciones[m.id] && ocupaciones[m.id].length > 0 && (
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
                  <div className="flex items-center gap-2 mt-1">
                    {reservasHoy.length > 0 ? (
                      <button
                        className="inline-flex items-center gap-2 px-2 py-1 rounded bg-blue-100 text-blue-800 font-semibold text-xs hover:bg-blue-200 focus:outline-none"
                        onClick={() =>
                          setReservasModal({
                            open: true,
                            reservas: reservasHoy,
                            mesa: m,
                          })
                        }
                      >
                        <span className="font-bold">{reservasHoy.length}</span> reserva{reservasHoy.length > 1 ? "s" : ""}
                      </button>
                    ) : (
                      <span className="text-gray-400 text-xs">-</span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {["Libre", "Ocupada", "Reservada", "Limpieza"].map((estado) => (
                      <button
                        key={estado}
                        className={`px-2 py-1 rounded text-xs font-semibold ${m.estado === estado ? "bg-gray-400 text-white" : "bg-blue-500 hover:bg-blue-600 text-white"}`}
                        onClick={() => handleCambiarEstado(m.id, estado)}
                        disabled={m.estado === estado}
                      >
                        {estado}
                      </button>
                    ))}
                    <button
                      className="px-2 py-1 rounded bg-green-500 hover:bg-green-600 text-white text-xs font-semibold"
                      onClick={() => setPedidoModal({ open: true, mesa: m })}
                    >
                      Iniciar Pedido
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* MODALES */}
      <ReservasModal
        open={reservasModal.open}
        reservas={reservasModal.reservas}
        mesa={reservasModal.mesa}
        onClose={() =>
          setReservasModal({ open: false, reservas: [], mesa: null })
        }
      />

      <PedidoModal
        open={pedidoModal.open}
        mesa={pedidoModal.mesa}
        onClose={() => setPedidoModal({ open: false, mesa: null })}
        onSubmit={(pedido) => {
          let msg = "Pedido guardado";
          if (pedido && (pedido.numero || pedido.id)) {
            msg += ` (N° ${pedido.numero || pedido.id})`;
          }
          alert(msg);
          setPedidoModal({ open: false, mesa: null });
        }}
      />
    </section>
  );
};

export default MesasMozo;
