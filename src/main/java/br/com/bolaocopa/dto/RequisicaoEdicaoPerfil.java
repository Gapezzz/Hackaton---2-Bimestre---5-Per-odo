package br.com.bolaocopa.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

@Data
public class RequisicaoEdicaoPerfil {
    @NotBlank(message = "O nome é obrigatório.")
    private String nome;

    // fotoUrl é opcional — enviada como URL (app mobile faz upload separado)
    private String fotoUrl;
}
