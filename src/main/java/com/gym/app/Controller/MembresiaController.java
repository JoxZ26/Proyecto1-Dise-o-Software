package com.gym.app.Controller;

import com.gym.app.Entity.Membresia;
import com.gym.app.Service.MembresiaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController // esta clase escribe y responde peticiones HTTP
@RequestMapping("/membresia") //todas las rutas de este controller van con /membresia
public class MembresiaController {

    private final MembresiaService membresiaService; //atributo del service

    public MembresiaController(MembresiaService membresiaService) {
        this.membresiaService = membresiaService;
    }

    @PostMapping("/{idUsuario}/gym/{idGym}") //endpoint de POST para unirse a un gimnasio, según id del usuario y la id del gimnasio a la que se va unir
    public ResponseEntity<Membresia> unirse(@PathVariable Long idUsuario,
                                            @PathVariable Long idGym) {
        Membresia membresia = membresiaService.unirseAGym(idUsuario, idGym);
        return ResponseEntity.ok(membresia);
    }
}
