package com.gym.app.Controller;

import com.gym.app.DTO.LoginRequest;
import com.gym.app.DTO.LoginResponse;
import com.gym.app.Entity.Usuario;
import com.gym.app.Security.JwtUtil;
import com.gym.app.Security.SecurityUtils;
import com.gym.app.Service.UsuarioService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.gym.app.DTO.UserInfoResponse;
import org.springframework.http.HttpHeaders;

@RestController
@RequestMapping("/auth")
public class AuthController {

    private final UsuarioService usuarioService;
    private final JwtUtil jwtUtil;

    public AuthController(UsuarioService usuarioService, JwtUtil jwtUtil) {
        this.usuarioService = usuarioService;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/login")
    public ResponseEntity<LoginResponse> login(@RequestBody LoginRequest request) {


        Usuario usuario = usuarioService.login( //validar usuario y contraseña
                request.correo(),
                request.password()
        );

        String token = jwtUtil.generateToken( //generar el token
                usuario.getIdUsuario(),
                usuario.getCorreo()
        );

        return ResponseEntity.ok(
                new LoginResponse(token) //devolver token
        );
    }

    @GetMapping("/me")
    public ResponseEntity<UserInfoResponse> me() {
        Long idUsuario = SecurityUtils.getCurrentUserId();
        Usuario usuario = usuarioService.getUserId(idUsuario);
        return ResponseEntity.ok(
                new UserInfoResponse(usuario.getIdUsuario(), usuario.getCorreo())
        );
    }
}