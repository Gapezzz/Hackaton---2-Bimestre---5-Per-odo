package br.com.bolaocopa.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "palpites", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"usuario_id", "partida_id"})
})
public class Palpite {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "usuario_id", nullable = false)
    private Usuario usuario;

    @ManyToOne
    @JoinColumn(name = "partida_id", nullable = false)
    private Partida partida;

    @Column(nullable = false)
    private Integer golsMandanteAposta;

    @Column(nullable = false)
    private Integer golsVisitanteAposta;

    private Integer pontuacaoObtida = 0; // Calculado no encerramento

    // Getters e Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public Usuario getUsuario() { return usuario; }
    public void setUsuario(Usuario usuario) { this.usuario = usuario; }
    public Partida getPartida() { return partida; }
    public void setPartida(Partida partida) { this.partida = partida; }
    public Integer getGolsMandanteAposta() { return golsMandanteAposta; }
    public void setGolsMandanteAposta(Integer golsMandanteAposta) { this.golsMandanteAposta = golsMandanteAposta; }
    public Integer getGolsVisitanteAposta() { return golsVisitanteAposta; }
    public void setGolsVisitanteAposta(Integer golsVisitanteAposta) { this.golsVisitanteAposta = golsVisitanteAposta; }
    public Integer getPontuacaoObtida() { return pontuacaoObtida; }
    public void setPontuacaoObtida(Integer pontuacaoObtida) { this.pontuacaoObtida = pontuacaoObtida; }
}