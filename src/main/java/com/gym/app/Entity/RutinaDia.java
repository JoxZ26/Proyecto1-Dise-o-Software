package com.gym.app.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

@Table(name = "rutina_dia", schema = "gym")
public class RutinaDia {

    @Id
    private Long idRutinaDia;

    @Column("id_rutina")
    private Long idRutina;

    @Column("dia_numero")
    private Integer diaNumero;

    private String nombre;

    public RutinaDia() {}

    public RutinaDia(Long idRutina, Integer diaNumero, String nombre) {
        this.idRutina = idRutina;
        this.diaNumero = diaNumero;
        this.nombre = nombre;
    }

    public Long getIdRutinaDia() {
        return idRutinaDia;
    }

    public Long getIdRutina() {
        return idRutina;
    }

    public void setIdRutina(Long idRutina) {
        this.idRutina = idRutina;
    }

    public Integer getDiaNumero() {
        return diaNumero;
    }

    public void setDiaNumero(Integer diaNumero) {
        this.diaNumero = diaNumero;
    }

    public String getNombre() {
        return nombre;
    }

    public void setNombre(String nombre) {
        this.nombre = nombre;
    }
}
