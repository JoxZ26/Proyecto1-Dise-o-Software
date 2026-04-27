package com.gym.app.Controller;

import com.gym.app.Entity.Rutina;
import com.gym.app.Service.RutinaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/rutinas")
public class RutinaController {

    private final RutinaService rutinaService;

    public RutinaController(RutinaService rutinaService) {
        this.rutinaService = rutinaService;
    }
    @PostMapping("/{idUsuario}")
    public ResponseEntity<?> crearRutina( @PathVariable Long idUsuario, @RequestBody CrearRutinaRequest request
    ) {
        try {
            Rutina rutina = new Rutina();
            rutina.setIdUsuario(idUsuario);
            rutina.setNombre(request.nombre());
            rutina.setDescripcion(request.descripcion());

            Rutina nuevaRutina = rutinaService.crearRutina(rutina);
            return ResponseEntity.ok(nuevaRutina);

        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("existe")) {
                return ResponseEntity.status(409).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public record CrearRutinaRequest(
            String nombre,
            String descripcion
    ) {}

    @GetMapping("/activas/{idUsuario}")
    public ResponseEntity<?> obtenerActivas(@PathVariable Long idUsuario) {
        return ResponseEntity.ok(rutinaService.obtenerRutinasActivas(idUsuario));
    }

    @PutMapping("/{idRutina}/activar")
    public ResponseEntity<?> activar(@PathVariable Long idRutina) {
        try {
            return ResponseEntity.ok(rutinaService.activarRutina(idRutina));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping("/{idRutina}/desactivar")
    public ResponseEntity<?> desactivar(@PathVariable Long idRutina) {
        try {
            return ResponseEntity.ok(rutinaService.desactivarRutina(idRutina));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }


}
