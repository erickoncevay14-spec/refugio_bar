package com.restaurante.dto.request;

import java.util.List;

import com.restaurante.validator.NombreValido;

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
public class ActualizarPedidoRequest {
    // Para: PUT /api/pedidos/{id}
    // Actualizar pedidos existentes (Mozo)
    
    @NotNull(message = "El ID del pedido es obligatorio")
    private Long id;

    @NotBlank(message = "El cliente es obligatorio")
    @NombreValido
    private String cliente;

    @Size(max = 255, message = "Las notas no pueden exceder los 255 caracteres")
    private String notas;  // Las notas son opcionales en actualización

    @NotBlank(message = "El estado es obligatorio")
    @Pattern(regexp = "PENDIENTE|PREPARANDO|LISTO|ENTREGADO", 
             message = "El estado debe ser PENDIENTE, PREPARANDO, LISTO o ENTREGADO")
    private String estado;

    @NotNull(message = "Los items del pedido son obligatorios")
    private List<PedidoItemRequest> items;
}