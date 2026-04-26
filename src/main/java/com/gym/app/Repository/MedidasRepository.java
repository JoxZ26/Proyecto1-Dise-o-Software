package com.gym.app.Repository;

import com.gym.app.Entity.Medidas;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface MedidasRepository extends CrudRepository<Medidas, Long> {
    List<Medidas> findByIdUsuarioOrderByFechaDesc(Long idUsuario);
}
