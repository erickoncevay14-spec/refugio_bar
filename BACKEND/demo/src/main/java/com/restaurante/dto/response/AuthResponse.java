package com.restaurante.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class AuthResponse {
    // Para: Respuesta de login y registro
    // Devuelve token JWT + info básica del usuario
    
    private String token;
    private String username;  // Nombre de usuario para login
    private String nombre;    // Nombre real del usuario
    private String rol;       // ADMINISTRADOR, MOZO, BARTENDER, CLIENTE
    private Long userId;      // ID del usuario
    private String message;   // Mensaje opcional (ej: "Login exitoso")
}
