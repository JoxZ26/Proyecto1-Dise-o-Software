package com.gym.app.Service;

import com.gym.app.Entity.Membresia;
import com.gym.app.Enum.Rol;
import com.gym.app.Repository.MembresiaRepository;
import com.gym.app.Repository.GymRepository;
import org.springframework.stereotype.Service;

@Service
public class MembresiaService {

    private final MembresiaRepository membresiaRepository; //atributo del repositorio de la membresia
    private final GymRepository gymRepository; // atributo del repositorio del gimnasio

    public MembresiaService(MembresiaRepository membresiaRepository, GymRepository gymRepository) {
        this.membresiaRepository = membresiaRepository;
        this.gymRepository = gymRepository;
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
}
