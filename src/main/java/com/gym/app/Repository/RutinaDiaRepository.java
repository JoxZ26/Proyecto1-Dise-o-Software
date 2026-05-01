package com.gym.app.Repository;

import com.gym.app.Entity.RutinaDia;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface RutinaDiaRepository extends CrudRepository<RutinaDia, Long> {
    boolean existsByIdRutinaAndDiaNumero(Long idRutina, Integer diaNumero);
    List<RutinaDia> findByIdRutina(Long idRutina);
}
