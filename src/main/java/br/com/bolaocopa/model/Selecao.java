package br.com.bolaocopa.model;

import jakarta.persistence.*;

@Entity
@Table(name = "selecoes")
public class Selecao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String nome;

    @Column(name = "codigo_fifa", nullable = false, length = 3, unique = true)
    private String codigoFifa;

    @Column(name = "url_bandeira")
    private String urlBandeira;

    @Column(length = 10)
    private String grupo;

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getNome() { return nome; }
    public void setNome(String nome) { this.nome = nome; }
    public String getCodigoFifa() { return codigoFifa; }
    public void setCodigoFifa(String codigoFifa) { this.codigoFifa = codigoFifa; }
    public String getUrlBandeira() { return urlBandeira; }
    public void setUrlBandeira(String urlBandeira) { this.urlBandeira = urlBandeira; }
    public String getGrupo() { return grupo; }
    public void setGrupo(String grupo) { this.grupo = grupo; }
}
