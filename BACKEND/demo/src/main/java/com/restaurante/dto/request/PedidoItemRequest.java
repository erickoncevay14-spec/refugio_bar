package com.restaurante.dto.request;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.Data;

@Data

public class PedidoItemRequest {
    // Para: POST /api/pedidos/{id}/items, PUT /api/pedidos/{id}/items/{itemId}
    // Agregar/modificar items de pedidos (Mozo)
    
    private Long id; // Solo para actualizaciones
    
    @NotNull(message = "El producto es obligatorio")
    private Long productoId;
    
    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser al menos 1")
    private Integer cantidad;
    
    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.01", message = "El precio debe ser mayor a 0")
    private Double precio;
    
    @Size(max = 255, message = "Las notas no pueden exceder 255 caracteres")
    private String notas;
    
}