package com.gym.app.Repository;

import com.gym.app.Entity.Gym;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface GymRepository extends CrudRepository<Gym, Long> {
    Optional<Gym> findByNombre(String nombre); //encontrar por el nombre el gimnasio
    List<Gym> findByNombreContainingIgnoreCase(String nombre); //encontrar por el nombre LIKE SQL del gimnasio sin importar mayúsculas o minúsculas
}