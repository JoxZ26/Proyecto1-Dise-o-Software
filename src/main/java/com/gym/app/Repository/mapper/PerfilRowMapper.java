package com.gym.app.Repository.mapper;

import com.gym.app.Entity.Perfil;
import org.springframework.jdbc.core.RowMapper;

import java.sql.ResultSet;
import java.sql.SQLException;

public class PerfilRowMapper implements RowMapper<Perfil> {

    @Override
    public Perfil mapRow(ResultSet rs, int rowNum) throws SQLException {
        Perfil perfil = new Perfil();

        perfil.setIdUsuario(rs.getLong("id_usuario"));
        perfil.setNombre(rs.getString("nombre"));
        perfil.setApellido1(rs.getString("apellido1"));
        perfil.setApellido2(rs.getString("apellido2"));

        if (rs.getDate("fecha_nacimiento") != null) {
            perfil.setFechaNacimiento(rs.getDate("fecha_nacimiento").toLocalDate());
        }

        perfil.setAltura(rs.getDouble("altura"));
        perfil.setPesoInicial(rs.getDouble("peso_inicial"));
        perfil.setFotoUrl(rs.getString("foto_url"));

        return perfil;
    }
}