package com.restaurante.controller;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.restaurante.model.Rol;
import com.restaurante.model.Usuario;
import com.restaurante.repository.UsuarioRepository;

@Controller
public class IndexController {
    @Autowired
    private UsuarioRepository usuarioRepository;

    @Autowired
    private com.restaurante.repository.RolRepository rolRepository;

    // ================== LOGIN ==================
    @GetMapping("/login")
    public String loginForm() {
        return "pagina/login";
    }
    @Autowired
    private org.springframework.security.crypto.password.PasswordEncoder passwordEncoder;
    
    @PostMapping("/login")
    public String procesarLogin(@RequestParam String usuario, @RequestParam String password, Model model) {
        Optional<Usuario> userOpt = usuarioRepository.findByUsuario(usuario);
        if (userOpt.isPresent()) {
            Usuario user = userOpt.get();
            if (passwordEncoder.matches(password, user.getPassword()) || user.getPassword().equals(password)) {
                if (user.getRol() != null) {
                    String rol = user.getRol().getNombre();
                    if (rol.equalsIgnoreCase("admin")) {
                        return "redirect:/admin";
                    } else if (rol.equalsIgnoreCase("mozo")) {
                        return "redirect:/mozo";
                    } else if (rol.equalsIgnoreCase("bartender")) {
                        return "redirect:/bartender";
                    }
                }
                return "redirect:/index";
            } else {
                model.addAttribute("error", "Contraseña incorrecta");
            }
        } else {
            model.addAttribute("error", "Usuario no encontrado");
        }
        return "pagina/login";
    }
    // ================== REGISTRO ==================
    @GetMapping("/registro")
    public String registroForm() {
        return "pagina/registro";
    }

    @PostMapping("/registro")
     public String procesarRegistro(
        @RequestParam String nombre,
        @RequestParam String apellido,
        @RequestParam String telefono,
        @RequestParam String correo,
        @RequestParam String clave,
        @RequestParam String usuario,
        Model model) {

    // Verifica si el usuario o correo ya existen
    if (usuarioRepository.existsByUsuario(usuario)) {
        model.addAttribute("error", "El nombre de usuario ya existe");
        return "pagina/registro";
    }
    if (usuarioRepository.existsByEmail(correo)) {
        model.addAttribute("error", "El correo ya está registrado");
        return "pagina/registro";
    }

    Usuario nuevo = new Usuario();
    nuevo.setNombre(nombre);
    nuevo.setApellido(apellido);
    nuevo.setTelefono(telefono);
    nuevo.setEmail(correo);
    // Encriptar la contraseña antes de guardar
    nuevo.setPassword(passwordEncoder.encode(clave));
    nuevo.setUsuario(usuario);
    // Asignar rol 'cliente' por defecto
    Rol rol = rolRepository.findByNombre("cliente").orElse(null);
    nuevo.setRol(rol);
    usuarioRepository.save(nuevo);

    return "redirect:/login";
    
}
@PostMapping("/admin/cambiar-rol")
@ResponseBody
public ResponseEntity<Usuario> cambiarRolAjax(@RequestParam Long usuarioId, @RequestParam String nuevoRol) {
    Usuario usuario = usuarioRepository.findById(usuarioId).orElse(null);
    Rol rol = rolRepository.findByNombre(nuevoRol.trim().toLowerCase()).orElse(null);
    if (usuario != null && rol != null) {
        usuario.setRol(rol);
        usuarioRepository.save(usuario);
        return ResponseEntity.ok(usuario);
    }
    return ResponseEntity.badRequest().build();
}
    
    // ================== RUTAS PRINCIPALES ==================
    @GetMapping("/")
    public String home() {
        return "pagina/index";
    }

    @GetMapping("/index")
    public String index() {
        return "pagina/index";
    }

    @GetMapping("/nosotros")
    public String nosotros() {
        return "pagina/nosotros";
    }

    @GetMapping("/productos")
    public String productos() {
        return "pagina/productos";
    }

    // ================== BEBIDAS ==================
    @GetMapping("/chelas")
    public String chelas() {
        return "pagina/chelas";
    }

    @GetMapping("/piscos")
    public String piscos() {
        return "pagina/piscos";
    }

    @GetMapping("/rones")
    public String rones() {
        return "pagina/rones";
    }

    @GetMapping("/tequilas")
    public String tequilas() {
        return "pagina/tequilas";
    }

    @GetMapping("/vinos")
    public String vinos() {
        return "pagina/vinos";
    }

    @GetMapping("/vodckas")
    public String vodckas() {
        return "pagina/vodckas";
    }

    // ================== ROLES ==================
    @GetMapping("/admin")
    public String admin(Model model) {
        List<Usuario> usuarios = usuarioRepository.findAll(Sort.by("id"));
        model.addAttribute("usuarios", usuarios);
        return "admin/admin";
    }

    @GetMapping("/bartender")
    public String bartender() {
        return "bartender/bartender";
    }

    @GetMapping("/mozo")
    public String mozo() {
        return "mozo/mozo";
    }

    @GetMapping("/api/usuarios")
    @ResponseBody
    public ResponseEntity<List<Usuario>> obtenerUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll(Sort.by("id"));
        return ResponseEntity.ok(usuarios);
    }
}

