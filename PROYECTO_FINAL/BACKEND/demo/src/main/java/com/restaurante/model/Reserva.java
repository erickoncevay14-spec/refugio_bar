package com.restaurante.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;

@Entity
@Table(name = "reservas")
public class Reserva {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id_reserva")
    private Long idReserva;
    
    @ManyToOne
    @JoinColumn(name = "id_usuario_cliente", nullable = false)
    private Usuario cliente;
    
    @ManyToOne
    @JoinColumn(name = "id_mesa", nullable = false)
    private Mesa mesa;
    
    @NotNull
    @Column(name = "fecha_hora") // en la BD sigue siendo fecha_hora
    private LocalDateTime fechaHora;

    // Constructores
    public Reserva() {}
    
    public Reserva(Usuario cliente, Mesa mesa, LocalDateTime fechaHora) {
        this.cliente = cliente;
        this.mesa = mesa;
        this.fechaHora = fechaHora;
    }
    
    // Getters y Setters
    public Long getIdReserva() {
        return idReserva;
    }
    
    public void setIdReserva(Long idReserva) {
        this.idReserva = idReserva;
    }
    
    public Usuario getCliente() {
        return cliente;
    }
    
    public void setCliente(Usuario cliente) {
        this.cliente = cliente;
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
}