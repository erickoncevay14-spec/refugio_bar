package com.restaurante.controller.api;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurante.service.ReservaService;


@RestController
@RequestMapping("/api/reservas")

public class ReservaController {

    @Autowired
    private ReservaService reservaService;

    @GetMapping
    public java.util.List<com.restaurante.model.Reserva> getAllReservas() {
        return reservaService.getAllReservas();
    }

    @PostMapping
    public com.restaurante.model.Reserva createReserva(@RequestBody com.restaurante.model.Reserva reserva) {
        return reservaService.createReserva(reserva);
    }

    @DeleteMapping("/{id}")
    public void deleteReserva(@org.springframework.web.bind.annotation.PathVariable Long id) {
        reservaService.deleteReserva(id);
    }
    @PutMapping("/{id}")
    public com.restaurante.model.Reserva updateReserva(@org.springframework.web.bind.annotation.PathVariable Long id, @RequestBody com.restaurante.model.Reserva reservaDetails) {
        return reservaService.updateReserva(id, reservaDetails);
    }
    @GetMapping("/{id}")
    public com.restaurante.model.Reserva getReservaById(@org.springframework.web.bind.annotation.PathVariable Long id) {
        return reservaService.getReservaById(id);
    }
}
