package com.gym.app.Service;

import com.gym.app.Entity.Ejercicio;
import com.gym.app.Entity.Usuario;
import com.gym.app.Enum.Rol;
import com.gym.app.Repository.EjercicioRepository;
import com.gym.app.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EjercicioService {
    private final EjercicioRepository ejercicioRepository; //atributo para el repositorio de Ejercicio.
    private final UsuarioRepository usuarioRepository;

    public EjercicioService(EjercicioRepository ejercicioRepository, UsuarioRepository usuarioRepository) {

        this.ejercicioRepository = ejercicioRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Ejercicio crearEjercicio(Ejercicio e, Long idUsuario){

        Usuario usuario = usuarioRepository.findByIdUsuario(idUsuario) .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        if (usuario.getRol() != Rol.ADMIN && usuario.getRol() != Rol.COACH) {
            throw new RuntimeException("No tiene permisos para crear ejercicios");
        }

        if (e.getNombre() == null || e.getNombre().isBlank()) {
            throw new IllegalArgumentException("Nombre es obligatorio");
        }
        if (e.getGrupoMuscular() == null || e.getGrupoMuscular().isBlank()) {
            throw new IllegalArgumentException("Grupo muscular es obligatorio");
        }
        if (ejercicioRepository.existsByNombre(e.getNombre())) {
            throw new IllegalArgumentException("El ejercicio ya existe");
        }
        if (e.getDescripcion() == null || e.getDescripcion().isBlank()){
            throw new IllegalArgumentException("La descripción es obligatoria");
        }
        return ejercicioRepository.save(e);
    }

    public List<Ejercicio> buscar(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("Nombre requerido");
        }
        return ejercicioRepository.findByNombreContainingIgnoreCase(nombre);
    }
}
