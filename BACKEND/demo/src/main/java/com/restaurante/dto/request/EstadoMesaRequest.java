package com.restaurante.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor

public class EstadoMesaRequest {
    // Para: PUT /api/mesas/{id}/estado
    // Cambiar estado de mesas (Mozo)

    @NotBlank(message = "El estado es obligatorio")
    @Pattern(regexp = "LIBRE|OCUPADA|RESERVADA|LIMPIEZA", message = "El estado debe ser LIBRE, OCUPADA, RESERVADA o LIMPIEZA")
    private String estado;
    
    @NotNull(message = "El ID del usuario es obligatorio")
    private Long usuarioId;

    @Size(max = 255, message = "Las notas no pueden exceder los 255 caracteres")
    private String notas;

    

    
}
