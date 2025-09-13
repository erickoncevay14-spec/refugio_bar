package com.restaurante.repository;

import com.restaurante.model.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Long> {
    
    // Buscar mesa por número
    Optional<Mesa> findByNumero(Integer numero);
    
    // Buscar mesas por estado
    List<Mesa> findByEstado(String estado);
    
    // Buscar mesas disponibles con capacidad mayor o igual a un valor
    @Query("SELECT m FROM Mesa m WHERE m.estado = 'Disponible' AND m.capacidad >= :capacidad")
    List<Mesa> findMesasDisponiblesPorCapacidad(@Param("capacidad") Integer capacidad);
    
    // Verificar si existe una mesa con un número específico
    boolean existsByNumero(Integer numero);
    
    // Contar mesas por estado
    long countByEstado(String estado);
}