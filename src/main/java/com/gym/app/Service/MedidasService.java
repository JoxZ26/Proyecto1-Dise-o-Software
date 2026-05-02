package com.gym.app.Service;

import com.gym.app.Entity.Medidas;
import com.gym.app.Entity.Usuario;
import com.gym.app.Repository.MedidasRepository;
import com.gym.app.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.List;

@Service
public class MedidasService {

    private final MedidasRepository medidasRepository; //atributo al repositorio
    private final UsuarioRepository usuarioRepository;

    public MedidasService(MedidasRepository medidasRepository, UsuarioRepository usuarioRepository) {
        this.medidasRepository = medidasRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public Medidas registrarMedidas(Long idUsuario, Double peso, Double biceps,
                                    Double antebrazo, Double pecho, Double cintura,
                                    Double abdomen, Double cadera, Double muslo,
                                    Double pantorrilla, LocalDate fecha) {
        Usuario usuario = usuarioRepository.findByIdUsuario(idUsuario)
                .orElseThrow(() -> new RuntimeException("El usuario no está registrado"));
        Medidas medidas = new Medidas(idUsuario, peso, biceps, antebrazo, pecho,
                cintura, abdomen, cadera, muslo, pantorrilla, fecha);
        return medidasRepository.save(medidas); //guardar medidas
    }

    public List<Medidas> obtenerHistorial(Long idUsuario) {
        Usuario usuario = usuarioRepository.findByIdUsuario(idUsuario)
                .orElseThrow(() -> new RuntimeException("El usuario no está registrado"));
        return medidasRepository.findByIdUsuarioOrderByFechaDesc(idUsuario);
    } //obtener medidas
}
