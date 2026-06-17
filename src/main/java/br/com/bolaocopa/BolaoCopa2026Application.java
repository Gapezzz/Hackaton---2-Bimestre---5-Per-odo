package br.com.bolaocopa;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class BolaoCopa2026Application {

	public static void main(String[] args) {
		SpringApplication.run(BolaoCopa2026Application.class, args);
	}

	@Bean
	public CommandLineRunner exibirCredenciaisNoConsole() {
		return args -> {
			System.out.println("\n==================================================================");
			System.out.println(" SERVIDOR RODANDO COM SUCESSO! ACESSE: http://localhost:8080/");
			System.out.println("==================================================================");
			System.out.println(" Admin cadastrado: admin@bolaocopa.com / 123456");
			System.out.println(" Usuário comum cadastrado: user@bolaocopa.com / 123456");
			System.out.println("==================================================================\n");
		};
	}
}