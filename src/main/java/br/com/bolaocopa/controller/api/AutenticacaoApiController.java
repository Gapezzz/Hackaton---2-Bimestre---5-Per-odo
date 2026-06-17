package br.com.bolaocopa.controller.api;

import br.com.bolaocopa.dto.RequisicaoCadastro;
import br.com.bolaocopa.dto.RequisicaoLogin;
import br.com.bolaocopa.dto.RespostaAutenticacao;
import br.com.bolaocopa.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/autenticacao")
public class AutenticacaoApiController {

    private final UsuarioService usuarioService;

    public AutenticacaoApiController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrar(@Valid @RequestBody RequisicaoCadastro dados) {
        usuarioService.cadastrarUsuario(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuário cadastrado com sucesso!");
    }

    @PostMapping("/login")
    public ResponseEntity<RespostaAutenticacao> login(@Valid @RequestBody RequisicaoLogin dados) {
        RespostaAutenticacao resposta = usuarioService.autenticarUsuario(dados);
        return ResponseEntity.ok(resposta);
    }
}