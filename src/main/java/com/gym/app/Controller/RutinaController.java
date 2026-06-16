package com.gym.app.Controller;

import com.gym.app.DTO.RutinaCompleta;
import com.gym.app.Entity.Rutina;
import com.gym.app.Entity.RutinaDia;
import com.gym.app.Entity.RutinaEjercicio;
import com.gym.app.Security.SecurityUtils;
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

    @PostMapping
    public ResponseEntity<Rutina> crearRutina(@RequestBody CrearRutinaRequest request) {
        Long idUsuario = SecurityUtils.getCurrentUserId();
        Rutina rutina = new Rutina();
        rutina.setIdUsuario(idUsuario);
        rutina.setNombre(request.nombre());
        rutina.setDescripcion(request.descripcion());

        return ResponseEntity.ok(
                rutinaService.crearRutina(rutina)
        );
    }

    public record CrearRutinaRequest(String nombre, String descripcion) {}

    @GetMapping("/activas")
    public ResponseEntity<List<RutinaCompleta>> obtenerActivas() {
        Long idUsuario = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(rutinaService.obtenerRutinasActivas(idUsuario));
    }

    @PutMapping("/{idRutina}/activar")
    public ResponseEntity<Rutina> activar(@PathVariable Long idRutina) {

        Long idUsuario = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(rutinaService.activarRutina(idRutina, idUsuario)
        );
    }

    @PutMapping("/{idRutina}/desactivar")
    public ResponseEntity<Rutina> desactivar(@PathVariable Long idRutina) {
        Long idUsuario = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(rutinaService.desactivarRutina(idRutina, idUsuario)
        );
    }

    @PutMapping("/{idRutina}/asignar/{idMiembro}")
    public ResponseEntity<Rutina> asignarAMiembro(@PathVariable Long idRutina, @PathVariable Long idMiembro) {

        Long idCoach = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(
                rutinaService.asignarRutinaAMiembro(idRutina, idMiembro, idCoach)
        );
    }

    @PostMapping("/{idRutina}/dias")
    public ResponseEntity<RutinaDia> agregarDia(
            @PathVariable Long idRutina,
            @RequestBody AgregarDiaRequest request) {

        return ResponseEntity.ok(
                rutinaService.agregarDia(idRutina, request.diaNumero(), request.nombre())
        );
    }

    public record AgregarDiaRequest(Integer diaNumero, String nombre) {}

    @PostMapping("/dias/{idDia}/ejercicios")
    public ResponseEntity<RutinaEjercicio> agregarEjercicio(
            @PathVariable Long idDia,
            @RequestBody AgregarEjercicioRequest request) {

        return ResponseEntity.ok(
                rutinaService.agregarEjercicioADia(
                        idDia,
                        request.idEjercicio(),
                        request.sets(),
                        request.reps(),
                        request.descansoSegundos(),
                        request.notas()
                )
        );
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Rutina>> buscar(@RequestParam String nombre) {
        return ResponseEntity.ok(rutinaService.buscar(nombre));
    }

    public record AgregarEjercicioRequest(
            Long idEjercicio,
            Integer sets,
            Integer reps,
            Integer descansoSegundos,
            String notas
    ) {}
}
