package com.gym.app.Service;

import com.gym.app.Entity.Gym;
import com.gym.app.Repository.GymRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class GymService {

    private final GymRepository gymRepository; //atributo para el repositorio

    public GymService(GymRepository gymRepository) {
        this.gymRepository = gymRepository;
    }

    public Gym crearGym(String nombre, String descripcion, String logoUrl) {
        if (gymRepository.findByNombre(nombre).isPresent()) {
            throw new RuntimeException("Ya existe un gimnasio con ese nombre"); //si ya existe gimnasio con ese nombre = error
        }
        Gym gym = new Gym(nombre, descripcion, logoUrl); //crear gimnasio
        return gymRepository.save(gym); //guardar
    }

    public List<Gym> buscarGyms(String nombre) { //buscar gimnasio LIKE (SQL)
        return gymRepository.findByNombreContainingIgnoreCase(nombre);
    }
}