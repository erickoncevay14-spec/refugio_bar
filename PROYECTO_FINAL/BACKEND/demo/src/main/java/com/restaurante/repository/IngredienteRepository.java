package com.restaurante.repository;

import com.restaurante.model.Ingrediente;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface IngredienteRepository extends JpaRepository<Ingrediente, Long> {
    
    // Buscar ingrediente por nombre
    Optional<Ingrediente> findByNombre(String nombre);
    
    // Buscar ingredientes con stock bajo
    @Query("SELECT i FROM Ingrediente i WHERE i.stock_actual <= :stockMinimo")
    List<Ingrediente> findIngredientesConStockBajo(@Param("stockMinimo") Double stockMinimo);
    
    // Verificar si existe un ingrediente con un nombre específico
    boolean existsByNombre(String nombre);
    
    // Buscar ingredientes por unidad de medida
    List<Ingrediente> findByUnidadMedida(String unidadMedida);
    
    // Actualizar stock de un ingrediente
    @Query("UPDATE Ingrediente i SET i.stock_actual = :nuevoStock WHERE i.id_ingrediente = :idIngrediente")
    void actualizarStock(@Param("idIngrediente") Long idIngrediente, 
                        @Param("nuevoStock") Double nuevoStock);
}