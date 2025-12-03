
import React, { useEffect, useState, useRef } from "react";
import { Chart, registerables } from "chart.js";
import { getDashboardStats, getVentasSemanales, getProductosTop } from "../../services/DasboarthService";
Chart.register(...registerables);

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalProductos: 0,
    ventasHoyMonto: 0,
    pedidosHoy: 0,
    totalUsuarios: 0,
    totalMesas: 0,
    reservasHoy: 0,
    ingresosSemanales: 0,
    productoMasVendido: "-",
  });

  const [ventasSemanales, setVentasSemanales] = useState([]);
  const [productosTop, setProductosTop] = useState([]);


  const ventasChartRef = useRef(null);
  const productosChartRef = useRef(null);

  useEffect(() => {
    cargarDashboard();
    // Escuchar evento custom para recargar dashboard
    const handler = () => cargarDashboard();
    window.addEventListener('dashboard-refresh', handler);
    // cleanup charts on unmount
    return () => {
      if (ventasChartRef.current) ventasChartRef.current.destroy();
      if (productosChartRef.current) productosChartRef.current.destroy();
      window.removeEventListener('dashboard-refresh', handler);
    };
  }, []);

  const cargarDashboard = async () => {
    try {
      const statsData = await getDashboardStats();
      setStats({
        totalProductos: statsData.totalProductos ?? statsData.totalproductos ?? 0,
        ventasHoyMonto: statsData.ventasHoy ?? statsData.ventasHoyMonto ?? 0,
        pedidosHoy: statsData.pedidosHoy ?? 0,
        totalUsuarios: statsData.totalUsuarios ?? statsData.totalusuarios ?? 0,
        totalMesas: statsData.mesasDisponibles ?? statsData.totalMesas ?? 0,
        reservasHoy: statsData.reservasHoy ?? 0,
        ingresosSemanales: statsData.ingresosSemanales ?? 0,
        productoMasVendido: statsData.productoTop ?? statsData.productoMasVendido ?? '-',
      });

      const ventas = await getVentasSemanales();
      setVentasSemanales(ventas);
      generarVentasChart(ventas);

      const productos = await getProductosTop();
      setProductosTop(productos);
      generarProductosChart(productos);
    } catch (e) {
      // fallback demo
      setStats({
        totalProductos: 0,
        ventasHoyMonto: 0,
        pedidosHoy: 0,
        totalUsuarios: 0,
        totalMesas: 0,
        reservasHoy: 0,
        ingresosSemanales: 0,
        productoMasVendido: "-",
      });
      setVentasSemanales([]);
      setProductosTop([]);
    }
  };

  const generarVentasChart = (data) => {
    if (ventasChartRef.current) ventasChartRef.current.destroy();
    const ctx = document.getElementById("ventasChart").getContext("2d");
    ventasChartRef.current = new Chart(ctx, {
      type: "line",
      data: {
        labels: ["Lun", "Mar", "Mié", "Jue", "Vie", "Sáb", "Dom"],
        datasets: [
          {
            label: "Ventas (S/.)",
            data,
            borderWidth: 2,
            tension: 0.3,
          },
        ],
      },
    });
  };

  const generarProductosChart = (data) => {
    if (productosChartRef.current) productosChartRef.current.destroy();
    const ctx = document.getElementById("productosChart").getContext("2d");
    productosChartRef.current = new Chart(ctx, {
      type: "bar",
      data: {
        labels: ["Cerveza", "Pizza", "Hamburguesa", "Refresco", "Postre"],
        datasets: [
          {
            label: "Unidades Vendidas",
            data,
            borderWidth: 1,
          },
        ],
      },
    });
  };

  return (
    <section id="dashboard" className="p-4">
      <h2 className="text-2xl font-bold mb-2 text-gray-700">Panel General</h2>
      <p className="text-gray-400 mb-6">Vista general del restaurante en tiempo real</p>

      {/* Tarjetas KPI */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <KpiCard title="Productos" value={stats.totalProductos} color="blue" />
        <KpiCard title="Ventas Hoy" value={`S/ ${stats.ventasHoyMonto}`} color="green" />
        <KpiCard title="Pedidos Hoy" value={stats.pedidosHoy} color="yellow" />
        <KpiCard title="Usuarios" value={stats.totalUsuarios} color="red" />
        <KpiCard title="Mesas Disponibles" value={stats.totalMesas} color="indigo" />
        <KpiCard title="Reservas Hoy" value={stats.reservasHoy} color="purple" />
        <KpiCard title="Ingresos Semanales" value={`S/ ${stats.ingresosSemanales}`} color="blue" />
        <KpiCard title="Producto Top" value={stats.productoMasVendido} color="green" />
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <GraphCard title="Ventas Semanales">
          <canvas id="ventasChart" className="w-full h-64"></canvas>
        </GraphCard>
        <GraphCard title="Productos Más Vendidos">
          <canvas id="productosChart" className="w-full h-64"></canvas>
        </GraphCard>
      </div>
    </section>
  );
};


// * Componentes reutilizables *
const colorMap = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  yellow: 'bg-yellow-100 text-yellow-700',
  red: 'bg-red-100 text-red-700',
  indigo: 'bg-indigo-100 text-indigo-700',
  purple: 'bg-purple-100 text-purple-700',
};

const KpiCard = ({ title, value, color }) => (
  <div className="w-full">
    <div className={`rounded-xl shadow p-4 flex flex-col gap-1 ${colorMap[color] || 'bg-gray-100 text-gray-700'}`}>
      <span className="text-xs font-semibold uppercase tracking-wide opacity-80">{title}</span>
      <span className="text-3xl font-bold">{
        typeof value === 'object' ? JSON.stringify(value) : value
      }</span>
    </div>
  </div>
);

const GraphCard = ({ title, children }) => (
  <div className="rounded-xl shadow bg-white p-4 flex flex-col gap-2">
    <div className="font-semibold text-gray-700 mb-2">{title}</div>
    <div>{children}</div>
  </div>
);

export default Dashboard;
