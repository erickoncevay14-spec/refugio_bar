package com.restaurante.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "productos")
public class Producto {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_producto;
    
    @NotBlank
    private String nombre;
    
    private String descripcion;
    
    @Min(0)
    private Double precio;
    
    @OneToMany(mappedBy = "producto", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ProductoIngrediente> ingredientes = new ArrayList<>();
    
    // Constructores
    public Producto() {}
    
    public Producto(String nombre, String descripcion, Double precio) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.precio = precio;
    }
    
    // Getters y Setters
    public Long getId_producto() {
        return id_producto;
    }
    
    public void setId_producto(Long id_producto) {
        this.id_producto = id_producto;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public String getDescripcion() {
        return descripcion;
    }
    
    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }
    
    public Double getPrecio() {
        return precio;
    }
    
    public void setPrecio(Double precio) {
        this.precio = precio;
    }
    
    public List<ProductoIngrediente> getIngredientes() {
        return ingredientes;
    }
    
    public void setIngredientes(List<ProductoIngrediente> ingredientes) {
        this.ingredientes = ingredientes;
    }
    
    // Método helper para agregar ingrediente
    public void addIngrediente(Ingrediente ingrediente, Double cantidadNecesaria) {
        ProductoIngrediente productoIngrediente = new ProductoIngrediente(this, ingrediente, cantidadNecesaria);
        ingredientes.add(productoIngrediente);
    }
}