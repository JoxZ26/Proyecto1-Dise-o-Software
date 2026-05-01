package com.gym.app.DTO;

import com.gym.app.Entity.Rutina;

import java.util.List;

public class RutinaCompleta {

    private Rutina rutina;
    private List<DiaConEjercicios> dias;

    public RutinaCompleta(Rutina rutina, List<DiaConEjercicios> dias) {
        this.rutina = rutina;
        this.dias = dias;
    }

    public Rutina getRutina() {
        return rutina;
    }

    public List<DiaConEjercicios> getDias() {
        return dias;
    }
}
