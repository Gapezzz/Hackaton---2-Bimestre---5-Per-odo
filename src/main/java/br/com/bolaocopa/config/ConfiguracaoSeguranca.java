package br.com.bolaocopa.config;

import br.com.bolaocopa.model.Usuario;
import br.com.bolaocopa.service.TokenService;
import jakarta.servlet.http.Cookie;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
public class ConfiguracaoSeguranca {

    private final TokenService tokenService;
    private final FiltroSeguranca filtroSeguranca;

    public ConfiguracaoSeguranca(TokenService tokenService, FiltroSeguranca filtroSeguranca) {
        this.tokenService = tokenService;
        this.filtroSeguranca = filtroSeguranca;
    }

    @Bean
    @Order(2)
    public SecurityFilterChain webFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(Customizer.withDefaults())
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/css/**", "/js/**", "/imagens/**", "/favicon.ico").permitAll()
                        .requestMatchers("/", "/login", "/sair", "/error",
                                "/api/autenticacao/cadastro", "/api/autenticacao/login",
                                "/api/autenticacao/recuperar-senha", "/api/autenticacao/redefinir-senha").permitAll()
                        .requestMatchers("/dashboard").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/admin/**").hasRole("ADMIN")
                        .requestMatchers("/api/autenticacao/perfil", "/api/autenticacao/logout",
                                "/api/autenticacao/conta", "/api/ranking/**",
                                "/api/partidas/**", "/api/palpites/**", "/api/selecoes/**").authenticated()
                        .anyRequest().authenticated()
                )
                .formLogin(form -> form
                        .loginPage("/login")
                        .loginProcessingUrl("/login")
                        .successHandler((request, response, authentication) -> {
                            Usuario usuario = (Usuario) authentication.getPrincipal();
                            String tokenJWT = tokenService.gerarToken(usuario);

                            Cookie cookie = new Cookie("TOKEN_BOLAOMC", tokenJWT);
                            cookie.setHttpOnly(true);
                            cookie.setPath("/");
                            cookie.setMaxAge(7200);
                            response.addCookie(cookie);

                            response.sendRedirect("/dashboard");
                        })
                        .failureUrl("/login?error=true")
                )
                .exceptionHandling(eh -> eh
                        .authenticationEntryPoint((request, response, authException) -> {
                            String uri = request.getRequestURI();
                            if (uri.startsWith("/api/")) {
                                response.setStatus(HttpStatus.UNAUTHORIZED.value());
                                response.setContentType("application/json");
                                response.setCharacterEncoding("UTF-8");
                                response.getWriter().write("{\"erro\": \"Não autorizado.\"}");
                            } else {
                                response.sendRedirect("/login");
                            }
                        })
                )
                .addFilterBefore(filtroSeguranca, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOriginPatterns(List.of("*"));
        config.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", config);
        return source;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration configuration) throws Exception {
        return configuration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}