package com.gym.app.Controller;

import com.gym.app.DTO.RutinaCompleta;
import com.gym.app.Entity.Rutina;
import com.gym.app.Entity.RutinaDia;
import com.gym.app.Entity.RutinaEjercicio;
import com.gym.app.Service.RutinaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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
    public ResponseEntity<List<RutinaCompleta>> obtenerActivas(@PathVariable Long idUsuario) {
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

    @PutMapping("/{idRutina}/asignar/{idMiembro}/{idCoach}")
    public ResponseEntity<?> asignarAMiembro(@PathVariable Long idRutina,
                                             @PathVariable Long idMiembro,
                                             @PathVariable Long idCoach) {
        try {
            return ResponseEntity.ok(
                    rutinaService.asignarRutinaAMiembro(idRutina, idMiembro, idCoach)
            );
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{idRutina}/dias")
    public ResponseEntity<?> agregarDia(@PathVariable Long idRutina,
                                        @RequestBody AgregarDiaRequest request) {
        try {
            RutinaDia dia = rutinaService.agregarDia(idRutina, request.diaNumero(), request.nombre());
            return ResponseEntity.ok(dia);
        } catch (IllegalArgumentException e) {
            if (e.getMessage().contains("existe")) {
                return ResponseEntity.status(409).body(e.getMessage());
            }
            return ResponseEntity.badRequest().body(e.getMessage());
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    public record AgregarDiaRequest(Integer diaNumero, String nombre) {}

    @PostMapping("/dias/{idDia}/ejercicios")
    public ResponseEntity<?> agregarEjercicio(@PathVariable Long idDia,
                                               @RequestBody AgregarEjercicioRequest request) {
        try {
            RutinaEjercicio resultado = rutinaService.agregarEjercicioADia(
                    idDia, request.idEjercicio(), request.sets(),
                    request.reps(), request.descansoSegundos(), request.notas());
            return ResponseEntity.ok(resultado);
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Rutina>> buscar(@RequestParam String nombre) {
        return ResponseEntity.ok(rutinaService.buscar(nombre));
    }

    public record AgregarEjercicioRequest(Long idEjercicio, Integer sets,
                                          Integer reps, Integer descansoSegundos,
                                          String notas) {}
}
