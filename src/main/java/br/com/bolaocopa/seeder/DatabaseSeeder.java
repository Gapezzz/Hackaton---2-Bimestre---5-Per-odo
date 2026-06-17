package br.com.bolaocopa.seeder;

import br.com.bolaocopa.model.Perfil;
import br.com.bolaocopa.model.Usuario;
import br.com.bolaocopa.repository.UsuarioRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

@Component
public class DatabaseSeeder implements CommandLineRunner {

    private final UsuarioRepository usuarioRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseSeeder(UsuarioRepository usuarioRepository, PasswordEncoder passwordEncoder) {
        this.usuarioRepository = usuarioRepository;
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

            System.out.println("✅ Seeder executado com sucesso: Usuários e nomes cadastrados!");
        }
    }
}