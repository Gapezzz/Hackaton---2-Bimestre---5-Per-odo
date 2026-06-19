package br.com.bolaocopa.controller.api;

import br.com.bolaocopa.model.Partida;
import br.com.bolaocopa.service.PartidaService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/partidas")
public class PartidaApiController {

    private final PartidaService partidaService;

    public PartidaApiController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

    // RF-010: Listar todas as partidas
    // RF-012: Filtrar por fase, status (encerrada=true/false) e data
    @GetMapping
    public ResponseEntity<List<Partida>> listarTodas(
            @RequestParam(required = false) String fase,
            @RequestParam(required = false) Boolean encerrada,
            @RequestParam(required = false) String data) {

        List<Partida> partidas = partidaService.listarTodas();

        if (fase != null && !fase.isBlank()) {
            partidas = partidas.stream()
                    .filter(p -> p.getFase().equalsIgnoreCase(fase))
                    .collect(Collectors.toList());
        }

        if (encerrada != null) {
            partidas = partidas.stream()
                    .filter(p -> p.isEncerrada() == encerrada)
                    .collect(Collectors.toList());
        }

        if (data != null && !data.isBlank()) {
            partidas = partidas.stream()
                    .filter(p -> p.getDataHora().toLocalDate().toString().equals(data))
                    .collect(Collectors.toList());
        }

        return ResponseEntity.ok(partidas);
    }

    // RF-011: Detalhe de uma partida específica
    @GetMapping("/{id}")
    public ResponseEntity<Partida> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(partidaService.buscarPorId(id));
    }

    // RF-013: Próximas partidas ainda abertas para palpite (não iniciadas)
    @GetMapping("/proximas")
    public ResponseEntity<List<Partida>> proximasParaPalpitar() {
        LocalDateTime agora = LocalDateTime.now();
        List<Partida> proximas = partidaService.listarTodas().stream()
                .filter(p -> p.getDataHora().isAfter(agora))
                .limit(5)
                .collect(Collectors.toList());
        return ResponseEntity.ok(proximas);
    }
}
