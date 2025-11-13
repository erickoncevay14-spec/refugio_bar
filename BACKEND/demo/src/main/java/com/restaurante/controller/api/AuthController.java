package com.restaurante.controller.api;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurante.dto.request.LoginRequest;
import com.restaurante.dto.request.RegisterRequest;
import com.restaurante.dto.response.AuthResponse;
import com.restaurante.model.Usuario;
import com.restaurante.security.jwt.JwtTokenManager;
import com.restaurante.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenManager jwtUtil;
    private final AuthService authService;

    public AuthController(AuthenticationManager authenticationManager, JwtTokenManager jwtUtil, AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            // Autenticar con Spring Security
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    loginRequest.getUsuario(),
                    loginRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Obtener usuario desde tu servicio (para nombre, rol, id)
            Usuario usuario = authService.findByUsername(loginRequest.getUsuario());

            // Generar token JWT real
            String jwt = jwtUtil.generateToken(userDetails);

            // Construir respuesta
            AuthResponse response = new AuthResponse();
            response.setToken(jwt);
            response.setUsername(usuario.getUsuario());
            response.setNombre(usuario.getNombre());
            response.setRol(usuario.getRol().getNombre());
            response.setUserId(usuario.getId());
            response.setMessage("Login exitoso");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(401).body("Credenciales inválidas");
        }
    }

    @PostMapping("/register")
    public ResponseEntity<?> register(@Valid @RequestBody RegisterRequest registerRequest) {
        try {
            if (authService.existsByUsuario(registerRequest.getUsuario())) {
                return ResponseEntity.status(409).body("El usuario ya existe");
            }
            if (authService.existsByEmail(registerRequest.getEmail())) {
                return ResponseEntity.status(409).body("El email ya está registrado");
            }

            Usuario nuevoUsuario = authService.registerUser(registerRequest);

            // Generar token tras registrarse
            Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                    registerRequest.getUsuario(),
                    registerRequest.getPassword()
                )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String jwt = jwtUtil.generateToken(userDetails);

            AuthResponse response = new AuthResponse();
            response.setToken(jwt);
            response.setUsername(nuevoUsuario.getUsuario());
            response.setNombre(nuevoUsuario.getNombre());
            response.setRol(nuevoUsuario.getRol().getNombre());
            response.setUserId(nuevoUsuario.getId());
            response.setMessage("Registro exitoso");

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("Error al registrar usuario");
        }
    }
}