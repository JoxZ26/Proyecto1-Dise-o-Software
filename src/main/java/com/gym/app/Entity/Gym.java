package com.gym.app.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "gym", schema = "gym")
public class Gym {
    @Id
    private Long idGym;
    private String nombre;
    private String descripcion;
    private String logoUrl;

    public Gym() {}

    public Gym(String nombre, String descripcion, String logoUrl) {
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.logoUrl = logoUrl;
    }

    public Long getIdGym() { return idGym; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
}

