package com.restaurante.dto.request;

import java.util.List;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CrearPedidoRequest {

    // Usuario ID es opcional (para clientes sin cuenta registrada)
    private Long usuarioId;
    
    @NotNull(message = "Mesa ID es requerido")
    private Long mesaId;
    
    @NotNull(message = "Items del pedido son requeridos")
    private List<ItemPedido> items;

    @Size(max = 255, message = "Las notas no pueden exceder los 255 caracteres")
    private String notas;
    
    @Data
    @AllArgsConstructor
    @NoArgsConstructor
    public static class ItemPedido {
        @NotNull(message = "Producto ID es requerido")
        private Long productoId;
        
        @NotNull(message = "Cantidad es requerida")
        private Integer cantidad;
    }
}