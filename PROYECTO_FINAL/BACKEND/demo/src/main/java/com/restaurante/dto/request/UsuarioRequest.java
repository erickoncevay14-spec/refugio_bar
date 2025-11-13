package com.restaurante.dto.request;

import com.restaurante.validator.NombreValido;
import com.restaurante.validator.PasswordFuerte;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data  // Lombok genera getters, setters, toString, equals, hashCode
public class UsuarioRequest {
    // Para: POST /api/usuarios, PUT /api/usuarios/{id}
    // Crear/actualizar usuarios (Admin)
    
    private Long id; // Solo para actualizaciones
    
    @NotBlank(message = "El nombre es obligatorio")
    @NombreValido  //  Solo letras y espacios
    private String nombre;
    
    @NotBlank(message = "Apellido es requerido")
    @NombreValido
    private String apellido;
    
    @NotBlank(message = "El email es obligatorio")
    @Email(message = "El email debe tener un formato válido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, max = 20, message = "Password debe tener entre 8 y 20 caracteres")
    @PasswordFuerte
    private String password; 
    
    @NotBlank(message = "El rol es obligatorio")
    @Pattern(regexp = "ADMIN|MOZO|BARTENDER|CLIENTE", 
             message = "El rol debe ser ADMIN, MOZO, BARTENDER o CLIENTE")
    private String rol;

    @NotBlank(message = "Teléfono es requerido")
    @Size(min = 9, max = 9, message = "Teléfono debe tener 9 dígitos")
    @Pattern(regexp = "^[0-9]{9}$", message = "Teléfono debe contener solo números")
    private String telefono;
    
    @NotBlank(message = "La dirección es obligatoria")
    private String direccion;

    @NotNull(message = "El estado activo es obligatorio")  //  @NotNull para Boolean
    private Boolean activo;
   
}