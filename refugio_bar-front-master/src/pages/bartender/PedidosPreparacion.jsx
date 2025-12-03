import React, { useState, useEffect, useContext } from 'react';
// contenido renderizado directamente en la página (no usar PedidosList)

import { getAllPedidos } from '../../services/pedidoService';
import { actualizarPedido } from '../../services/pedidoService';
import { PedidoUpdateContext } from '../../context/PedidoContext';

const PedidosPreparacion = () => {
  const [pedidos, setPedidos] = useState([]);

  const { tick } = useContext(PedidoUpdateContext);

  useEffect(() => {
    let mounted = true;
    const fetchPedidos = async () => {
      try {
        const data = await getAllPedidos();
        const list = Array.isArray(data) ? data : data?.content || [];
        // Mostrar solo pedidos PENDIENTE o ENVIADO o EN PREPARACION
        const filtrados = list.filter(p => {
          const s = (p?.estado || '').toString().toLowerCase();
          return s === 'pendiente' || s === 'enviado' || s === 'en preparación' || s === 'en preparacion';
        });
        if (mounted) setPedidos(filtrados);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      }
    };
    fetchPedidos();
    return () => { mounted = false; };
  }, [tick]);

  const handleAction = async (id) => {
    try {
      // Buscar el pedido actual
      const pedido = pedidos.find(p => p.id === id);
      let nuevoEstado = 'en preparación';
      if (pedido && (pedido.estado?.toLowerCase() === 'en preparación' || pedido.estado?.toLowerCase() === 'en preparacion')) {
        nuevoEstado = 'listo';
      }
      await actualizarPedido(id, { estado: nuevoEstado });
      setPedidos((prev) => prev.filter((pedido) => pedido.id !== id));
    } catch (error) {
      console.error('Error al actualizar el pedido:', error);
    }
  };

  return (
    <>
      {pedidos.length === 0 ? (
        <p className="empty">No hay pedidos</p>
      ) : (
        <div className="pedidos-grid">
          {pedidos.map((pedido) => (
            <div className="pedido-card" key={pedido.id}>
              <div className="pedido-header">
                <span className="pedido-estado">{pedido.estado}</span>
                <strong>Cliente:</strong> <span>{pedido.cliente?.nombre || 'Desconocido'}</span>
                <p><strong>Pedido:</strong> {pedido.detalles?.[0]?.producto?.nombre || 'Sin detalles'}</p>
                <p><strong>Cantidad:</strong> {pedido.detalles?.[0]?.cantidad || 0}</p>
              </div>
              <div className="pedido-actions">
                <button className="btn btn-action" onClick={() => handleAction(pedido.id)}>
                  {['pendiente', 'enviado'].includes((pedido.estado || '').toLowerCase()) ? 'Preparar' : 'Listo'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default PedidosPreparacion;