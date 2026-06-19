package br.com.bolaocopa.controller.web;

import br.com.bolaocopa.model.Partida;
import br.com.bolaocopa.service.PartidaService;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

@Controller
@RequestMapping("/admin/partidas")
public class PartidaAdminController {

    private final PartidaService partidaService;

    private static final String UPLOAD_DIR = System.getProperty("user.dir") + File.separator + "src" +
            File.separator + "main" + File.separator + "resources" +
            File.separator + "static" + File.separator + "uploads" + File.separator;

    public PartidaAdminController(PartidaService partidaService) {
        this.partidaService = partidaService;
    }

    // 1. LISTAGEM (RF-042)
    @GetMapping
    public String listarPartidas(Model model) {
        model.addAttribute("partidas", partidaService.listarTodas());
        return "admin/partidas";
    }

    // 2. TELA DE CADASTRO
    @GetMapping("/novo")
    public String novaPartida(Model model) {
        model.addAttribute("partida", new Partida());
        return "admin/nova-partida";
    }

    // 3. TELA DE EDIÇÃO
    @GetMapping("/editar/{id}")
    public String editarPartida(@PathVariable("id") Long id, Model model) {
        model.addAttribute("partida", partidaService.buscarPorId(id));
        return "admin/nova-partida";
    }

    // 4. SALVAR OU ATUALIZAR (RF-042)
    @PostMapping("/novo")
    public String salvarPartida(@ModelAttribute("partida") Partida partida,
                                @RequestParam(value = "fileMandante", required = false) MultipartFile fileMandante,
                                @RequestParam(value = "fileVisitante", required = false) MultipartFile fileVisitante) {
        try {
            // Se for edição, preserva as imagens antigas caso o admin não faça upload de novas
            if (partida.getId() != null) {
                Partida partidaExistente = partidaService.buscarPorId(partida.getId());
                if (fileMandante == null || fileMandante.isEmpty()) {
                    partida.setFotoMandante(partidaExistente.getFotoMandante());
                }
                if (fileVisitante == null || fileVisitante.isEmpty()) {
                    partida.setFotoVisitante(partidaExistente.getFotoVisitante());
                }
                // Preserva o estado de encerramento e gols anteriores
                partida.setEncerrada(partidaExistente.isEncerrada());
                partida.setGolsMandante(partidaExistente.getGolsMandante());
                partida.setGolsVisitante(partidaExistente.getGolsVisitante());
            }

            if (fileMandante != null && !fileMandante.isEmpty()) {
                partida.setFotoMandante(salvarArquivoLocal(fileMandante));
            }

            if (fileVisitante != null && !fileVisitante.isEmpty()) {
                partida.setFotoVisitante(salvarArquivoLocal(fileVisitante));
            }

            partidaService.salvarPartida(partida);

        } catch (IOException e) {
            e.printStackTrace();
            return "redirect:/admin/partidas/novo?erro=upload";
        }

        return "redirect:/admin/partidas";
    }

    // 5. TELA DE LANÇAR RESULTADO (RF-043 / RF-044)
    @GetMapping("/resultado/{id}")
    public String telaResultado(@PathVariable("id") Long id, Model model) {
        model.addAttribute("partida", partidaService.buscarPorId(id));
        return "admin/lancar-resultado";
    }

    // 6. SALVAR RESULTADO — dispara cálculo automático de pontuação (RF-043, RF-044, RN 4.1, 4.3)
    @PostMapping("/resultado/{id}")
    public String salvarResultado(@PathVariable("id") Long id,
                                  @RequestParam("golsMandante") Integer golsMandante,
                                  @RequestParam("golsVisitante") Integer golsVisitante) {
        partidaService.lancarResultado(id, golsMandante, golsVisitante);
        return "redirect:/admin/partidas";
    }

    // 7. REMOVER PARTIDA (RF-042)
    @PostMapping("/excluir/{id}")
    public String excluirPartida(@PathVariable("id") Long id) {
        partidaService.excluirPartida(id);
        return "redirect:/admin/partidas";
    }

    private String salvarArquivoLocal(MultipartFile arquivo) throws IOException {
        File diretorio = new File(UPLOAD_DIR);
        if (!diretorio.exists()) {
            diretorio.mkdirs();
        }

        String nomeOriginal = arquivo.getOriginalFilename();
        String extensao = nomeOriginal.substring(nomeOriginal.lastIndexOf("."));
        String nomeUnico = UUID.randomUUID().toString() + extensao;

        Path caminhoCompleto = Paths.get(UPLOAD_DIR + nomeUnico);
        Files.write(caminhoCompleto, arquivo.getBytes());

        return "/uploads/" + nomeUnico;
    }
}
