package br.com.bolaocopa.controller.web;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

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

    @GetMapping("/admin/configuracoes")
    public String exibirPainelAdmin() {
        return "admin-painel";
    }
}