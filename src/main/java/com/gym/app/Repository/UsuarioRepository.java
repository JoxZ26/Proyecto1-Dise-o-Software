package com.gym.app.Repository;

import com.gym.app.Entity.Usuario;
import com.gym.app.Enum.Rol;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public class UsuarioRepository {

    private final JdbcTemplate jdbcTemplate;

    public UsuarioRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    //Inserta un nuevo usuario en la base de datos.
    public Long crearUsuario(Usuario usuario) {
        String sql = """
            INSERT INTO gym.usuario (correo, password, rol)
            VALUES (?, ?, ?)
            RETURNING id_usuario
            """;

        return jdbcTemplate.queryForObject(
                sql,
                Long.class,
                usuario.getCorreo(),
                usuario.getPassword(),
                usuario.getRol().name()
        );
    }

    public Optional<Usuario> buscarPorCorreo(String correo) {
        String sql = "SELECT * FROM gym.usuario WHERE correo = ?";
        var usuarios = jdbcTemplate.query(sql, usuarioRowMapper, correo);
        return usuarios.stream().findFirst();
    }

    //Se utiliza para mapear los resultados de consultas SQL hacia la entidad Usuario de forma manual (JDBC).
    private final RowMapper<Usuario> usuarioRowMapper = (rs, rowNum) -> {
        // Crear una nueva instancia de Usuario
        Usuario u = new Usuario();

        // Mapear la columna id_usuario (PK) a Long
        u.setIdUsuario(rs.getLong("id_usuario"));

        // Mapear el correo del usuario
        u.setCorreo(rs.getString("correo"));

        // Mapear la contraseña (almacenada como texto en la BD)
        u.setPassword(rs.getString("password"));

        // Convertir el valor String de la BD a enum Rol
        // Se asume que el valor en la BD coincide exactamente con el nombre del enum
        u.setRol(Rol.valueOf(rs.getString("rol")));

        return u;
    };
}