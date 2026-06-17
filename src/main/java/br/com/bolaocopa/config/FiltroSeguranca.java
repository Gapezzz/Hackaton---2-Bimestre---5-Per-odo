package br.com.bolaocopa.config;

import br.com.bolaocopa.service.TokenService;
import br.com.bolaocopa.repository.UsuarioRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class FiltroSeguranca extends OncePerRequestFilter {

    private final TokenService tokenService;
    private final UsuarioRepository usuarioRepository;

    public FiltroSeguranca(TokenService tokenService, UsuarioRepository usuarioRepository) {
        this.tokenService = tokenService;
        this.usuarioRepository = usuarioRepository;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {

        // 1. Recupera o token do Cookie ou do Header
        String tokenJWT = recuperarTokenDoCookie(request);
        if (tokenJWT == null) {
            tokenJWT = recuperarTokenDoHeader(request);
        }

        // 2. Se achou o token, valida e autentica no contexto do Spring
        if (tokenJWT != null && !tokenJWT.isBlank()) {
            String subject = tokenService.getSubject(tokenJWT);

            if (subject != null) {
                var usuarioOptional = usuarioRepository.findByEmail(subject);

                if (usuarioOptional.isPresent()) {
                    var usuario = usuarioOptional.get();
                    var authentication = new UsernamePasswordAuthenticationToken(
                            usuario,
                            null,
                            usuario.getAuthorities()
                    );

                    // Injeta a autenticação para o Spring saber quem é o usuário nesta requisição
                    SecurityContextHolder.getContext().setAuthentication(authentication);
                }
            }
        }

        // 3. Segue para a página solicitada (ex: /dashboard)
        filterChain.doFilter(request, response);
    }

    private String recuperarTokenDoCookie(HttpServletRequest request) {
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if ("TOKEN_BOLAOMC".equals(cookie.getName())) {
                    return cookie.getValue();
                }
            }
        }
        return null;
    }

    private String recuperarTokenDoHeader(HttpServletRequest request) {
        String authorizationHeader = request.getHeader("Authorization");
        if (authorizationHeader != null && authorizationHeader.startsWith("Bearer ")) {
            return authorizationHeader.replace("Bearer ", "");
        }
        return null;
    }
}