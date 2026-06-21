package br.com.bolaocopa.service;

import br.com.bolaocopa.dto.RequisicaoCadastro;
import br.com.bolaocopa.dto.RequisicaoEdicaoPerfil;
import br.com.bolaocopa.dto.RequisicaoLogin;
import br.com.bolaocopa.dto.RespostaAutenticacao;
import br.com.bolaocopa.exception.RegraNegocioException;
import br.com.bolaocopa.model.Perfil;
import br.com.bolaocopa.model.Usuario;
import br.com.bolaocopa.repository.UsuarioRepository;
import br.com.bolaocopa.security.JwtService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class UsuarioService {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder criptografiaSenha;
    private final TokenService tokenService;

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

    @Transactional
    public void salvarNovoUsuarioAdmin(Usuario usuario) {
        if (usuarioRepository.existsByEmail(usuario.getEmail())) {
            throw new RegraNegocioException("O e-mail informado já está cadastrado.");
        }
        usuario.setSenha(criptografiaSenha.encode(usuario.getSenha()));
        usuario.setAtivo(true);
        usuarioRepository.save(usuario);
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

        String tokenGerado = tokenService.gerarToken(usuario);

        return new RespostaAutenticacao(tokenGerado, "Bearer", usuario.getId(), usuario.getNome(), usuario.getPerfil().name());
    }

    public List<Usuario> listarTodos() {
        return usuarioRepository.findAll();
    }

    public Usuario buscarPorId(Long id) {
        return usuarioRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException("Usuário não encontrado."));
    }

    @Transactional
    public void atualizarDadosUsuario(Long id, Usuario dadosAtualizados) {
        Usuario usuario = buscarPorId(id);

        if (!usuario.getEmail().equalsIgnoreCase(dadosAtualizados.getEmail())) {
            if (usuarioRepository.existsByEmail(dadosAtualizados.getEmail())) {
                throw new RegraNegocioException("O e-mail informado já está sendo utilizado por outro usuário.");
            }
        }

        usuario.setNome(dadosAtualizados.getNome());
        usuario.setEmail(dadosAtualizados.getEmail());
        usuario.setPerfil(dadosAtualizados.getPerfil());
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void alternarStatus(Long id) {
        Usuario usuario = buscarPorId(id);
        usuario.setAtivo(!usuario.isAtivo());
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void editarPerfil(Long id, RequisicaoEdicaoPerfil dados) {
        Usuario usuario = buscarPorId(id);
        usuario.setNome(dados.getNome());
        if (dados.getFotoUrl() != null && !dados.getFotoUrl().isBlank()) {
            usuario.setFotoUrl(dados.getFotoUrl());
        }
        usuarioRepository.save(usuario);
    }

    @Transactional
    public void excluirUsuario(Long id) {
        Usuario usuario = buscarPorId(id);
        usuarioRepository.delete(usuario);
    }
}