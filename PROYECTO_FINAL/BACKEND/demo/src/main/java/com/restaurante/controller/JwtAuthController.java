package com.restaurante.controller;

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

import com.restaurante.dto.request.RegisterRequest;
import com.restaurante.model.Usuario;
import com.restaurante.security.dto.AuthRequest;
import com.restaurante.security.dto.AuthResponse;
import com.restaurante.security.jwt.JwtUtil;
import com.restaurante.service.AuthService;

@RestController
@RequestMapping("/jwt-auth")
public class JwtAuthController {

    private final AuthenticationManager authenticationManager;
    private final JwtUtil jwtUtil;
    private final AuthService authService;

    public JwtAuthController(AuthenticationManager authenticationManager, JwtUtil jwtUtil, AuthService authService) {
        this.authenticationManager = authenticationManager;
        this.jwtUtil = jwtUtil;
        this.authService = authService;
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest authRequest) {
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                authRequest.getUsername(), 
                authRequest.getPassword()
            )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        
        // Generar token JWT
        String jwt = jwtUtil.generateToken(userDetails);
        
        // Obtener rol del usuario
        Usuario usuario = authService.findByUsername(authRequest.getUsername());
        String rol = usuario.getRol().getNombre();
        
        return ResponseEntity.ok(new AuthResponse(jwt, userDetails.getUsername(), rol));
    }

    @PostMapping("/registro")
    public ResponseEntity<AuthResponse> registro(@RequestBody RegisterRequest registerRequest) {
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
        
        return ResponseEntity.ok(new AuthResponse(
                jwt,
                nuevoUsuario.getUsuario(),
                nuevoUsuario.getRol().getNombre()));
    }
}