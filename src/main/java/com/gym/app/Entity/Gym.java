package com.gym.app.Entity;

import org.springframework.data.relational.core.mapping.Table;

@Table(name = "Gym", schema =  "gym")
public class Gym {
    private long idGym;
    private String nombre;

    public Gym(){};

    public Gym(String nombre){
        this.nombre = nombre;
    }

    public long getIdGym() {
        return idGym;
    }

    public void setIdGym(long idGym) {
        this.idGym = idGym;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}


