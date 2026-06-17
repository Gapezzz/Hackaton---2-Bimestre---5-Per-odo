package br.com.bolaocopa.model;

public enum Perfil {
    USER("ROLE_USER"),
    ADMIN("ROLE_ADMIN");

    private final String autoridade;

    Perfil(String autoridade) {
        this.autoridade = autoridade;
    }

    public String getAutoridade() {
        return autoridade;
    }
}