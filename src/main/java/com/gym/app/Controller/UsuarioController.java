package com.gym.app.Controller;

import com.gym.app.Entity.Usuario;
import com.gym.app.Service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import com.gym.app.Enum.Rol;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/registrar")
    public ResponseEntity<Usuario> registrar(@RequestBody UsuarioRequest request) {

        return ResponseEntity.ok(
                usuarioService.registrar(request.correo(), request.password())
        );
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody UsuarioRequest request) {

        return ResponseEntity.ok(
                usuarioService.login(request.correo(), request.password())
        );
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Usuario>> buscar(@RequestParam String correo) {
        return ResponseEntity.ok(usuarioService.buscar(correo));
    }

    public record UsuarioRequest(String correo, String password, Rol rol) {}
}
