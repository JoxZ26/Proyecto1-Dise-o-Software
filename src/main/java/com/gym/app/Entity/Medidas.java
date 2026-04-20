package com.gym.app.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

@Table(name = "medidas", schema = "gym")
public class Medidas {
    @Id
    private Long id;
    private Long idUsuario;
    private Double peso;
    private Double porcentajeGrasa;
    private Double masaMagra;
    private LocalDate fecha;

    public Medidas() {}

    public Medidas(Long idUsuario, Double peso, Double porcentajeGrasa,
                   Double masaMagra, LocalDate fecha) {
        this.idUsuario = idUsuario;
        this.peso = peso;
        this.porcentajeGrasa = porcentajeGrasa;
        this.masaMagra = masaMagra;
        this.fecha = fecha;
    }

    public Long getId() {
        return id;
    }

    public Long getIdUsuario() {
        return idUsuario;
    }

    public void setIdUsuario(Long idUsuario) {
        this.idUsuario = idUsuario;
    }

    public Double getPeso() {
        return peso;
    }

    public void setPeso(Double peso) {
        this.peso = peso;
    }

    public Double getPorcentajeGrasa() {
        return porcentajeGrasa;
    }

    public void setPorcentajeGrasa(Double porcentajeGrasa) {
        this.porcentajeGrasa = porcentajeGrasa;
    }

    public Double getMasaMagra() {
        return masaMagra;
    }

    public void setMasaMagra(Double masaMagra) {
        this.masaMagra = masaMagra;
    }

    public LocalDate getFecha() {
        return fecha;
    }

    public void setFecha(LocalDate fecha) {
        this.fecha = fecha;
    }
}