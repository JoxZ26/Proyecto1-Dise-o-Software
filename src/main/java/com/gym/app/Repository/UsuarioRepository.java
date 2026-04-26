package com.gym.app.Repository;

import com.gym.app.Entity.Usuario;
import org.springframework.data.repository.CrudRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends CrudRepository<Usuario, Long> {
    Optional<Usuario> findByCorreo(String correo); //buscar (find by) por el correo
}
