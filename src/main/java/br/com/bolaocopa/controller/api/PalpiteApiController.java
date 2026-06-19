package br.com.bolaocopa.controller.api;

import br.com.bolaocopa.exception.RegraNegocioException;
import br.com.bolaocopa.model.Palpite;
import br.com.bolaocopa.model.Usuario;
import br.com.bolaocopa.service.PalpiteService;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/palpites")
public class PalpiteApiController {

    private final PalpiteService palpiteService;

    public PalpiteApiController(PalpiteService palpiteService) {
        this.palpiteService = palpiteService;
    }

    // RF-020 e RF-021: Registrar ou editar palpite (upsert)
    // RF-022: Bloqueio automático se partida já iniciou → HTTP 422 via RegraNegocioException
    @PostMapping
    public ResponseEntity<String> registrarOuEditar(
            @RequestBody RequisicaoPalpite dados,
            @AuthenticationPrincipal Usuario usuario) {

        palpiteService.registrarPalpite(
                dados.getPartidaId(),
                usuario,
                dados.getGolsMandanteAposta(),
                dados.getGolsVisitanteAposta()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body("Palpite registrado com sucesso!");
    }

    // RF-023: Listar meus palpites com pontuação obtida (RF-024)
    @GetMapping("/meus")
    public ResponseEntity<List<Palpite>> meusPalpites(
            @AuthenticationPrincipal Usuario usuario) {

        List<Palpite> palpites = palpiteService.listarPorUsuario(usuario.getId());
        return ResponseEntity.ok(palpites);
    }

    // DTO interno para receber o palpite
    @Data
    static class RequisicaoPalpite {
        @NotNull(message = "O ID da partida é obrigatório.")
        private Long partidaId;

        @NotNull(message = "Os gols do mandante são obrigatórios.")
        @Min(value = 0, message = "Gols não podem ser negativos.")
        private Integer golsMandanteAposta;

        @NotNull(message = "Os gols do visitante são obrigatórios.")
        @Min(value = 0, message = "Gols não podem ser negativos.")
        private Integer golsVisitanteAposta;
    }
}
