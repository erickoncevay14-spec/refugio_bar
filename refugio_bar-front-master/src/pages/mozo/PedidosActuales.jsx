import React, { useState, useEffect, useRef } from 'react';
import { getAllPedidos, getPedidos, actualizarPedido } from '../../services/pedidoService';
import { connectPedidosSocket } from '../../websocket/socket';
import './PedidosActuales.css';

const PedidosActuales = () => {
  const [pedidos, setPedidos] = useState([]);
  const [loading, setLoading] = useState(false);
  const mounted = useRef(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  useEffect(() => {
    mounted.current = true;
    const load = async () => {
      try {
        setLoading(true);
        // Pedir solo pedidos no entregados y paginados para mejorar velocidad
        const fetched = await getPedidos('pendiente', currentPage, itemsPerPage);
        if (mounted.current) setPedidos(fetched || []);
      } catch (e) {
        console.error('No se pudieron cargar pedidos:', e);
      } finally {
        setLoading(false);
      }
    };
    load();

    connectPedidosSocket({
      onPedidoNuevo: (pedido) => setPedidos(prev => [pedido, ...prev]),
      onPedidoActualizado: (pedido) => {
        // Si el pedido fue marcado como entregado en el backend, lo removemos localmente
        if (String(pedido.estado || '').toLowerCase().includes('entreg')) {
          setPedidos(prev => prev.filter(p => p.id !== pedido.id));
          return;
        }
        setPedidos(prev => prev.map(p => p.id === pedido.id ? pedido : p));
      },
      onPedidoListo: (pedido) => setPedidos(prev => {
        const exists = prev.find(p => p.id === pedido.id);
        if (exists) return prev.map(p => p.id === pedido.id ? pedido : p);
        return [pedido, ...prev];
      })
    });

    return () => { mounted.current = false; };
  }, []);

  const normalizeEstadoForBackend = (estado) => {
    if (!estado) return estado;
    return String(estado).toUpperCase().replace(/\s+/g, '_');
  };

  const handleMarcarEntregado = async (id) => {
    try {
      const actual = pedidos.find(x => x.id === id);
      if (actual && String(actual.estado || '').toLowerCase().includes('entreg')) return;
      const estadoBackend = normalizeEstadoForBackend('entregado');
      await actualizarPedido(id, { estado: estadoBackend });
      setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: estadoBackend } : p));
    } catch (err) {
      console.error('Error marcando entregado:', err);
      alert('No se pudo actualizar el pedido');
    }
  };

  // Filtrar no entregados
  // Solo mostrar pedidos no entregados
  const filteredPedidos = pedidos.filter(p => !String(p.estado || '').toLowerCase().includes('entreg'));
  const totalPages = Math.max(1, Math.ceil(filteredPedidos.length / itemsPerPage));
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(filteredPedidos.length, startIndex + itemsPerPage);
  const displayedPedidos = filteredPedidos.slice(startIndex, endIndex);

  const goToPage = (page) => setCurrentPage(Math.max(1, Math.min(totalPages, page)));

  return (
    <div className="pa-container">
      <h1 className="pa-title">Pedidos actuales</h1>
      <p className="pa-sub">Mostrando solo pedidos no entregados.</p>

      <div className="pa-card">
        {loading ? (
          <div className="pa-loading"><div className="pa-spinner" /></div>
        ) : displayedPedidos.length === 0 ? (
          <div className="pa-empty">No hay pedidos en curso.</div>
        ) : (
          <>
            <table className="pa-table">
              <thead>
                <tr>
                  <th># Pedido</th>
                  <th>Mesa</th>
                  <th>Cliente</th>
                  <th>Total</th>
                  <th style={{ textAlign: 'center' }}>Estado</th>
                  <th style={{ textAlign: 'center' }}>Acción</th>
                </tr>
              </thead>
              <tbody>
                {displayedPedidos.map(p => {
                  const mesaNumero = (p.mesa && (p.mesa.numero || p.mesa.id)) || p.mesaId || '-';
                  const clienteNombre = (p.usuario && (p.usuario.nombre || p.usuario.usuario)) || p.cliente || '-';
                  const totalValue = Number(p.total ?? p.monto ?? 0);
                  const estadoLower = String(p.estado || '').toLowerCase();
                  const badgeClass = estadoLower.includes('entreg') ? 'entregado' : estadoLower.includes('list') ? 'listo' : 'pendiente';
                  return (
                    <tr key={p.id}>
                      <td data-label="# Pedido">{p.id}</td>
                      <td data-label="Mesa">{mesaNumero}</td>
                      <td data-label="Cliente">{clienteNombre}</td>
                      <td data-label="Total">S/. {totalValue.toFixed(2)}</td>
                      <td data-label="Estado" style={{ textAlign: 'center' }}>
                        <span className={`pa-badge ${badgeClass}`}>{p.estado}</span>
                      </td>
                      <td data-label="Acción" style={{ textAlign: 'center' }}>
                        {String(p.estado || '').toLowerCase() === 'listo' ? (
                          <button className="pa-btn" onClick={() => handleMarcarEntregado(p.id)}>Recoger</button>
                        ) : (
                          <button className="pa-btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>Recoger</button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="pa-footer">
              <div>
                {(() => {
                  const total = filteredPedidos.length;
                  const from = total === 0 ? 0 : startIndex + 1;
                  const to = endIndex;
                  return `Mostrando ${from} - ${to} de ${total}`;
                })()}
              </div>

              <div className="pa-pagination">
                <button onClick={() => goToPage(currentPage - 1)} disabled={currentPage === 1}>← Anterior</button>
                <span style={{ margin: '0 12px' }}>Página {currentPage} de {totalPages}</span>
                <button onClick={() => goToPage(currentPage + 1)} disabled={currentPage === totalPages}>Siguiente →</button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default PedidosActuales;
