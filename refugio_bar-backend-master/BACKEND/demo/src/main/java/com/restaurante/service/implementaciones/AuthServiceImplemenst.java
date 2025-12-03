package com.restaurante.service.implementaciones;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.restaurante.dto.request.RegisterRequest;
import com.restaurante.model.Rol;
import com.restaurante.model.Usuario;
import com.restaurante.repository.RolRepository;
import com.restaurante.repository.UsuarioRepository;
import com.restaurante.service.AuthService;

import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;

@Service
@Transactional

public class AuthServiceImplemenst implements AuthService {
     @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private RolRepository rolRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    //  Método de autenticación (versión pedida para pruebas)
    @Override
    public Usuario authenticate(String email, String password) {
        Usuario user = usuarioRepository.findByEmail(email).orElse(null);
        if (user != null) {
            // Permitir login con contraseña encriptada o en texto plano
            if (passwordEncoder.matches(password, user.getPassword()) || password.equals(user.getPassword())) {
                return user;
            }
        }
        return null;
    }

    @Override
    public Usuario registerUser(RegisterRequest request) {
        Usuario nuevoUsuario = new Usuario();
        
        nuevoUsuario.setEmail(request.getEmail());
        nuevoUsuario.setPassword(passwordEncoder.encode(request.getPassword()));
        nuevoUsuario.setNombre(request.getNombre());
        nuevoUsuario.setApellido(request.getApellido());
        nuevoUsuario.setTelefono(request.getTelefono());

        // Asignar rol por defecto (CLIENTE)
        Rol rolCliente = rolRepository.findByNombre("CLIENTE")
                .orElseGet(() -> {
                    Rol nuevoRol = new Rol();
                    nuevoRol.setNombre("CLIENTE");
                    // La descripción ha sido eliminada del modelo
                    return rolRepository.save(nuevoRol);
                });

        nuevoUsuario.setRol(rolCliente);
        nuevoUsuario.setActivo(true);

        return usuarioRepository.save(nuevoUsuario);
    }



    @Override
    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }
    
    @Override
    public Usuario findByEmail(String email) {
        return usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new EntityNotFoundException("Usuario no encontrado: " + email));
    }
}
