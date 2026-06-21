package br.com.bolaocopa.seeder;

import br.com.bolaocopa.model.Perfil;
import br.com.bolaocopa.model.Selecao;
import br.com.bolaocopa.model.Usuario;
import br.com.bolaocopa.model.Partida;
import br.com.bolaocopa.repository.SelecaoRepository;
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
    private final SelecaoRepository selecaoRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UsuarioRepository usuarioRepository,
                          PartidaRepository partidaRepository,
                          SelecaoRepository selecaoRepository,
                          PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
        this.partidaRepository = partidaRepository;
        this.selecaoRepository = selecaoRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {

        // Seed de Seleções (RF-041)
        if (selecaoRepository.count() == 0) {
            String[][] selecoes = {
                {"Brasil",      "BRA", "https://flagcdn.com/w40/br.png", "G"},
                {"Argentina",   "ARG", "https://flagcdn.com/w40/ar.png", "G"},
                {"França",      "FRA", "https://flagcdn.com/w40/fr.png", "D"},
                {"Alemanha",    "GER", "https://flagcdn.com/w40/de.png", "F"},
                {"Espanha",     "ESP", "https://flagcdn.com/w40/es.png", "E"},
                {"Portugal",    "POR", "https://flagcdn.com/w40/pt.png", "B"},
                {"México",      "MEX", "https://flagcdn.com/w40/mx.png", "A"},
                {"Estados Unidos","USA","https://flagcdn.com/w40/us.png","A"},
                {"Canadá",      "CAN", "https://flagcdn.com/w40/ca.png", "B"},
                {"Croácia",     "CRO", "https://flagcdn.com/w40/hr.png", "H"},
                {"Holanda",     "NED", "https://flagcdn.com/w40/nl.png", "C"},
                {"Inglaterra",  "ENG", "https://flagcdn.com/w40/gb-eng.png","C"},
                {"Itália",      "ITA", "https://flagcdn.com/w40/it.png", "D"},
                {"Bélgica",     "BEL", "https://flagcdn.com/w40/be.png", "E"},
                {"Japão",       "JPN", "https://flagcdn.com/w40/jp.png", "F"},
                {"Marrocos",    "MAR", "https://flagcdn.com/w40/ma.png", "H"}
            };
            for (String[] s : selecoes) {
                Selecao sel = new Selecao();
                sel.setNome(s[0]);
                sel.setCodigoFifa(s[1]);
                sel.setUrlBandeira(s[2]);
                sel.setGrupo(s[3]);
                selecaoRepository.save(sel);
            }
            System.out.println("✅ Seeder: 16 seleções inicializadas.");
        }

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