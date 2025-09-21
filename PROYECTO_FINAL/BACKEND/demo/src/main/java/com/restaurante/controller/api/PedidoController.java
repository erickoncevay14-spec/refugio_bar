package com.restaurante.controller.api;

import com.restaurante.dto.request.CrearPedidoRequest;
import com.restaurante.model.Pedido;
import com.restaurante.service.PedidoService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001"})
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @PostMapping
    public ResponseEntity<?> crearPedido(@Valid @RequestBody CrearPedidoRequest pedidoRequest) {
        try {
            Pedido nuevoPedido = pedidoService.crearPedido(pedidoRequest);
            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPedido);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getPedidoById(@PathVariable Long id) {
        return pedidoService.findById(id)
            .map(ResponseEntity::ok)
            .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/usuario/{usuarioId}")
    public ResponseEntity<List<Pedido>> getPedidosByUsuario(@PathVariable Long usuarioId) {
        List<Pedido> pedidos = pedidoService.findByUsuarioId(usuarioId);
        return ResponseEntity.ok(pedidos);
    }

    @GetMapping("/mesa/{mesaId}")
    public ResponseEntity<List<Pedido>> getPedidosByMesa(@PathVariable Long mesaId) {
        List<Pedido> pedidos = pedidoService.findByMesaId(mesaId);
        return ResponseEntity.ok(pedidos);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id, @RequestParam String estado) {
        try {
            Pedido pedidoActualizado = pedidoService.actualizarEstado(id, estado);
            return ResponseEntity.ok(pedidoActualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/pendientes")
    public ResponseEntity<List<Pedido>> getPedidosPendientes() {
        List<Pedido> pedidos = pedidoService.findPedidosPendientes();
        return ResponseEntity.ok(pedidos);
    }
}
