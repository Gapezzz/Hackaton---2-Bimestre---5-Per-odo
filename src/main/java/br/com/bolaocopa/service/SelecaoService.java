package br.com.bolaocopa.service;

import br.com.bolaocopa.exception.RegraNegocioException;
import br.com.bolaocopa.model.Selecao;
import br.com.bolaocopa.repository.SelecaoRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class SelecaoService {

    private final SelecaoRepository selecaoRepository;

    public SelecaoService(SelecaoRepository selecaoRepository) {
        this.selecaoRepository = selecaoRepository;
    }

    public List<Selecao> listarTodas() {
        return selecaoRepository.findAllByOrderByNomeAsc();
    }

    public Selecao buscarPorId(Long id) {
        return selecaoRepository.findById(id)
                .orElseThrow(() -> new RegraNegocioException("Seleção não encontrada."));
    }

    @Transactional
    public void salvar(Selecao selecao) {
        // Valida código FIFA único apenas em criação ou quando mudou
        if (selecao.getId() == null) {
            if (selecaoRepository.existsByCodigoFifa(selecao.getCodigoFifa().toUpperCase())) {
                throw new RegraNegocioException("Já existe uma seleção com o código FIFA '" + selecao.getCodigoFifa() + "'.");
            }
        }
        selecao.setCodigoFifa(selecao.getCodigoFifa().toUpperCase());
        selecaoRepository.save(selecao);
    }

    @Transactional
    public void excluir(Long id) {
        Selecao selecao = buscarPorId(id);
        selecaoRepository.delete(selecao);
    }
}
