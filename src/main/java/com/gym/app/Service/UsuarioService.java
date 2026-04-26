package com.gym.app.Service;

import com.gym.app.Entity.Usuario;
import com.gym.app.Enum.Rol;
import com.gym.app.Repository.UsuarioRepository;
import com.gym.app.Repository.PerfilRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PerfilRepository perfilRepository;

    public UsuarioService(UsuarioRepository usuarioRepository,
                          PerfilRepository perfilRepository) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
    }

    @Transactional
    public Long registrarUsuario(Usuario usuario) {

        validarCorreo(usuario.getCorreo());
        validarPassword(usuario.getPassword());
        verificarCorreoUnico(usuario.getCorreo());

        usuario.setRol(Rol.MEMBER);

        Long idUsuario = usuarioRepository.crearUsuario(usuario);
        perfilRepository.crearPerfilVacio(idUsuario);

        return idUsuario;
    }

    public Usuario login(String correo, String password) {

        validarCorreo(correo);
        validarPassword(password);

        Usuario usuario = usuarioRepository.buscarPorCorreo(correo)
                .orElseThrow(() -> new IllegalArgumentException("Credenciales incorrectas"));

        if (!usuario.getPassword().equals(password)) {
            throw new IllegalArgumentException("Credenciales incorrectas");
        }

        Usuario response = new Usuario();
        response.setIdUsuario(usuario.getIdUsuario());
        response.setCorreo(usuario.getCorreo());
        response.setRol(usuario.getRol());

        return response;
    }

    private void validarCorreo(String correo) {
        if (correo == null || correo.isBlank()) {
            throw new IllegalArgumentException("Correo requerido");
        }
        if (!correo.contains("@")) {
            throw new IllegalArgumentException("Correo inválido");
        }
    }

    private void validarPassword(String password) {
        if (password == null || password.isBlank()) {
            throw new IllegalArgumentException("Contraseña requerida");
        }
        if (password.length() < 4) {
            throw new IllegalArgumentException("Contraseña muy corta");
        }
    }

    private void verificarCorreoUnico(String correo) {
        if (usuarioRepository.buscarPorCorreo(correo).isPresent()) {
            throw new IllegalStateException("El correo ya está registrado");
        }
    }
}