package com.gym.app.Service;

import com.gym.app.Entity.Rutina;
import com.gym.app.Repository.RutinaRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RutinaService {

    private final RutinaRepository rutinaRepository;

    public RutinaService(RutinaRepository rutinaRepository) {
        this.rutinaRepository = rutinaRepository;
    }

    public Rutina crearRutina(Rutina rutina){
        if (rutina.getNombre() == null || rutina.getNombre().isBlank()){
            throw new IllegalArgumentException("Nombre obligatorio");
        }
        if (rutina.getIdUsuario() == null){
            throw new IllegalArgumentException("Usuario obligatorio");
        }
        if (rutinaRepository.existsByNombreAndIdUsuario(rutina.getNombre(), rutina.getIdUsuario())) {
            throw new IllegalArgumentException("Ya existe una rutina con ese nombre para este usuario");
        }
        if (rutina.getDescripcion() == null || rutina.getDescripcion().isBlank()) {
            throw new IllegalArgumentException("Descripción obligatoria");
        }

        rutina.setActivo(false);
        rutina.setCreatedBy(rutina.getIdUsuario());
        return rutinaRepository.save(rutina);
    }

    public List<Rutina> obtenerRutinasActivas(Long idUsuario) {
        return rutinaRepository.findByIdUsuarioAndActivoTrue(idUsuario);
    }

    public Rutina activarRutina(Long idRutina) {
        Rutina rutina = rutinaRepository.findById(idRutina)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));

        rutina.setActivo(true);
        return rutinaRepository.save(rutina);
    }

    public Rutina desactivarRutina(Long idRutina) {
        Rutina rutina = rutinaRepository.findById(idRutina)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));

        rutina.setActivo(false);
        return rutinaRepository.save(rutina);
    }
}
