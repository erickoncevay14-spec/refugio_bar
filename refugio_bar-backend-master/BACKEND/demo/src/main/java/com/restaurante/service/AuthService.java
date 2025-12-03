package com.restaurante.service;

import com.restaurante.dto.request.RegisterRequest;
import com.restaurante.model.Usuario;

public interface AuthService {

    Usuario authenticate(String email, String password);

    Usuario registerUser(RegisterRequest request);

    boolean existsByEmail(String email);

    Usuario findByEmail(String email);
}