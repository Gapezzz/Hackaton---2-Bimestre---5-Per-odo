# Bolão Copa do Mundo 2026

## Descrição do Projeto

Aplicação backend RESTful para um sistema de bolão da Copa do Mundo 2026. Fornece endpoints para cadastro e autenticação de usuários, além de uma base para gerenciamento de partidas, palpites, rankings e grupos de bolão. A interface web básica (Thymeleaf) oferece páginas de login e dashboard.

## Objetivos

- Permitir cadastro e autenticação de usuários.
- Manter informações de usuários (perfil, pontuação, data de criação).
- Fornecer APIs seguras para consumo por clientes (SPA/mobile) e páginas web com login.
- Servir de base para recursos futuros: partidas, palpites, grupos e ranking.

## Arquitetura Utilizada

O projeto segue a arquitetura clássica em camadas, com separação clara de responsabilidades.

- Controller: expõe os endpoints HTTP (rest controllers e controllers para páginas Thymeleaf). Ex.: `AutenticacaoApiController`.
  - Exemplo (trecho):

```java
@RestController
@RequestMapping("/api/autenticacao")
public class AutenticacaoApiController {
	@PostMapping("/cadastro")
	public ResponseEntity<String> cadastrar(@Valid @RequestBody RequisicaoCadastro dados) { ... }
}
```

- Service: contém a lógica de negócio. Ex.: `UsuarioService` trata cadastro, valida duplicidade de e-mail e autenticação (comparação de senha criptografada).
  - Exemplo (trecho):

```java
if (usuarioRepository.existsByEmail(dados.getEmail())) {
	throw new RegraNegocioException("O e-mail informado já está cadastrado.");
}
```

- Repository: abstrai o acesso ao banco de dados via Spring Data JPA. Ex.: `UsuarioRepository extends JpaRepository<Usuario, Long>`.

- DTO: objetos usados para entrada/saída na API (validados com Jakarta Validation). Exemplos: `RequisicaoCadastro`, `RequisicaoLogin`, `RespostaAutenticacao`.

- Model: entidades JPA que representam tabelas no banco. Ex.: `Usuario`, `Perfil`.

- Exception: tratamento centralizado de erros e regras de negócio. `RegraNegocioException` representa erros de domínio e `ManipuladorGlobalErros` converte para respostas HTTP apropriadas.

- Config: classes de configuração do Spring (segurança, beans como `PasswordEncoder`, e `CommandLineRunner` para seeders).

- Seeder: popula o banco com dados iniciais (usuário admin e um usuário de teste) via `CommandLineRunner`.

## Tecnologias Utilizadas

| Tecnologia | Versão (aprox.) | Finalidade |
|---|---:|---|
| Java | 21 | Linguagem principal |
| Spring Boot | 4.1.0 | Framework principal (inicialização, DI, web) |
| Maven | 3.x | Gerenciamento de build/dependências |
| MySQL | 8+ | Banco de dados relacional |
| Spring Data JPA / Hibernate | - | ORM para persistência |
| Spring Security | - | Autenticação e autorização |
| Jakarta Validation | - | Validação de DTOs (anotações como @NotBlank) |
| Thymeleaf | - | Template engine para páginas web |
| Lombok | - | Reduz boilerplate (getters/setters) |

> Nota: as versões exatas das dependências estão definidas no `pom.xml` do projeto.

## Requisitos de Instalação

- Java 21 (JDK)
- Maven
- MySQL 8+
- IDE recomendada: IntelliJ IDEA

## Configuração do Ambiente

1. Configure variáveis de ambiente Java e Maven (JAVA_HOME, MAVEN_HOME) conforme sua plataforma.
2. Crie um banco de dados no MySQL, por exemplo `bolao_copa_2026`.
3. Edite `src/main/resources/application.properties` com as credenciais e URL do seu banco.

Exemplo mínimo de `application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/bolao_copa_2026?useSSL=false&serverTimezone=UTC
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
server.port=8080
```

## Configuração do Banco de Dados

- Crie o schema (banco) no MySQL:

