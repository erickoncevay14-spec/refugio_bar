package com.restaurante.dto.request;

import jakarta.validation.constraints.*;

public class StockRequest {
    // Para: PUT /api/inventario/bebidas/{id}/stock
    // Actualizar stock de bebidas (Bartender)
    
    @NotNull(message = "El nuevo stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Double nuevoStock;
    
    private Long usuarioId;
    
    @NotBlank(message = "El motivo es obligatorio")
    @Pattern(regexp = "RESTOCK|CONSUMO|MERMA|AJUSTE", 
             message = "Motivo inválido")
    private String motivo;
    
    private String observaciones;
    
    // Constructores, getters y setters...
    public StockRequest() {}
    public Double getNuevoStock() { return nuevoStock; }
    public void setNuevoStock(Double nuevoStock) { this.nuevoStock = nuevoStock; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getMotivo() { return motivo; }
    public void setMotivo(String motivo) { this.motivo = motivo; }
    public String getObservaciones() { return observaciones; }
    public void setObservaciones(String observaciones) { this.observaciones = observaciones; }  
}
