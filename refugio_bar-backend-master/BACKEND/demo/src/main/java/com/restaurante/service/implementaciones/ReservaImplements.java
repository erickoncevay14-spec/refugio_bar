package com.restaurante.service.implementaciones;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurante.model.Reserva;
import com.restaurante.repository.ReservaRepository;
import com.restaurante.service.ReservaService;

@Service
public class ReservaImplements implements ReservaService {

    @Autowired
    private ReservaRepository reservaRepository;

    @Override
    public List<Reserva> getAllReservas() {
        return reservaRepository.findAll();
    }

    @Override
    public Reserva getReservaById(Long id) {
        return reservaRepository.findById(id).orElse(null);
    }

    @Override
    public Reserva createReserva(Reserva reserva) {
        return reservaRepository.save(reserva);
    }

    @Override
    public Reserva updateReserva(Long id, Reserva reservaDetails) {
        Reserva reserva = reservaRepository.findById(id).orElse(null);
        if (reserva != null) {
            reserva.setFechaHora(reservaDetails.getFechaHora());
            reserva.setPersonas(reservaDetails.getPersonas());
            reserva.setEstado(reservaDetails.getEstado());
            reserva.setUsuario(reservaDetails.getUsuario());
            reserva.setMesa(reservaDetails.getMesa());
            return reservaRepository.save(reserva);
        }
        return null;
    }

    @Override
    public void deleteReserva(Long id) {
        reservaRepository.deleteById(id);
    }

}
