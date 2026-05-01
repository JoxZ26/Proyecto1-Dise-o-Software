package com.gym.app.DTO;

import com.gym.app.Entity.RutinaDia;
import com.gym.app.Entity.RutinaEjercicio;

import java.util.List;

public class DiaConEjercicios {

    private RutinaDia dia;
    private List<RutinaEjercicio> ejercicios;

    public DiaConEjercicios(RutinaDia dia, List<RutinaEjercicio> ejercicios) {
        this.dia = dia;
        this.ejercicios = ejercicios;
    }

    public RutinaDia getDia() {
        return dia;
    }

    public List<RutinaEjercicio> getEjercicios() {
        return ejercicios;
    }
}
