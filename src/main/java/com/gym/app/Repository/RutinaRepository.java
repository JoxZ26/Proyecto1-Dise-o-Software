package com.gym.app.Repository;

import com.gym.app.Entity.Rutina;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RutinaRepository extends CrudRepository<Rutina, Long> {
    boolean existsByNombreAndIdUsuario(String nombre, Long idUsuario);
    List<Rutina> findByIdUsuarioAndActivoTrue(Long idUsuario);

}
