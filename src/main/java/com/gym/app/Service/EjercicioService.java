package com.gym.app.Service;

import com.gym.app.Entity.Ejercicio;
import com.gym.app.Entity.Membresia;
import com.gym.app.Entity.Usuario;
import com.gym.app.Enum.Rol;
import com.gym.app.Repository.EjercicioRepository;
import com.gym.app.Repository.MembresiaRepository;
import com.gym.app.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EjercicioService {
    private final EjercicioRepository ejercicioRepository; //atributo para el repositorio de Ejercicio.
    private final MembresiaRepository membresiaRepository;
    private final UsuarioRepository usuarioRepository;

    public EjercicioService(EjercicioRepository ejercicioRepository, MembresiaRepository membresiaRepository, UsuarioRepository usuarioRepository) {

        this.ejercicioRepository = ejercicioRepository;
        this.membresiaRepository = membresiaRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Ejercicio crearEjercicio(Ejercicio ejercicio, Long idUsuario){
        usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Membresia membresiaCoach = membresiaRepository.findByIdUsuario(idUsuario)
                .orElseThrow(() -> new RuntimeException("El usuario no tiene membresía en ningún gimnasio"));

        if (membresiaCoach.getRol() != Rol.COACH) {
            throw new IllegalStateException("Solo un coach puede asignar rutinas a miembros del gym");
        }

        if (ejercicio.getNombre() == null || ejercicio.getNombre().isBlank()) {
            throw new IllegalArgumentException("Nombre es obligatorio");
        }

        if (ejercicio.getGrupoMuscular() == null || ejercicio.getGrupoMuscular().isBlank()) {
            throw new IllegalArgumentException("Grupo muscular es obligatorio");
        }

        if (ejercicioRepository.existsByNombre(ejercicio.getNombre())) {
            throw new IllegalArgumentException("El ejercicio ya existe");
        }

        if (ejercicio.getDescripcion() == null || ejercicio.getDescripcion().isBlank()){
            throw new IllegalArgumentException("La descripción es obligatoria");
        }
        return ejercicioRepository.save(ejercicio);
    }

    public List<Ejercicio> buscar(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("Nombre requerido");
        }
        return ejercicioRepository.findByNombreContainingIgnoreCase(nombre);
    }
}
