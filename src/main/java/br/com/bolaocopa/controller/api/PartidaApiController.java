package br.com.bolaocopa.controller.api;

import br.com.bolaocopa.model.Partida;
import br.com.bolaocopa.repository.PartidaRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/partidas") // URL que o JavaScript busca via fetch()
public class PartidaApiController {

    private final PartidaRepository partidaRepository;

    public PartidaApiController(PartidaRepository partidaRepository) {
        this.partidaRepository = partidaRepository;
    }

    @GetMapping
    public ResponseEntity<List<Partida>> listarTodas() {
        return ResponseEntity.ok(partidaRepository.findAll());
    }
}