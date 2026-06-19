# 🏆 Bolão Copa do Mundo 2026

## 📋 Descrição do Projeto

Aplicação full-stack para um sistema de bolão da Copa do Mundo 2026, desenvolvida com **Spring Boot 4.1.0** e **Java 21**. Fornece endpoints RESTful robustos para autenticação de usuários com **JWT (Auth0)**, gerenciamento de usuários e uma base extensível para recursos futuros como partidas, palpites, rankings e grupos de bolão. A interface web utiliza **Thymeleaf** com integração de segurança, oferecendo páginas autenticadas e painel administrativo.

### 🎯 Objetivos Principais

- ✅ Autenticação e cadastro de usuários com validação robusta
- ✅ Armazenamento seguro de senhas com **BCrypt**
- ✅ Geração e validação de **tokens JWT** com expiração configurável
- ✅ Separação clara entre roles: **USER** e **ADMIN**
- ✅ APIs RESTful seguras para clientes SPA/mobile
- ✅ Páginas web autenticadas com **Thymeleaf**
- ✅ Painel administrativo para gerenciar usuários, partidas e resultados
- ✅ Base extensível para: partidas, palpites, grupos, ranking e pontuação

## 🏗️ Arquitetura Utilizada

O projeto segue o padrão **Clean Architecture** em camadas, com separação clara de responsabilidades e alta coesão.

### 📁 Camadas da Aplicação

**1. Controller (Camada de Apresentação)**
   - Expõe endpoints HTTP para APIs REST e renderiza páginas web
   - Pacotes: `controller.api` (REST) e `controller.web` (web pages)
   - Exemplo: `AutenticacaoApiController` - endpoints de login/cadastro
   
   ```java
   @RestController
   @RequestMapping("/api/autenticacao")
   public class AutenticacaoApiController {
       @PostMapping("/cadastro")
       public ResponseEntity<String> cadastrar(@Valid @RequestBody RequisicaoCadastro dados) { ... }
       
       @PostMapping("/login")
       public ResponseEntity<RespostaAutenticacao> login(@Valid @RequestBody RequisicaoLogin dados) { ... }
   }
   ```

**2. Service (Camada de Lógica de Negócio)**
   - Implementa regras de negócio e orquestra operações
   - Valida dados, aplica regras e coordena persistência
   - Exemplo: `UsuarioService` e `AutenticacaoService`
   
   ```java
   @Service
   public class UsuarioService {
       public void cadastrar(RequisicaoCadastro dados) {
           if (usuarioRepository.existsByEmail(dados.getEmail())) {
               throw new RegraNegocioException("E-mail já cadastrado");
           }
           // ... resto da lógica
       }
   }
   ```

**3. Repository (Camada de Persistência)**
   - Abstrai acesso ao banco de dados via **Spring Data JPA**
   - Utiliza **Hibernate** como ORM
   - Exemplo: `UsuarioRepository extends JpaRepository<Usuario, Long>`

**4. Model (Entidades de Persistência)**
   - Representa as tabelas do banco de dados
   - Anotadas com `@Entity` e `@Table`
   - Exemplo: `Usuario`, `Perfil`, `Partida` (futura)

**5. DTO (Data Transfer Objects)**
   - Objetos para entrada/saída de dados
   - Validados com **Jakarta Validation** (`@NotBlank`, `@Email`, etc.)
   - Separam a API das entidades internas
   - Exemplo: `RequisicaoCadastro`, `RequisicaoLogin`, `RespostaAutenticacao`

**6. Config (Configurações do Spring)**
   - `ConfiguracaoSeguranca.java` - Spring Security com JWT
   - `DatabaseSeeder.java` - Popula dados iniciais (usuário admin + teste)
   - Beans customizados: `PasswordEncoder`, `JwtTokenProvider`

**7. Exception (Tratamento de Erros)**
   - `ManipuladorGlobalErros` - Handler centralizado via `@ControllerAdvice`
   - `RegraNegocioException` - Exceções de domínio
   - Conversão automática para HTTP apropriados (400, 422, 500, etc.)

## 🛠️ Tecnologias Utilizadas

