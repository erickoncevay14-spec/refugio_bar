package com.restaurante.controller.api;

import com.restaurante.model.Producto;
import com.restaurante.service.ProductoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/productos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class ProductoController {

    @Autowired
    private ProductoService productoService;

    @GetMapping
    public ResponseEntity<List<Producto>> getAllProductos() {
        List<Producto> productos = productoService.findAll();
        return ResponseEntity.ok(productos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductoById(@PathVariable Long id) {
        return productoService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/categoria/{categoria}")
    public ResponseEntity<List<Producto>> getProductosByCategoria(@PathVariable String categoria) {
        List<Producto> productos = productoService.findByCategoria(categoria);
        return ResponseEntity.ok(productos);
    }

    @PostMapping
    public ResponseEntity<?> createProducto(@Valid @RequestBody Producto producto) {
        try {
            if (productoService.existsByNombre(producto.getNombre())) {
                return ResponseEntity.status(HttpStatus.CONFLICT)
                    .body(Map.of("error", "Producto con ese nombre ya existe"));
            }
            
            Producto nuevoProducto = productoService.save(producto);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoProducto);
            
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("error", "Error al crear producto"));
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateProducto(@PathVariable Long id, @Valid @RequestBody Producto producto) {
        try {
            producto.setId(id);
            Producto actualizado = productoService.update(producto);
            return ResponseEntity.ok(actualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Producto no encontrado"));
        }
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProducto(@PathVariable Long id) {
        try {
            productoService.deleteById(id);
            return ResponseEntity.ok(Map.of("message", "Producto eliminado exitosamente"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                .body(Map.of("error", "Producto no encontrado"));
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Producto>> buscarProductos(@RequestParam String q) {
        List<Producto> productos = productoService.buscarProductos(q);
        return ResponseEntity.ok(productos);
    }
}
