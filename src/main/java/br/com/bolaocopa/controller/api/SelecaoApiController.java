package br.com.bolaocopa.controller.api;

import br.com.bolaocopa.model.Selecao;
import br.com.bolaocopa.service.SelecaoService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/selecoes")
public class SelecaoApiController {

    private final SelecaoService selecaoService;

    public SelecaoApiController(SelecaoService selecaoService) {
        this.selecaoService = selecaoService;
    }

    // GET /api/selecoes — lista todas ordenadas por nome (Bearer token obrigatório)
    @GetMapping
    public ResponseEntity<List<Selecao>> listarTodas() {
        return ResponseEntity.ok(selecaoService.listarTodas());
    }

    // GET /api/selecoes/{id} — detalhe de uma seleção específica
    @GetMapping("/{id}")
    public ResponseEntity<Selecao> buscarPorId(@PathVariable Long id) {
        return ResponseEntity.ok(selecaoService.buscarPorId(id));
    }
}
