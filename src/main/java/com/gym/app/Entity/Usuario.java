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
    private Rol rol;

    public Usuario() {}

    public Usuario(String correo, String password, Rol rol) {
        this.correo = correo;
        this.password = password;
        this.rol = rol;
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

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}
