import React, { useState, useEffect, useContext } from 'react';
// contenido renderizado directamente en la página (no usar PedidosList)
import { getPedidos, actualizarPedido } from '../../services/pedidoService';
import { PedidoUpdateContext } from '../../context/PedidoContext';

const ListosParaEntregar = () => {
  const [pedidos, setPedidos] = useState([]);

  const { tick } = useContext(PedidoUpdateContext);

  useEffect(() => {
    const fetchPedidos = async () => {
      try {
        // Traer todos los pedidos y filtrar en frontend por 'listo'
        const data = await getPedidos();
        const list = Array.isArray(data) ? data : data?.content || [];
        const filtrados = list.filter(p => {
          const s = (p?.estado || '').toString().toLowerCase();
          return s === 'listo';
        });
        setPedidos(filtrados);
      } catch (error) {
        console.error('Error al cargar pedidos:', error);
      }
    };
    fetchPedidos();
  }, [tick]);

  const handleAction = async (id) => {
    try {
      await actualizarPedido(id, { estado: 'listo' });
      // No eliminar el pedido de la lista, solo recargar en el próximo tick (cuando el mozo lo recoja cambiará de estado y desaparecerá)
      // Opcional: puedes mostrar un mensaje de éxito si lo deseas
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
                <button className="btn btn-action" onClick={() => handleAction(pedido.id)}>Listo</button>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
};

export default ListosParaEntregar;