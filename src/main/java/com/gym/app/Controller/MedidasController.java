package com.gym.app.Controller;

import com.gym.app.Entity.Medidas;
import com.gym.app.Security.SecurityUtils;
import com.gym.app.Service.MedidasService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.List;

@RestController //esta clase escribe y responde peticiones HTTP
@RequestMapping("/medidas") //todas las rutas de este controller van con /medidas
public class MedidasController {

    private final MedidasService medidasService; //atributo del servicio

    public MedidasController(MedidasService medidasService) {
        this.medidasService = medidasService;
    }

    @PostMapping // endpoint de POST para registrar un usuario
    public ResponseEntity<Medidas> registrar(@RequestBody MedidasRequest request) {

        Long idUsuario = SecurityUtils.getCurrentUserId();
        Medidas medidas = medidasService.registrarMedidas(idUsuario, request.peso(),
                request.biceps(), request.antebrazo(), request.pecho(), request.cintura(),
                request.abdomen(), request.cadera(), request.muslo(),
                request.pantorrilla(), request.fecha());
        return ResponseEntity.ok(medidas);
    }

    @GetMapping //endpoint de GET para obtener el historial
    public ResponseEntity<List<Medidas>> historial() {
        Long idUsuario = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(medidasService.obtenerHistorial(idUsuario));
    }

    public record MedidasRequest(Double peso, Double biceps, Double antebrazo,
                                 Double pecho, Double cintura, Double abdomen,
                                 Double cadera, Double muslo, Double pantorrilla,
                                 LocalDate fecha) {} //mapear el JSON  del request a un objeto de Java
}
