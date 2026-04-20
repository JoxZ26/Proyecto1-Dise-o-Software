package com.gym.app.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "ejercicio", schema = "gym")
public class Ejercicio {

    @Id
    private Long idEjercicio;

    private String nombre;
    private String grupoMuscular;
    private String descripcion;

    private String imagenUrl;
    private String videoUrl;

    public Ejercicio() {}

    public Ejercicio(String nombre, String grupoMuscular, String descripcion, String imagenUrl, String videoUrl) {
        this.nombre = nombre;
        this.grupoMuscular = grupoMuscular;
        this.descripcion = descripcion;
        this.imagenUrl = imagenUrl;
        this.videoUrl = videoUrl;
    }

    public Long getIdEjercicio() {
        return idEjercicio;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }

    public String getGrupoMuscular() {
        return grupoMuscular;
    }

    public void setGrupoMuscular(String grupoMuscular) {
        this.grupoMuscular = grupoMuscular;
    }

    public String getDescripcion() {
        return descripcion;
    }

    public void setDescripcion(String descripcion) {
        this.descripcion = descripcion;
    }

    public String getImagenUrl() {
        return imagenUrl;
    }

    public void setImagenUrl(String imagenUrl) {
        this.imagenUrl = imagenUrl;
    }

    public String getVideoUrl() {
        return videoUrl;
    }

    public void setVideoUrl(String videoUrl) {
        this.videoUrl = videoUrl;
    }
}