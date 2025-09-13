package com.restaurante.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Min;

@Entity
@Table(name = "ingredientes")
public class Ingrediente {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_ingrediente;
    
    @NotBlank
    private String nombre;
    
    @Min(0)
    private Double stock_actual;
    
    @NotBlank
    @Column(name = "unidad_medida") 
    private String unidadMedida;      
    
    // Constructores
    public Ingrediente() {}
    
    public Ingrediente(String nombre, Double stock_actual, String unidadMedida) {
        this.nombre = nombre;
        this.stock_actual = stock_actual;
        this.unidadMedida = unidadMedida;
    }
    
    // Getters y Setters
    public Long getId_ingrediente() {
        return id_ingrediente;
    }
    
    public void setId_ingrediente(Long id_ingrediente) {
        this.id_ingrediente = id_ingrediente;
    }
    
    public String getNombre() {
        return nombre;
    }
    
    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
    
    public Double getStock_actual() {
        return stock_actual;
    }
    
    public void setStock_actual(Double stock_actual) {
        this.stock_actual = stock_actual;
    }
    
    public String getUnidadMedida() {
        return unidadMedida;       
    }
    
    public void setUnidadMedida(String unidadMedida) {
        this.unidadMedida = unidadMedida; 
    }
}
