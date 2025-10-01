package com.restaurante.controller.api;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.restaurante.model.Mesa;
import com.restaurante.repository.MesaRepository;

@RestController
@RequestMapping("/api/mesas")
@CrossOrigin(origins = "*")
public class MesaController {

    @Autowired
    private MesaRepository mesaRepository;

    @GetMapping
    public ResponseEntity<?> getMesas() {
        List<Mesa> mesas = mesaRepository.findAll();
            // Si hay menos de 10 mesas, crear las faltantes
            int faltan = 10 - mesas.size();
            if (faltan > 0) {
                int maxNumero = mesas.stream().mapToInt(m -> m.getNumero()).max().orElse(0);
                for (int i = 1; i <= faltan; i++) {
                    Mesa nueva = new Mesa();
                    nueva.setNumero(maxNumero + i);
                    nueva.setCapacidad(4);
                    nueva.setEstado("DISPONIBLE");
                    mesaRepository.save(nueva);
                    mesas.add(nueva);
                }
            }
        return ResponseEntity.ok(Map.of("data", mesas));
    }

        // Crear mesa
        @org.springframework.web.bind.annotation.PostMapping
        public ResponseEntity<Mesa> crearMesa(@org.springframework.web.bind.annotation.RequestBody Mesa mesa) {
            mesa.setEstado("DISPONIBLE");
            Mesa nueva = mesaRepository.save(mesa);
            return ResponseEntity.ok(nueva);
        }

        // Modificar mesa
        @org.springframework.web.bind.annotation.PutMapping("/{id}")
        public ResponseEntity<Mesa> modificarMesa(@org.springframework.web.bind.annotation.PathVariable Long id, @org.springframework.web.bind.annotation.RequestBody Mesa mesa) {
            Mesa actual = mesaRepository.findById(id).orElse(null);
            if (actual == null) return ResponseEntity.notFound().build();
            actual.setNumero(mesa.getNumero());
            actual.setCapacidad(mesa.getCapacidad());
            actual.setUbicacion(mesa.getUbicacion());
            actual.setEstado(mesa.getEstado());
            Mesa guardada = mesaRepository.save(actual);
            return ResponseEntity.ok(guardada);
        }

        // Cambiar solo el estado de la mesa
        @org.springframework.web.bind.annotation.PutMapping("/{id}/estado")
        public ResponseEntity<Mesa> cambiarEstado(@org.springframework.web.bind.annotation.PathVariable Long id, @org.springframework.web.bind.annotation.RequestBody Map<String, String> body) {
            Mesa mesa = mesaRepository.findById(id).orElse(null);
            if (mesa == null) return ResponseEntity.notFound().build();
            String nuevoEstado = body.get("estado");
            mesa.setEstado(nuevoEstado);
            mesaRepository.save(mesa);
            return ResponseEntity.ok(mesa);
        }
}
