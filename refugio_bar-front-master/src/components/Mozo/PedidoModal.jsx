

import React, { useEffect, useState } from "react";

import { crearPedido } from "../../services/pedidoService";
import { getProductosDisponibles } from "../../services/productosService";

// Utilidad para descargar un archivo por URL
const descargarArchivo = (url, nombre) => {
  fetch(url, { credentials: 'include' })
    .then(resp => resp.blob())
    .then(blob => {
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(blob);
      link.download = nombre;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    });
};



const PedidoModal = ({ open, onClose, mesa, onSubmit }) => {
  const [productos, setProductos] = useState([]);
  const [productoId, setProductoId] = useState("");
  const [cantidad, setCantidad] = useState(1);
  const [personas, setPersonas] = useState(1);
  const [descripcion, setDescripcion] = useState("");
  const [metodoPago, setMetodoPago] = useState("");
  const [montoPagado, setMontoPagado] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [lastPedidoId, setLastPedidoId] = useState(null);

  useEffect(() => {
    if (open) {
      getProductosDisponibles().then(setProductos).catch(() => setProductos([]));
      setProductoId("");
      setCantidad(1);
      setPersonas(1);
      setDescripcion("");
      setMetodoPago("");
      setMontoPagado(0);
      setError("");
      setSuccess(false);
    }
  }, [open]);

  if (!open) return null;

  const selectedProducto = productos.find(p => String(p.id) === String(productoId));
  const total = selectedProducto ? (selectedProducto.precio * cantidad) : 0;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (!mesa) throw new Error("No se ha seleccionado una mesa");
      if (!productoId) throw new Error("Selecciona un producto");
      if (cantidad < 1) throw new Error("Cantidad inválida");
      if (personas < 1) throw new Error("Cantidad de personas inválida");
      if (!metodoPago) throw new Error("Selecciona un método de pago");
      if (montoPagado < total) throw new Error("El monto pagado debe ser igual o mayor al total");
      // Obtener usuarioId del mozo logueado
      let usuarioId = null;
      try {
        const user = localStorage.getItem('currentUser');
        if (user) {
          const parsed = JSON.parse(user);
          usuarioId = parsed.id || parsed.usuarioId || parsed.userId || (parsed.usuario && parsed.usuario.id);
        }
      } catch (e) {}
      const body = {
        usuarioId,
        mesaId: mesa.id,
        personas,
        descripcion,
        metodoPago,
        montoPagado,
        items: [
          { productoId, cantidad }
        ]
      };
      console.log('Enviando pedido:', body);
      const pedido = await crearPedido(body);
      setSuccess(true);
      if (pedido && pedido.id) {
        setLastPedidoId(pedido.id);
        const url = `http://localhost:8080/api/pedidos/${pedido.id}/comprobante`;
        descargarArchivo(url, `comprobante_${pedido.id}.pdf`);
      }
      if (onSubmit) onSubmit(pedido);
    } catch (err) {
      if (err?.response?.data) {
        alert('Error backend: ' + JSON.stringify(err.response.data));
      }
      setError(err?.response?.data?.message || err.message || "Error al crear el pedido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md p-6 relative animate-fade-in">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl font-bold"
          onClick={onClose}
        >
          &times;
        </button>
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-700">
          {mesa ? `Pedido para Mesa ${mesa.numero}` : "Nuevo Pedido"}
        </h2>
        {success ? (
          <div className="text-green-600 text-center font-semibold py-6">
            ¡Pedido creado correctamente!<br />
            {lastPedidoId && (
              <a
                href={`http://localhost:8080/api/pedidos/${lastPedidoId}/comprobante`}
                target="_blank"
                rel="noopener noreferrer"
                className="block mt-4 text-blue-700 underline"
              >
                Descargar comprobante PDF
              </a>
            )}
            <div className="mt-4">
              <button
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                onClick={onClose}
              >
                Cerrar
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block mb-1 font-semibold">Producto</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={productoId}
                onChange={e => setProductoId(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Selecciona un producto</option>
                {productos.map(p => (
                  <option key={p.id} value={p.id}>{p.nombre}</option>
                ))}
              </select>
            </div>
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Cantidad</label>
                <input
                  type="number"
                  min={1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={cantidad}
                  onChange={e => setCantidad(Number(e.target.value))}
                  required
                  disabled={loading}
                />
              </div>
              <div className="flex-1">
                <label className="block mb-1 font-semibold">Personas</label>
                <input
                  type="number"
                  min={1}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2"
                  value={personas}
                  onChange={e => setPersonas(Number(e.target.value))}
                  required
                  disabled={loading}
                />
              </div>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Total</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-gray-100"
                value={selectedProducto ? `$${total.toFixed(2)}` : "-"}
                readOnly
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Método de Pago</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={metodoPago}
                onChange={e => setMetodoPago(e.target.value)}
                required
                disabled={loading}
              >
                <option value="">Selecciona método de pago</option>
                <option value="EFECTIVO">Efectivo</option>
                <option value="TARJETA">Tarjeta</option>
                <option value="YAPE">Yape</option>
                <option value="PLIN">Plin</option>
              </select>
            </div>
            <div>
              <label className="block mb-1 font-semibold">Monto Pagado</label>
              <input
                type="number"
                min={total}
                step="0.01"
                className="w-full border border-gray-300 rounded-lg px-3 py-2"
                value={montoPagado}
                onChange={e => setMontoPagado(Number(e.target.value))}
                required
                disabled={loading}
              />
            </div>
            <div>
              <label className="block mb-1 font-semibold">Descripción</label>
              <textarea
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows={3}
                placeholder="Detalle del pedido..."
                value={descripcion}
                onChange={e => setDescripcion(e.target.value)}
                required
                disabled={loading}
              />
            </div>
            {error && <div className="text-red-500 text-sm">{error}</div>}
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                className="px-4 py-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 font-semibold"
                onClick={onClose}
                disabled={loading}
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 font-semibold"
                disabled={loading}
              >
                {loading ? "Guardando..." : "Guardar Pedido"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default PedidoModal;
