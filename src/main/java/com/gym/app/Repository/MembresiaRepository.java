package com.gym.app.Repository;

import com.gym.app.Entity.Membresia;
import com.gym.app.Enum.Rol;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;
import java.util.List;

@Repository
public interface MembresiaRepository extends CrudRepository<Membresia, Long> {
    Optional<Membresia> findByIdUsuarioAndIdGym(Long idUsuario, Long idGym); //encontrar membresia por idUsuario e idGym
    List<Membresia> findByIdUsuario(Long idUsuario);
    Optional<Membresia> findByIdUsuarioAndRol(Long idUsuario, Rol rol);
}
