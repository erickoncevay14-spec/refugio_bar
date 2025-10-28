package com.restaurante.service;

import java.util.List;

import com.restaurante.model.Reserva;

public interface ReservaService {

   List<Reserva> getAllReservas();

    Reserva getReservaById(Long id);

    Reserva createReserva(Reserva reserva);

    Reserva updateReserva(Long id, Reserva reservaDetails);
    
    void deleteReserva(Long id);
}
