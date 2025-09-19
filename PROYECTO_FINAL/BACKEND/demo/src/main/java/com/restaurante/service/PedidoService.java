package com.restaurante.service;

import com.restaurante.dto.request.PedidoRequest;
import com.restaurante.model.*;
import com.restaurante.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class PedidoService {
    
    @Autowired
    private PedidoRepository pedidoRepository;
    
    @Autowired
    private UsuarioRepository usuarioRepository;
    
    @Autowired
    private ProductoRepository productoRepository;
    
    @Autowired
    private MesaRepository mesaRepository;
    
    @Autowired
    private DetallePedidoRepository detallePedidoRepository;
    
    public Pedido crearPedido(PedidoRequest request) {
        Pedido pedido = new Pedido();
        
        // Asignar usuario
        Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
            .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
        pedido.setUsuario(usuario);
        
        // Asignar mesa si existe
        if (request.getMesaId() != null) {
            Mesa mesa = mesaRepository.findById(request.getMesaId())
                .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));
            pedido.setMesa(mesa);
        }
        
        // Crear detalles del pedido
        List<DetallePedido> detalles = new ArrayList<>();
        Double total = 0.0;
        
        for (PedidoRequest.ItemPedido item : request.getItems()) {
            Producto producto = productoRepository.findById(item.getProductoId())
                .orElseThrow(() -> new RuntimeException("Producto no encontrado"));
            
            DetallePedido detalle = new DetallePedido();
            detalle.setProducto(producto);
            detalle.setCantidad(item.getCantidad());
            detalle.setPrecioUnitario(producto.getPrecio());
            
            // Calcular subtotal (usando Double)
            Double subtotal = producto.getPrecio() * item.getCantidad();
            detalle.setSubtotal(subtotal);
            detalle.setPedido(pedido);
            
            detalles.add(detalle);
            total = total + subtotal;
        }
        
        pedido.setDetalles(detalles);
        pedido.setTotal(total);
        pedido.setEstado("PENDIENTE");
        pedido.setFechaPedido(new Date());
        pedido.setNumeroPedido("PED-" + System.currentTimeMillis());
        
        return pedidoRepository.save(pedido);
    }
    
    public Optional<Pedido> findById(Long id) {
        return pedidoRepository.findById(id);
    }
    
    public List<Pedido> findByUsuarioId(Long usuarioId) {
        return pedidoRepository.findAll().stream()
            .filter(p -> p.getUsuario() != null && p.getUsuario().getId().equals(usuarioId))
            .toList();
    }
    
    public List<Pedido> findByMesaId(Long mesaId) {
        return pedidoRepository.findAll().stream()
            .filter(p -> p.getMesa() != null && p.getMesa().getId().equals(mesaId))
            .toList();
    }
    
    public Pedido actualizarEstado(Long id, String estado) {
        Pedido pedido = pedidoRepository.findById(id)
            .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));
        
        pedido.setEstado(estado);
        
        if ("ENTREGADO".equals(estado)) {
            pedido.setFechaEntrega(new Date());
        }
        
        return pedidoRepository.save(pedido);
    }
    
    public List<Pedido> findPedidosPendientes() {
        return pedidoRepository.findAll().stream()
            .filter(p -> "PENDIENTE".equals(p.getEstado()) || "EN_PREPARACION".equals(p.getEstado()))
            .toList();
    }
}