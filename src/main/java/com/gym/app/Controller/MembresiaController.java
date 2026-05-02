package com.gym.app.Controller;

import com.gym.app.Entity.Membresia;
import com.gym.app.Service.MembresiaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/membresia")
public class MembresiaController {

    private final MembresiaService membresiaService;

    public MembresiaController(MembresiaService membresiaService) {
        this.membresiaService = membresiaService;
    }

    @PostMapping("/{idUsuario}/gym/{idGym}")
    public ResponseEntity<Membresia> unirse(@PathVariable Long idUsuario,
                                            @PathVariable Long idGym) {

        return ResponseEntity.ok(
                membresiaService.unirseAGym(idUsuario, idGym)
        );
    }

    @PutMapping("/{idGym}/admin/{idAdmin}/coach/{idUsuario}")
    public ResponseEntity<String> asignarCoach(@PathVariable Long idGym,
                                               @PathVariable Long idAdmin,
                                               @PathVariable Long idUsuario) {

        membresiaService.asignarCoach(idAdmin, idUsuario, idGym);

        return ResponseEntity.ok("Rol actualizado a COACH");
    }
}