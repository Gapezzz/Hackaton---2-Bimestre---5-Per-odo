package br.com.bolaocopa.repository;

import br.com.bolaocopa.model.Palpite;
import br.com.bolaocopa.model.Partida;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.Optional;

public interface PalpiteRepository extends JpaRepository<Palpite, Long> {
    List<Palpite> findByUsuarioId(Long usuarioId);
    Optional<Palpite> findByUsuarioIdAndPartidaId(Long usuarioId, Long partidaId);
    List<Palpite> findByPartidaId(Long partidaId);
}