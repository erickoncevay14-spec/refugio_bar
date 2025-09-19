package com.restaurante.controller.api;

import com.restaurante.dto.request.LoginRequest;
import com.restaurante.dto.response.LoginResponse;
import com.restaurante.dto.request.RegisterRequest;
import com.restaurante.model.Usuario;
import com.restaurante.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    @Autowired
    private AuthService authService;

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest loginRequest) {
        try {
            // Por ahora sin JWT, solo validación básica
            Usuario usuario = authService.authenticate(loginRequest.getUsuario(), loginRequest.getPassword());
            
            if (usuario != null) {
                LoginResponse response = new LoginResponse();
                response.setId(usuario.getId());
                response.setUsuario(usuario.getUsuario());
                response.setNombre(usuario.getNombre());
                response.setRol(usuario.getRol().getNombre());
                response.setToken("temporal-token-" + usuario.getId()); // Token temporal
                response.setMessage("Login exitoso");
                
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("error", "Credenciales inválidas"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error en el servidor"));
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            if (authService.existsByUsuario(registerRequest.getUsuario())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "El usuario ya existe"));
            }
            
            if (authService.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "El email ya está registrado"));
            }
            
            Usuario nuevoUsuario = authService.registerUser(registerRequest);
            
            Map<String, Object> response = new HashMap<>();
            response.put("message", "Usuario registrado exitosamente");
            response.put("usuario", nuevoUsuario.getUsuario());
            
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al registrar usuario"));
        }
    }

    @GetMapping("/validate")
    public ResponseEntity<?> validateToken(@RequestHeader(value = "Authorization", required = false) String token) {
        // Validación temporal sin JWT real
        if (token != null && token.startsWith("temporal-token-")) {
            return ResponseEntity.ok(Map.of("valid", true));
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
            .body(Map.of("valid", false));
    }
}