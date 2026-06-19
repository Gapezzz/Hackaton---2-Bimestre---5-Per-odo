package br.com.bolaocopa.repository;

import br.com.bolaocopa.model.Partida;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface PartidaRepository extends JpaRepository<Partida, Long> {
    List<Partida> findAllByOrderByDataHoraAsc();
}