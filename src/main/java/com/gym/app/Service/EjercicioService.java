package com.gym.app.Service;

import com.gym.app.Entity.Ejercicio;
import com.gym.app.Repository.EjercicioRepository;
import org.springframework.stereotype.Service;

@Service
public class EjercicioService {
    private final EjercicioRepository ejercicioRepository; //atributo para el repositorio de Ejercicio.

    public EjercicioService(EjercicioRepository ejercicioRepository) {
        this.ejercicioRepository = ejercicioRepository;
    }

    public Ejercicio crearEjercicio(Ejercicio e){
        if (e.getNombre() == null || e.getNombre().isBlank()) {
            throw new IllegalArgumentException("Nombre es obligatorio");
        }
        if (e.getGrupoMuscular() == null || e.getGrupoMuscular().isBlank()) {
            throw new IllegalArgumentException("Grupo muscular es obligatorio");
        }
        if (ejercicioRepository.existsByNombre(e.getNombre())) {
            throw new IllegalArgumentException("El ejercicio ya existe");
        }
        if (e.getDescripcion() == null || e.getDescripcion().isBlank()){
            throw new IllegalArgumentException("La descripción es obligatoria");
        }
        return ejercicioRepository.save(e);
    }
}
