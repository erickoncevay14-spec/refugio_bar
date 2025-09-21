package com.restaurante.dto.response;

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
    
    // Constructores, getters y setters...
    public MesaResponse() {}
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Integer getNumero() { return numero; }
    public void setNumero(Integer numero) { this.numero = numero; }
    public Integer getCapacidad() { return capacidad; }
    public void setCapacidad(Integer capacidad) { this.capacidad = capacidad; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getUbicacion() { return ubicacion; }
    public void setUbicacion(String ubicacion) { this.ubicacion = ubicacion; }
    public Double getTotal() { return total; }
    public void setTotal(Double total) { this.total = total; }
    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }
    public Long getPedidoActualId() { return pedidoActualId; }
    public void setPedidoActualId(Long pedidoActualId) { this.pedidoActualId = pedidoActualId; }
}