package com.gym.app.Controller;

import com.gym.app.DTO.MembresiaInfoResponse;
import com.gym.app.Entity.Usuario;
import com.gym.app.Security.SecurityUtils;
import com.gym.app.Service.MembresiaService;
import com.gym.app.Service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.gym.app.Enum.Rol;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;
    private final MembresiaService membresiaService;

    public UsuarioController(UsuarioService usuarioService, MembresiaService membresiaService) {
        this.usuarioService = usuarioService;
        this.membresiaService = membresiaService;
    }

    @PostMapping("/registrar")
    public ResponseEntity<Usuario> registrar(@RequestBody UsuarioRequest request) {

        return ResponseEntity.ok(
                usuarioService.registrar(request.correo(), request.password())
        );
    }

    // devuelve las membresías del usuario autenticado con gymId, nombreGym y rol
    @GetMapping("/me/membresias")
    public ResponseEntity<List<MembresiaInfoResponse>> misMembresias() {
        Long idUsuario = SecurityUtils.getCurrentUserId();
        return ResponseEntity.ok(membresiaService.getMembresiasMeInfo(idUsuario));
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Usuario>> buscar(@RequestParam String correo) {
        return ResponseEntity.ok(usuarioService.buscar(correo));
    }

    public record UsuarioRequest(String correo, String password, Rol rol) {}
}
