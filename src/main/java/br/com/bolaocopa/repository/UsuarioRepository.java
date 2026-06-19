package br.com.bolaocopa.repository;

import br.com.bolaocopa.model.Usuario;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    boolean existsByEmail(String email);

    // RF-032: ranking com desempate por placares exatos e depois data de cadastro (RN 4.4)
    @Query("SELECT u FROM Usuario u WHERE u.perfil = 'USER' ORDER BY u.pontuacaoTotal DESC, u.quantidadePlacaresExatos DESC, u.criadoEm ASC")
    Page<Usuario> findRankingPaginado(Pageable pageable);

    // Para calcular a posição do usuário (RF-033)
    @Query("SELECT COUNT(u) + 1 FROM Usuario u WHERE u.perfil = 'USER' AND (u.pontuacaoTotal > :pontuacao OR (u.pontuacaoTotal = :pontuacao AND u.quantidadePlacaresExatos > :placaresExatos))")
    long calcularPosicaoUsuario(int pontuacao, int placaresExatos);

    // Para indicador de total de usuários comuns (RF-047)
    long countByPerfil(br.com.bolaocopa.model.Perfil perfil);

    // Para o indicador de usuários ativos nas últimas 24h (RF-047)
    @Query("SELECT COUNT(DISTINCT p.usuario.id) FROM Palpite p WHERE p.partida.dataHora >= :desde")
    long contarUsuariosAtivos(java.time.LocalDateTime desde);
}