package br.com.bolaocopa.security;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class JwtService {

    @Value("${jwt.secret}")
    private String segredo;

    @Value("${jwt.expiracao-ms}")
    private long expiracaoMs;

    private SecretKey gerarChave() {
        return Keys.hmacShaKeyFor(segredo.getBytes(StandardCharsets.UTF_8));
    }

    public String gerarToken(String email, String perfil) {
        Date agora = new Date();
        Date expiracao = new Date(agora.getTime() + expiracaoMs);

        return Jwts.builder()
                .subject(email)
                .claim("perfil", perfil)
                .issuedAt(agora)
                .expiration(expiracao)
                .signWith(gerarChave())
                .compact();
    }

    private Claims extrairClaims(String token) {
        return Jwts.parser()
                .verifyWith(gerarChave())
                .build()
                .parseSignedClaims(token)
                .getPayload();
    }

    public String extrairEmail(String token) {
        return extrairClaims(token).getSubject();
    }

    public boolean tokenValido(String token) {
        try {
            return extrairClaims(token).getExpiration().after(new Date());
        } catch (Exception e) {
            return false;
        }
    }
}