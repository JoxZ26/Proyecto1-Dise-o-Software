package com.gym.app.Controller;

import com.gym.app.Entity.Usuario;
import com.gym.app.Service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController //Esta clase escribe y responde peticiones HTTP
@RequestMapping("/usuarios") //todas las rutas de este controller van con /usuarios
public class UsuarioController {

    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/registrar") // este endpoint responde a POST /usuarios/registrar
    public ResponseEntity<Usuario> registrar(@RequestBody UsuarioRequest request) {
        Usuario usuario = usuarioService.registrar(request.correo(), request.password());
        return ResponseEntity.ok(usuario);
    }

    @PostMapping("/login")
    public ResponseEntity<Usuario> login(@RequestBody UsuarioRequest request) {
        Usuario usuario = usuarioService.login(request.correo(), request.password());
        return ResponseEntity.ok(usuario);
    }

    @GetMapping("/buscar")
    public ResponseEntity<List<Usuario>> buscar(@RequestParam String correo) {
        return ResponseEntity.ok(usuarioService.buscar(correo));
    }

    public record UsuarioRequest(String correo, String password) {} //mapear el JSON del request a un objeto Java
}
