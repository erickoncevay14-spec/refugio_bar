package com.restaurante.controller.api;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurante.dto.request.ProductoRequest;
import com.restaurante.dto.response.ApiResponse;
import com.restaurante.dto.response.ProductoResponse;
import com.restaurante.service.ProductoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = "*")
public class ProductoController {
    
    @Autowired
    private ProductoService productoService;
    
    // GET /api/productos - Obtener todos los productos
    @GetMapping
    public ResponseEntity<ApiResponse<List<ProductoResponse>>> getAllProductos() {
        try {
            List<ProductoResponse> productos = productoService.obtenerTodos();
            return ResponseEntity.ok(ApiResponse.success("Productos obtenidos exitosamente", productos));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error al obtener productos: " + e.getMessage()));
        }
    }
    
    // GET /api/productos/{id} - Obtener producto por ID
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductoResponse>> getProductoById(@PathVariable Long id) {
        try {
            ProductoResponse producto = productoService.obtenerPorId(id);
            return ResponseEntity.ok(ApiResponse.success("Producto encontrado", producto));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
    
    // GET /api/productos/disponibles - Obtener productos disponibles (para mozo)
    @GetMapping("/disponibles")
    public ResponseEntity<ApiResponse<List<ProductoResponse>>> getProductosDisponibles() {
        try {
            List<ProductoResponse> productos = productoService.obtenerDisponibles();
            return ResponseEntity.ok(ApiResponse.success("Productos disponibles obtenidos", productos));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error al obtener productos disponibles: " + e.getMessage()));
        }
    }
    
    // GET /api/productos/categoria/{categoria} - Obtener productos por categoría
    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<ApiResponse<List<ProductoResponse>>> getProductosPorCategoria(@PathVariable String categoria) {
        try {
            List<ProductoResponse> productos = productoService.obtenerPorCategoria(categoria);
            return ResponseEntity.ok(ApiResponse.success("Productos de categoría " + categoria, productos));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error al obtener productos por categoría: " + e.getMessage()));
        }
    }
    
    // POST /api/productos - Crear nuevo producto (ADMIN)
    @PostMapping
    public ResponseEntity<ApiResponse<ProductoResponse>> crearProducto(@Valid @RequestBody ProductoRequest request) {
        try {
            ProductoResponse producto = productoService.crear(request);
            return ResponseEntity.ok(ApiResponse.success("Producto creado exitosamente", producto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Datos inválidos: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error al crear producto: " + e.getMessage()));
        }
    }
    
    // PUT /api/productos/{id} - Actualizar producto (ADMIN)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<ProductoResponse>> actualizarProducto(
            @PathVariable Long id, 
            @Valid @RequestBody ProductoRequest request) {
        try {
            ProductoResponse producto = productoService.actualizar(id, request);
            return ResponseEntity.ok(ApiResponse.success("Producto actualizado exitosamente", producto));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Datos inválidos: " + e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error al actualizar producto: " + e.getMessage()));
        }
    }
    
    // DELETE /api/productos/{id} - Eliminar producto (ADMIN)
    @DeleteMapping("/{id}")
    public ResponseEntity<ApiResponse<String>> eliminarProducto(@PathVariable Long id) {
        try {
            productoService.eliminar(id);
            return ResponseEntity.ok(ApiResponse.success("Producto eliminado exitosamente", "Producto con ID " + id + " eliminado"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error al eliminar producto: " + e.getMessage()));
        }
    }
    
    // PUT /api/productos/{id}/stock - Actualizar solo el stock (BARTENDER/ADMIN)
    @PutMapping("/{id}/stock")
    public ResponseEntity<ApiResponse<ProductoResponse>> actualizarStock(
            @PathVariable Long id, 
            @RequestBody StockUpdateRequest stockRequest) {
        try {
            ProductoResponse producto = productoService.actualizarStock(id, stockRequest.getNuevoStock());
            return ResponseEntity.ok(ApiResponse.success("Stock actualizado exitosamente", producto));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error al actualizar stock: " + e.getMessage()));
        }
    }
    
    // GET /api/productos/stock-bajo - Obtener productos con stock bajo
    @GetMapping("/stock-bajo")
    public ResponseEntity<ApiResponse<List<ProductoResponse>>> getProductosStockBajo() {
        try {
            List<ProductoResponse> productos = productoService.obtenerConStockBajo();
            return ResponseEntity.ok(ApiResponse.success("Productos con stock bajo obtenidos", productos));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                .body(ApiResponse.error("Error al obtener productos con stock bajo: " + e.getMessage()));
        }
    }
    
    // Clase interna para actualización de stock simple
    public static class StockUpdateRequest {
        private Integer nuevoStock;
        
        public StockUpdateRequest() {}
        
        public Integer getNuevoStock() {
            return nuevoStock;
        }
        
        public void setNuevoStock(Integer nuevoStock) {
            this.nuevoStock = nuevoStock;
        }
    }
}