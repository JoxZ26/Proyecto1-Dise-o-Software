package com.gym.app.Controller;

import com.gym.app.Entity.Ejercicio;
import com.gym.app.Security.SecurityUtils;
import com.gym.app.Service.AuthService;
import com.gym.app.Service.EjercicioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/ejercicios")
public class EjercicioController {

    private final EjercicioService ejercicioService;

    public EjercicioController(EjercicioService ejercicioService) {
        this.ejercicioService = ejercicioService;
    }

    @PostMapping
    public ResponseEntity<Ejercicio> crearEjercicio(@RequestBody CrearEjercicioRequest request) {
        Long idUsuario = SecurityUtils.getCurrentUserId();
        Ejercicio ejercicio = new Ejercicio();
        ejercicio.setNombre(request.nombre());
        ejercicio.setGrupoMuscular(request.grupoMuscular());
        ejercicio.setDescripcion(request.descripcion());
        ejercicio.setImagenUrl(request.imagenUrl());
        ejercicio.setVideoUrl(request.videoUrl());

        return ResponseEntity.ok(
                ejercicioService.crearEjercicio(ejercicio, idUsuario)
        );
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Ejercicio>> buscar(@RequestParam String nombre) {
        return ResponseEntity.ok(ejercicioService.buscar(nombre));
    }

    @GetMapping
    public ResponseEntity<List<Ejercicio>> listar() {
        return ResponseEntity.ok(ejercicioService.listarTodos());
    }

    public record CrearEjercicioRequest(
            String nombre,
            String grupoMuscular,
            String descripcion,
            String imagenUrl,
            String videoUrl
    ) {}
}