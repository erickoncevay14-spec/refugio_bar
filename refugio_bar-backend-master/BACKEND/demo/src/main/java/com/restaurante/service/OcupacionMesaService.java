package com.restaurante.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurante.model.OcupacionMesa;
import com.restaurante.repository.OcupacionMesaRepository;

@Service
public class OcupacionMesaService {
    @Autowired
    private OcupacionMesaRepository ocupacionMesaRepository;

    public OcupacionMesa ocuparMesa(OcupacionMesa ocupacion) {
        ocupacion.setEstado("ACTIVA");
        return ocupacionMesaRepository.save(ocupacion);
    }

    public void liberarMesa(Long id) {
        Optional<OcupacionMesa> ocupacionOpt = ocupacionMesaRepository.findById(id);
        ocupacionOpt.ifPresent(ocupacion -> {
            ocupacion.setEstado("FINALIZADA");
            ocupacionMesaRepository.save(ocupacion);
        });
    }

    public List<OcupacionMesa> ocupacionesActivasPorMesa(Long mesaId) {
        return ocupacionMesaRepository.findByMesaIdAndEstado(mesaId, "ACTIVA");
    }

    public List<OcupacionMesa> ocupacionesActivasEnRango(Long mesaId, LocalDateTime inicio, LocalDateTime fin) {
        return ocupacionMesaRepository.findByMesaIdAndEstadoAndFechaHoraInicioLessThanEqualAndFechaHoraFinGreaterThanEqual(
                mesaId, "ACTIVA", inicio, fin);
    }

    public List<OcupacionMesa> todasOcupacionesActivas() {
        return ocupacionMesaRepository.findByEstadoAndFechaHoraFinAfter("ACTIVA", LocalDateTime.now());
    }
}
