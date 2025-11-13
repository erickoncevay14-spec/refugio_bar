package com.restaurante.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class LoginRequest {
    // Para: POST /jwt-auth/login, POST /api/auth/login
    // Iniciar sesión
    
    @NotBlank(message = "Usuario es requerido")
    private String usuario;
    
    @NotBlank(message = "Password es requerido")
    private String password;
}