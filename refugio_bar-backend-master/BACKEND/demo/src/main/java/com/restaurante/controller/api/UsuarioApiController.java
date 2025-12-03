package com.restaurante.controller.api;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

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

    // Crear usuario/cliente
    @PostMapping("")
    public ResponseEntity<Usuario> crearUsuario(@RequestBody Map<String, Object> body) {
        try {
            Usuario usuario = new Usuario();
            // Campos obligatorios
            usuario.setNombre((String) body.get("nombre"));
            usuario.setApellido((String) body.get("apellido"));
            usuario.setEmail((String) body.get("email"));
            usuario.setTelefono((String) body.get("telefono"));
            usuario.setActivo(body.containsKey("activo") ? Boolean.valueOf(body.get("activo").toString()) : true);
            // No se usa direccion, se omite
            // Password
            Object passwordObj = body.get("password");
            if (passwordObj != null) {
                usuario.setPassword(passwordEncoder.encode(passwordObj.toString()));
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "La contraseña es obligatoria");
            }
            // Rol
            Object rolIdObj = body.get("rol_id");
            if (rolIdObj != null) {
                Long rolId = Long.valueOf(rolIdObj.toString());
                Rol rol = rolRepository.findById(rolId).orElse(null);
                if (rol == null) throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Rol no encontrado");
                usuario.setRol(rol);
            } else {
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "El rol es obligatorio");
            }
            usuarioRepository.save(usuario);
            return ResponseEntity.status(HttpStatus.CREATED).body(usuario);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "Error al crear usuario: " + e.getMessage());
        }
    }

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
        // Solo actualiza los campos enviados y si el valor no es null
        if (body.containsKey("nombre") && body.get("nombre") != null) usuario.setNombre((String) body.get("nombre"));
        if (body.containsKey("apellido") && body.get("apellido") != null) usuario.setApellido((String) body.get("apellido"));
        if (body.containsKey("email") && body.get("email") != null) usuario.setEmail((String) body.get("email"));
        if (body.containsKey("telefono") && body.get("telefono") != null) usuario.setTelefono((String) body.get("telefono"));
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
        // Si se envía activo, actualizar el estado
        if (body.containsKey("activo")) {
            Object activoObj = body.get("activo");
            if (activoObj instanceof Boolean) {
                usuario.setActivo((Boolean) activoObj);
            } else if (activoObj instanceof String) {
                usuario.setActivo(Boolean.parseBoolean((String) activoObj));
            } else if (activoObj instanceof Number) {
                usuario.setActivo(((Number) activoObj).intValue() != 0);
            }
        }
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(usuario);
    }
}
