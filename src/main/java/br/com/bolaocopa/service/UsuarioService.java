package br.com.bolaocopa.service;

import br.com.bolaocopa.dto.RequisicaoCadastro;
import br.com.bolaocopa.dto.RequisicaoLogin;
import br.com.bolaocopa.dto.RespostaAutenticacao;
import br.com.bolaocopa.exception.RegraNegocioException;
import br.com.bolaocopa.model.Perfil;
import br.com.bolaocopa.model.Usuario;
import br.com.bolaocopa.repository.UsuarioRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder criptografiaSenha;
    private final TokenService tokenService; // Injeção do novo serviço

    // Atualizado o construtor para incluir o TokenService
    public UsuarioService(UsuarioRepository usuarioRepository, PasswordEncoder criptografiaSenha, TokenService tokenService) {
        this.usuarioRepository = usuarioRepository;
        this.criptografiaSenha = criptografiaSenha;
        this.tokenService = tokenService;
    }

    @Transactional
    public void cadastrarUsuario(RequisicaoCadastro dados) {
        if (usuarioRepository.existsByEmail(dados.getEmail())) {
            throw new RegraNegocioException("O e-mail informado já está cadastrado.");
        }

        Usuario novoUsuario = new Usuario();
        novoUsuario.setNome(dados.getNome());
        novoUsuario.setEmail(dados.getEmail());
        novoUsuario.setSenha(criptografiaSenha.encode(dados.getSenha()));
        novoUsuario.setPerfil(Perfil.USER);
        novoUsuario.setAtivo(true);

        usuarioRepository.save(novoUsuario);
    }

    public RespostaAutenticacao autenticarUsuario(RequisicaoLogin dados) {
        Usuario usuario = usuarioRepository.findByEmail(dados.getEmail())
                .orElseThrow(() -> new RegraNegocioException("E-mail ou senha inválidos."));

        if (!usuario.isAtivo()) {
            throw new RegraNegocioException("Esta conta está bloqueada.");
        }

        if (!criptografiaSenha.matches(dados.getSenha(), usuario.getSenha())) {
            throw new RegraNegocioException("E-mail ou senha inválidos.");
        }

        // GERAÇÃO REAL DO TOKEN AQUI:
        String tokenGerado = tokenService.gerarToken(usuario);

        return new RespostaAutenticacao(
                tokenGerado, // Token dinâmico inserido aqui
                "Bearer",
                usuario.getId(),
                usuario.getNome(),
                usuario.getPerfil().name()
        );
    }
}