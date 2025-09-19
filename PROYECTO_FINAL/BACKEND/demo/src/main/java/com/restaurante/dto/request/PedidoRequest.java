package com.restaurante.dto.request;

import jakarta.validation.constraints.NotNull;
import java.util.List;

public class PedidoRequest {
    @NotNull(message = "Usuario ID es requerido")
    private Long usuarioId;
    
    private Long mesaId;
    
    @NotNull(message = "Items del pedido son requeridos")
    private List<ItemPedido> items;
    
    private String notas;
    
    // Getters y Setters
    public Long getUsuarioId() { return usuarioId; }
    public void setUsuarioId(Long usuarioId) { this.usuarioId = usuarioId; }
    public Long getMesaId() { return mesaId; }
    public void setMesaId(Long mesaId) { this.mesaId = mesaId; }
    public List<ItemPedido> getItems() { return items; }
    public void setItems(List<ItemPedido> items) { this.items = items; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    
    public static class ItemPedido {
        private Long productoId;
        private Integer cantidad;
        
        // Getters y Setters
        public Long getProductoId() { return productoId; }
        public void setProductoId(Long productoId) { this.productoId = productoId; }
        public Integer getCantidad() { return cantidad; }
        public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    }
}