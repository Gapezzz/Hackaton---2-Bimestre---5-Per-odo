package br.com.bolaocopa.service;

import br.com.bolaocopa.exception.RegraNegocioException;
import br.com.bolaocopa.model.TokenRecuperacao;
import br.com.bolaocopa.model.Usuario;
import br.com.bolaocopa.repository.TokenRecuperacaoRepository;
import br.com.bolaocopa.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class RecuperacaoSenhaService {

    private final UsuarioRepository usuarioRepository;
    private final TokenRecuperacaoRepository tokenRepository;
    private final PasswordEncoder passwordEncoder;

    public RecuperacaoSenhaService(UsuarioRepository usuarioRepository,
                                   TokenRecuperacaoRepository tokenRepository,
                                   PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.tokenRepository = tokenRepository;
        this.passwordEncoder = passwordEncoder;
    }

    // RF-003: Solicita redefinição — gera token e "envia" por e-mail
    // Nota: em produção, integrar com JavaMailSender. Para o MVP, o token é retornado na resposta
    // (simulação sem servidor SMTP).
    @Transactional
    public String solicitarRecuperacao(String email) {
        Usuario usuario = usuarioRepository.findByEmail(email)
                .orElseThrow(() -> new RegraNegocioException("E-mail não encontrado."));

        // Invalida tokens anteriores do usuário
        tokenRepository.deleteByUsuarioId(usuario.getId());

        String tokenGerado = UUID.randomUUID().toString().replace("-", "");

        TokenRecuperacao tokenRecuperacao = new TokenRecuperacao();
        tokenRecuperacao.setToken(tokenGerado);
        tokenRecuperacao.setUsuario(usuario);
        tokenRecuperacao.setExpiraEm(LocalDateTime.now().plusHours(1)); // válido por 1 hora
        tokenRecuperacao.setUsado(false);
        tokenRepository.save(tokenRecuperacao);

        // Em produção: enviar e-mail com link contendo o token
        // mailService.enviarEmailRecuperacao(usuario.getEmail(), tokenGerado);

        return tokenGerado; // Retornado na resposta para fins de demonstração/teste
    }

    // RF-003: Redefine a senha usando o token recebido
    @Transactional
    public void redefinirSenha(String token, String novaSenha) {
        TokenRecuperacao tokenRecuperacao = tokenRepository.findByToken(token)
                .orElseThrow(() -> new RegraNegocioException("Token inválido ou expirado."));

        if (tokenRecuperacao.isUsado()) {
            throw new RegraNegocioException("Este token já foi utilizado.");
        }

        if (LocalDateTime.now().isAfter(tokenRecuperacao.getExpiraEm())) {
            throw new RegraNegocioException("Token expirado. Solicite uma nova recuperação.");
        }

        Usuario usuario = tokenRecuperacao.getUsuario();
        usuario.setSenha(passwordEncoder.encode(novaSenha));
        usuarioRepository.save(usuario);

        tokenRecuperacao.setUsado(true);
        tokenRepository.save(tokenRecuperacao);
    }
}
