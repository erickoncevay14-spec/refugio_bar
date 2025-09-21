package com.restaurante.dto.response;

import java.time.LocalDateTime;

public class UsuarioResponse {
    // Para: Respuestas de GET/POST/PUT /api/usuarios
    // Datos del usuario (SIN password por seguridad)
    
    private Long id;
    private String nombre;
    private String apellido;
    private String email;
    private String rol;
    private String telefono;
    private String direccion;
    private Boolean activo;
    private String avatar;
    private LocalDateTime fechaCreacion;
    private LocalDateTime ultimoAcceso;
    
    // Método utilitario
    public String getNombreCompleto() {
        return nombre + " " + apellido;
    }
    
    // Constructores, getters y setters...
    public UsuarioResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
    public String getAvatar() { return avatar; }
    public void setAvatar(String avatar) { this.avatar = avatar; }
    public LocalDateTime getFechaCreacion() { return fechaCreacion; }
    public void setFechaCreacion(LocalDateTime fechaCreacion) { this.fechaCreacion = fechaCreacion; }
    public LocalDateTime getUltimoAcceso() { return ultimoAcceso; }
    public void setUltimoAcceso(LocalDateTime ultimoAcceso) { this.ultimoAcceso = ultimoAcceso; }
}