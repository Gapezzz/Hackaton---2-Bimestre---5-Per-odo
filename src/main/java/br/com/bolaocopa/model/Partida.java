package br.com.bolaocopa.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "partidas")
public class Partida {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String mandante;

    @Column(nullable = false)
    private String visitante;

    // Novos campos para armazenar o caminho/URL das fotos das bandeiras ou escudos
    @Column(name = "foto_mandante")
    private String fotoMandante;

    @Column(name = "foto_visitante")
    private String fotoVisitante;

    @Column(name = "data_hora", nullable = false)
    private LocalDateTime dataHora;

    @Column(nullable = false)
    private String estadio;

    @Column(nullable = false)
    private String fase; // Grupos, Oitavas, Quartas, Semi, Final

    private Integer golsMandante; // null enquanto não finalizada
    private Integer golsVisitante; // null enquanto não finalizada

    @Column(nullable = false)
    private boolean encerrada = false;

    // Getters e Setters existentes...
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getMandante() { return mandante; }
    public void setMandante(String mandante) { this.mandante = mandante; }
    public String getVisitante() { return visitante; }
    public void setVisitante(String visitante) { this.visitante = visitante; }

    // Novos Getters e Setters
    public String getFotoMandante() { return fotoMandante; }
    public void setFotoMandante(String fotoMandante) { this.fotoMandante = fotoMandante; }
    public String getFotoVisitante() { return fotoVisitante; }
    public void setFotoVisitante(String fotoVisitante) { this.fotoVisitante = fotoVisitante; }

    public LocalDateTime getDataHora() { return dataHora; }
    public void setDataHora(LocalDateTime dataHora) { this.dataHora = dataHora; }
    public String getEstadio() { return estadio; }
    public void setEstadio(String estadio) { this.estadio = estadio; }
    public String getFase() { return fase; }
    public void setFase(String fase) { this.fase = fase; }
    public Integer getGolsMandante() { return golsMandante; }
    public void setGolsMandante(Integer golsMandante) { this.golsMandante = golsMandante; }
    public Integer getGolsVisitante() { return golsVisitante; }
    public void setGolsVisitante(Integer golsVisitante) { this.golsVisitante = golsVisitante; }
    public boolean isEncerrada() { return encerrada; }
    public void setEncerrada(boolean encerrada) { this.encerrada = encerrada; }
}