package com.gym.app.Controller;

import com.gym.app.Entity.Gym;
import com.gym.app.Service.GymService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController //esta clase escribe y responde peticiones HTTP
@RequestMapping("/gyms") //todas las rutas de este controller van con /gyms
public class GymController {

    private final GymService gymService; //atributo para el service

    public GymController(GymService gymService) {
        this.gymService = gymService;
    }

    @PostMapping("/{idUsuario}")
    public ResponseEntity<Gym> crearGym(@PathVariable Long idUsuario,
                                        @RequestBody GymRequest request) {
        return ResponseEntity.ok(
                gymService.crearGym(request.nombre(), request.descripcion(), request.logoUrl(), idUsuario)
        );
    }

    @GetMapping("/buscar") //endpoint de buscar, requiere parámetros para la búsqueda (el nombre)
    public ResponseEntity<List<Gym>> buscar(@RequestParam String nombre) {
        return ResponseEntity.ok(gymService.buscarGyms(nombre));
    }

    public record GymRequest(String nombre, String descripcion, String logoUrl) {} //mapear el JSON del request a un objeto de Java
}