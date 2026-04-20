package com.gym.app.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;
import com.gym.app.Enum.Rol;

@Table(name = "membresia", schema = "gym")
public class Membresia {
    @Id
    private Long idMembresia;
    private Long idUsuario;
    private Long idGym;
    private Rol rol;

    public Membresia() {}

    public Membresia(Long idUsuario, Long idGym, Rol rol) {
        this.idUsuario = idUsuario;
        this.idGym = idGym;
        this.rol = rol;
    }

    public Long getIdMembresia() {
        return idMembresia;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Long getIdGym() {
        return idGym;
    }

    public void setIdGym(Long idGym) {
        this.idGym = idGym;
    }

    public Rol getRol() {
        return rol;
    }

    public void setRol(Rol rol) {
        this.rol = rol;
    }
}
