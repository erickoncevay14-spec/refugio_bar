package com.restaurante.dto.request;

import jakarta.validation.constraints.*;
import java.util.List;

public class ActualizarPedidoRequest {
    // Para: PUT /api/pedidos/{id}
    // Actualizar pedidos existentes (Mozo)
    
    @NotNull(message = "El ID del pedido es obligatorio")
    private Long id;
    
    private String cliente;
    private String notas;
    private String estado; // PENDIENTE, PREPARANDO, LISTO, ENTREGADO
    private List<PedidoItemRequest> items;
    
    // Constructores, getters y setters...
    public ActualizarPedidoRequest() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public List<PedidoItemRequest> getItems() { return items; }
    public void setItems(List<PedidoItemRequest> items) { this.items = items; }
}