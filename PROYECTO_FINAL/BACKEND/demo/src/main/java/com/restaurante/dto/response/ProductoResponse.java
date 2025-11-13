package com.restaurante.dto.response;

import java.time.LocalDateTime;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProductoResponse {
    // Para: Respuestas de GET/POST/PUT /api/productos
    // Datos completos del producto
    
    private Long id;
    private String nombre;
    private String descripcion;
    private Double precio;
    private String categoria;
    private Integer stock;
    private Boolean disponible;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaModificacion;
}