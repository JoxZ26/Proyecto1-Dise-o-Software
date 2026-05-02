package com.gym.app.Entity;

import org.springframework.data.annotation.Id;
import org.springframework.data.relational.core.mapping.Column;
import org.springframework.data.relational.core.mapping.Table;

import java.time.LocalDate;

@Table(name = "medidas", schema = "gym")
public class Medidas {
    @Id
    private Long id;

    @Column("id_usuario")
    private Long idUsuario;
    private Double peso;
    private Double biceps;
    private Double antebrazo;
    private Double pecho;
    private Double cintura;
    private Double abdomen;
    private Double cadera;
    private Double muslo;
    private Double pantorrilla;
    private LocalDate fecha;

    public Medidas() {}

    public Medidas(Long idUsuario, Double peso, Double biceps, Double antebrazo,
                   Double pecho, Double cintura, Double abdomen, Double cadera,
                   Double muslo, Double pantorrilla, LocalDate fecha) {
        this.idUsuario = idUsuario;
        this.peso = peso;
        this.biceps = biceps;
        this.antebrazo = antebrazo;
        this.pecho = pecho;
        this.cintura = cintura;
        this.abdomen = abdomen;
        this.cadera = cadera;
        this.muslo = muslo;
        this.pantorrilla = pantorrilla;
        this.fecha = fecha;
    }

    public Long getId() { return id; }

    public Long getIdUsuario() { return idUsuario; }
    public void setIdUsuario(Long idUsuario) { this.idUsuario = idUsuario; }

    public Double getPeso() { return peso; }
    public void setPeso(Double peso) { this.peso = peso; }

    public Double getBiceps() { return biceps; }
    public void setBiceps(Double biceps) { this.biceps = biceps; }

    public Double getAntebrazo() { return antebrazo; }
    public void setAntebrazo(Double antebrazo) { this.antebrazo = antebrazo; }

    public Double getPecho() { return pecho; }
    public void setPecho(Double pecho) { this.pecho = pecho; }

    public Double getCintura() { return cintura; }
    public void setCintura(Double cintura) { this.cintura = cintura; }

    public Double getAbdomen() { return abdomen; }
    public void setAbdomen(Double abdomen) { this.abdomen = abdomen; }

    public Double getCadera() { return cadera; }
    public void setCadera(Double cadera) { this.cadera = cadera; }

    public Double getMuslo() { return muslo; }
    public void setMuslo(Double muslo) { this.muslo = muslo; }

    public Double getPantorrilla() { return pantorrilla; }
    public void setPantorrilla(Double pantorrilla) { this.pantorrilla = pantorrilla; }

    public LocalDate getFecha() { return fecha; }
    public void setFecha(LocalDate fecha) { this.fecha = fecha; }
}