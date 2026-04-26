package com.gym.app.Controller;

import com.gym.app.Entity.Usuario;
import com.gym.app.Service.UsuarioService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/usuarios")
public class UsuarioController {
    private final UsuarioService usuarioService;

    public UsuarioController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }
    @PostMapping("/registro")
    public Long registrar(@RequestBody Usuario usuario) {
        return usuarioService.registrarUsuario(usuario);
    }
    @PostMapping("/login")
    public Usuario login(@RequestBody Usuario usuario) {
        return usuarioService.login(usuario.getCorreo(), usuario.getPassword());
    }
}
