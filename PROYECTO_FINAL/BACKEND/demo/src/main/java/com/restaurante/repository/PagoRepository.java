package com.restaurante.repository;

import com.restaurante.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    
    // Buscar pagos por pedido
    List<Pago> findByPedidoIdPedido(Long idPedido);
    
    // Buscar pagos por método de pago
    List<Pago> findByMetodoPago(String metodoPago);
    
    // Buscar pagos en un rango de fechas
    @Query("SELECT p FROM Pago p WHERE p.fechaPago BETWEEN :inicio AND :fin")
    List<Pago> findPagosEntreFechas(@Param("inicio") LocalDateTime inicio, 
                                   @Param("fin") LocalDateTime fin);
    
    // Calcular el total de pagos por método en un período
    @Query("SELECT p.metodoPago, SUM(p.monto) FROM Pago p " +
           "WHERE p.fechaPago BETWEEN :inicio AND :fin " +
           "GROUP BY p.metodoPago")
    List<Object[]> calcularTotalPagosPorMetodo(@Param("inicio") LocalDateTime inicio, 
                                              @Param("fin") LocalDateTime fin);
    
    // Buscar el último pago de un pedido
    @Query("SELECT p FROM Pago p WHERE p.pedido.idPedido = :idPedido ORDER BY p.fechaPago DESC")
    List<Pago> findUltimoPagoByPedido(@Param("idPedido") Long idPedido);
    
    // Verificar si un pedido tiene pagos
    boolean existsByPedidoIdPedido(Long idPedido);
    
    // Calcular el total de pagos realizados
    @Query("SELECT COALESCE(SUM(p.monto), 0) FROM Pago p")
    Double calcularTotalPagos();
}
