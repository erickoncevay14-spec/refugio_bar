package com.restaurante.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.restaurante.model.Pedido;

@Repository
public interface PedidoRepository extends JpaRepository<Pedido, Long> {
    Optional<Pedido> findByNumeroPedido(String numeroPedido);
    List<Pedido> findByEstado(String estado);

    // Dashboard queries

    @Query(value = "SELECT SUM(total) FROM pedidos WHERE DATE(fecha_pedido) = CURRENT_DATE", nativeQuery = true)
    Double ventasHoy();

    @Query(value = "SELECT COUNT(*) FROM pedidos WHERE DATE(fecha_pedido) = CURRENT_DATE", nativeQuery = true)
    Integer pedidosHoy();

    @Query(value = "SELECT SUM(total) FROM pedidos WHERE fecha_pedido >= CURRENT_DATE - INTERVAL '7 days'", nativeQuery = true)
    Double ingresosUltimos7Dias();

    @Query(value = """
        SELECT DATE(fecha_pedido) AS dia, SUM(total)
        FROM pedidos
        WHERE fecha_pedido >= CURRENT_DATE - INTERVAL '7 days'
        GROUP BY DATE(fecha_pedido)
        ORDER BY dia ASC
    """, nativeQuery = true)
    List<Object[]> ventasSemanales();

    @Query(value = """
        SELECT pr.nombre, SUM(dp.cantidad) AS total_vendido
        FROM detalle_pedidos dp
        JOIN productos pr ON dp.producto_id = pr.id
        GROUP BY pr.nombre
        ORDER BY total_vendido DESC
        LIMIT 5
    """, nativeQuery = true)
    List<Object[]> productosTop();

    @Query(value = """
        SELECT pr.nombre
        FROM detalle_pedidos dp
        JOIN productos pr ON dp.producto_id = pr.id
        GROUP BY pr.id
        ORDER BY SUM(dp.cantidad) DESC
        LIMIT 1
    """, nativeQuery = true)
    String productoMasVendido();
}