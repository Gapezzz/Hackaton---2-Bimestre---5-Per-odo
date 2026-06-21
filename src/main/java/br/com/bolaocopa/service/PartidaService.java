package br.com.bolaocopa.service;

import br.com.bolaocopa.model.Partida;
import br.com.bolaocopa.model.Palpite;
import br.com.bolaocopa.model.Usuario;
import br.com.bolaocopa.repository.PartidaRepository;
import br.com.bolaocopa.repository.PalpiteRepository;
import br.com.bolaocopa.repository.UsuarioRepository;
import br.com.bolaocopa.exception.RegraNegocioException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class PartidaService {

    private final PartidaRepository partidaRepository;
    private final PalpiteRepository palpiteRepository;
    private final UsuarioRepository usuarioRepository;

    public PartidaService(PartidaRepository partidaRepository, PalpiteRepository palpiteRepository, UsuarioRepository usuarioRepository) {
        this.partidaRepository = partidaRepository;
        this.palpiteRepository = palpiteRepository;
        this.usuarioRepository = usuarioRepository;
    }

    public List<Partida> listarTodas() {
        return partidaRepository.findAllByOrderByDataHoraAsc();
    }

    public Partida buscarPorId(Long id) {
        return partidaRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException("Partida não encontrada."));
    }

    @Transactional
    public void salvarPartida(Partida partida) {
        partidaRepository.save(partida);
    }

    @Transactional
    public void excluirPartida(Long id) {
        Partida partida = buscarPorId(id);
        if (partida.isEncerrada()) {
            throw new RegraNegocioException("Não é permitido excluir uma partida que já possui resultado.");
        }
        partidaRepository.delete(partida);
    }

    // RF-043 e RF-044: Lançamento/Edição de resultados e processamento de pontos de forma transacional única
    @Transactional
    public void lancarResultado(Long id, Integer golsMandante, Integer golsVisitante) {
        Partida partida = buscarPorId(id);
        partida.setGolsMandante(golsMandante);
        partida.setGolsVisitante(golsVisitante);
        partida.setEncerrada(true);
        partidaRepository.save(partida);

        // Buscar todos os lances de usuários para este jogo
        List<Palpite> palpites = palpiteRepository.findByPartidaId(partida.getId());

        for (Palpite p : palpites) {
            int pontosObtidos = calcularPontosDoPalpite(
                    p.getGolsMandanteAposta(), p.getGolsVisitanteAposta(),
                    golsMandante, golsVisitante
            );
            p.setPontuacaoObtida(pontosObtidos);
            palpiteRepository.save(p);
        }

        // Atualizar pontuação consolidada na tabela dos Usuários afetados
        recalcularPontuacaoTotalGeralDosUsuarios();
    }

    private int calcularPontosDoPalpite(int pm, int pv, int rm, int rv) {
        if (pm == rm && pv == rv) {
            return 10; // Placar Exato (RF-031 / Item 4.1)
        }
        // Verifica o saldo/tendência (Vencedor Mandante, Vencedor Visitante ou Empate)
        if (Integer.compare(pm, pv) == Integer.compare(rm, rv)) {
            return 5; // Acertou apenas o vencedor ou empate
        }
        return 0; // Erro completo
    }

    private void recalcularPontuacaoTotalGeralDosUsuarios() {
        List<Usuario> usuarios = usuarioRepository.findAll();
        for (Usuario u : usuarios) {
            List<Palpite> lancesDoUsuario = palpiteRepository.findByUsuarioId(u.getId());
            int somaTotal = lancesDoUsuario.stream().mapToInt(Palpite::getPontuacaoObtida).sum();
            // Conta placares exatos para critério de desempate (RF-032 / RN 4.4)
            int placaresExatos = (int) lancesDoUsuario.stream()
                    .filter(p -> p.getPontuacaoObtida() != null && p.getPontuacaoObtida() == 10)
                    .count();
            u.setPontuacaoTotal(somaTotal);
            u.setQuantidadePlacaresExatos(placaresExatos);
            usuarioRepository.save(u);
        }
    }
}