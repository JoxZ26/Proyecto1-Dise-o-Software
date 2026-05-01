package com.gym.app.Repository;

import com.gym.app.Entity.RutinaEjercicio;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RutinaEjercicioRepository extends CrudRepository<RutinaEjercicio, Long> {
    List<RutinaEjercicio> findByIdDia(Long idDia);
}