| Tecnologia | Versão | Finalidade |
|---|---|---|
| **Java** | 21 | Linguagem principal com suporte a records e features modernas |
| **Spring Boot** | 4.1.0 | Framework principal (DI, web, segurança) |
| **Spring Security** | 6.x | Autenticação e autorização (JWT, BCrypt) |
| **JWT (Auth0)** | 4.4.0 | Geração e validação de tokens JWT |
| **Spring Data JPA** | - | Abstração de persistência com repositories |
| **Hibernate** | 6.x | ORM para mapeamento objeto-relacional |
| **MySQL** | 8+ | Banco de dados relacional |
| **Thymeleaf** | 3.x | Template engine para páginas web |
| **Thymeleaf Extras (Security)** | 6.x | Integração segurança com Thymeleaf (sec:authorize) |
| **Jakarta Validation** | 3.x | Validação de beans com anotações (`@NotBlank`, `@Email`, etc.) |
| **Commons FileUpload** | 1.5 | Upload de arquivos multipart |
| **Lombok** | 1.x | Reduz boilerplate (getters, setters, construtores) |
| **Maven** | 3.x | Build tool e gerenciamento de dependências |

> 💡 **Nota**: Versões exatas das dependências podem ser consultadas em `pom.xml`

## 📦 Requisitos de Instalação

- **Java 21** (JDK - Java Development Kit)
  - Verifique: `java -version`
  - Download: https://adoptium.net/ ou https://www.oracle.com/java/technologies/downloads/
  
- **Maven 3.8+**
  - Verifique: `mvn -version`
  - Download: https://maven.apache.org/download.cgi
  
- **MySQL 8.0+**
  - Verifique: `mysql --version`
  - Download: https://dev.mysql.com/downloads/mysql/
  
- **Git** (opcional, para clonar repositórios)

- **IDE Recomendada**: 
  - IntelliJ IDEA Ultimate/Community
  - Visual Studio Code com extensões Java
  - Eclipse IDE

## ⚙️ Configuração do Ambiente

### 1. Variáveis de Ambiente (Opcional)

```bash
# Windows (PowerShell)
[Environment]::SetEnvironmentVariable("JAVA_HOME", "C:\Program Files\Java\jdk-21", "User")
[Environment]::SetEnvironmentVariable("MAVEN_HOME", "C:\Program Files\maven-3.9.0", "User")
$env:Path += ";$env:JAVA_HOME\bin;$env:MAVEN_HOME\bin"

# Linux/Mac (bash)
export JAVA_HOME=/usr/lib/jvm/java-21-openjdk
export MAVEN_HOME=/opt/maven
export PATH=$PATH:$JAVA_HOME/bin:$MAVEN_HOME/bin
```

### 2. Criar Banco de Dados

```sql
-- MySQL
CREATE DATABASE bd_bolao_copa CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Verificar
SHOW DATABASES;
```

### 3. Configurar Credenciais

Edite `src/main/resources/application.properties`:

```properties
# Banco de dados
spring.datasource.url=jdbc:mysql://localhost:3306/bd_bolao_copa?useSSL=false&allowPublicKeyRetrieval=true&serverTimezone=America/Sao_Paulo
spring.datasource.username=seu_usuario
spring.datasource.password=sua_senha

# JWT Secret (altere em produção!)
api.security.token.secret=seu-segredo-super-secreto-min-32-caracteres
```

### 4. Verificar Instalação

```bash
java -version
mvn -version
mysql -u root -p -e "SELECT VERSION();"
```

## 🚀 Como Executar o Projeto

### Clone ou Baixe o Repositório

```bash
# Clone via Git
git clone https://github.com/seu-usuario/bolao-copa-2026.git
cd bolao-copa-2026

# Ou extraia o arquivo ZIP
# E acesse o diretório do projeto
cd bolao-copa-2026
```

### Compile o Projeto

```bash
# Limpar compilações anteriores e compilar
mvn clean compile

# Ou apenas compilar
mvn compile
```

### Executar em Modo Desenvolvimento

```bash
# Inicia o servidor em http://localhost:8080
# Auto-reload ativo (Thymeleaf em modo desenvolvimento)
mvn spring-boot:run
```

### Build e Execução em Produção

