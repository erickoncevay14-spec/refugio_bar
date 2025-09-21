package com.restaurante.dto.request;

import jakarta.validation.constraints.*;

public class UsuarioRequest {
    // Para: POST /api/usuarios, PUT /api/usuarios/{id}
    // Crear/actualizar usuarios (Admin)
    
    private Long id; // Solo para actualizaciones
    
    @NotBlank(message = "El nombre es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    private String nombre;
    
    @NotBlank(message = "El apellido es obligatorio")
    @Size(min = 2, max = 100, message = "El apellido debe tener entre 2 y 100 caracteres")
    private String apellido;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;
    
    @Size(min = 6, max = 100, message = "La contraseña debe tener entre 6 y 100 caracteres")
    private String password; // Opcional en actualizaciones
    
    @NotBlank(message = "El rol es obligatorio")
    @Pattern(regexp = "ADMIN|MOZO|BARTENDER|COCINERO", 
             message = "El rol debe ser ADMIN, MOZO, BARTENDER o COCINERO")
    private String rol;
    
    private String telefono;
    private String direccion;
    private Boolean activo;
    
    // Constructores, getters y setters...
    public UsuarioRequest() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}