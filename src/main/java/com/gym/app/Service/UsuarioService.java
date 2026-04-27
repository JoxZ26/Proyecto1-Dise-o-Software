package com.gym.app.Service;

import com.gym.app.Entity.Perfil;
import com.gym.app.Entity.Usuario;
import com.gym.app.Repository.PerfilRepository;
import com.gym.app.Enum.Rol;
import com.gym.app.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository; //atributo del repositorio de Usuario
    private final PerfilRepository perfilRepository; //atributo del repositorio de Perfil

    public UsuarioService(UsuarioRepository usuarioRepository, PerfilRepository perfilRepository) {
        this.usuarioRepository = usuarioRepository;
        this.perfilRepository = perfilRepository;
    }

    public Usuario registrar(String correo, String password) {
        if (usuarioRepository.findByCorreo(correo).isPresent()) {
            throw new RuntimeException("El correo ya está registrado"); //si el correo ya existe = error
        }
        Usuario usuario = new Usuario(correo, password, Rol.MEMBER); //crear nuevo usuario
        Usuario usuarioGuardado = usuarioRepository.save(usuario); // guardar

        Perfil perfil = new Perfil(); //crear perfil vacío para el nuevo usuario
        perfil.setIdUsuario(usuarioGuardado.getIdUsuario()); //misma id que el usuario
        perfilRepository.save(perfil); //guardar el perfil vacío

        return usuarioGuardado;
    }

    public Usuario login(String correo, String password) {
        Usuario usuario = usuarioRepository.findByCorreo(correo)
                .orElseThrow(() -> new RuntimeException("Correo no registrado")); //caso de que el correo no exista = error
        if (!usuario.getPassword().equals(password)) {
            throw new RuntimeException("Contraseña incorrecta"); //caso de que la contraseña no coincida = error
        }
        return usuario;
    }
}