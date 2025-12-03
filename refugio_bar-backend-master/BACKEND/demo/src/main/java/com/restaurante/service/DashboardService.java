package com.restaurante.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.restaurante.repository.MesaRepository;
import com.restaurante.repository.PedidoRepository;
import com.restaurante.repository.ProductoRepository;
import com.restaurante.repository.UsuarioRepository;

@Service
public class DashboardService {

    @Autowired private ProductoRepository productoRepo;
    @Autowired private PedidoRepository pedidoRepo;
    @Autowired private UsuarioRepository usuarioRepo;
    @Autowired private MesaRepository mesaRepo;

    public Map<String, Object> obtenerResumenGeneral() {
        Map<String, Object> data = new HashMap<>();

        data.put("totalProductos", productoRepo.count());
        data.put("ventasHoy", pedidoRepo.ventasHoy() != null ? pedidoRepo.ventasHoy() : 0);
        data.put("pedidosHoy", pedidoRepo.pedidosHoy() != null ? pedidoRepo.pedidosHoy() : 0);
        data.put("totalUsuarios", usuarioRepo.count());
        data.put("mesasDisponibles", mesaRepo.countByEstado("LIBRE"));
        data.put("reservasHoy", mesaRepo.reservasHoy() != null ? mesaRepo.reservasHoy() : 0);
        data.put("ingresosSemanales", pedidoRepo.ingresosUltimos7Dias() != null ? pedidoRepo.ingresosUltimos7Dias() : 0);
        String productoTop = pedidoRepo.productoMasVendido();
        data.put("productoTop", productoTop != null ? productoTop : "-");

        return data;
    }

    public List<Object[]> obtenerVentasSemanales() {
        return pedidoRepo.ventasSemanales();
    }

    public List<Object[]> obtenerTopProductos() {
        return pedidoRepo.productosTop();
    }
}
