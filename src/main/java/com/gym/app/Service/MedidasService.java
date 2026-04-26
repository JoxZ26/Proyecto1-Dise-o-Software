package com.gym.app.Service;

import com.gym.app.Entity.Medidas;
import com.gym.app.Repository.MedidasRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class MedidasService {

    private final MedidasRepository medidasRepository; //atributo al repositorio

    public MedidasService(MedidasRepository medidasRepository) {
        this.medidasRepository = medidasRepository;
    }

    public Medidas registrarMedidas(Long idUsuario, Double peso, Double biceps,
                                    Double antebrazo, Double pecho, Double cintura,
                                    Double abdomen, Double cadera, Double muslo,
                                    Double pantorrilla, LocalDate fecha) {
        Medidas medidas = new Medidas(idUsuario, peso, biceps, antebrazo, pecho,
                cintura, abdomen, cadera, muslo, pantorrilla, fecha);
        return medidasRepository.save(medidas); //guardar medidas
    }

    public List<Medidas> obtenerHistorial(Long idUsuario) {
        return medidasRepository.findByIdUsuarioOrderByFechaDesc(idUsuario);
    } //obtener medidas
}
