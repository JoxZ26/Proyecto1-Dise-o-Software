package com.gym.app.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import com.gym.app.Enum.Rol;

@Table(name = "usuario", schema = "gym")
public class Usuario {

    @Id
    private Long idUsuario;
    private String correo;
    private String password;

    public Usuario() {}

    public Usuario(String correo, String password) {
        this.correo = correo;
        this.password = password;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public String getCorreo() {
        return correo;
    }

    public void setCorreo(String correo) {
        this.correo = correo;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

}
