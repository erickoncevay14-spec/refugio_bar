package com.restaurante.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class UsuarioResponse {
    // Para: Respuestas de GET/POST/PUT /api/usuarios
    // Datos del usuario (SIN password por seguridad)
    
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String rol;
    private String telefono;
    private String direccion;
    private Boolean activo;
    private String avatar;
    private LocalDateTime fechaCreacion;
    private LocalDateTime ultimoAcceso;
    
    // Método utilitario
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
    
   
}