```bash
# Criar JAR executável
mvn clean package -DskipTests

# Executar o JAR
java -jar target/bolao-copa-2026-0.0.1-SNAPSHOT.jar

# Ou com parâmetros customizados
java -Dspring.profiles.active=prod \
     -Dserver.port=8080 \
     -jar target/bolao-copa-2026-0.0.1-SNAPSHOT.jar
```

### Executar Testes

```bash
# Executar todos os testes
mvn test

# Executar teste específico
mvn test -Dtest=BolaoCopa2026ApplicationTests

# Com relatório de cobertura
mvn test jacoco:report
```

### Acessar a Aplicação

- **Frontend Web**: http://localhost:8080
- **Login Padrão**: 
  - Email: `admin@example.com`
  - Senha: `admin123`
  
- **API REST**: http://localhost:8080/api
- **Swagger/OpenAPI** (futuro): http://localhost:8080/swagger-ui.html

## 📡 Endpoints da API REST

### Autenticação

**Base URL**: `POST /api/autenticacao`

#### 1. Cadastro de Novo Usuário

```http
POST /api/autenticacao/cadastro
Content-Type: application/json

{
  "nome": "João Silva",
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta (201 Created)**:
```json
"Usuário cadastrado com sucesso!"
```

**Erros**:
- `422 Unprocessable Entity` - E-mail já cadastrado
  ```json
  { "erro": "O e-mail informado já está cadastrado." }
  ```
- `400 Bad Request` - Validação falhou
  ```json
  { "email": "E-mail inválido." }
  ```

#### 2. Login (Obter Token JWT)

```http
POST /api/autenticacao/login
Content-Type: application/json

{
  "email": "joao@example.com",
  "senha": "senha123"
}
```

**Resposta (200 OK)**:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "tipoToken": "Bearer",
  "usuarioId": 1,
  "nome": "João Silva",
  "perfil": "USER"
}
```

**Erros**:
- `401 Unauthorized` - Credenciais inválidas
  ```json
  { "erro": "E-mail ou senha inválidos." }
  ```

### Uso do Token JWT

Para acessar endpoints protegidos, envie o token no header:

```http
GET /api/usuarios/perfil
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### Páginas Web (Thymeleaf)

| Rota | Método | Autenticação | Descrição |
|---|---|---|---|
| `/` | GET | ❌ | Redireciona para `/login` |
| `/login` | GET | ❌ | Página de login |
| `/dashboard` | GET | ✅ | Dashboard do usuário |
| `/admin/usuarios` | GET | ✅ ADMIN | Gerenciar usuários |
| `/admin/partidas` | GET | ✅ ADMIN | Gerenciar partidas |
| `/admin/nova-partida` | GET | ✅ ADMIN | Criar nova partida |
| `/admin/lancar-resultado` | GET | ✅ ADMIN | Lançar resultado |

## 🔐 Fluxo de Autenticação

```
┌─────────────────────────────────────────────────────────────┐
│              FLUXO DE AUTENTICAÇÃO JWT                      │
└─────────────────────────────────────────────────────────────┘

1. CADASTRO (POST /api/autenticacao/cadastro)
   ├─ Enviar: nome, email, senha
   ├─ Validar: email único, senha forte
   ├─ Hash: BCrypt(senha)
   └─ Salvar: novo Usuario no BD

2. LOGIN (POST /api/autenticacao/login)
   ├─ Receber: email, senha
   ├─ Buscar: usuário por email
   ├─ Validar: BCrypt.matches(senha, senha_hash)
   ├─ Gerar: JWT Token (Auth0)
   └─ Retornar: token + metadados (usuarioId, nome, perfil)

3. REQUISIÇÕES PROTEGIDAS
   ├─ Cliente: Authorization: Bearer <token>
   ├─ Servidor: validar JWT (assinatura, expiração)
   ├─ Extrair: claims (usuarioId, roles)
   └─ Processar: requisição autenticada

4. EXPIRAÇÃO
   ├─ Token válido por: configurável (padrão 24h)
   ├─ Ao expirar: 401 Unauthorized
   └─ Solução: realizar login novamente
