package com.restaurante.repository;

import com.restaurante.model.Pedido;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {

    @Query("SELECT p FROM Pedido p WHERE p.cliente.idUsuario = :idCliente")
    List<Pedido> findByClienteIdUsuario(@Param("idCliente") Long idCliente);

    @Query("SELECT p FROM Pedido p WHERE p.mesero.idUsuario = :idMesero")
    List<Pedido> findByMeseroIdUsuario(@Param("idMesero") Long idMesero);

    List<Pedido> findByEstado(String estado);

    List<Pedido> findByMesaIdMesa(Long idMesa);

    @Query("SELECT p FROM Pedido p WHERE p.fechaHora BETWEEN :inicio AND :fin")
    List<Pedido> findPedidosEntreFechas(@Param("inicio") LocalDateTime inicio,
                                        @Param("fin") LocalDateTime fin);

    @Query("SELECT COALESCE(SUM(d.cantidad * d.precioUnitario), 0) " +
           "FROM Pedido p JOIN p.detalles d " +
           "WHERE p.fechaHora BETWEEN :inicio AND :fin AND p.estado = 'Entregado'")
    Double calcularVentasPorPeriodo(@Param("inicio") LocalDateTime inicio,
                                    @Param("fin") LocalDateTime fin);

    long countByEstado(String estado);

    @Query("SELECT p FROM Pedido p WHERE p.fechaHora >= :fecha")
    List<Pedido> findPedidosRecientes(@Param("fecha") LocalDateTime fecha);
}
