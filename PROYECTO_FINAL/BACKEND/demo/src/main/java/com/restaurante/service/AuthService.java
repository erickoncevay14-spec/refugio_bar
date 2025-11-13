package com.restaurante.service;

import com.restaurante.dto.request.RegisterRequest;
import com.restaurante.model.Usuario;

public interface AuthService {
    
    Usuario authenticate(String username, String password);
    
    Usuario registerUser(RegisterRequest request);
    
    boolean existsByUsuario(String usuario);
    
    boolean existsByEmail(String email);
    
    Usuario findByUsername(String username);
}