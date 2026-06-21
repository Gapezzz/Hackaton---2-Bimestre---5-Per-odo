package br.com.bolaocopa.dto;

public class ItemRankingDto {
    private long posicao;
    private Long usuarioId;
    private String nome;
    private String fotoUrl;
    private int pontuacaoTotal;
    private int quantidadePlacaresExatos;
    private boolean euSou;

    public ItemRankingDto(long posicao, Long usuarioId, String nome, String fotoUrl,
                          int pontuacaoTotal, int quantidadePlacaresExatos, boolean euSou) {
        this.posicao = posicao;
        this.usuarioId = usuarioId;
        this.nome = nome;
        this.fotoUrl = fotoUrl;
        this.pontuacaoTotal = pontuacaoTotal;
        this.quantidadePlacaresExatos = quantidadePlacaresExatos;
        this.euSou = euSou;
    }

    public long getPosicao() { return posicao; }
    public Long getUsuarioId() { return usuarioId; }
    public String getNome() { return nome; }
    public String getFotoUrl() { return fotoUrl; }
    public int getPontuacaoTotal() { return pontuacaoTotal; }
    public int getQuantidadePlacaresExatos() { return quantidadePlacaresExatos; }
    public boolean isEuSou() { return euSou; }
}
