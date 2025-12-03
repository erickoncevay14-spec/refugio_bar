import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

const Reportes = () => {
  // Datos de ejemplo (puedes reemplazar con tu API)
  const ventasMensuales = [
    { mes: "Ene", total: 4200 },
    { mes: "Feb", total: 3800 },
    { mes: "Mar", total: 4700 },
    { mes: "Abr", total: 5100 },
    { mes: "May", total: 6100 },
    { mes: "Jun", total: 5900 },
  ];

  const categoriasPopulares = [
    { categoria: "Bebidas", ventas: 120 },
    { categoria: "Comidas", ventas: 90 },
    { categoria: "Postres", ventas: 70 },
    { categoria: "Snacks", ventas: 45 },
  ];

  return (
    <section id="reportes" className="content-section p-4">

      <h2 className="fw-bold mb-4">Reportes y Análisis</h2>

      {/* ===== CARDS ===== */}
      <div className="row g-3 mb-4">

        <div className="col-md-3">
          <div className="p-3 bg-primary text-white rounded shadow-sm">
            <h5>Ventas Hoy</h5>
            <h2 className="fw-bold">{typeof 520 === 'object' ? JSON.stringify(520) : 'S/ 520'}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="p-3 bg-success text-white rounded shadow-sm">
            <h5>Clientes Atendidos</h5>
            <h2 className="fw-bold">{typeof 37 === 'object' ? JSON.stringify(37) : 37}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="p-3 bg-warning text-dark rounded shadow-sm">
            <h5>Productos Vendidos</h5>
            <h2 className="fw-bold">{typeof 112 === 'object' ? JSON.stringify(112) : 112}</h2>
          </div>
        </div>

        <div className="col-md-3">
          <div className="p-3 bg-danger text-white rounded shadow-sm">
            <h5>Reservas Hoy</h5>
            <h2 className="fw-bold">{typeof 9 === 'object' ? JSON.stringify(9) : 9}</h2>
          </div>
        </div>

      </div>

      {/* ===== GRÁFICO DE LÍNEAS ===== */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header fw-bold">Ventas Mensuales</div>
        <div className="card-body" style={{ height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={ventasMensuales}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="mes" />
              <YAxis />
              <Tooltip />
              <Line type="monotone" dataKey="total" stroke="#007bff" strokeWidth={3} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== GRÁFICO DE BARRAS ===== */}
      <div className="card mb-4 shadow-sm">
        <div className="card-header fw-bold">Categorías Más Vendidas</div>
        <div className="card-body" style={{ height: "300px" }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoriasPopulares}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="categoria" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="ventas" fill="#28a745" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ===== LOOKER / IFRAME ===== */}
      <div className="card shadow-sm">
        <div className="card-header fw-bold">Reporte Looker (Integrado)</div>
        <div className="card-body">
          <p className="text-muted">
            Aquí puedes integrar Looker, Google Data Studio o dashboards externos.
          </p>

          {/* EJEMPLO DE IFRAME — reemplázalo con tu URL de Looker */}
          <div className="ratio ratio-16x9">
            <iframe
              src="https://lookerstudio.google.com/embed/reporting/xxxxxxxx"
              style={{ border: 0 }}
              allowFullScreen
              title="Looker Dashboard"
            ></iframe>
          </div>
        </div>
      </div>

    </section>
  );
};

export default Reportes;
