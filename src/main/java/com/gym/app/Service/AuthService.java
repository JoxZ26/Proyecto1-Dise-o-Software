package com.gym.app.Service;

import com.gym.app.Entity.Membresia;
import com.gym.app.Enum.Rol;
import com.gym.app.Exception.AccesoProhibidoException;
import com.gym.app.Repository.MembresiaRepository;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final MembresiaRepository membresiaRepository;

    public AuthService(MembresiaRepository membresiaRepository) {
        this.membresiaRepository = membresiaRepository;
    }

    public boolean esAdmin(Long idUsuario, Long idGym) {

        return membresiaRepository
                .findByIdUsuarioAndIdGym(idUsuario, idGym)
                .map(m -> m.getRol() == Rol.ADMIN)
                .orElse(false);
    }

    public boolean esCoachOAdmin(Long idUsuario, Long idGym) {
        return membresiaRepository
                .findByIdUsuarioAndIdGym(idUsuario, idGym)
                .map(m -> m.getRol() == Rol.COACH || m.getRol() == Rol.ADMIN)
                .orElse(false);
    }

    public Rol obtenerRol(Long idUsuario, Long idGym) {
        Membresia membresia = membresiaRepository
                .findByIdUsuarioAndIdGym(idUsuario, idGym)
                .orElseThrow(() -> new RuntimeException("El usuario no pertenece al gimnasio"));
        return membresia.getRol();
    }

    public void validarAdmin(Long idUsuario, Long idGym) {
        if (!esAdmin(idUsuario, idGym)) {
            throw new AccesoProhibidoException("Acceso denegado. Se requiere rol ADMIN");
        }
    }

    public void validarPuedeCrearEjercicio(Long idUsuario) {
        boolean esCoach =
                membresiaRepository
                        .findByIdUsuarioAndRol(idUsuario, Rol.COACH)
                        .isPresent();

        boolean esAdmin =
                membresiaRepository
                        .findByIdUsuarioAndRol(idUsuario, Rol.ADMIN)
                        .isPresent();

        if (!esCoach && !esAdmin) {
            throw new AccesoProhibidoException(
                    "Solo un coach o administrador puede crear ejercicios"
            );
        }
    }

    public void validarAsignarRutina(Long idUsuario){
        boolean esCoach = membresiaRepository.findByIdUsuarioAndRol(idUsuario, Rol.COACH).isPresent();
        if(!esCoach){
            throw new AccesoProhibidoException("Solo un coach puede asignar rutinas");
        }
    }


}