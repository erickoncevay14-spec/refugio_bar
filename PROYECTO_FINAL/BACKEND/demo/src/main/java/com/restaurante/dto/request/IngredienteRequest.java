package com.restaurante.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;


public class IngredienteRequest {
    // Para: Parte de RecetaRequest
    // Ingredientes de las recetas (Bartender)
    
    @NotBlank(message = "El nombre del ingrediente es obligatorio")
    private String nombre;
    
    @NotNull(message = "La cantidad es obligatoria")
    @DecimalMin(value = "0.01", message = "La cantidad debe ser mayor a 0")
    private Double cantidad;
    
    @NotBlank(message = "La unidad es obligatoria")
    private String unidad; // ml, cl, oz, gotas, etc.
    
    private String notas;
    private Boolean opcional;
    
    // Constructores, getters y setters...
    public IngredienteRequest() {}
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public Double getCantidad() { return cantidad; }
    public void setCantidad(Double cantidad) { this.cantidad = cantidad; }
    public String getUnidad() { return unidad; }
    public void setUnidad(String unidad) { this.unidad = unidad; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public Boolean getOpcional() { return opcional; }
    public void setOpcional(Boolean opcional) { this.opcional = opcional; }
}

