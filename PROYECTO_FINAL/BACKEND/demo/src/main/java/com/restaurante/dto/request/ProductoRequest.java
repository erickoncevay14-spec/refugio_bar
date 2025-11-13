package com.restaurante.dto.request;

import com.restaurante.validator.NombreValido;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor

public class ProductoRequest {
    // Para: POST /api/productos, PUT /api/productos/{id}
    // Operaciones CRUD de productos (Admin)
    
    private Long id; // Solo para actualizaciones
    
    @NotBlank(message = "El nombre del producto es obligatorio")
    @Size(min = 2, max = 100, message = "El nombre debe tener entre 2 y 100 caracteres")
    @NombreValido
    private String nombre;
    
    @Size(max = 255, message = "La descripción no puede exceder los 255 caracteres")
    @NombreValido
    private String descripcion;
    
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    private Double precio;
    
    @NotBlank(message = "La categoría es obligatoria")
    @NombreValido
    private String categoria;

    @NotNull(message = "El stock es obligatorio")
    @Min(value = 0, message = "El stock no puede ser negativo")
    private Integer stock;
    
    @NotNull(message = "El estado disponible es obligatorio")
    private Boolean disponible;
    
}