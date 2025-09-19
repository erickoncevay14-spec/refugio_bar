package com.restaurante.repository;

import com.restaurante.model.Pago;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PagoRepository extends JpaRepository<Pago, Long> {
    // Métodos básicos heredados de JpaRepository
}