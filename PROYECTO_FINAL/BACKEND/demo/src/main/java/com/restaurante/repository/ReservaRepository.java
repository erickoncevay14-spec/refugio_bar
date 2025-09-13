package com.restaurante.repository;

import com.restaurante.model.Reserva;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface ReservaRepository extends JpaRepository<Reserva, Long> {
    
    // Buscar reservas por cliente
    @Query("SELECT r FROM Reserva r WHERE r.cliente.idUsuario = :idCliente")
    List<Reserva> findByClienteIdUsuario(@Param("idCliente") Long idCliente);
    
    // Buscar reservas por mesa
    List<Reserva> findByMesa_IdMesa(Long idMesa);
    
    // Buscar reservas en un rango de fechas
    @Query("SELECT r FROM Reserva r WHERE r.fechaHora BETWEEN :inicio AND :fin")
    List<Reserva> findReservasEntreFechas(@Param("inicio") LocalDateTime inicio, 
                                          @Param("fin") LocalDateTime fin);
    
    // Buscar reservas por mesa y fecha
    @Query("SELECT r FROM Reserva r WHERE r.mesa.idMesa = :idMesa AND r.fechaHora BETWEEN :inicio AND :fin")
    List<Reserva> findReservasPorMesaYFecha(@Param("idMesa") Long idMesa,
                                            @Param("inicio") LocalDateTime inicio,
                                            @Param("fin") LocalDateTime fin);
    
    // Verificar si existe una reserva para una mesa en un horario específico
    @Query("SELECT COUNT(r) > 0 FROM Reserva r WHERE r.mesa.idMesa = :idMesa AND r.fechaHora = :fechaHora")
    boolean existsReservaParaMesaYHorario(@Param("idMesa") Long idMesa, 
                                          @Param("fechaHora") LocalDateTime fechaHora);
}