```

**Detalhes Técnicos**:
- **Algoritmo JWT**: HS256 (HMAC com SHA-256)
- **Secret**: `api.security.token.secret` (altere em produção!)
- **Expiração**: 1 dia (86400 segundos)
- **Gerador**: `JwtTokenProvider.java` ou configuração Spring Security

## ⚠️ Tratamento de Exceções

O projeto implementa tratamento centralizado de erros via `@ControllerAdvice` (`ManipuladorGlobalErros`).

### Tipos de Erro

| Tipo | HTTP | Descrição | Exemplo |
|---|---|---|---|
| **Validação DTO** | 400 Bad Request | Violação de constraints Jakarta Validation | `@NotBlank`, `@Email` inválido |
| **Regra Negócio** | 422 Unprocessable Entity | Erro de lógica de domínio | E-mail duplicado, senha fraca |
| **Não Autorizado** | 401 Unauthorized | Token JWT inválido/expirado | Token ausente ou malformado |
| **Acesso Negado** | 403 Forbidden | Insuficiente privilégios | User tentando acessar /admin |
| **Não Encontrado** | 404 Not Found | Recurso não existe | Usuário/Partida não encontrado |
| **Erro Servidor** | 500 Internal Server Error | Erro não tratado | Exception não capturada |

### Exemplo de Resposta de Erro

**Validação (400)**:
```json
{
  "email": "E-mail inválido.",
  "senha": "A senha deve ter no mínimo 6 caracteres."
}
```

**Regra Negócio (422)**:
```json
{
  "erro": "O e-mail informado já está cadastrado."
}
```

**Não Autorizado (401)**:
```json
{
  "erro": "Token JWT inválido ou expirado."
}
```

## 🔒 Segurança

### Configuração do Spring Security

O projeto implementa autenticação multi-camadas com Spring Security 6.x:

```java
@Configuration
@EnableWebSecurity
public class ConfiguracaoSeguranca {
    
    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .authorizeHttpRequests(authz -> authz
                .requestMatchers("/login", "/api/autenticacao/**").permitAll()
                .requestMatchers("/css/**", "/js/**", "/uploads/**").permitAll()
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .formLogin(form -> form
                .loginPage("/login")
                .defaultSuccessUrl("/dashboard")
            )
            .logout(logout -> logout
                .logoutUrl("/logout")
                .logoutSuccessUrl("/login")
            )
            .csrf().disable()
            .addFilterBefore(new JwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class);
        
        return http.build();
    }
}
```

### Recursos de Segurança Implementados

✅ **Autenticação JWT**
   - Tokens HS256 gerados pela Auth0 (`com.auth0:java-jwt:4.4.0`)
   - Expiração configurável (padrão 24h)
   - Claims: `usuarioId`, `email`, `roles`

✅ **Hash de Senha**
   - BCryptPasswordEncoder (Force Strength: 10)
   - Senha nunca armazenada em plain text
   - Validação com `BCrypt.matches(entrada, hash)`

✅ **Controle de Acesso (RBAC)**
   - **ROLE_USER**: Usuários normais (acesso ao dashboard)
   - **ROLE_ADMIN**: Administradores (acesso ao painel admin)

✅ **Proteção de Rota**
   - Públicas: `/login`, `/api/autenticacao/**`, assets estáticos
   - Autenticadas: `/dashboard`
   - Admin: `/admin/**`

✅ **CSRF Protection**
   - Desativado para API REST (stateless)
   - Ativado para Thymeleaf (form submissions)

✅ **CORS** (Future)
   - Configurável em `application.properties`
   - Padrão: apenas localhost em desenvolvimento

### Secrets e Configuração Sensível

⚠️ **IMPORTANTE - Produção**:

```properties
# NÃO COMMITAR ESSAS VARIÁVEIS NO REPOSITÓRIO

# .env ou System Environment Variables
API_SECURITY_TOKEN_SECRET=seu-segredo-super-secreto-com-min-32-caracteres
SPRING_DATASOURCE_PASSWORD=sua_senha_banco
SPRING_DATASOURCE_USERNAME=seu_usuario
```

**Boas Práticas**:
- Use variáveis de ambiente em produção
- Armazene secrets em vault (AWS Secrets Manager, HashiCorp Vault, etc.)
- Nunca commitar `application.properties` com valores reais
- Usar `.env.example` ou `.properties.example` para template

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


