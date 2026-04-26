package com.gym.app.Controller;

import com.gym.app.Entity.Perfil;
import com.gym.app.Service.PerfilService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;

@RestController //Esta clase escribe y responde a peticiones HTTP
@RequestMapping("/perfil") //todas las rutas del controller van con /perfil
public class PerfilController {

    private final PerfilService perfilService;

    public PerfilController(PerfilService perfilService) {
        this.perfilService = perfilService;
    }

    @GetMapping("/{idUsuario}") //endpoint de GET para obtener mediante ID de usuario el perfil
    public ResponseEntity<Perfil> obtenerPerfil(@PathVariable Long idUsuario) {
        Perfil perfil = perfilService.obtenerPerfil(idUsuario);
        return ResponseEntity.ok(perfil);
    }

    @PutMapping("/{idUsuario}") //endpoint de PUT para actualizar el perfil mediante ID de usuario, recibe un JSON con los datos a actualizar
    public ResponseEntity<Perfil> actualizarPerfil(@PathVariable Long idUsuario,
                                                   @RequestBody PerfilRequest request) {
        Perfil perfil = perfilService.actualizarPerfil(idUsuario, request.nombre(),
                request.apellido1(), request.apellido2(), request.fechaNacimiento(),
                request.altura(), request.pesoInicial(), request.fotoUrl());
        return ResponseEntity.ok(perfil);
    }

    public record PerfilRequest(String nombre, String apellido1, String apellido2,
                                LocalDate fechaNacimiento, Double altura,
                                Double pesoInicial, String fotoUrl) {} //mapear del JSON a objeto de Java
}