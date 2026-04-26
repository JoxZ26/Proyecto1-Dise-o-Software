package com.gym.app.Repository;

import com.gym.app.Entity.Membresia;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface MembresiaRepository extends CrudRepository<Membresia, Long> {
    Optional<Membresia> findByIdUsuarioAndIdGym(Long idUsuario, Long idGym); //encontrar membresia por idUsuario e idGym
}
