package com.restaurante.service;

import com.restaurante.dto.RegisterRequest;
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
    
    public Usuario authenticate(String usuario, String password) {
        Usuario user = usuarioRepository.findByUsuario(usuario).orElse(null);
        
        if (user != null && passwordEncoder.matches(password, user.getPassword())) {
            return user;
        }
        
        // Para testing temporal (ELIMINAR EN PRODUCCIÓN)
        if ("admin".equals(usuario) && "1234".equals(password)) {
            return createTemporalAdmin();
        }
        if ("Mozo".equals(usuario) && "1234".equals(password)) {
            return createTemporalMozo();
        }
        if ("bartender".equals(usuario) && "1234".equals(password)) {
            return createTemporalBartender();
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