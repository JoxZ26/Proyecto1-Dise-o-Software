package com.gym.app.Controller;

import com.gym.app.DTO.MiembroGymResponse;
import com.gym.app.Entity.Gym;
import com.gym.app.DTO.UserInfoResponse;
import com.gym.app.Security.SecurityUtils;
import com.gym.app.Service.AuthService;
import com.gym.app.Service.GymService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController //esta clase escribe y responde peticiones HTTP
@RequestMapping("/gyms") //todas las rutas de este controller van con /gyms
public class GymController {

    private final GymService gymService; //atributo para el service
    private final AuthService authService;

    public GymController(GymService gymService, AuthService authService) {
        this.gymService = gymService;
        this.authService = authService;
    }

    @PostMapping
    public ResponseEntity<Gym> crearGym(@RequestBody GymRequest request) {
        Long idUsuario = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(gymService.crearGym(request.nombre(), request.descripcion(), request.logoUrl(), idUsuario)
        );
    }

    @GetMapping("/buscar") //endpoint de buscar, requiere parámetros para la búsqueda (el nombre)
    public ResponseEntity<List<Gym>> buscar(@RequestParam String nombre) {
        return ResponseEntity.ok(gymService.buscarGyms(nombre));
    }

    // solo ADMIN del gym puede modificar su información — demuestra chequeo de rol por gym
    @PutMapping("/{idGym}")
    public ResponseEntity<Gym> actualizarGym(@PathVariable Long idGym, @RequestBody GymRequest request) {
        Long idUsuario = SecurityUtils.getCurrentUserId();
        authService.validarAdmin(idUsuario, idGym);
        return ResponseEntity.ok(gymService.actualizarGym(idGym, request.nombre(), request.descripcion(), request.logoUrl()));
    }

    @GetMapping("/{idGym}/usuarios")
    public ResponseEntity<List<MiembroGymResponse>> obtenerUsuariosGym(@PathVariable Long idGym){
        return ResponseEntity.ok(gymService.obtenerUsuariosGym(idGym));
    }

    public record GymRequest(String nombre, String descripcion, String logoUrl) {} //mapear el JSON del request a un objeto de Java
}