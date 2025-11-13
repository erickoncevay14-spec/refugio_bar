package com.restaurante.controller.api;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.restaurante.dto.request.CrearPedidoRequest;
import com.restaurante.model.Pedido;
import com.restaurante.model.Producto;
import com.restaurante.service.PedidoService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/pedidos")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:3001", "http://localhost:8080"})
public class PedidoController {

    @Autowired
    private PedidoService pedidoService;

    @Autowired
    private com.restaurante.repository.ProductoRepository productoRepository;

    //  NUEVO: Inyectar SimpMessagingTemplate para WebSocket
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public ResponseEntity<?> crearPedido(@Valid @RequestBody CrearPedidoRequest pedidoRequest) {
        try {
            Pedido nuevoPedido = pedidoService.crearPedido(pedidoRequest);

            //  Notificar a todos los clientes suscritos al topic
            messagingTemplate.convertAndSend("/topic/pedidos", nuevoPedido);

            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoPedido);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> actualizarEstado(@PathVariable Long id, @RequestParam String estado) {
        try {
            Pedido pedidoActualizado = pedidoService.actualizarEstado(id, estado);
            
            // Notificar a TODOS sobre el cambio de estado
            messagingTemplate.convertAndSend("/topic/pedidos/actualizado", pedidoActualizado);
            
            // Si el pedido está LISTO, notificar específicamente al mozo
            if ("LISTO".equals(estado)) {
                messagingTemplate.convertAndSend("/topic/pedidos/listos", pedidoActualizado);
            }
            
            return ResponseEntity.ok(pedidoActualizado);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("error", e.getMessage()));
        }
    }


    @GetMapping
    public ResponseEntity<List<Pedido>> getAllPedidos() {
        return ResponseEntity.ok(pedidoService.findAll());
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

    @GetMapping("/pendientes")
    public ResponseEntity<List<Pedido>> getPedidosPendientes() {
        List<Pedido> pedidos = pedidoService.findPedidosPendientes();
        return ResponseEntity.ok(pedidos);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarPedido(@PathVariable Long id) {
        try {
            boolean eliminado = pedidoService.eliminarPedido(id);
            if (eliminado) {
                return ResponseEntity.ok().build();
            } else {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                        .body(Map.of("error", "Pedido no encontrado"));
            }
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", e.getMessage()));
        }
    }
    @GetMapping("/estadisticas/ventas-semanales")
    public ResponseEntity<List<Integer>> getVentasSemanales() {
        try {
            List<Integer> ventas = pedidoService.obtenerVentasSemanales();
            return ResponseEntity.ok(ventas);
        } catch (Exception e) {
            List<Integer> ventas = List.of(0, 0, 0, 0, 0, 0, 0);
            return ResponseEntity.ok(ventas);
        }
    }

    @GetMapping("/estadisticas/productos-mas-vendidos")
    public ResponseEntity<Map<String, Integer>> getProductosMasVendidos() {
        List<Producto> productos = productoRepository.findByDisponibleTrue();
        Map<String, Integer> conteo = new java.util.LinkedHashMap<>();
        conteo.put("Bebidas", 0);
        conteo.put("Comidas", 0);
        conteo.put("Postres", 0);
        conteo.put("Aperitivos", 0);

        for (Producto p : productos) {
            String categoria = p.getCategoria();
            if (categoria == null) categoria = "";
            categoria = categoria.trim().toLowerCase();

            if (categoria.equals("bebida") || categoria.equals("bebidas")) {
                conteo.put("Bebidas", conteo.get("Bebidas") + 1);
            } else if (categoria.equals("comida") || categoria.equals("comidas")) {
                conteo.put("Comidas", conteo.get("Comidas") + 1);
            } else if (categoria.equals("postre") || categoria.equals("postres")) {
                conteo.put("Postres", conteo.get("Postres") + 1);
            } else if (categoria.equals("aperitivo") || categoria.equals("aperitivos")) {
                conteo.put("Aperitivos", conteo.get("Aperitivos") + 1);
            }
        }
        return ResponseEntity.ok(conteo);
    }

}
