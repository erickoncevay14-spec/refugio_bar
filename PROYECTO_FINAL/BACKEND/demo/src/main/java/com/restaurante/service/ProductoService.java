package com.restaurante.service;

import com.restaurante.dto.request.ProductoRequest;
import com.restaurante.dto.response.ProductoResponse;
import com.restaurante.model.Producto;
import com.restaurante.repository.ProductoRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
public class ProductoService {
    
    @Autowired
    private ProductoRepository productoRepository;
    
    // Obtener todos los productos
    public List<ProductoResponse> obtenerTodos() {
        List<Producto> productos = productoRepository.findAll();
        return productos.stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }
    
    // Obtener producto por ID
    public ProductoResponse obtenerPorId(Long id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        return convertirAResponse(producto);
    }
    
    // Obtener productos disponibles (stock > 0 y disponible = true)
    public List<ProductoResponse> obtenerDisponibles() {
        List<Producto> productos = productoRepository.findByDisponibleTrueAndStockGreaterThan(0);
        return productos.stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }
    
    // Obtener productos por categoría
    public List<ProductoResponse> obtenerPorCategoria(String categoria) {
        List<Producto> productos = productoRepository.findByCategoriaAndDisponibleTrue(categoria);
        return productos.stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }
    
    // Crear nuevo producto
    public ProductoResponse crear(ProductoRequest request) {
        // Validaciones de negocio
        validarDatosProducto(request);
        
        // Verificar que no exista un producto con el mismo nombre
        if (productoRepository.existsByNombre(request.getNombre())) {
            throw new IllegalArgumentException("Ya existe un producto con el nombre: " + request.getNombre());
        }
        
        // Convertir Request a Entity
        Producto producto = new Producto();
        mapearRequestAEntity(request, producto);
        producto.setFechaCreacion(LocalDateTime.now());
        
        // Guardar en base de datos
        Producto productoGuardado = productoRepository.save(producto);
        
        return convertirAResponse(productoGuardado);
    }
    
    // Actualizar producto existente
    public ProductoResponse actualizar(Long id, ProductoRequest request) {
        // Validaciones
        validarDatosProducto(request);
        
        // Buscar producto existente
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        
        // Verificar nombre duplicado (excluyendo el producto actual)
        if (!producto.getNombre().equals(request.getNombre()) && 
            productoRepository.existsByNombre(request.getNombre())) {
            throw new IllegalArgumentException("Ya existe otro producto con el nombre: " + request.getNombre());
        }
        
        // Actualizar campos
        mapearRequestAEntity(request, producto);
        producto.setFechaModificacion(LocalDateTime.now());
        
        // Guardar cambios
        Producto productoActualizado = productoRepository.save(producto);
        
        return convertirAResponse(productoActualizado);
    }
    
    // Eliminar producto
    public void eliminar(Long id) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        
        // Verificar si el producto está siendo usado en pedidos activos
        // TODO: Agregar validación con PedidoRepository cuando esté disponible
        
        productoRepository.delete(producto);
    }
    
    // Actualizar solo el stock
    public ProductoResponse actualizarStock(Long id, Integer nuevoStock) {
        Producto producto = productoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + id));
        
        if (nuevoStock < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
        
        producto.setStock(nuevoStock);
        producto.setFechaModificacion(LocalDateTime.now());
        
        // Actualizar disponibilidad automáticamente
        producto.setDisponible(nuevoStock > 0);
        
        Producto productoActualizado = productoRepository.save(producto);
        return convertirAResponse(productoActualizado);
    }
    
    // Obtener productos con stock bajo (stock <= 5)
    public List<ProductoResponse> obtenerConStockBajo() {
        List<Producto> productos = productoRepository.findByStockLessThanEqual(5);
        return productos.stream()
                .map(this::convertirAResponse)
                .collect(Collectors.toList());
    }
    
    // Reducir stock (para cuando se haga un pedido)
    public void reducirStock(Long productoId, Integer cantidad) {
        Producto producto = productoRepository.findById(productoId)
            .orElseThrow(() -> new RuntimeException("Producto no encontrado con ID: " + productoId));
        
        if (producto.getStock() < cantidad) {
            throw new IllegalArgumentException("Stock insuficiente. Disponible: " + producto.getStock() + ", Solicitado: " + cantidad);
        }
        
        producto.setStock(producto.getStock() - cantidad);
        producto.setFechaModificacion(LocalDateTime.now());
        
        // Si el stock queda en 0, marcar como no disponible
        if (producto.getStock() == 0) {
            producto.setDisponible(false);
        }
        
        productoRepository.save(producto);
    }
    
    // MÉTODOS PRIVADOS DE UTILIDAD
    
    private void validarDatosProducto(ProductoRequest request) {
        if (request.getPrecio() <= 0) {
            throw new IllegalArgumentException("El precio debe ser mayor a 0");
        }
        
        if (request.getStock() < 0) {
            throw new IllegalArgumentException("El stock no puede ser negativo");
        }
        
        if (request.getNombre() == null || request.getNombre().trim().isEmpty()) {
            throw new IllegalArgumentException("El nombre del producto es obligatorio");
        }
        
        if (request.getCategoria() == null || request.getCategoria().trim().isEmpty()) {
            throw new IllegalArgumentException("La categoría es obligatoria");
        }
        
        // Validar categorías permitidas
        List<String> categoriasPermitidas = List.of("BEBIDA", "COMIDA", "POSTRE", "ENTRADA", "SNACK");
        if (!categoriasPermitidas.contains(request.getCategoria().toUpperCase())) {
            throw new IllegalArgumentException("Categoría inválida. Permitidas: " + String.join(", ", categoriasPermitidas));
        }
    }
    
    private void mapearRequestAEntity(ProductoRequest request, Producto producto) {
        producto.setNombre(request.getNombre());
        producto.setDescripcion(request.getDescripcion());
        producto.setPrecio(request.getPrecio());
        producto.setCategoria(request.getCategoria().toUpperCase());
        producto.setStock(request.getStock());
        producto.setDisponible(request.getDisponible() != null ? request.getDisponible() : true);
        producto.setImagen(request.getImagen());
    }
    
    private ProductoResponse convertirAResponse(Producto producto) {
        ProductoResponse response = new ProductoResponse();
        response.setId(producto.getId());
        response.setNombre(producto.getNombre());
        response.setDescripcion(producto.getDescripcion());
        response.setPrecio(producto.getPrecio());
        response.setCategoria(producto.getCategoria());
        response.setStock(producto.getStock());
        response.setDisponible(producto.getDisponible());
        response.setImagen(producto.getImagen());
        response.setFechaCreacion(producto.getFechaCreacion());
        response.setFechaModificacion(producto.getFechaModificacion());
        return response;
    }
}