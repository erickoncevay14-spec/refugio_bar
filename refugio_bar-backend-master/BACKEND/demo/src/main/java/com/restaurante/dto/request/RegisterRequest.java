package com.restaurante.dto.request;

import com.restaurante.validator.NombreValido;
import com.restaurante.validator.PasswordFuerte;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class RegisterRequest {
    @NotBlank(message = "Email es requerido")
    @Email(message = "Email debe ser válido")
    private String email;

    @NotBlank(message = "Password es requerido")
    @Size(min = 8, max = 20, message = "Password debe tener entre 8 y 20 caracteres")
    @PasswordFuerte
    private String password;

    @NotBlank(message = "Nombre es requerido")
    @NombreValido
    private String nombre;

    @NotBlank(message = "Apellido es requerido")
    @NombreValido
    private String apellido;

    @NotBlank(message = "Teléfono es requerido")
    @Size(min = 9, max = 9, message = "Teléfono debe tener 9 dígitos")
    @Pattern(regexp = "^[0-9]{9}$", message = "Teléfono debe contener solo números")
    private String telefono;
}