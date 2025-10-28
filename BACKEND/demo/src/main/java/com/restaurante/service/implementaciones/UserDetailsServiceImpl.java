package com.restaurante.service.implementaciones;

import java.util.Collections;

import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import com.restaurante.model.Usuario;
import com.restaurante.repository.UsuarioRepository;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

    private final UsuarioRepository usuarioRepository;

    public UserDetailsServiceImpl(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        // Intentar buscar por email primero
        Usuario usuario = usuarioRepository.findByEmail(username)
                .orElseGet(() -> {
                    // Si no se encuentra por email, intentar por nombre de usuario
                    return usuarioRepository.findByUsuario(username)
                            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + username));
                });

        String roleName = "ROLE_" + usuario.getRol().getNombre();
        
        return new User(
            // Usar el email como identificador de usuario para autenticación
            usuario.getEmail(),
            usuario.getPassword(),
            Collections.singletonList(new SimpleGrantedAuthority(roleName))
        );
    }
}