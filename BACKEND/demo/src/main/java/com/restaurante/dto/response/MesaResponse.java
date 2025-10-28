package com.restaurante.dto.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor

public class MesaResponse {
    // Para: Respuestas de GET /api/mesas
    // Estado actual de las mesas
    
    private Long id;
    private Integer numero;
    private Integer capacidad;
    private String estado; // LIBRE, OCUPADA, RESERVADA, LIMPIEZA
    private String ubicacion;
    private Double total; // Si está ocupada
    private String cliente; // Si está ocupada
    private Long pedidoActualId; // Si está ocupada
    
}