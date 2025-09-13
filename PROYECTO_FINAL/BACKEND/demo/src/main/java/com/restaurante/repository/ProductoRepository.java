package com.restaurante.repository;

import com.restaurante.model.Producto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface ProductoRepository extends JpaRepository<Producto, Long> {
    
    // Buscar producto por nombre
    Optional<Producto> findByNombre(String nombre);
    
    // Buscar productos por rango de precios
    @Query("SELECT p FROM Producto p WHERE p.precio BETWEEN :precioMin AND :precioMax")
    List<Producto> findProductosPorRangoPrecio(@Param("precioMin") Double precioMin, 
                                              @Param("precioMax") Double precioMax);
    
    // Buscar productos que contengan en el nombre o descripción
    @Query("SELECT p FROM Producto p WHERE p.nombre LIKE %:termino% OR p.descripcion LIKE %:termino%")
    List<Producto> buscarProductos(@Param("termino") String termino);
    
    // Verificar si existe un producto con un nombre específico
    boolean existsByNombre(String nombre);
    
    // Buscar productos ordenados por precio (ascendente o descendente)
    List<Producto> findByOrderByPrecioAsc();
    List<Producto> findByOrderByPrecioDesc();
    
    // Contar productos
    long count();
}