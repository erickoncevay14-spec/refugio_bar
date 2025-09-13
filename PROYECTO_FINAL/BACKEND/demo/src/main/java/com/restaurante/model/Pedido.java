package com.restaurante.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "pedidos")
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_pedido") 
    private Long idPedido;

    
    @ManyToOne
    @JoinColumn(name = "id_usuario_cliente", nullable = false)
    private Usuario cliente;
    
    @ManyToOne
    @JoinColumn(name = "id_usuario_mesero")
    private Usuario mesero;
    
    @ManyToOne
    @JoinColumn(name = "id_mesa")
    private Mesa mesa;
    
    @NotNull
    @Column(name = "fecha_hora") 
    private LocalDateTime fechaHora; 

    
    @NotBlank
    private String estado; // Pendiente, En preparación, Listo, Entregado, Cancelado
    
    @OneToMany(mappedBy = "pedido", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DetallePedido> detalles = new ArrayList<>();
    
    // Constructores
    public Pedido() {}
    
    public Pedido(Usuario cliente, Usuario mesero, Mesa mesa, LocalDateTime fecha_hora, String estado) {
        this.cliente = cliente;
        this.mesero = mesero;
        this.mesa = mesa;
        this.fechaHora = fecha_hora;
        this.estado = estado;
    }
    
    // Getters y Setters
    public Long getIdPedido() {
        return idPedido;
    }

    public void setIdPedido(Long idPedido) {
        this.idPedido = idPedido;
    }

    
    public Usuario getCliente() {
        return cliente;
    }
    
    public void setCliente(Usuario cliente) {
        this.cliente = cliente;
    }
    
    public Usuario getMesero() {
        return mesero;
    }
    
    public void setMesero(Usuario mesero) {
        this.mesero = mesero;
    }
    
    public Mesa getMesa() {
        return mesa;
    }
    
    public void setMesa(Mesa mesa) {
        this.mesa = mesa;
    }
    
    public LocalDateTime getFechaHora() {
        return fechaHora;
    }

    public void setFechaHora(LocalDateTime fechaHora) {
        this.fechaHora = fechaHora;
    }

    
    public String getEstado() {
        return estado;
    }
    
    public void setEstado(String estado) {
        this.estado = estado;
    }
    
    public List<DetallePedido> getDetalles() {
        return detalles;
    }
    
    public void setDetalles(List<DetallePedido> detalles) {
        this.detalles = detalles;
    }
    
    // Método helper para agregar detalle
    public void addDetalle(Producto producto, Integer cantidad, Double precioUnitario) {
        DetallePedido detalle = new DetallePedido(this, producto, cantidad, precioUnitario);
        detalles.add(detalle);
    }
    
    // Método para calcular el total del pedido
    public Double getTotal() {
        return detalles.stream()
                .mapToDouble(d -> d.getCantidad() * d.getPrecioUnitario())
                .sum();
    }
}