package com.restaurante.repository;

import com.restaurante.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {

    // Buscar productos disponibles con stock mayor a 0
    List<Producto> findByDisponibleTrueAndStockGreaterThan(Integer stock);

    // Buscar productos por categoría que estén disponibles
    List<Producto> findByCategoriaAndDisponibleTrue(String categoria);

    // Verificar si existe un producto con ese nombre
    boolean existsByNombre(String nombre);

    // Buscar productos con stock menor o igual al especificado
    List<Producto> findByStockLessThanEqual(Integer stock);

    // Buscar productos disponibles
    List<Producto> findByDisponibleTrue();

    // Buscar productos por categoría (sin importar si están disponibles)
    List<Producto> findByCategoria(String categoria);

    // Query personalizada para buscar productos con stock bajo
    @Query("SELECT p FROM Producto p WHERE p.stock <= 5 AND p.disponible = true")
    List<Producto> findProductosConStockBajo();

    // Query personalizada para buscar por nombre (case insensitive)
    @Query("SELECT p FROM Producto p WHERE UPPER(p.nombre) LIKE UPPER(CONCAT('%', :nombre, '%'))")
    List<Producto> findByNombreContainingIgnoreCase(@Param("nombre") String nombre);

    // Query para obtener productos más vendidos (cuando tengas tabla de pedidos)
    @Query("SELECT p FROM Producto p WHERE p.disponible = true ORDER BY p.nombre ASC")
    List<Producto> findAllDisponiblesOrdenados();
}
