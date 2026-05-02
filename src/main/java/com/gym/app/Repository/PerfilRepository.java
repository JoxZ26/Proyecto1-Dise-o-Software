package com.gym.app.Repository;

import com.gym.app.Entity.Perfil;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface PerfilRepository extends CrudRepository<Perfil, Long> {
    Optional<Perfil> findByIdUsuario(Long idUsuario); //encontrar por ID de usuario
}