```sql
CREATE DATABASE bolao_copa_2026 CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

- Garanta que o usuário configurado no `application.properties` tenha permissões adequadas.

## Como Executar o Projeto

### Clonar repositório

```bash
git clone <URL_DO_REPOSITORIO>
cd <repositorio>
```

### Configurar banco

- Atualize `src/main/resources/application.properties` conforme mostrado acima.

### Executar aplicação

Usando Maven (modo desenvolvimento):

```bash
mvn spring-boot:run
```

Ou buildar e executar o jar:

```bash
mvn clean package -DskipTests
java -jar target/bolao-copa-2026-0.0.1-SNAPSHOT.jar
```

### Executar testes

```bash
mvn test
```

## Endpoints da API

Atualmente o projeto implementa os endpoints de autenticação (API REST) e páginas web básicas. Abaixo estão os endpoints identificados e exemplos de uso.

### Autenticação (API)

Base: `POST /api/autenticacao`

- Cadastro de usuário

Endpoint: `POST /api/autenticacao/cadastro`

Request (JSON):

```json
{
  "nome": "test1",
  "email": "test1@email.com",
  "senha": "123456"
}
```

Resposta sucesso:

HTTP 201 Created

```json
"Usuário cadastrado com sucesso!"
```

Resposta de erro (exemplo quando e-mail já existe):

HTTP 422 Unprocessable Entity

```json
{
  "erro": "O e-mail informado já está cadastrado."
}
```

- Login

Endpoint: `POST /api/autenticacao/login`

Request (JSON):

```json
{
  "email": "test1@email.com",
  "senha": "123456"
}
```

Resposta (exemplo):

HTTP 200 OK

```json
{
  "token": "SESSAO_ATIVA",
  "tipoToken": "Bearer",
  "usuarioId": 11,
  "nome": "test1",
  "perfil": "USER"
}
```

Observações:
- O token retornado hoje é um placeholder (`SESSAO_ATIVA`). Como melhoria, o projeto deve trocar por JWT real.

### Páginas web (Thymeleaf)

- Raiz: `GET /` — redireciona para `/login`.
- Login: `GET /login` — página de login (template `login.html`).
- Dashboard: `GET /dashboard` — página protegida após autenticação (template `dashboard.html`).
- Admin: `GET /admin/configuracoes` — painel administrativo (requer ROLE_ADMIN).

Exemplo de redirecionamento no controller (trecho):

```java
@GetMapping("/")
public String raiz() {
	return "redirect:/login";
}
```

## Fluxo de Autenticação

1. Cadastro (POST `/api/autenticacao/cadastro`) — envia `RequisicaoCadastro` com `nome`, `email` e `senha`.
2. Login (POST `/api/autenticacao/login`) — envia `RequisicaoLogin` com `email` e `senha`.
3. Recebimento do token: `RespostaAutenticacao` contém um campo `token` e `tipoToken`.
4. Utilização do token: para endpoints protegidos, envie o token no header `Authorization: Bearer <token>` (quando JWT real estiver implementado).

## Tratamento de Exceções

Erros de regra de negócio lançam `RegraNegocioException` e são convertidos pelo `ManipuladorGlobalErros` para HTTP 422 (Unprocessable Entity) com payload:

```json
{ "erro": "Mensagem de negócio" }
```

Validações de DTO (constraints Jakarta Validation, ex.: `@NotBlank`, `@Email`) produzem HTTP 400 (Bad Request) com um mapa campo->mensagem:

```json
{ "email": "E-mail inválido." }
```

## Segurança

O aplicativo usa Spring Security com a seguinte configuração principal (trecho):

```java
.requestMatchers("/login", "/api/autenticacao/**", "/css/**", "/js/**", "/imagens/**").permitAll()
.requestMatchers("/admin/**").hasRole("ADMIN")
.anyRequest().authenticated()
```

- As rotas de autenticação (`/api/autenticacao/**`) e assets estáticos são públicas.
- Páginas administrativas exigem ROLE_ADMIN.
- As senhas são armazenadas com `BCryptPasswordEncoder` (bean `passwordEncoder`).

## Estrutura de Pacotes

Árvore principal do projeto (resumida):

```
src/main/java/br/com/bolaocopa
├── config
│   ├── ConfiguracaoSeguranca.java
│   └── DatabaseSeeder.java
├── controller
│   ├── api
│   │   └── AutenticacaoApiController.java
│   └── web
│       └── AdminWebController.java
├── dto
│   ├── RequisicaoCadastro.java
│   ├── RequisicaoLogin.java
│   └── RespostaAutenticacao.java
├── exception
│   ├── ManipuladorGlobalErros.java
│   └── RegraNegocioException.java
├── model
│   ├── Perfil.java
│   └── Usuario.java
├── repository
│   └── UsuarioRepository.java
├── seeder
│   └── DatabaseSeeder.java
├── service
│   ├── AutenticacaoService.java
   │   └── UsuarioService.java
└── BolaoCopa2026Application.java
```

## Boas Práticas Utilizadas

- DTO Pattern para separar entrada/saída da API das entidades persistentes.
- Service Layer Pattern para isolar regras de negócio.
- Repository Pattern (Spring Data JPA) para abstração de persistência.
- Separation of Concerns entre camadas.
- Validação com Jakarta Validation para garantias de integridade na entrada.
- Tratamento centralizado de exceções via `@ControllerAdvice`.
- Uso de `PasswordEncoder` (BCrypt) para segurança de senhas.

## Melhorias Futuras

- Implementar JWT real com expiração e refresh tokens.
- Adicionar endpoints para gerenciamento de partidas e resultados.
- Implementar sistema de palpites por partida e cálculo automático de pontuação.
- Controles detalhados de grupos de bolão (convites, permissões privadas/públicas).
- Painel administrativo avançado para gerenciar usuários, partidas e resultados.

## Autor

Felipe Pestana

---

Se precisar, posso também gerar documentação OpenAPI/Swagger automaticamente, criar endpoints adicionais para partidas/palpites ou migrar o placeholder de token para JWT real. Deseja que eu gere um arquivo OpenAPI (swagger) para o projeto agora?


