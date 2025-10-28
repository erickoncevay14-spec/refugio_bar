package com.restaurante.controller.api;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.*;

import com.restaurante.dto.request.EstadoMesaRequest;
import com.restaurante.model.Mesa;
import com.restaurante.repository.MesaRepository;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/mesas")
@CrossOrigin(origins = "*")
public class MesaController {

    @Autowired
    private MesaRepository mesaRepository;
    
    @Autowired
    private SimpMessagingTemplate messagingTemplate;

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
                nueva.setEstado("LIBRE"); // Cambiado de DISPONIBLE a LIBRE
                mesaRepository.save(nueva);
                mesas.add(nueva);
            }
        }
        return ResponseEntity.ok(Map.of("data", mesas));
    }

    @PostMapping
    public ResponseEntity<Mesa> crearMesa(@RequestBody Mesa mesa) {
        mesa.setEstado("LIBRE");
        Mesa nueva = mesaRepository.save(mesa);
        
        // Notificar creación
        messagingTemplate.convertAndSend("/topic/mesas/actualizado", nueva);
        
        return ResponseEntity.ok(nueva);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Mesa> modificarMesa(@PathVariable Long id, @RequestBody Mesa mesa) {
        Mesa actual = mesaRepository.findById(id).orElse(null);
        if (actual == null) return ResponseEntity.notFound().build();
        
        actual.setNumero(mesa.getNumero());
        actual.setCapacidad(mesa.getCapacidad());
        actual.setUbicacion(mesa.getUbicacion());
        actual.setEstado(mesa.getEstado());
        
        Mesa guardada = mesaRepository.save(actual);
        
        // Notificar actualización
        messagingTemplate.convertAndSend("/topic/mesas/actualizado", guardada);
        
        return ResponseEntity.ok(guardada);
    }

    @PutMapping("/{id}/estado")
    public ResponseEntity<?> cambiarEstado(
            @PathVariable Long id, 
            @Valid @RequestBody EstadoMesaRequest request) {
        
        Mesa mesa = mesaRepository.findById(id).orElse(null);
        if (mesa == null) {
            return ResponseEntity.notFound().build();
        }
        
        mesa.setEstado(request.getEstado());
        Mesa mesaActualizada = mesaRepository.save(mesa);
        
        // Notificar cambio de estado vía WebSocket
        messagingTemplate.convertAndSend("/topic/mesas/actualizado", mesaActualizada);
        
        return ResponseEntity.ok(mesaActualizada);
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarMesa(@PathVariable Long id) {
        if (!mesaRepository.existsById(id)) {
            return ResponseEntity.notFound().build();
        }
        mesaRepository.deleteById(id);
        
        // Notificar eliminación
        messagingTemplate.convertAndSend("/topic/mesas/eliminada", Map.of("id", id));
        
        return ResponseEntity.ok().build();
    }
}