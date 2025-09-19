package com.restaurante.service;

import com.restaurante.model.Producto;
import com.restaurante.repository.ProductoRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    public List<Producto> findAll() {
        return productoRepository.findAll();
    }
    
    public Optional<Producto> findById(Long id) {
        return productoRepository.findById(id);
    }
    
    public List<Producto> findByCategoria(String categoria) {
        // Implementar método en repository
        return productoRepository.findAll().stream()
            .filter(p -> p.getCategoria() != null && p.getCategoria().equalsIgnoreCase(categoria))
            .toList();
    }
    
    public Producto save(Producto producto) {
        return productoRepository.save(producto);
    }
    
    public Producto update(Producto producto) {
        if (!productoRepository.existsById(producto.getId())) {
            throw new RuntimeException("Producto no encontrado");
        }
        return productoRepository.save(producto);
    }
    
    public void deleteById(Long id) {
        productoRepository.deleteById(id);
    }
    
    public boolean existsByNombre(String nombre) {
        return productoRepository.existsByNombre(nombre);
    }
    
    public List<Producto> buscarProductos(String termino) {
        return productoRepository.buscarProductos(termino);
    }
}