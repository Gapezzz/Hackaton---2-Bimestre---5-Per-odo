package br.com.bolaocopa.controller.web;

import br.com.bolaocopa.exception.RegraNegocioException;
import br.com.bolaocopa.model.Selecao;
import br.com.bolaocopa.service.SelecaoService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

@Controller
@RequestMapping("/admin/selecoes")
public class SelecaoAdminController {

    private final SelecaoService selecaoService;

    public SelecaoAdminController(SelecaoService selecaoService) {
        this.selecaoService = selecaoService;
    }

    @GetMapping
    public String listar(Model model) {
        model.addAttribute("selecoes", selecaoService.listarTodas());
        return "admin/selecoes";
    }

    @GetMapping("/nova")
    public String novaSelecao(Model model) {
        model.addAttribute("selecao", new Selecao());
        return "admin/nova-selecao";
    }

    @GetMapping("/editar/{id}")
    public String editarSelecao(@PathVariable Long id, Model model) {
        model.addAttribute("selecao", selecaoService.buscarPorId(id));
        return "admin/nova-selecao";
    }

    @PostMapping("/salvar")
    public String salvar(@ModelAttribute("selecao") Selecao selecao, Model model) {
        try {
            selecaoService.salvar(selecao);
            return "redirect:/admin/selecoes";
        } catch (RegraNegocioException e) {
            model.addAttribute("erro", e.getMessage());
            return "admin/nova-selecao";
        }
    }

    @PostMapping("/excluir/{id}")
    public String excluir(@PathVariable Long id) {
        selecaoService.excluir(id);
        return "redirect:/admin/selecoes";
    }
}
