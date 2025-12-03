import React, { useEffect, useState } from "react";

const Ventas = () => {
  const [ventas, setVentas] = useState([]);
  const [filtro, setFiltro] = useState("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [fechaFin, setFechaFin] = useState("");

  useEffect(() => {
    cargarVentas();
  }, []);

  const cargarVentas = () => {
    // Simulación de API — reemplazar con fetch() a tu backend
    const dataMock = [
      {
        id: 1,
        cliente: "Juan Pérez",
        mesa: 4,
        total: 58.5,
        cantidad: 3,
        fecha: "2025-11-28",
        estado: "PAGADO",
      },
      {
        id: 2,
        cliente: "Ana Torres",
        mesa: 2,
        total: 34.0,
        cantidad: 2,
        fecha: "2025-11-29",
        estado: "PENDIENTE",
      },
      {
        id: 3,
        cliente: "Carlos Roca",
        mesa: 1,
        total: 72.8,
        cantidad: 4,
        fecha: "2025-11-30",
        estado: "PAGADO",
      },
    ];

    setVentas(dataMock);
  };

  // Filtrado por texto y fecha
  const ventasFiltradas = ventas.filter((v) => {
    const coincideTexto =
      v.cliente.toLowerCase().includes(filtro.toLowerCase()) ||
      String(v.mesa).includes(filtro);

    const fecha = new Date(v.fecha);
    const inicio = fechaInicio ? new Date(fechaInicio) : null;
    const fin = fechaFin ? new Date(fechaFin) : null;

    const coincideFecha =
      (!inicio || fecha >= inicio) && (!fin || fecha <= fin);

    return coincideTexto && coincideFecha;
  });

  const totalVentas = ventasFiltradas.reduce(
    (sum, v) => sum + v.total,
    0
  );

  return (
    <section className="p-4">
      <h2 className="text-2xl font-bold mb-2 text-gray-700">Ventas</h2>
      <p className="text-gray-400 mb-6">Historial de ventas realizadas</p>

      {/* FILTROS */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <input
          type="text"
          placeholder="Buscar cliente o mesa..."
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          value={filtro}
          onChange={(e) => setFiltro(e.target.value)}
        />
        <input
          type="date"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          value={fechaInicio}
          onChange={(e) => setFechaInicio(e.target.value)}
        />
        <input
          type="date"
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 w-full"
          value={fechaFin}
          onChange={(e) => setFechaFin(e.target.value)}
        />
        <div className="flex items-center justify-between md:justify-end w-full">
          <span className="text-lg font-semibold text-blue-600">Total: S/ {totalVentas.toFixed(2)}</span>
        </div>
      </div>

      {/* TABLA */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="min-w-full bg-white">
          <thead>
            <tr className="bg-gray-800 text-white text-center">
              <th className="py-3 px-4">ID</th>
              <th className="py-3 px-4">Cliente</th>
              <th className="py-3 px-4">Mesa</th>
              <th className="py-3 px-4">Total</th>
              <th className="py-3 px-4">Cantidad</th>
              <th className="py-3 px-4">Fecha</th>
              <th className="py-3 px-4">Estado</th>
            </tr>
          </thead>
          <tbody>
            {ventasFiltradas.length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-gray-400 py-4">
                  No hay resultados
                </td>
              </tr>
            ) : (
              ventasFiltradas.map((v) => (
                <tr key={v.id} className="border-b hover:bg-gray-50 text-center">
                  <td className="py-2 px-4">{v.id}</td>
                  <td className="py-2 px-4">{
                    v.cliente && typeof v.cliente === 'object'
                      ? v.cliente.nombre || v.cliente.id || JSON.stringify(v.cliente)
                      : v.cliente || '-'
                  }</td>
                  <td className="py-2 px-4">{
                    v.mesa && typeof v.mesa === 'object'
                      ? (v.mesa.nombre || v.mesa.numero || v.mesa.id || JSON.stringify(v.mesa))
                      : (typeof v.mesa === 'string' || typeof v.mesa === 'number')
                        ? v.mesa
                        : '-'
                  }</td>
                  <td className="py-2 px-4 font-bold text-green-600">S/ {
                    typeof v.total === 'number'
                      ? v.total.toFixed(2)
                      : (typeof v.total === 'object' && v.total !== null && v.total.monto ? Number(v.total.monto).toFixed(2) : '-')
                  }</td>
                  <td className="py-2 px-4">{
                    typeof v.cantidad === 'number' ? v.cantidad : (v.cantidad && v.cantidad.valor ? v.cantidad.valor : '-')
                  }</td>
                  <td className="py-2 px-4">{
                    typeof v.fecha === 'string' ? v.fecha : (v.fecha && v.fecha.toString ? v.fecha.toString() : '-')
                  }</td>
                  <td className="py-2 px-4">
                    <span
                      className={`inline-block px-2 py-1 text-xs font-semibold rounded ${
                        (typeof v.estado === 'string' && v.estado === "PAGADO")
                          ? "bg-green-100 text-green-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {typeof v.estado === 'string' ? v.estado : (v.estado && v.estado.nombre ? v.estado.nombre : '-')}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
};

export default Ventas;
