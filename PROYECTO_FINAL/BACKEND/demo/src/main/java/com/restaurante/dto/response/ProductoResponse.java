package com.restaurante.dto.response;

import java.time.LocalDateTime;

public class ProductoResponse {
    // Para: Respuestas de GET/POST/PUT /api/productos
    // Datos completos del producto
    
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String categoria;
    private Integer stock;
    private Boolean disponible;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
    
    // Constructores
    public ProductoResponse() {}
    
    public ProductoResponse(Long id, String nombre, String descripcion, Double precio, 
                           String categoria, Integer stock, Boolean disponible) {
        this.id = id;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
        this.categoria = categoria;
        this.stock = stock;
        this.disponible = disponible;
    }
    
    // Getters y setters completos...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public Double getPrecio() { return precio; }
    public void setPrecio(Double precio) { this.precio = precio; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public Integer getStock() { return stock; }
    public void setStock(Integer stock) { this.stock = stock; }
    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public LocalDateTime getFechaModificacion() { return fechaModificacion; }
    public void setFechaModificacion(LocalDateTime fechaModificacion) { this.fechaModificacion = fechaModificacion; }
}