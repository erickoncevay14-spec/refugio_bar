package com.restaurante.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import java.time.LocalDateTime;

@Entity
@Table(name = "pagos")
public class Pago {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPago;
    
    @ManyToOne
    @JoinColumn(name = "id_pedido", nullable = false)
    private Pedido pedido;
    
    @Min(0)
    private Double monto;
    
    @NotBlank
    @Column(name = "metodo_pago") // BD sigue usando snake_case
    private String metodoPago; // Java usa camelCase
    
    @Column(name = "fecha_pago")
    private LocalDateTime fechaPago;
    
    // Constructores
    public Pago() {}
    
    public Pago(Pedido pedido, Double monto, String metodoPago, LocalDateTime fechaPago) {
        this.pedido = pedido;
        this.monto = monto;
        this.metodoPago = metodoPago;
        this.fechaPago = fechaPago;
    }
    
    // Getters y Setters
    public Long getIdPago() {
        return idPago;
    }
    
    public void setIdPago(Long idPago) {
        this.idPago = idPago;
    }
    
    public Pedido getPedido() {
        return pedido;
    }
    
    public void setPedido(Pedido pedido) {
        this.pedido = pedido;
    }
    
    public Double getMonto() {
        return monto;
    }
    
    public void setMonto(Double monto) {
        this.monto = monto;
    }
    
    public String getMetodoPago() {
        return metodoPago;
    }
    
    public void setMetodoPago(String metodoPago) {
        this.metodoPago = metodoPago;
    }
    
    public LocalDateTime getFechaPago() {
        return fechaPago;
    }
    
    public void setFechaPago(LocalDateTime fechaPago) {
        this.fechaPago = fechaPago;
    }
}