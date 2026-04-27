package com.gym.app.Controller;

import com.gym.app.Entity.Ejercicio;
import com.gym.app.Service.EjercicioService;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/ejercicios")
public class EjercicioController {
    private final EjercicioService ejercicioService;

    public EjercicioController(EjercicioService ejercicioService) {
        this.ejercicioService = ejercicioService;
    }
    @PostMapping
    public ResponseEntity<?> crear(@RequestBody CrearEjercicioRequest request) {
        try {
            Ejercicio ejercicio = new Ejercicio();
            ejercicio.setNombre(request.nombre());
            ejercicio.setGrupoMuscular(request.grupoMuscular());
            ejercicio.setDescripcion(request.descripcion());
            ejercicio.setImagenUrl(request.imagenUrl());
            ejercicio.setVideoUrl(request.videoUrl());

            Ejercicio nuevo = ejercicioService.crearEjercicio(ejercicio);
            return ResponseEntity.ok(nuevo);

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage()); // datos inválidos
        } catch (RuntimeException e) {
            return ResponseEntity.status(409).body(e.getMessage()); // duplicado
        }
    }

    public record CrearEjercicioRequest(
            String nombre,
            String grupoMuscular,
            String descripcion,
            String imagenUrl,
            String videoUrl
    ) {}
}
