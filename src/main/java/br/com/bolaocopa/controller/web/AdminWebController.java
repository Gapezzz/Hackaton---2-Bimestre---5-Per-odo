package br.com.bolaocopa.controller.web;

import br.com.bolaocopa.repository.PalpiteRepository;
import br.com.bolaocopa.repository.PartidaRepository;
import br.com.bolaocopa.repository.UsuarioRepository;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.time.LocalDateTime;

@Controller
public class AdminWebController {

    private final UsuarioRepository usuarioRepository;
    private final PalpiteRepository palpiteRepository;
    private final PartidaRepository partidaRepository;

    public AdminWebController(UsuarioRepository usuarioRepository,
                              PalpiteRepository palpiteRepository,
                              PartidaRepository partidaRepository) {
        this.usuarioRepository = usuarioRepository;
        this.palpiteRepository = palpiteRepository;
        this.partidaRepository = partidaRepository;
    }

    @GetMapping("/")
    public String raiz() {
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String exibirLogin() {
        return "login";
    }

    // RF-047: Dashboard com os 4 indicadores exigidos
    @GetMapping("/dashboard")
    public String exibirDashboard(Model model) {
        long totalUsuarios = usuarioRepository.countByPerfil(br.com.bolaocopa.model.Perfil.USER);
        long totalPalpites = palpiteRepository.count();
        long partidasPendentes = partidaRepository.countByEncerradaFalse();
        long usuariosAtivos24h = usuarioRepository.contarUsuariosAtivos(LocalDateTime.now().minusHours(24));

        model.addAttribute("totalUsuarios", totalUsuarios);
        model.addAttribute("totalPalpites", totalPalpites);
        model.addAttribute("partidasPendentes", partidasPendentes);
        model.addAttribute("usuariosAtivos24h", usuariosAtivos24h);

        return "dashboard";
    }

    @PostMapping("/sair")
    public String processarLogoutWeb(HttpServletResponse response) {
        Cookie cookie = new Cookie("TOKEN_BOLAOMC", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0);
        response.addCookie(cookie);
        return "redirect:/login?sair=true";
    }
}
