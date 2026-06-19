package br.com.bolaocopa.repository;

import br.com.bolaocopa.model.Selecao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;

public interface SelecaoRepository extends JpaRepository<Selecao, Long> {
    List<Selecao> findAllByOrderByNomeAsc();
    boolean existsByCodigoFifa(String codigoFifa);
}
