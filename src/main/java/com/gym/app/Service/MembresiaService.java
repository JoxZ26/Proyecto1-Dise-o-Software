package com.gym.app.Service;

import com.gym.app.DTO.MembresiaInfoResponse;
import com.gym.app.Entity.Gym;
import com.gym.app.Entity.Membresia;
import com.gym.app.Enum.Rol;
import com.gym.app.Repository.MembresiaRepository;
import com.gym.app.Repository.GymRepository;
import com.gym.app.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class MembresiaService {

    private final MembresiaRepository membresiaRepository; //atributo del repositorio de la membresia
    private final GymRepository gymRepository; // atributo del repositorio del gimnasio
    private final UsuarioRepository usuarioRepository;
    private final AuthService authService;

    public MembresiaService(MembresiaRepository membresiaRepository, GymRepository gymRepository, UsuarioRepository usuarioRepository,
                            AuthService authService) {
        this.membresiaRepository = membresiaRepository;
        this.gymRepository = gymRepository;
        this.usuarioRepository = usuarioRepository;
        this.authService = authService;
    }

    public Membresia unirseAGym(Long idUsuario, Long idGym) {
        gymRepository.findById(idGym)
                .orElseThrow(() -> new RuntimeException("Gimnasio no encontrado")); //validar que el gimnasio exista, si no = error
        if (membresiaRepository.findByIdUsuarioAndIdGym(idUsuario, idGym).isPresent()) {
            throw new RuntimeException("El usuario ya es miembro de este gimnasio"); //validar que la persona no forme parte ya del gimnasio, si ya lo es = error
        }
        Membresia membresia = new Membresia(idUsuario, idGym, Rol.MEMBER);
        return membresiaRepository.save(membresia); //guardar la membresía
    }

    // retorna la lista de membresías del usuario con el nombre del gym para cada una
    public List<MembresiaInfoResponse> getMembresiasMeInfo(Long usuarioId) {
        List<Membresia> membresias = membresiaRepository.findByIdUsuario(usuarioId);
        return membresias.stream()
                .map(m -> {
                    Gym gym = gymRepository.findById(m.getIdGym())
                            .orElseThrow(() -> new RuntimeException("Gimnasio no encontrado"));
                    return new MembresiaInfoResponse(m.getIdGym(), gym.getNombre(), m.getRol(), gym.getLogoUrl(), gym.getDescripcion());
                })
                .toList();
    }

    public void asignarCoach(Long idAdmin, Long idUsuario, Long idGym) {

        authService.validarAdmin(idAdmin, idGym);
        usuarioRepository.findById(idUsuario)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Membresia miembro = membresiaRepository
                .findByIdUsuarioAndIdGym(idUsuario, idGym)
                .orElse(null);

        if (miembro == null){
            Membresia membresia = new Membresia(idUsuario, idGym, Rol.COACH);
            membresiaRepository.save(membresia);
        }else if (miembro.getRol() != Rol.COACH) {
            miembro.setRol(Rol.COACH);
            membresiaRepository.save(miembro);
        }else{
            throw new IllegalStateException("El usuario ya es coach en este gym");
        }
    }

    public void salirDeGym(Long idUsuario, Long idGym){
        Membresia membresia = membresiaRepository.findByIdUsuarioAndIdGym(idUsuario, idGym)
                .orElseThrow(() -> new RuntimeException("No eres miembro de este gymnasio"));
        if (membresia.getRol() == Rol.ADMIN) {
            throw new IllegalStateException("El administrador no puede abandonar su propio gimnasio");
        }

        membresiaRepository.delete(membresia);
    }
}
