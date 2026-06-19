package br.com.bolaocopa.controller.api;

import br.com.bolaocopa.dto.*;
import br.com.bolaocopa.model.Usuario;
import br.com.bolaocopa.service.RecuperacaoSenhaService;
import br.com.bolaocopa.service.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/autenticacao")
public class AutenticacaoApiController {

    private final UsuarioService usuarioService;
    private final RecuperacaoSenhaService recuperacaoSenhaService;

    public AutenticacaoApiController(UsuarioService usuarioService,
                                     RecuperacaoSenhaService recuperacaoSenhaService) {
        this.usuarioService = usuarioService;
        this.recuperacaoSenhaService = recuperacaoSenhaService;
    }

    // RF-001: Cadastro
    @PostMapping("/cadastro")
    public ResponseEntity<String> cadastrar(@Valid @RequestBody RequisicaoCadastro dados) {
        usuarioService.cadastrarUsuario(dados);
        return ResponseEntity.status(HttpStatus.CREATED).body("Usuário cadastrado com sucesso!");
    }

    // RF-002: Login com JWT
    @PostMapping("/login")
    public ResponseEntity<RespostaAutenticacao> login(@Valid @RequestBody RequisicaoLogin dados) {
        RespostaAutenticacao resposta = usuarioService.autenticarUsuario(dados);
        return ResponseEntity.ok(resposta);
    }

    // RF-003: Solicitar recuperação de senha
    @PostMapping("/recuperar-senha")
    public ResponseEntity<Map<String, String>> recuperarSenha(@Valid @RequestBody RequisicaoRecuperacaoSenha dados) {
        String token = recuperacaoSenhaService.solicitarRecuperacao(dados.getEmail());
        // Em produção o token seria enviado por e-mail; aqui retornamos para facilitar testes
        return ResponseEntity.ok(Map.of(
                "mensagem", "Token de recuperação gerado. Em produção, seria enviado ao e-mail cadastrado.",
                "token", token
        ));
    }

    // RF-003: Redefinir senha com token
    @PostMapping("/redefinir-senha")
    public ResponseEntity<String> redefinirSenha(@Valid @RequestBody RequisicaoRedefinicaoSenha dados) {
        recuperacaoSenhaService.redefinirSenha(dados.getToken(), dados.getNovaSenha());
        return ResponseEntity.ok("Senha redefinida com sucesso!");
    }

    // RF-004: Editar perfil (nome e foto)
    @PutMapping("/perfil")
    public ResponseEntity<String> editarPerfil(@Valid @RequestBody RequisicaoEdicaoPerfil dados,
                                               @AuthenticationPrincipal Usuario usuarioAutenticado) {
        usuarioService.editarPerfil(usuarioAutenticado.getId(), dados);
        return ResponseEntity.ok("Perfil atualizado com sucesso!");
    }

    // RF-005: Logout — instrui o app mobile a descartar o token localmente
    @PostMapping("/logout")
    public ResponseEntity<String> logout() {
        return ResponseEntity.ok("Sessão encerrada. Descarte o token no dispositivo.");
    }

    // RF-006: Exclusão de conta pelo próprio usuário (LGPD)
    @DeleteMapping("/conta")
    public ResponseEntity<String> excluirConta(@AuthenticationPrincipal Usuario usuarioAutenticado) {
        usuarioService.excluirUsuario(usuarioAutenticado.getId());
        return ResponseEntity.ok("Conta excluída com sucesso.");
    }
}
