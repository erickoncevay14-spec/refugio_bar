package com.restaurante.controller;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restaurante.model.OcupacionMesa;
import com.restaurante.service.OcupacionMesaService;

@RestController
@RequestMapping("/api/ocupaciones")
public class OcupacionMesaController {
    @Autowired
    private OcupacionMesaService ocupacionMesaService;

    @PostMapping
    public OcupacionMesa ocuparMesa(@RequestBody OcupacionMesa ocupacion) {
        return ocupacionMesaService.ocuparMesa(ocupacion);
    }

    @PutMapping("/{id}/liberar")
    public void liberarMesa(@PathVariable Long id) {
        ocupacionMesaService.liberarMesa(id);
    }

    @GetMapping("/activas")
    public List<OcupacionMesa> todasOcupacionesActivas() {
        return ocupacionMesaService.todasOcupacionesActivas();
    }

    @GetMapping("/mesa/{mesaId}")
    public List<OcupacionMesa> ocupacionesActivasPorMesa(@PathVariable Long mesaId) {
        return ocupacionMesaService.ocupacionesActivasPorMesa(mesaId);
    }

    @GetMapping("/mesa/{mesaId}/rango")
    public List<OcupacionMesa> ocupacionesActivasEnRango(
            @PathVariable Long mesaId,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fin) {
        return ocupacionMesaService.ocupacionesActivasEnRango(mesaId, inicio, fin);
    }
}
