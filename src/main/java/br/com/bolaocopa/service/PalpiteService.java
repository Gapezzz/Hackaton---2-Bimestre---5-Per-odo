package br.com.bolaocopa.service;

import br.com.bolaocopa.model.Palpite;
import br.com.bolaocopa.model.Partida;
import br.com.bolaocopa.model.Usuario;
import br.com.bolaocopa.repository.PalpiteRepository;
import br.com.bolaocopa.repository.PartidaRepository;
import br.com.bolaocopa.exception.RegraNegocioException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class PalpiteService {

    private final PalpiteRepository palpiteRepository;
    private final PartidaRepository partidaRepository;

    public PalpiteService(PalpiteRepository palpiteRepository, PartidaRepository partidaRepository) {
        this.palpiteRepository = palpiteRepository;
        this.partidaRepository = partidaRepository;
    }

    public List<Palpite> listarPorUsuario(Long usuarioId) {
        return palpiteRepository.findByUsuarioId(usuarioId);
    }

    // RF-020 e RF-022: Registro de palpite com trava de horário retroativo/tempo real
    @Transactional
    public void registrarPalpite(Long partidaId, Usuario usuario, Integer golsM, Integer golsV) {
        Partida partida = partidaRepository.findById(partidaId)
                .orElseThrow(() -> new RegraNegocioException("Partida inválida."));

        // Validação de Negócio Crítica (Item 4.2): Bloquear lances após o início do jogo
        if (LocalDateTime.now().isAfter(partida.getDataHora())) {
            throw new RegraNegocioException("Aposta recusada. Esta partida já foi iniciada ou encerrada.");
        }

        Palpite palpite = palpiteRepository.findByUsuarioIdAndPartidaId(usuario.getId(), partida.getId())
                .orElse(new Palpite());

        palpite.setUsuario(usuario);
        palpite.setPartida(partida);
        palpite.setGolsMandanteAposta(golsM);
        palpite.setGolsVisitanteAposta(golsV);

        palpiteRepository.save(palpite);
    }
}