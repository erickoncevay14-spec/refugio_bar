package com.restaurante.controller.api;

import com.restaurante.service.DashboardService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/dashboard")
@CrossOrigin(origins = "*")
public class DashboardController {

    private final DashboardService dashboardService;

    public DashboardController(DashboardService dashboardService) {
        this.dashboardService = dashboardService;
    }

    @GetMapping("/resumen")
    public Object getResumenGeneral() {
        return dashboardService.obtenerResumenGeneral();
    }

    @GetMapping("/ventas-semanales")
    public Object getVentasSemanales() {
        return dashboardService.obtenerVentasSemanales();
    }

    @GetMapping("/top-productos")
    public Object getTopProductos() {
        return dashboardService.obtenerTopProductos();
    }
}
