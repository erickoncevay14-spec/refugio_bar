package com.restaurante.dto.request;

import jakarta.validation.constraints.*;

public class EstadoMesaRequest {
    // Para: PUT /api/mesas/{id}/estado
    // Cambiar estado de mesas (Mozo)
    
    @NotBlank(message = "El estado es obligatorio")
    @Pattern(regexp = "LIBRE|OCUPADA|RESERVADA|LIMPIEZA", 
             message = "El estado debe ser LIBRE, OCUPADA, RESERVADA o LIMPIEZA")
    private String estado;
    
    private Long usuarioId;
    private String notas;
    
    // Constructores, getters y setters...
    public EstadoMesaRequest() {}
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
}

