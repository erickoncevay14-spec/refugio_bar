package com.restaurante.service.implementaciones;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.restaurante.dto.request.CrearPedidoRequest;
import com.restaurante.model.DetallePedido;
import com.restaurante.model.Mesa;
import com.restaurante.model.Pedido;
import com.restaurante.model.Producto;
import com.restaurante.model.Usuario;
import com.restaurante.repository.DetallePedidoRepository;
import com.restaurante.repository.MesaRepository;
import com.restaurante.repository.PedidoRepository;
import com.restaurante.repository.ProductoRepository;
import com.restaurante.repository.UsuarioRepository;
import com.restaurante.service.PedidoService;

@Service
@Transactional

public class PedidoServiceImplements implements PedidoService {
    
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

    @Override
    public List<Pedido> findAll() {
        return pedidoRepository.findAll();
    }

    @Override
    public Pedido crearPedido(CrearPedidoRequest request) {
        Pedido pedido = new Pedido();

        // Asignar usuario solo si existe
        if (request.getUsuarioId() != null) {
            Usuario usuario = usuarioRepository.findById(request.getUsuarioId())
                    .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));
            pedido.setUsuario(usuario);
        }

        // Asignar mesa si existe
        if (request.getMesaId() != null) {
            Mesa mesa = mesaRepository.findById(request.getMesaId())
                    .orElseThrow(() -> new RuntimeException("Mesa no encontrada"));
            pedido.setMesa(mesa);
        }

        // Crear detalles del pedido
        List<DetallePedido> detalles = new ArrayList<>();
        Double total = 0.0;

        for (CrearPedidoRequest.ItemPedido item : request.getItems()) {
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

    @Override
    public Optional<Pedido> findById(Long id) {
        return pedidoRepository.findById(id);
    }

    @Override
    public List<Pedido> findByUsuarioId(Long usuarioId) {
        return pedidoRepository.findAll().stream()
                .filter(p -> p.getUsuario() != null && p.getUsuario().getId().equals(usuarioId))
                .toList();
    }

    @Override
    public List<Pedido> findByMesaId(Long mesaId) {
        return pedidoRepository.findAll().stream()
                .filter(p -> p.getMesa() != null && p.getMesa().getId().equals(mesaId))
                .toList();
    }

    @Override
    @Transactional
    public Pedido actualizarEstado(Long id, String estado) {
        Pedido pedido = pedidoRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Pedido no encontrado"));

        pedido.setEstado(estado);

        if ("ENTREGADO".equals(estado)) {
            pedido.setFechaEntrega(new Date());
        }

        // Solo guarda los cambios de estado, no recarga todas las relaciones
        pedidoRepository.flush();
        
        return pedido;
    }

    @Override
    public List<Pedido> findPedidosPendientes() {
        return pedidoRepository.findAll().stream()
                .filter(p -> "PENDIENTE".equals(p.getEstado()) || "EN_PREPARACION".equals(p.getEstado()))
                .toList();
    }

    @Override
    public boolean eliminarPedido(Long id) {
        if (pedidoRepository.existsById(id)) {
            pedidoRepository.deleteById(id);
            return true;
        }
        return false;
    }

    @Override
    public List<Integer> obtenerVentasSemanales() {
        List<Pedido> pedidos = pedidoRepository.findAll();
        int[] ventasPorDia = new int[7];
        for (Pedido pedido : pedidos) {
            if (pedido.getFechaPedido() != null) {
                java.util.Calendar cal = java.util.Calendar.getInstance();
                cal.setTime(pedido.getFechaPedido());
                int dia = cal.get(java.util.Calendar.DAY_OF_WEEK); // 1=Domingo, 2=Lunes, ...
                int idx = (dia == 1) ? 6 : dia - 2; // 0=Lunes, ..., 6=Domingo
                ventasPorDia[idx] += pedido.getTotal().intValue();
            }
        }
        List<Integer> resultado = new java.util.ArrayList<>();
        for (int v : ventasPorDia) {
            resultado.add(v);
        }
        return resultado;
    }
}
