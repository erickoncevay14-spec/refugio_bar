package com.restaurante.service;

import com.restaurante.dto.request.RegisterRequest;
import com.restaurante.model.Usuario;
import com.restaurante.model.Rol;
import com.restaurante.repository.UsuarioRepository;
import com.restaurante.repository.RolRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class AuthService {
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private RolRepository rolRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    // 👉 Método de autenticación (versión pedida para pruebas)
    public Usuario authenticate(String username, String password) {
        Usuario user = usuarioRepository.findByUsuario(username).orElse(null);
        
        if (user != null) {
            // Temporal: comparación directa sin encriptar
            if (password.equals(user.getPassword())) {
                return user;
            }
            // O si está encriptada:
            // if (passwordEncoder.matches(password, user.getPassword())) {
            //     return user;
            // }
        }
        return null;
    }
    
    public Usuario registerUser(RegisterRequest request) {
        Usuario nuevoUsuario = new Usuario();
        nuevoUsuario.setUsuario(request.getUsuario());
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
                nuevoRol.setDescripcion("Cliente del restaurante");
                return rolRepository.save(nuevoRol);
            });
        
        nuevoUsuario.setRol(rolCliente);
        nuevoUsuario.setActivo(true);
        
        return usuarioRepository.save(nuevoUsuario);
    }
    
    public boolean existsByUsuario(String usuario) {
        return usuarioRepository.existsByUsuario(usuario);
    }
    
    public boolean existsByEmail(String email) {
        return usuarioRepository.existsByEmail(email);
    }
    
    // Métodos temporales para testing (ELIMINAR EN PRODUCCIÓN)
    private Usuario createTemporalAdmin() {
        Usuario admin = new Usuario();
        admin.setId(1L);
        admin.setUsuario("admin");
        admin.setNombre("Administrador");
        Rol rol = new Rol();
        rol.setNombre("ADMIN");
        admin.setRol(rol);
        return admin;
    }
    
    private Usuario createTemporalMozo() {
        Usuario mozo = new Usuario();
        mozo.setId(2L);
        mozo.setUsuario("Mozo");
        mozo.setNombre("Mesero");
        Rol rol = new Rol();
        rol.setNombre("MESERO");
        mozo.setRol(rol);
        return mozo;
    }
    
    private Usuario createTemporalBartender() {
        Usuario bartender = new Usuario();
        bartender.setId(3L);
        bartender.setUsuario("bartender");
        bartender.setNombre("Bartender");
        Rol rol = new Rol();
        rol.setNombre("BARTENDER");
        bartender.setRol(rol);
        return bartender;
    }
}
