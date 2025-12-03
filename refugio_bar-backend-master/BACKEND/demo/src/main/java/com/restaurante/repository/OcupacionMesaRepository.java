package com.restaurante.repository;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.restaurante.model.OcupacionMesa;

@Repository
public interface OcupacionMesaRepository extends JpaRepository<OcupacionMesa, Long> {
    List<OcupacionMesa> findByMesaIdAndEstadoAndFechaHoraInicioLessThanEqualAndFechaHoraFinGreaterThanEqual(
        Long mesaId, String estado, LocalDateTime inicio, LocalDateTime fin);

    List<OcupacionMesa> findByMesaIdAndEstado(Long mesaId, String estado);

    List<OcupacionMesa> findByEstadoAndFechaHoraFinAfter(String estado, LocalDateTime now);
}
