import React, { useState, useEffect } from "react";
import { getAllPedidos, actualizarPedido, eliminarPedido as eliminarPedidoApi } from "../../services/pedidoService";

const Pedidos = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPedidos = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAllPedidos();
        // Si el backend devuelve paginado, usar .content, si no, usar el array directo
        const pedidosList = Array.isArray(data) ? data : data?.content || [];
        setPedidos(pedidosList);
      } catch (e) {
        setError("Error al cargar pedidos");
      }
      setLoading(false);
    };
    fetchPedidos();
  }, []);

  const cambiarEstado = async (id, estadoActual) => {
    const nuevoEstado = estadoActual === "ENTREGADO" ? "PENDIENTE" : "ENTREGADO";
    try {
      await actualizarPedido(id, { estado: nuevoEstado });
      setPedidos((prev) => prev.map((p) =>
        p.id === id ? { ...p, estado: nuevoEstado } : p
      ));
    } catch (e) {
      alert("Error al cambiar estado");
    }
  };

  const eliminarPedido = async (id) => {
    if (window.confirm("¿Seguro que deseas eliminar este pedido?")) {
      try {
        await eliminarPedidoApi(id);
        setPedidos((prev) => prev.filter((p) => p.id !== id));
      } catch (e) {
        alert("Error al eliminar pedido");
      }
    }
  };

  return (
    <section id="pedidos" className="content-section p-4">
      <h2 className="fw-bold mb-3">Pedidos</h2>
      {loading ? (
        <div className="text-center py-4">Cargando pedidos...</div>
      ) : error ? (
        <div className="text-center py-4 text-red-500">{error}</div>
      ) : (
        <div className="overflow-x-auto rounded-lg shadow">
          <table className="min-w-full bg-white">
            <thead>
              <tr className="bg-gray-800 text-white">
                <th className="py-3 px-4 text-left">ID</th>
                <th className="py-3 px-4 text-left">ID Cliente</th>
                <th className="py-3 px-4 text-left">Cliente</th>
                <th className="py-3 px-4 text-left">Mesa</th>
                <th className="py-3 px-4 text-left">Total</th>
                <th className="py-3 px-4 text-left">Cantidad</th>
                <th className="py-3 px-4 text-left">Fecha</th>
                <th className="py-3 px-4 text-left">Estado</th>
                <th className="py-3 px-4 text-left">Producto</th>
                <th className="py-3 px-4 text-left">Categoría</th>
                <th className="py-3 px-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {pedidos.length === 0 ? (
                <tr>
                  <td colSpan="10" className="text-center py-4 text-gray-500">
                    No hay pedidos disponibles
                  </td>
                </tr>
              ) : (
                pedidos.map((pedido) => {
                  // Cliente puede estar en pedido.usuario o pedido.cliente
                  const cliente = pedido.usuario || pedido.cliente || {};
                  // ID y nombre del cliente
                  const idCliente = cliente.id || '-';
                  const nombreCliente = cliente.nombre || cliente.usuario || cliente.email || '-';
                  // Mesa
                  const mesa = pedido.mesa && typeof pedido.mesa === 'object'
                    ? (pedido.mesa.numero || pedido.mesa.nombre || pedido.mesa.id || JSON.stringify(pedido.mesa))
                    : (typeof pedido.mesa === 'string' || typeof pedido.mesa === 'number')
                      ? pedido.mesa
                      : '-';
                  // Fecha
                  let fecha = pedido.fechaPedido || pedido.fecha || pedido.fechaCreacion || pedido.fechaRegistro || '-';
                  if (fecha && typeof fecha === 'string' && fecha.length > 10) fecha = fecha.substring(0, 19).replace('T', ' ');
                  // Cantidad: suma de cantidades de detalles
                  let cantidad = '-';
                  if (Array.isArray(pedido.detalles) && pedido.detalles.length > 0) {
                    cantidad = pedido.detalles.reduce((acc, d) => acc + (d.cantidad || 0), 0);
                  } else if (pedido.cantidad) {
                    cantidad = pedido.cantidad;
                  }
                  // Producto y categoría (primer producto del pedido)
                  const producto = pedido.producto?.nombre || (pedido.detalles && pedido.detalles[0]?.producto?.nombre) || pedido.producto || '-';
                  const categoria = pedido.categoria || (pedido.detalles && pedido.detalles[0]?.producto?.categoria) || (pedido.producto?.categoria) || '-';
                  return (
                    <tr key={pedido.id} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{pedido.id}</td>
                      <td className="py-2 px-4">{idCliente}</td>
                      <td className="py-2 px-4">{nombreCliente}</td>
                      <td className="py-2 px-4">{mesa}</td>
                      <td className="py-2 px-4">S/ {Number(pedido.total).toFixed(2)}</td>
                      <td className="py-2 px-4">{cantidad}</td>
                      <td className="py-2 px-4">{fecha}</td>
                      <td className="py-2 px-4">
                        {String(pedido.estado).toUpperCase() === "ENTREGADO" ? (
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-green-100 text-green-800">Entregado</span>
                        ) : (
                          <span className="inline-block px-2 py-1 text-xs font-semibold rounded bg-yellow-100 text-yellow-800">Pendiente</span>
                        )}
                      </td>
                      <td className="py-2 px-4">{producto}</td>
                      <td className="py-2 px-4">{categoria}</td>
                      <td className="py-2 px-4 flex flex-col sm:flex-row gap-2 justify-center">
                        <button
                          className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-xs"
                          onClick={() => setPedidoSeleccionado(pedido)}
                        >
                          Ver
                        </button>
                        {/* Modal de detalles del pedido */}
                        {pedidoSeleccionado && (
                         <div className="fixed inset-0 z-50 flex items-center justify-center bg-transparent">

                            <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 relative">
                              <button
                                className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-xl font-bold"
                                onClick={() => setPedidoSeleccionado(null)}
                                aria-label="Cerrar"
                              >
                                ×
                              </button>
                              <h3 className="text-2xl font-bold mb-4 text-blue-700">Detalle del Pedido</h3>
                              <div className="mb-2"><span className="font-semibold">ID:</span> {pedidoSeleccionado.id}</div>
                              <div className="mb-2"><span className="font-semibold">Cliente:</span> {pedidoSeleccionado.usuario?.nombre || pedidoSeleccionado.cliente?.nombre || '-'}</div>
                              <div className="mb-2"><span className="font-semibold">Mesa:</span> {pedidoSeleccionado.mesa?.numero || pedidoSeleccionado.mesa?.nombre || pedidoSeleccionado.mesa || '-'}</div>
                              <div className="mb-2"><span className="font-semibold">Total:</span> S/ {Number(pedidoSeleccionado.total).toFixed(2)}</div>
                              <div className="mb-2"><span className="font-semibold">Fecha:</span> {pedidoSeleccionado.fechaPedido?.substring(0, 19).replace('T', ' ') || pedidoSeleccionado.fecha || '-'}</div>
                              <div className="mb-2"><span className="font-semibold">Estado:</span> <span className={String(pedidoSeleccionado.estado).toUpperCase() === "ENTREGADO" ? "text-green-600" : "text-yellow-600"}>{String(pedidoSeleccionado.estado).charAt(0).toUpperCase() + String(pedidoSeleccionado.estado).slice(1).toLowerCase()}</span></div>
                              <div className="mb-2"><span className="font-semibold">Productos:</span>
                                <ul className="list-disc list-inside ml-2">
                                  {(pedidoSeleccionado.detalles || []).map((d, idx) => (
                                    <li key={idx}>{d.producto?.nombre || '-'} x{d.cantidad} <span className="text-gray-500">({d.producto?.categoria || '-'})</span></li>
                                  ))}
                                </ul>
                              </div>
                              <div className="mb-2"><span className="font-semibold">Categoría:</span> {pedidoSeleccionado.categoria || (pedidoSeleccionado.detalles && pedidoSeleccionado.detalles[0]?.producto?.categoria) || pedidoSeleccionado.producto?.categoria || '-'}</div>
                            </div>
                          </div>
                        )}
                       
                        {String(pedido.estado).toUpperCase() !== "ENTREGADO" ? (
                          <button
                            className="bg-yellow-400 hover:bg-yellow-500 text-white font-semibold py-1 px-3 rounded text-xs"
                            onClick={() => cambiarEstado(pedido.id, pedido.estado)}
                          >
                            Estado
                          </button>
                        ) : null}
                        <button
                          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-1 px-3 rounded text-xs"
                          onClick={() => eliminarPedido(pedido.id)}
                        >
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
};

export default Pedidos;
