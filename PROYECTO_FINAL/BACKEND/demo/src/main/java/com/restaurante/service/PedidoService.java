package com.restaurante.service;

import java.util.List;
import java.util.Optional;

import com.restaurante.dto.request.CrearPedidoRequest;
import com.restaurante.model.Pedido;

public interface PedidoService {
    
    List<Pedido> findAll();
    
    Pedido crearPedido(CrearPedidoRequest request);
    
    Optional<Pedido> findById(Long id);
    
    List<Pedido> findByUsuarioId(Long usuarioId);
    
    List<Pedido> findByMesaId(Long mesaId);
    
    Pedido actualizarEstado(Long id, String estado);
    
    List<Pedido> findPedidosPendientes();
    
    boolean eliminarPedido(Long id);
    
    List<Integer> obtenerVentasSemanales();
}
