import React from "react";

const ReservaModal = ({ reserva, open, onClose }) => {
  if (!open || !reserva) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">Detalle de Reserva</h2>
        <div className="space-y-2">
          <div>
            <span className="font-semibold">Cliente:</span> {reserva.cliente || reserva.usuario?.nombre || reserva.usuario?.username || reserva.usuario?.email || '-'}
          </div>
          <div>
            <span className="font-semibold">Mesa:</span> {reserva.mesa?.numero || reserva.mesa?.id || reserva.mesa || '-'}
          </div>
          <div>
            <span className="font-semibold">Fecha:</span> {reserva.fecha || (reserva.fechaHora ? reserva.fechaHora.split('T')[0] : '')}
          </div>
          <div>
            <span className="font-semibold">Hora:</span> {reserva.hora || (reserva.fechaHora ? reserva.fechaHora.split('T')[1]?.substring(0,5) : '')}
          </div>
          <div>
            <span className="font-semibold">Personas:</span> {reserva.personas}
          </div>
          <div>
            <span className="font-semibold">Estado:</span> {reserva.estado === 'CONFIRMADA' ? (
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">Confirmada</span>
            ) : reserva.estado === 'PENDIENTE' ? (
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">Pendiente</span>
            ) : (
              <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-red-100 text-red-800">Cancelada</span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReservaModal;
