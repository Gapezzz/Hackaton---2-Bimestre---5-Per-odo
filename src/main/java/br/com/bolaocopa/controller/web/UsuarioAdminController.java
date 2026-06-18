package br.com.bolaocopa.controller.web;

import br.com.bolaocopa.model.Perfil;
import br.com.bolaocopa.model.Usuario;
import br.com.bolaocopa.service.UsuarioService;
import br.com.bolaocopa.exception.RegraNegocioException;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/usuarios")
public class UsuarioAdminController {

    private final UsuarioService usuarioService;

    public UsuarioAdminController(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    public String listarUsuarios(Model model) {
        model.addAttribute("usuarios", usuarioService.listarTodos());
        return "admin/usuarios";
    }

    // ROTAS DE INCLUSÃO (GET e POST)
    @GetMapping("/novo")
    public String exibirFormularioCadastro(Model model) {
        model.addAttribute("usuario", new Usuario());
        model.addAttribute("perfis", Perfil.values());
        return "admin/novo-usuario";
    }

    @PostMapping("/novo")
    public String salvarNovoUsuario(@ModelAttribute("usuario") Usuario usuario, Model model) {
        try {
            usuarioService.salvarNovoUsuarioAdmin(usuario);
            return "redirect:/admin/usuarios";
        } catch (RegraNegocioException e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("perfis", Perfil.values());
            return "admin/novo-usuario";
        }
    }

    @GetMapping("/editar/{id}")
    public String editarUsuario(@PathVariable Long id, Model model) {
        Usuario usuario = usuarioService.buscarPorId(id);
        model.addAttribute("usuario", usuario);
        model.addAttribute("perfis", Perfil.values());
        return "admin/editar-usuario";
    }

    @PostMapping("/editar/{id}")
    public String salvarAlteracao(@PathVariable Long id, @ModelAttribute("usuario") Usuario usuarioForm, Model model) {
        try {
            usuarioService.atualizarDadosUsuario(id, usuarioForm);
            return "redirect:/admin/usuarios";
        } catch (RegraNegocioException e) {
            model.addAttribute("error", e.getMessage());
            model.addAttribute("usuario", usuarioForm);
            model.addAttribute("perfis", Perfil.values());
            return "admin/editar-usuario";
        }
    }

    @PostMapping("/status/{id}")
    public String alterarStatus(@PathVariable Long id) {
        usuarioService.alternarStatus(id);
        return "redirect:/admin/usuarios";
    }

    // ROTA DE EXCLUSÃO DEFINITIVA
    @PostMapping("/excluir/{id}")
    public String deletarUsuario(@PathVariable Long id) {
        usuarioService.excluirUsuario(id);
        return "redirect:/admin/usuarios";
    }
}