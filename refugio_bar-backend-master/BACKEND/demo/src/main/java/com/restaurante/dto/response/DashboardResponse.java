package com.restaurante.dto.response;

import java.util.List;

public class DashboardResponse {
    // Para: GET /api/dashboard/stats
    // Estadísticas del dashboard para Admin
    
    private Integer totalProductos;
    private Integer pedidosHoy;
    private Double ventasHoy;
    private Integer mesasOcupadas;
    private Integer totalMesas;
    private Integer usuariosActivos;
    private List<ProductoPopular> productosPopulares;
    private List<VentaPorHora> ventasPorHora;
    
    // Clase interna ProductoPopular
    public static class ProductoPopular {
        private String nombre;
        private Integer cantidadVendida;
        private Double ingresos;
        
        // Getters y setters
        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        
        public Integer getCantidadVendida() { return cantidadVendida; }
        public void setCantidadVendida(Integer cantidadVendida) { this.cantidadVendida = cantidadVendida; }
        
        public Double getIngresos() { return ingresos; }
        public void setIngresos(Double ingresos) { this.ingresos = ingresos; }
    }
    
    // Clase interna VentaPorHora
    public static class VentaPorHora {
        private Integer hora;
        private Double monto;
        private Integer pedidos;
        
        // Getters y setters
        public Integer getHora() { return hora; }
        public void setHora(Integer hora) { this.hora = hora; }
        
        public Double getMonto() { return monto; }
        public void setMonto(Double monto) { this.monto = monto; }
        
        public Integer getPedidos() { return pedidos; }
        public void setPedidos(Integer pedidos) { this.pedidos = pedidos; }
    }
    
    // Getters y setters de DashboardResponse
    public Integer getTotalProductos() { return totalProductos; }
    public void setTotalProductos(Integer totalProductos) { this.totalProductos = totalProductos; }
    
    public Integer getPedidosHoy() { return pedidosHoy; }
    public void setPedidosHoy(Integer pedidosHoy) { this.pedidosHoy = pedidosHoy; }
    
    public Double getVentasHoy() { return ventasHoy; }
    public void setVentasHoy(Double ventasHoy) { this.ventasHoy = ventasHoy; }
    
    public Integer getMesasOcupadas() { return mesasOcupadas; }
    public void setMesasOcupadas(Integer mesasOcupadas) { this.mesasOcupadas = mesasOcupadas; }
    
    public Integer getTotalMesas() { return totalMesas; }
    public void setTotalMesas(Integer totalMesas) { this.totalMesas = totalMesas; }
    
    public Integer getUsuariosActivos() { return usuariosActivos; }
    public void setUsuariosActivos(Integer usuariosActivos) { this.usuariosActivos = usuariosActivos; }
    
    public List<ProductoPopular> getProductosPopulares() { return productosPopulares; }
    public void setProductosPopulares(List<ProductoPopular> productosPopulares) { this.productosPopulares = productosPopulares; }
    
    public List<VentaPorHora> getVentasPorHora() { return ventasPorHora; }
    public void setVentasPorHora(List<VentaPorHora> ventasPorHora) { this.ventasPorHora = ventasPorHora; }
}
