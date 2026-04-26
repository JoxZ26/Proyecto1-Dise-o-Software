package com.gym.app.Service;

import com.gym.app.Entity.Perfil;
import com.gym.app.Repository.PerfilRepository;
import org.springframework.stereotype.Service;
import java.time.LocalDate;
import java.util.Optional;

@Service
public class PerfilService {

    private final PerfilRepository perfilRepository; //atributo del repository

    public PerfilService(PerfilRepository perfilRepository) {
        this.perfilRepository = perfilRepository;
    } //constructor

    public Perfil actualizarPerfil(Long idUsuario, String nombre, String apellido1,
                                   String apellido2, LocalDate fechaNacimiento,
                                   Double altura, Double pesoInicial, String fotoUrl) {
        Perfil perfil = perfilRepository.findByIdUsuario(idUsuario)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
        perfil.setNombre(nombre);
        perfil.setApellido1(apellido1);
        perfil.setApellido2(apellido2);
        perfil.setFechaNacimiento(fechaNacimiento);
        perfil.setAltura(altura);
        perfil.setPesoInicial(pesoInicial);
        perfil.setFotoUrl(fotoUrl);
        return perfilRepository.save(perfil);
    } //función para actualizar el perfil, llama al repositorio para buscar el perfil por ID de usuario, actualiza los campos y guarda los cambios

    public Perfil obtenerPerfil(Long idUsuario) {
        return perfilRepository.findByIdUsuario(idUsuario)
                .orElseThrow(() -> new RuntimeException("Perfil no encontrado"));
    } //función para obtener el perfil, llama al repositorio para buscar el perfil por ID de usuario y devuelve el perfil encontrado o lanza una excepción si no se encuentra
}
