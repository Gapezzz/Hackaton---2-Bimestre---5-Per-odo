package br.com.bolaocopa.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class RespostaAutenticacao {
    private String token;
    private String tipoToken;
    private Long usuarioId;
    private String nome;
    private String perfil;
}