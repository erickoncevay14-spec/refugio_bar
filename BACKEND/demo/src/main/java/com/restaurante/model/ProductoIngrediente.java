package com.restaurante.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "producto_ingredientes")
public class ProductoIngrediente {
    @Id
    @ManyToOne
    @JoinColumn(name = "id_producto", nullable = false)
    private Producto producto;
    
    @Id
    @ManyToOne
    @JoinColumn(name = "id_ingrediente", nullable = false)
    private Ingrediente ingrediente;
    
    @Min(0)
    @Column(name = "cantidad_necesaria", nullable = false)
    private Double cantidadNecesaria;
    
    // Constructores
    public ProductoIngrediente() {}
    
    public ProductoIngrediente(Producto producto, Ingrediente ingrediente, Double cantidadNecesaria) {
        this.producto = producto;
        this.ingrediente = ingrediente;
        this.cantidadNecesaria = cantidadNecesaria;
    }
    
    // Getters y Setters
    public Producto getProducto() {
        return producto;
    }
    
    public void setProducto(Producto producto) {
        this.producto = producto;
    }
    
    public Ingrediente getIngrediente() {
        return ingrediente;
    }
    
    public void setIngrediente(Ingrediente ingrediente) {
        this.ingrediente = ingrediente;
    }
    
    public Double getCantidadNecesaria() {
        return cantidadNecesaria;
    }
    
    public void setCantidadNecesaria(Double cantidadNecesaria) {
        this.cantidadNecesaria = cantidadNecesaria;
    }
}