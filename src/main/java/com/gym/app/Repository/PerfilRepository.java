package com.gym.app.Repository;

import com.gym.app.Entity.Perfil;
import com.gym.app.Repository.mapper.PerfilRowMapper;
import org.springframework.dao.EmptyResultDataAccessException;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class PerfilRepository {

    private final JdbcTemplate jdbcTemplate;
    private final PerfilRowMapper perfilRowMapper = new PerfilRowMapper();

    public PerfilRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    public void crearPerfilVacio(Long idUsuario) {
        String sql = """
            INSERT INTO gym.perfil (id_usuario)
            VALUES (?)
            """;
        jdbcTemplate.update(sql, idUsuario);
    }

    public Optional<Perfil> obtenerPorUsuario(Long idUsuario) {
        String sql = "SELECT * FROM gym.perfil WHERE id_usuario = ?";

        try {
            Perfil perfil = jdbcTemplate.queryForObject(sql, perfilRowMapper, idUsuario);
            return Optional.ofNullable(perfil);

        } catch (EmptyResultDataAccessException e) {
            return Optional.empty();
        }
    }

    public void actualizarPerfil(Perfil perfil) {
        String sql = """
            UPDATE gym.perfil
            SET nombre = ?, 
                apellido1 = ?, 
                apellido2 = ?, 
                fecha_nacimiento = ?, 
                altura = ?, 
                peso_inicial = ?, 
                foto_url = ?
            WHERE id_usuario = ?
            """;

        int rows = jdbcTemplate.update(sql,
                perfil.getNombre(),
                perfil.getApellido1(),
                perfil.getApellido2(),
                perfil.getFechaNacimiento(),
                perfil.getAltura(),
                perfil.getPesoInicial(),
                perfil.getFotoUrl(),
                perfil.getIdUsuario()
        );
        if (rows == 0){ throw new IllegalStateException("Perfil no existe para el usuario");}
    }
}
