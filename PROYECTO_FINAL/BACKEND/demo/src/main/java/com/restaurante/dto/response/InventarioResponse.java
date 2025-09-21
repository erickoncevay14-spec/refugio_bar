package com.restaurante.dto.response;

import java.time.LocalDateTime;

public class InventarioResponse {
    // Para: GET /api/inventario/bebidas
    // Estado del inventario de bebidas
    
    private Long id;
    private String nombre;
    private String tipo; // RON, VODKA, WHISKY, etc.
    private Double stock;
    private String unidad; // ml, litros, botellas
    private Double stockMinimo;
    private String estado; // DISPONIBLE, STOCK_BAJO, AGOTADO
    private Double costo;
    private String proveedor;
    private LocalDateTime ultimaActualizacion;
    private String ultimoUsuarioModificacion;
    
    // Método utilitario
    public String getEstadoStock() {
        if (stock <= 0) return "AGOTADO";
        if (stock <= stockMinimo) return "STOCK_BAJO";
        return "DISPONIBLE";
    }
    
    // Constructores, getters y setters...
    public InventarioResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public Double getStock() { return stock; }
    public void setStock(Double stock) { this.stock = stock; }
    public String getUnidad() { return unidad; }
    public void setUnidad(String unidad) { this.unidad = unidad; }  
    public Double getStockMinimo() { return stockMinimo; }
    public void setStockMinimo(Double stockMinimo) { this.stockMinimo = stockMinimo; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Double getCosto() { return costo; }
    public void setCosto(Double costo) { this.costo = costo; }  
    public String getProveedor() { return proveedor; }
    public void setProveedor(String proveedor) { this.proveedor = proveedor; }
    public LocalDateTime getUltimaActualizacion() { return ultimaActualizacion; }
    public void setUltimaActualizacion(LocalDateTime ultimaActualizacion) { this.ultimaActualizacion = ultimaActualizacion; }
    public String getUltimoUsuarioModificacion() { return ultimoUsuarioModificacion; }
    public void setUltimoUsuarioModificacion(String ultimoUsuarioModificacion) { this.ultimoUsuarioModificacion = ultimoUsuarioModificacion; }
}  