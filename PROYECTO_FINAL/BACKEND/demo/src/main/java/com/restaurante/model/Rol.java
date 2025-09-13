package com.restaurante.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;

@Entity
@Table(name = "roles")
public class Rol {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id_rol;
    
    @NotBlank
    @Column(name = "nombre_rol", nullable = false)
    private String nombreRol;
    
    // Constructores
    public Rol() {}
    
    public Rol(String nombreRol) {
        this.nombreRol = nombreRol;
    }
    
    // Getters y Setters
    public Long getId_rol() {
        return id_rol;
    }
    
    public void setId_rol(Long id_rol) {
        this.id_rol = id_rol;
    }
    
    public String getNombreRol() {
        return nombreRol;
    }
    
    public void setNombreRol(String nombreRol) {
        this.nombreRol = nombreRol;
    }
}