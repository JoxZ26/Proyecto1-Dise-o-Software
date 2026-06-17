package com.gym.app.Service;

import com.gym.app.Entity.Gym;
import com.gym.app.Entity.Membresia;
import com.gym.app.Enum.Rol;
import com.gym.app.Repository.GymRepository;
import com.gym.app.Repository.MembresiaRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GymService {

    private final GymRepository gymRepository; //atributo para el repositorio
    private final MembresiaRepository membresiaRepository;

    public GymService(GymRepository gymRepository, MembresiaRepository membresiaRepository) {
        this.gymRepository = gymRepository;
        this.membresiaRepository = membresiaRepository;
    }

    @Transactional
    public Gym crearGym(String nombre, String descripcion, String logoUrl, Long idUsuario) {

        if (gymRepository.findByNombre(nombre).isPresent()) {
            throw new RuntimeException("Ya existe un gimnasio con ese nombre");
        }

        Gym gym = new Gym(nombre, descripcion, logoUrl);

        gym = gymRepository.save(gym); // guardar primero para tener ID
        Membresia admin = new Membresia();
        admin.setIdUsuario(idUsuario);
        admin.setIdGym(gym.getIdGym());
        admin.setRol(Rol.ADMIN);

        membresiaRepository.save(admin);
        return gym;
    }

    public List<Gym> buscarGyms(String nombre) { //buscar gimnasio LIKE (SQL)
        return gymRepository.findByNombreContainingIgnoreCase(nombre);
    }

    public Gym actualizarGym(Long idGym, String nombre, String descripcion, String logoUrl) {
        Gym gym = gymRepository.findById(idGym)
                .orElseThrow(() -> new RuntimeException("Gimnasio no encontrado"));
        gym.setNombre(nombre);
        gym.setDescripcion(descripcion);
        gym.setLogoUrl(logoUrl);
        return gymRepository.save(gym);
    }
}