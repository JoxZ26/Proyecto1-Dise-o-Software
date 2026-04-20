package com.gym.app.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "rutina_ejercicio", schema = "gym")
public class RutinaEjercicio {
    @Id
    private Long idRutinaE;
    private Long idDia;
    private Long idEjercicio;
    private Integer sets;
    private Integer reps;
    private Integer descansoSegundos;
    private String notas;

    public RutinaEjercicio() {}

    public RutinaEjercicio(Long idDia, Long idEjercicio, Integer sets,
                           Integer reps, Integer descansoSegundos, String notas) {
        this.idDia = idDia;
        this.idEjercicio = idEjercicio;
        this.sets = sets;
        this.reps = reps;
        this.descansoSegundos = descansoSegundos;
        this.notas = notas;
    }

    public Long getIdRutinaE() {
        return idRutinaE;
    }

    public Long getIdDia() {
        return idDia;
    }

    public void setIdDia(Long idDia) {
        this.idDia = idDia;
    }

    public Long getIdEjercicio() {
        return idEjercicio;
    }

    public void setIdEjercicio(Long idEjercicio) {
        this.idEjercicio = idEjercicio;
    }

    public Integer getSets() {
        return sets;
    }

    public void setSets(Integer sets) {
        this.sets = sets;
    }

    public Integer getReps() {
        return reps;
    }

    public void setReps(Integer reps) {
        this.reps = reps;
    }

    public Integer getDescansoSegundos() {
        return descansoSegundos;
    }

    public void setDescansoSegundos(Integer descansoSegundos) {
        this.descansoSegundos = descansoSegundos;
    }

    public String getNotas() {
        return notas;
    }

    public void setNotas(String notas) {
        this.notas = notas;
    }
}