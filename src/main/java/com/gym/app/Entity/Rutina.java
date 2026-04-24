package com.gym.app.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "rutina", schema = "gym")
public class Rutina {
    @Id
    private Long idRutina;
    private Long idUsuario;
    private String nombre;
    private String descripcion;
    private Boolean activo = false;
    private Long createdBy;

    public Rutina() {}

    public Rutina(Long idUsuario, String nombre, String descripcion, Boolean activo, Long createdBy) {
        this.idUsuario = idUsuario;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.activo = activo;
        this.createdBy = createdBy;
    }

    public Long getIdRutina() { return idRutina; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }

    public Long getCreatedBy() { return createdBy; }
    public void setCreatedBy(Long createdBy) { this.createdBy = createdBy; }
}