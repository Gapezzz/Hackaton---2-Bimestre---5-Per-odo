package br.com.bolaocopa.service;

import br.com.bolaocopa.dto.ItemRankingDto;
import br.com.bolaocopa.model.Usuario;
import br.com.bolaocopa.repository.UsuarioRepository;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.atomic.AtomicLong;
import java.util.stream.Collectors;

@Service
public class RankingService {

    private final UsuarioRepository usuarioRepository;

    public RankingService(UsuarioRepository usuarioRepository) {
        this.usuarioRepository = usuarioRepository;
    }

    // RF-034: ranking paginado com mínimo 50 por página
    // RF-032: ordenado por pontuação, desempate por placares exatos (RN 4.4)
    // RF-033: marca o usuário autenticado na lista
    public List<ItemRankingDto> listarRanking(int pagina, int tamanhoPagina, Usuario usuarioAutenticado) {
        Page<Usuario> paginaResultado = usuarioRepository.findRankingPaginado(
                PageRequest.of(pagina, tamanhoPagina)
        );

        // Calcula o offset da posição absoluta na página atual
        long offsetPagina = (long) pagina * tamanhoPagina + 1;
        AtomicLong contador = new AtomicLong(offsetPagina);

        return paginaResultado.getContent().stream()
                .map(u -> new ItemRankingDto(
                        contador.getAndIncrement(),
                        u.getId(),
                        u.getNome(),
                        u.getFotoUrl(),
                        u.getPontuacaoTotal(),
                        u.getQuantidadePlacaresExatos(),
                        usuarioAutenticado != null && u.getId().equals(usuarioAutenticado.getId())
                ))
                .collect(Collectors.toList());
    }

    // RF-033: posição exata do usuário autenticado no ranking geral
    public long posicaoDoUsuario(Usuario usuario) {
        return usuarioRepository.calcularPosicaoUsuario(
                usuario.getPontuacaoTotal(),
                usuario.getQuantidadePlacaresExatos()
        );
    }
}
