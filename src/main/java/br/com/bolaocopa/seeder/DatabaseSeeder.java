package br.com.bolaocopa.seeder;

import br.com.bolaocopa.model.Perfil;
import br.com.bolaocopa.model.Usuario;
import br.com.bolaocopa.model.Partida;
import br.com.bolaocopa.repository.UsuarioRepository;
import br.com.bolaocopa.repository.PartidaRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PartidaRepository partidaRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UsuarioRepository usuarioRepository,
                          PartidaRepository partidaRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.partidaRepository = partidaRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        if (usuarioRepository.count() == 0) {
            Usuario admin = new Usuario();
            admin.setNome("Administrador do Sistema");
            admin.setEmail("admin@bolaocopa.com");
            admin.setSenha(passwordEncoder.encode("123456"));
            admin.setPerfil(Perfil.ADMIN);
            admin.setAtivo(true);
            usuarioRepository.save(admin);

            Usuario user = new Usuario();
            user.setNome("Usuário de Teste");
            user.setEmail("user@bolaocopa.com");
            user.setSenha(passwordEncoder.encode("123456"));
            user.setPerfil(Perfil.USER);
            user.setAtivo(true);
            usuarioRepository.save(user);
        }

        if (partidaRepository.count() == 0) {

            // Jogo 1
            Partida jogo1 = new Partida();
            jogo1.setFase("Fase de Grupos");
            jogo1.setMandante("México");
            jogo1.setFotoMandante("https://flagcdn.com/w40/mx.png"); // URL da bandeira do México
            jogo1.setVisitante("Estados Unidos");
            jogo1.setFotoVisitante("https://flagcdn.com/w40/us.png"); // URL da bandeira dos EUA
            jogo1.setDataHora(LocalDateTime.of(2026, 6, 11, 17, 0));
            jogo1.setEstadio("Estádio Azteca");
            jogo1.setGolsMandante(2);
            jogo1.setGolsVisitante(1);
            jogo1.setEncerrada(true);
            partidaRepository.save(jogo1);

            // Jogo 2
            Partida jogo2 = new Partida();
            jogo2.setFase("Fase de Grupos");
            jogo2.setMandante("Brasil");
            jogo2.setFotoMandante("https://flagcdn.com/w40/br.png"); // URL da bandeira do Brasil
            jogo2.setVisitante("Croácia");
            jogo2.setFotoVisitante("https://flagcdn.com/w40/hr.png"); // URL da bandeira da Croácia
            jogo2.setDataHora(LocalDateTime.of(2026, 6, 25, 16, 0));
            jogo2.setEstadio("SoFi Stadium");
            jogo2.setEncerrada(false);
            partidaRepository.save(jogo2);

            // Jogo 3
            Partida jogo3 = new Partida();
            jogo3.setFase("Fase de Grupos");
            jogo3.setMandante("Argentina");
            jogo3.setFotoMandante("https://flagcdn.com/w40/ar.png"); // URL da bandeira da Argentina
            jogo3.setVisitante("França");
            jogo3.setFotoVisitante("https://flagcdn.com/w40/fr.png"); // URL da bandeira da França
            jogo3.setDataHora(LocalDateTime.of(2026, 6, 26, 20, 0));
            jogo3.setEstadio("MetLife Stadium");
            jogo3.setEncerrada(false);
            partidaRepository.save(jogo3);

            System.out.println("✅ Seeder: Partidas inicializadas com URLs de imagens.");
        }
    }
}