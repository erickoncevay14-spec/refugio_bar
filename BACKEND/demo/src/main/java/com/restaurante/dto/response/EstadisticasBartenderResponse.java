package com.restaurante.dto.response;

import java.util.List;

public class EstadisticasBartenderResponse {
    // Para: GET /api/estadisticas/bartender/{id}
    // Estadísticas específicas del bartender
    
    private Integer bebidasPreparadasHoy;
    private Integer bebidasPreparadasSemana;
    private Double tiempoPromedioPreparacion;
    private Integer pedidosPendientes;
    private Double eficiencia; // Porcentaje
    private List<BebidaPopular> bebidasMasPreparadas;
    private List<TiempoPorCategoria> tiemposPorCategoria;
    
    // Clase interna BebidaPopular
    public static class BebidaPopular {
        private String nombre;
        private Integer cantidad;
        private Double tiempoPromedio;
        
        // Getters y setters
        public String getNombre() { return nombre; }
        public void setNombre(String nombre) { this.nombre = nombre; }
        
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
        
        public Double getTiempoPromedio() { return tiempoPromedio; }
        public void setTiempoPromedio(Double tiempoPromedio) { this.tiempoPromedio = tiempoPromedio; }
    }
    
    // Clase interna TiempoPorCategoria
    public static class TiempoPorCategoria {
        private String categoria;
        private Double tiempoPromedio;
        private Integer cantidad;
        
        // Getters y setters
        public String getCategoria() { return categoria; }
        public void setCategoria(String categoria) { this.categoria = categoria; }
        
        public Double getTiempoPromedio() { return tiempoPromedio; }
        public void setTiempoPromedio(Double tiempoPromedio) { this.tiempoPromedio = tiempoPromedio; }
        
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    }
    
    // Getters y setters de EstadisticasBartenderResponse
    public Integer getBebidasPreparadasHoy() { return bebidasPreparadasHoy; }
    public void setBebidasPreparadasHoy(Integer bebidasPreparadasHoy) { this.bebidasPreparadasHoy = bebidasPreparadasHoy; }
    
    public Integer getBebidasPreparadasSemana() { return bebidasPreparadasSemana; }
    public void setBebidasPreparadasSemana(Integer bebidasPreparadasSemana) { this.bebidasPreparadasSemana = bebidasPreparadasSemana; }
    
    public Double getTiempoPromedioPreparacion() { return tiempoPromedioPreparacion; }
    public void setTiempoPromedioPreparacion(Double tiempoPromedioPreparacion) { this.tiempoPromedioPreparacion = tiempoPromedioPreparacion; }
    
    public Integer getPedidosPendientes() { return pedidosPendientes; }
    public void setPedidosPendientes(Integer pedidosPendientes) { this.pedidosPendientes = pedidosPendientes; }
    
    public Double getEficiencia() { return eficiencia; }
    public void setEficiencia(Double eficiencia) { this.eficiencia = eficiencia; }
    
    public List<BebidaPopular> getBebidasMasPreparadas() { return bebidasMasPreparadas; }
    public void setBebidasMasPreparadas(List<BebidaPopular> bebidasMasPreparadas) { this.bebidasMasPreparadas = bebidasMasPreparadas; }
    
    public List<TiempoPorCategoria> getTiemposPorCategoria() { return tiemposPorCategoria; }
    public void setTiemposPorCategoria(List<TiempoPorCategoria> tiemposPorCategoria) { this.tiemposPorCategoria = tiemposPorCategoria; }
}
