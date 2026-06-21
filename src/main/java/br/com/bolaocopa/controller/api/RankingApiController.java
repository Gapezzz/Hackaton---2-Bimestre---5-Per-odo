package br.com.bolaocopa.controller.api;

import br.com.bolaocopa.dto.ItemRankingDto;
import br.com.bolaocopa.model.Usuario;
import br.com.bolaocopa.service.RankingService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/ranking")
public class RankingApiController {

    private final RankingService rankingService;

    public RankingApiController(RankingService rankingService) {
        this.rankingService = rankingService;
    }

    // RF-032 + RF-033 + RF-034: Ranking paginado (mínimo 50 por página) com posição do usuário destacada
    @GetMapping
    public ResponseEntity<List<ItemRankingDto>> ranking(
            @RequestParam(defaultValue = "0") int pagina,
            @RequestParam(defaultValue = "50") int tamanhoPagina,
            @AuthenticationPrincipal Usuario usuarioAutenticado) {

        // RF-034: garante mínimo de 50 por página
        if (tamanhoPagina < 50) tamanhoPagina = 50;

        List<ItemRankingDto> ranking = rankingService.listarRanking(pagina, tamanhoPagina, usuarioAutenticado);
        return ResponseEntity.ok(ranking);
    }

    // RF-033: Posição exata do usuário autenticado
    @GetMapping("/minha-posicao")
    public ResponseEntity<Map<String, Object>> minhaPosicao(
            @AuthenticationPrincipal Usuario usuarioAutenticado) {

        long posicao = rankingService.posicaoDoUsuario(usuarioAutenticado);
        return ResponseEntity.ok(Map.of(
                "posicao", posicao,
                "nome", usuarioAutenticado.getNome(),
                "pontuacaoTotal", usuarioAutenticado.getPontuacaoTotal(),
                "placaresExatos", usuarioAutenticado.getQuantidadePlacaresExatos()
        ));
    }
}
