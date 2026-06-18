package br.com.bolaocopa.controller.web;

import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

@Controller
public class AdminWebController {

    @GetMapping("/")
    public String raiz() {
        return "redirect:/login";
    }

    @GetMapping("/login")
    public String exibirLogin() {
        return "login";
    }

    @GetMapping("/dashboard")
    public String exibirDashboard() {
        return "dashboard";
    }

    @PostMapping("/sair")
    public String processarLogoutWeb(HttpServletResponse response) {
        Cookie cookie = new Cookie("TOKEN_BOLAOMC", null);
        cookie.setHttpOnly(true);
        cookie.setPath("/");
        cookie.setMaxAge(0); // Deleta o cookie do navegador instantaneamente
        response.addCookie(cookie);
        return "redirect:/login?sair=true";
    }
}