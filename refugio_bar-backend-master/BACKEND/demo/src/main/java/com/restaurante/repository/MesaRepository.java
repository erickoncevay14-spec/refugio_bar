package com.restaurante.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.restaurante.model.Mesa;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Long> {
    Optional<Mesa> findByNumero(Integer numero);
    List<Mesa> findByEstado(String estado);

    // Dashboard helpers
    long countByEstado(String estado);

    // Si tienes una entidad Reserva relacionada, deberías ajustar esto:
    @Query(value = "SELECT COUNT(*) FROM reservas WHERE DATE(fecha_creacion) = CURRENT_DATE", nativeQuery = true)
    Integer reservasHoy();
}