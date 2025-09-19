package com.restaurante.repository;

import com.restaurante.model.Mesa;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MesaRepository extends JpaRepository<Mesa, Long> {
    Optional<Mesa> findByNumero(Integer numero);
    List<Mesa> findByEstado(String estado);
}