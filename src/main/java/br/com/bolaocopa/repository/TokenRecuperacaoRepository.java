package br.com.bolaocopa.repository;

import br.com.bolaocopa.model.TokenRecuperacao;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface TokenRecuperacaoRepository extends JpaRepository<TokenRecuperacao, Long> {
    Optional<TokenRecuperacao> findByToken(String token);
    void deleteByUsuarioId(Long usuarioId);
}
