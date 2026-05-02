package com.gym.app.Service;

import com.gym.app.DTO.DiaConEjercicios;
import com.gym.app.DTO.RutinaCompleta;
import com.gym.app.Entity.*;
import com.gym.app.Enum.Rol;
import com.gym.app.Repository.EjercicioRepository;
import com.gym.app.Repository.MembresiaRepository;
import com.gym.app.Repository.RutinaDiaRepository;
import com.gym.app.Repository.RutinaEjercicioRepository;
import com.gym.app.Repository.RutinaRepository;
import com.gym.app.Repository.UsuarioRepository;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class RutinaService {

    private final RutinaRepository rutinaRepository;
    private final RutinaDiaRepository rutinaDiaRepository;
    private final RutinaEjercicioRepository rutinaEjercicioRepository;
    private final UsuarioRepository usuarioRepository;
    private final EjercicioRepository ejercicioRepository;
    private final MembresiaRepository membresiaRepository;

    public RutinaService(RutinaRepository rutinaRepository,
                         RutinaDiaRepository rutinaDiaRepository,
                         RutinaEjercicioRepository rutinaEjercicioRepository,
                         UsuarioRepository usuarioRepository,
                         EjercicioRepository ejercicioRepository,
                         MembresiaRepository membresiaRepository) {
        this.rutinaRepository = rutinaRepository;
        this.rutinaDiaRepository = rutinaDiaRepository;
        this.rutinaEjercicioRepository = rutinaEjercicioRepository;
        this.usuarioRepository = usuarioRepository;
        this.ejercicioRepository = ejercicioRepository;
        this.membresiaRepository = membresiaRepository;
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

    public List<RutinaCompleta> obtenerRutinasActivas(Long idUsuario) {

        List<Rutina> rutinas = rutinaRepository.findByIdUsuarioAndActivoTrue(idUsuario);
        List<RutinaCompleta> resultado = new ArrayList<>();

        for (Rutina rutina : rutinas) {
            List<RutinaDia> dias = rutinaDiaRepository.findByIdRutina(rutina.getIdRutina());
            List<DiaConEjercicios> diasConEjercicios = new ArrayList<>();

            for (RutinaDia dia : dias) {
                List<RutinaEjercicio> ejercicios =
                        rutinaEjercicioRepository.findByIdDia(dia.getIdRutinaDia());

                diasConEjercicios.add(new DiaConEjercicios(dia, ejercicios));
            }

            resultado.add(new RutinaCompleta(rutina, diasConEjercicios));
        }
        return resultado;
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

    public Rutina asignarRutinaAMiembro(Long idRutina, Long idMiembro, Long coachId) {
        Rutina rutina = rutinaRepository.findById(idRutina)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));

        usuarioRepository.findById(idMiembro)
                .orElseThrow(() -> new RuntimeException("Usuario no encontrado"));

        Membresia membresiaCoach = membresiaRepository.findByIdUsuario(coachId)
                .orElseThrow(() -> new RuntimeException("El coach no tiene membresía en ningún gimnasio"));

        if (membresiaCoach.getRol() != Rol.COACH) {
            throw new IllegalStateException("Solo un coach puede asignar rutinas a miembros del gym");
        }

        Membresia membresiaMiembro = membresiaRepository.findByIdUsuario(idMiembro)
                .orElseThrow(() -> new RuntimeException("El miembro no tiene membresía en ningún gimnasio"));

        if (!membresiaCoach.getIdGym().equals(membresiaMiembro.getIdGym())) {
            throw new IllegalArgumentException("El miembro no pertenece al mismo gimnasio que el coach");
        }

        Rutina nuevaRutina = new Rutina(idMiembro, rutina.getNombre(), rutina.getDescripcion(), false, coachId);
        nuevaRutina = rutinaRepository.save(nuevaRutina);

        List<RutinaDia> dias = rutinaDiaRepository.findByIdRutina(idRutina);
        for (RutinaDia diaOriginal : dias) {
            RutinaDia nuevoDia = new RutinaDia(nuevaRutina.getIdRutina(), diaOriginal.getDiaNumero(), diaOriginal.getNombre());
            nuevoDia = rutinaDiaRepository.save(nuevoDia);

            List<RutinaEjercicio> ejercicios = rutinaEjercicioRepository.findByIdDia(diaOriginal.getIdRutinaDia());
            for (RutinaEjercicio ejercicioOriginal : ejercicios) {
                RutinaEjercicio nuevoEjercicio = new RutinaEjercicio(
                        nuevoDia.getIdRutinaDia(),
                        ejercicioOriginal.getIdEjercicio(),
                        ejercicioOriginal.getSets(),
                        ejercicioOriginal.getReps(),
                        ejercicioOriginal.getDescansoSegundos(),
                        ejercicioOriginal.getNotas()
                );
                rutinaEjercicioRepository.save(nuevoEjercicio);
            }
        }

        return nuevaRutina;
    }

    public RutinaDia agregarDia(Long idRutina, Integer diaNumero, String nombre) {
        rutinaRepository.findById(idRutina)
                .orElseThrow(() -> new RuntimeException("Rutina no encontrada"));

        if (diaNumero == null || diaNumero < 1) {
            throw new IllegalArgumentException("El número de día debe ser mayor a 0");
        }
        if (rutinaDiaRepository.existsByIdRutinaAndDiaNumero(idRutina, diaNumero)) {
            throw new IllegalArgumentException("Ya existe un día con ese número en esta rutina");
        }

        RutinaDia dia = new RutinaDia(idRutina, diaNumero, nombre);
        return rutinaDiaRepository.save(dia);
    }

    public RutinaEjercicio agregarEjercicioADia(Long idDia, Long idEjercicio,
                                                 Integer sets, Integer reps,
                                                 Integer descansoSegundos, String notas) {
        rutinaDiaRepository.findById(idDia)
                .orElseThrow(() -> new RuntimeException("Día de rutina no encontrado"));

        ejercicioRepository.findById(idEjercicio)
                .orElseThrow(() -> new RuntimeException("Ejercicio no encontrado"));

        RutinaEjercicio rutinaEjercicio = new RutinaEjercicio(idDia, idEjercicio, sets, reps, descansoSegundos, notas);
        return rutinaEjercicioRepository.save(rutinaEjercicio);
    }
    public List<Rutina> buscar(String nombre) {
        if (nombre == null || nombre.isBlank()) {
            throw new IllegalArgumentException("Nombre requerido");
        }
        return rutinaRepository.findByNombreContainingIgnoreCase(nombre);
    }

}
