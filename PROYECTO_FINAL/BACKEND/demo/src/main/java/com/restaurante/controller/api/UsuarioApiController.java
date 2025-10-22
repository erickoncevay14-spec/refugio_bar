package com.restaurante.controller.api;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurante.model.Rol;
import com.restaurante.model.Usuario;
import com.restaurante.repository.RolRepository;
import com.restaurante.repository.UsuarioRepository;

@RestController
@RequestMapping("/api/usuarios")
public class UsuarioApiController {
    @Autowired
    private UsuarioRepository usuarioRepository;
    @Autowired
    private RolRepository rolRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @PutMapping("/{id}/rol")
    public ResponseEntity<Usuario> cambiarRol(@PathVariable Long id, @RequestBody Map<String, String> body) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        String nuevoRol = body.get("rol");
        Rol rol = rolRepository.findByNombre(nuevoRol.trim().toLowerCase()).orElse(null);
        if (usuario != null && rol != null) {
            usuario.setRol(rol);
            usuarioRepository.save(usuario);
            return ResponseEntity.ok(usuario);
        }
        return ResponseEntity.badRequest().build();
    }

    @PutMapping("/{id}")
    public ResponseEntity<Usuario> editarUsuario(@PathVariable Long id, @RequestBody Map<String, Object> body) {
        Usuario usuario = usuarioRepository.findById(id).orElse(null);
        if (usuario == null) return ResponseEntity.notFound().build();
        usuario.setNombre((String) body.get("nombre"));
        usuario.setApellido((String) body.get("apellido"));
        usuario.setEmail((String) body.get("email"));
        usuario.setTelefono((String) body.get("telefono"));
        // Si se envía password, encriptar antes de guardar
        Object passwordObj = body.get("password");
        if (passwordObj != null) {
            String rawPassword = passwordObj.toString();
            usuario.setPassword(passwordEncoder.encode(rawPassword));
        }
        // Si se envía rol_id, actualizar el rol
        Object rolIdObj = body.get("rol_id");
        if (rolIdObj != null) {
            Long rolId = Long.valueOf(rolIdObj.toString());
            Rol rol = rolRepository.findById(rolId).orElse(null);
            if (rol != null) usuario.setRol(rol);
        }
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(usuario);
    }
}
