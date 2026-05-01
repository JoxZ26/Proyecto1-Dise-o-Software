package com.gym.app.Repository;

import com.gym.app.Entity.Ejercicio;
import org.springframework.stereotype.Repository;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EjercicioRepository extends CrudRepository<Ejercicio, Long> {
    boolean existsByNombre(String nombre);
    List<Ejercicio> findByNombreContainingIgnoreCase(String nombre);
}
