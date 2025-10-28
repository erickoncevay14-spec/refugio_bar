package com.restaurante.service;

import java.util.List;

import com.restaurante.dto.request.ProductoRequest;
import com.restaurante.dto.response.ProductoResponse;


public interface ProductoService {

    
    List<ProductoResponse> obtenerTodos();
    
    ProductoResponse obtenerPorId(Long id);
    
    List<ProductoResponse> obtenerDisponibles();
    
    List<ProductoResponse> obtenerPorCategoria(String categoria);
    
    ProductoResponse crear(ProductoRequest request);
    
    ProductoResponse actualizar(Long id, ProductoRequest request);
    
    void eliminar(Long id);
    
    ProductoResponse actualizarStock(Long id, Integer nuevoStock);
    
    List<ProductoResponse> obtenerConStockBajo();
    
    void reducirStock(Long productoId, Integer cantidad);
}
