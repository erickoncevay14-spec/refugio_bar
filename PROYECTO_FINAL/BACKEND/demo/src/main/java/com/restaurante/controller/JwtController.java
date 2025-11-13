/*package com.restaurante.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
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
@RequestMapping("/jwt-auth")
public class JwtController {

    private final AuthenticationManager authenticationManager;
    private final JwtTokenManager jwtUtil;
    private final AuthService authService;

    public JwtController(AuthenticationManager authenticationManager, JwtTokenManager jwtUtil, AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginRequest.getUsuario(), 
                loginRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        // Generar token JWT
        String jwt = jwtUtil.generateToken(userDetails);
        
        // Obtener rol del usuario
        Usuario usuario = authService.findByUsername(loginRequest.getUsuario());
        String rol = usuario.getRol().getNombre();
        
        // Crear response con Lombok (usar setters o constructor completo)
        AuthResponse response = new AuthResponse();
        response.setToken(jwt);
        response.setUsername(userDetails.getUsername());
        response.setNombre(usuario.getNombre());
        response.setRol(rol);
        response.setUserId(usuario.getId());
        response.setMessage("Login exitoso");
        
        return ResponseEntity.ok(response);
    }

    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registro(@Valid @RequestBody RegisterRequest registerRequest) {
        // Lógica de registro + devolución de token
        Usuario nuevoUsuario = authService.registerUser(registerRequest);
        
        // Generar token para el nuevo usuario
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                registerRequest.getUsuario(),
                registerRequest.getPassword()
            )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        String jwt = jwtUtil.generateToken(userDetails);
        
        // Crear response
        AuthResponse response = new AuthResponse();
        response.setToken(jwt);
        response.setUsername(nuevoUsuario.getUsuario());
        response.setNombre(nuevoUsuario.getNombre());
        response.setRol(nuevoUsuario.getRol().getNombre());
        response.setUserId(nuevoUsuario.getId());
        response.setMessage("Registro exitoso");
        
        return ResponseEntity.ok(response);
    }
}*/