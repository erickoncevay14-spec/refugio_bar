package com.restaurante.dto.response;

public class IngredienteResponse {
    // Para: Parte de RecetaResponse
    // Ingredientes con datos completos
    
    private Long id;
    private String nombre;
    private Double cantidad;
    private String unidad;
    private String notas;
    private Boolean opcional;
    private Boolean disponibleEnStock; // Si está disponible en inventario
    
    // Método utilitario
    public String getCantidadFormateada() {
        if (cantidad % 1 == 0) {
            return cantidad.intValue() + " " + unidad;
        }
        return cantidad + " " + unidad;
    }
    
    // Constructores, getters y setters...
    public IngredienteResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
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
    public Boolean getDisponibleEnStock() { return disponibleEnStock; }
    public void setDisponibleEnStock(Boolean disponibleEnStock) { this.disponibleEnStock = disponibleEnStock; }
}