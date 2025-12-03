package com.restaurante.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurante.model.Usuario;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByUsuario(String usuario);
    Optional<Usuario> findByEmail(String email);
    boolean existsByUsuario(String usuario);
    boolean existsByEmail(String email);

    // Filtrar por nombre de rol (mayúsculas)
    java.util.List<Usuario> findByRol_NombreIgnoreCase(String rol);
    java.util.List<Usuario> findByRol_NombreIgnoreCaseNot(String rol);
}