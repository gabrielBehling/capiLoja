# capiLoja — Capibara Store

> **Capibara Store** é uma aplicação web de e-commerce desenvolvida com Node.js e TypeScript, focada na venda de produtos naturais. O nome é uma referência à capivara (*Hydrochoerus hydrochaeris*), animal símbolo do Brasil.

---

## Sumário

1. [Visão Geral](#visão-geral)
2. [Funcionalidades](#funcionalidades)
3. [Arquitetura](#arquitetura)
4. [Estrutura de Pastas](#estrutura-de-pastas)
5. [Modelo de Dados](#modelo-de-dados)
6. [Rotas da API](#rotas-da-api)
7. [Componentes Principais](#componentes-principais)
8. [Tecnologias e Dependências](#tecnologias-e-dependências)
9. [Configuração do Ambiente](#configuração-do-ambiente)
10. [Executando o Projeto](#executando-o-projeto)
11. [Segurança](#segurança)
12. [Diagrama de Fluxo](#diagrama-de-fluxo)
13. [Contribuição](#contribuição)
14. [Licença](#licença)

---

## Visão Geral

O **capiLoja** é uma loja virtual fullstack que permite a clientes navegarem, avaliarem e comprarem produtos naturais diretamente de vendedores cadastrados. A aplicação adota o padrão **MVC (Model-View-Controller)** com renderização server-side via templates Mustache e persistência em Microsoft SQL Server.

### Objetivos do Projeto

- Fornecer uma plataforma de e-commerce simples e segura
- Permitir que usuários se cadastrem tanto como **compradores** quanto como **vendedores**
- Gerenciar catálogo de produtos com sistema de avaliações
- Processar compras e manter histórico de pedidos

---

## Funcionalidades

| Funcionalidade | Status |
|---|---|
| Cadastro e login de usuários | ✅ Implementado |
| Navegação de produtos | ✅ Implementado |
| Página de vendedores | ✅ Implementado |
| Sistema de autenticação com cookies | ✅ Implementado |
| Avaliação de produtos | 🗄️ Modelo no banco |
| Carrinho de compras | 🗄️ Modelo no banco |
| Histórico de compras | 🗄️ Modelo no banco |

---

## Arquitetura

A aplicação segue o padrão **MVC (Model-View-Controller)** com a seguinte divisão de responsabilidades:

```
┌─────────────────────────────────────────────────────┐
│                    Cliente (Browser)                │
└───────────────────────┬─────────────────────────────┘
                        │ HTTP Request
                        ▼
┌─────────────────────────────────────────────────────┐
│                   Express Server                    │
│                  (src/server.ts)                    │
│  ┌──────────┐  ┌──────────┐  ┌───────────────────┐ │
│  │  Helmet  │  │  Cookie  │  │   Body Parser     │ │
│  │(security)│  │  Parser  │  │ (form data)       │ │
│  └──────────┘  └──────────┘  └───────────────────┘ │
└───────────────────────┬─────────────────────────────┘
                        │
              ┌─────────▼──────────┐
              │      Routers       │
              │  ┌──────────────┐  │
              │  │  /           │  │
              │  │  /login      │  │
              │  │  /register   │  │
              │  │  /products   │  │
              │  │  /sellers    │  │
              │  └──────────────┘  │
              └─────────┬──────────┘
                        │
              ┌─────────▼──────────┐
              │    Controllers     │
              │  pageController    │
              │  userController    │
              └──────┬──────┬──────┘
                     │      │
              ┌──────▼──┐ ┌─▼────────┐
              │  Views  │ │  Models  │
              │Mustache │ │  User.ts │
              │Templates│ └────┬─────┘
              └─────────┘      │
                         ┌─────▼──────┐
                         │  Database  │
                         │ SQL Server │
                         └────────────┘
```

### Decisões de Design

**Por que Express.js?**
Express é um framework minimalista e amplamente utilizado para Node.js, com ecossistema maduro e suporte a middleware, facilitando a implementação de funcionalidades como autenticação, parsing de formulários e segurança.

**Por que Mustache para templates?**
Mustache é um template engine *logic-less* (sem lógica), que incentiva a separação de apresentação e lógica de negócio. Isso garante que as views não contenham código de negócio, mantendo a arquitetura MVC limpa.

**Por que Microsoft SQL Server?**
O MSSQL oferece suporte nativo a *triggers* e *stored procedures*, utilizados para manter a consistência dos dados (ex: atualização automática do total de compras e score de produtos).

**Por que TypeScript?**
TypeScript adiciona tipagem estática ao JavaScript, reduzindo erros em tempo de execução e melhorando a experiência de desenvolvimento com autocomplete e detecção precoce de bugs.

---

## Estrutura de Pastas

```
capiLoja/
├── public/                     # Arquivos estáticos servidos diretamente
│   ├── index.html              # Página principal estática
│   ├── styles.css              # Estilos globais
│   └── img/                   # Imagens e ícones
│
├── src/                        # Código-fonte TypeScript
│   ├── server.ts               # Ponto de entrada da aplicação
│   │
│   ├── routes/                 # Definição de rotas
│   │   ├── index.ts            # Rotas principais (/, /login, /register)
│   │   ├── products.ts         # Rotas de produtos (/products)
│   │   └── sellers.ts          # Rotas de vendedores (/sellers)
│   │
│   ├── controllers/            # Lógica de controle
│   │   ├── pageController.ts   # Renderização de páginas
│   │   └── userController.ts   # Autenticação e cadastro de usuários
│   │
│   ├── models/                 # Modelos de dados e acesso ao banco
│   │   └── User.ts             # Modelo de usuário (verificação de senha)
│   │
│   ├── database/               # Configuração do banco de dados
│   │   ├── database.ts         # Pool de conexões MSSQL
│   │   └── script.sql          # Script de criação do banco de dados
│   │
│   └── views/                  # Templates Mustache
│       └── pages/
│           ├── home.mustache
│           ├── login.mustache
│           ├── register.mustache
│           ├── products.mustache
│           ├── product.mustache
│           ├── sellers.mustache
│           ├── seller.mustache
│           └── 404.mustache
│
├── package.json                # Dependências e scripts npm
├── package-lock.json           # Lock file de dependências
└── .gitignore
```

---

## Modelo de Dados

O banco de dados `capiLoja` é composto pelas seguintes tabelas:

### Diagrama Entidade-Relacionamento

```
┌───────────────────────┐         ┌─────────────────────────┐
│        Client         │         │          Item            │
├───────────────────────┤         ├─────────────────────────┤
│ idClient (PK)         │◄──┐     │ idItem (PK)             │
│ UserName (unique)     │   │     │ itemName                │
│ ClientName            │   │     │ itemDescription         │
│ email (unique)        │   │     │ price                   │
│ passwordHash          │   │     │ score (auto-calculated) │
│ phone (unique)        │   │     │ idSeller (FK→Client)    │──┐
│ isSeller (bit)        │   │     └─────────────────────────┘  │
│ birthDate             │   │                                   │
└───────────────────────┘   │     ┌─────────────────────────┐  │
                             │     │       Avaliation         │  │
┌───────────────────────┐   │     ├─────────────────────────┤  │
│       Purchase         │   │     │ idAvaliation (PK)       │  │
├───────────────────────┤   │     │ score (1-255)           │  │
│ idPurchase (PK)        │   │     │ comment                 │  │
│ purchaseDatetime       │   ├─────│ idClient (FK)           │  │
│ purchaseArrival        │   │     │ idItem (FK)             │──┘
│ totalValue (auto-calc) │   │     └─────────────────────────┘
│ idClient (FK→Client)  │───┘
└───────────────────────┘     ┌─────────────────────────┐
             │                │          Sale            │
             │                ├─────────────────────────┤
             └────────────────│ idSale (PK)             │
                              │ quantity (default 1)    │
                              │ idItem (FK→Item)        │
                              │ idPurchase (FK)         │
                              └─────────────────────────┘
```

### Tabelas

#### `Client`
Representa todos os usuários da plataforma (compradores e vendedores).

| Coluna | Tipo | Descrição |
|---|---|---|
| `idClient` | `INT IDENTITY` | Chave primária auto-incremental |
| `UserName` | `VARCHAR(50)` | Nome de usuário único para login |
| `ClientName` | `VARCHAR(50)` | Nome de exibição do usuário |
| `email` | `VARCHAR(100)` | E-mail único do usuário |
| `passwordHash` | `VARCHAR(16)` | Hash da senha (bcrypt) |
| `phone` | `VARCHAR(20)` | Telefone único (opcional) |
| `isSeller` | `BIT` | Flag que indica se é vendedor (padrão: 0) |
| `birthDate` | `DATE` | Data de nascimento (opcional) |

#### `Item`
Representa os produtos disponíveis na loja.

| Coluna | Tipo | Descrição |
|---|---|---|
| `idItem` | `INT IDENTITY` | Chave primária auto-incremental |
| `itemName` | `VARCHAR(50)` | Nome do produto |
| `itemDescription` | `VARCHAR(200)` | Descrição do produto |
| `price` | `DECIMAL(10,2)` | Preço unitário |
| `score` | `DECIMAL(3,2)` | Nota média (calculada por trigger) |
| `idSeller` | `INT` | FK para o vendedor (Client) |

#### `Avaliation`
Avaliações feitas por clientes sobre produtos.

| Coluna | Tipo | Descrição |
|---|---|---|
| `idAvaliation` | `INT IDENTITY` | Chave primária |
| `score` | `TINYINT` | Nota (1 a 255) |
| `comment` | `VARCHAR(200)` | Comentário opcional |
| `idClient` | `INT` | FK para o avaliador |
| `idItem` | `INT` | FK para o produto avaliado |

#### `Purchase`
Cabeçalho de uma compra realizada por um cliente.

| Coluna | Tipo | Descrição |
|---|---|---|
| `idPurchase` | `INT IDENTITY` | Chave primária |
| `purchaseDatetime` | `DATETIME` | Data/hora da compra |
| `purchaseArrival` | `DATETIME` | Previsão de chegada (opcional) |
| `totalValue` | `DECIMAL(10,2)` | Valor total (atualizado por trigger) |
| `idClient` | `INT` | FK para o comprador |

#### `Sale`
Itens individuais de uma compra (linha de pedido).

| Coluna | Tipo | Descrição |
|---|---|---|
| `idSale` | `INT IDENTITY` | Chave primária |
| `quantity` | `INT` | Quantidade do item (padrão: 1) |
| `idItem` | `INT` | FK para o produto |
| `idPurchase` | `INT` | FK para a compra |

### Triggers

#### `TRG_updateTotal`
Executado após `INSERT`, `UPDATE` ou `DELETE` na tabela `Sale`. Recalcula automaticamente o `totalValue` de uma `Purchase` somando `(quantidade × preço)` de todos os itens.

#### `TRG_updateItemScore`
Executado após `INSERT`, `UPDATE` ou `DELETE` na tabela `Avaliation`. Recalcula a nota média (`score`) de um `Item` com base em todas as avaliações existentes.

---

## Rotas da API

### Rotas Principais (`/`)

| Método | Caminho | Controlador | Descrição |
|---|---|---|---|
| `GET` | `/` | `pageController.getHome` | Página inicial |
| `GET` | `/login` | `userController.getLogin` | Formulário de login |
| `POST` | `/login` | `userController.postLogin` | Autenticação do usuário |
| `GET` | `/register` | `userController.getRegister` | Formulário de cadastro |
| `POST` | `/register` | `userController.postRegister` | Criação de conta |

### Rotas de Produtos (`/products`)

| Método | Caminho | Controlador | Descrição |
|---|---|---|---|
| `GET` | `/products` | `pageController.getProducts` | Lista de produtos |
| `GET` | `/products/:id` | `pageController.getProduct` | Detalhes de um produto |

### Rotas de Vendedores (`/sellers`)

| Método | Caminho | Controlador | Descrição |
|---|---|---|---|
| `GET` | `/sellers` | `pageController.getSellers` | Lista de vendedores |
| `GET` | `/sellers/:id` | `pageController.getSeller` | Perfil de um vendedor |

---

## Componentes Principais

### `src/server.ts`

Ponto de entrada da aplicação. Configura todos os middlewares e inicializa o servidor:

```typescript
// Segurança HTTP headers
server.use(helmet());

// Servir arquivos estáticos
server.use(express.static(path.join(__dirname, "../public")));

// Template engine Mustache
server.set("view engine", "mustache");
server.engine("mustache", mustache());

// Parsing de cookies e formulários
server.use(cookieParser());
server.use(bodyParser.urlencoded({ extended: true }));

// Rotas
server.use(mainRouter);
server.use("/products", productsRouter);
server.use("/sellers", sellersRouter);

// Fallback 404
server.use((req, res) => res.render("pages/404"));

server.listen(process.env.PORT);
```

> **Referência**: `src/server.ts`

### `src/database/database.ts`

Gerencia o pool de conexões com o Microsoft SQL Server usando a biblioteca `mssql`. A função `getDatabase()` reutiliza o pool caso já esteja inicializado:

```typescript
export async function getDatabase() {
  if (pool) {
    return await pool.connect();
  }
  var pool = new sql.ConnectionPool(config);
  return await pool.connect();
}
```

> **Referência**: `src/database/database.ts`

As credenciais são carregadas via variáveis de ambiente (arquivo `.env`): `DB_USER`, `DB_PASSWORD`, `DB_SERVER`, `DB_DATABASE`.

### `src/models/User.ts`

Modelo responsável pela autenticação. Busca o hash da senha do usuário no banco e compara com a senha fornecida usando **bcrypt**:

```typescript
export async function checkUser(username, password): Promise<boolean> {
  let db = await getDatabase();
  let res = await db.query`select ClientName, passwordHash from Client
                            where UserName=${username}`;
  if (!res.recordset.length) return false;

  let hash = res.recordset[0].passwordHash;
  return await bcrypt.compare(password, hash);
}
```

> **Referência**: `src/models/User.ts`

> ⚠️ A query utiliza template literals do `mssql` para **prevenir SQL Injection** automaticamente.

### `src/controllers/userController.ts`

Gerencia o fluxo de autenticação. Após login bem-sucedido, armazena `username` e `password` em cookies `httpOnly` com validade de 30 dias.

> **Referência**: `src/controllers/userController.ts`

### `src/controllers/pageController.ts`

Controller responsável pela renderização de todas as páginas de navegação (home, produtos, vendedores). Não possui acesso direto ao banco — apenas repassa dados do request para as views.

> **Referência**: `src/controllers/pageController.ts`

---

## Tecnologias e Dependências

### Dependências de Produção

| Pacote | Versão | Finalidade |
|---|---|---|
| `express` | `^4.22.1` | Framework web HTTP |
| `mssql` | `^11.0.1` | Driver Microsoft SQL Server |
| `bcrypt` | `^5.1.1` | Hashing seguro de senhas |
| `helmet` | `^7.2.0` | Segurança via headers HTTP |
| `mustache-express` | `^1.3.2` | Template engine Mustache para Express |
| `cookie-parser` | `^1.4.7` | Parsing de cookies HTTP |
| `body-parser` | `^1.20.4` | Parsing de corpo de requisições |
| `dotenv` | `^16.6.1` | Carregamento de variáveis de ambiente |

### Dependências de Desenvolvimento

| Pacote | Versão | Finalidade |
|---|---|---|
| `typescript` | `^5.9.3` | Compilador TypeScript |
| `tsx` | `^4.21.0` | Execução TypeScript sem compilação prévia |
| `@types/express` | `^5.0.6` | Tipos TypeScript para Express |
| `@types/mssql` | `^9.1.11` | Tipos TypeScript para mssql |
| `@types/node` | `^22.19.17` | Tipos TypeScript para Node.js |

---

## Configuração do Ambiente

### Pré-requisitos

- **Node.js** v18 ou superior
- **Microsoft SQL Server** (local ou remoto, ex: Azure SQL)
- **npm** v9 ou superior

### Instalação

```bash
# Clone o repositório
git clone https://github.com/gabrielBehling/capiLoja.git
cd capiLoja

# Instale as dependências
npm install
```

### Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto com as seguintes variáveis:

```env
PORT=8000

DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_SERVER=localhost
DB_DATABASE=capiLoja
```

| Variável | Descrição |
|---|---|
| `PORT` | Porta em que o servidor será iniciado |
| `DB_USER` | Usuário do SQL Server |
| `DB_PASSWORD` | Senha do usuário do SQL Server |
| `DB_SERVER` | Host/endereço do servidor SQL Server |
| `DB_DATABASE` | Nome do banco de dados |

### Criação do Banco de Dados

Execute o script SQL no seu SQL Server Management Studio (SSMS) ou via `sqlcmd`:

```bash
sqlcmd -S localhost -U sa -P sua_senha -i src/database/script.sql
```

O script (`src/database/script.sql`) irá:
1. Criar o banco de dados `capiLoja`
2. Criar as tabelas `Client`, `Item`, `Avaliation`, `Purchase` e `Sale`
3. Criar os triggers `TRG_updateTotal` e `TRG_updateItemScore`

---

## Executando o Projeto

```bash
# Modo de desenvolvimento (com hot-reload via tsx --watch)
npm start
```

O servidor será iniciado na porta definida em `PORT` (padrão: `8000`).

Acesse: [http://localhost:8000](http://localhost:8000)

---

## Segurança

### Medidas Implementadas

| Medida | Implementação |
|---|---|
| **Headers HTTP seguros** | `helmet` configura headers como `X-Frame-Options`, `X-Content-Type-Options`, `Strict-Transport-Security`, etc. |
| **Hash de senha** | `bcrypt` com fator de custo padrão — senhas nunca são armazenadas em texto plano |
| **SQL Injection Prevention** | Template literals do `mssql` parametrizam automaticamente todas as queries |
| **Cookies HttpOnly** | Cookies de sessão com flag `httpOnly: true` — inacessíveis via JavaScript |
| **Arquivos estáticos isolados** | Servidos diretamente do diretório `/public`, sem acesso ao código-fonte |

### Considerações de Segurança

> ⚠️ **Atenção**: A implementação atual armazena a senha em plaintext dentro de um cookie (`res.cookie("password", password)`). Isso representa um risco de segurança. Em produção, recomenda-se utilizar sessões server-side (ex: `express-session`) ou tokens JWT, nunca armazenando credenciais no cliente.

---

## Diagrama de Fluxo

### Fluxo de Autenticação (Login)

```
Usuário                 Express Server              SQL Server
   │                         │                          │
   │─── POST /login ─────────►│                          │
   │    {username, password}  │                          │
   │                         │──── SELECT passwordHash ─►│
   │                         │     WHERE UserName=?      │
   │                         │◄─── recordset ────────────│
   │                         │                          │
   │                         │── bcrypt.compare() ──┐   │
   │                         │                      │   │
   │                         │◄─── boolean ─────────┘   │
   │                         │                          │
   │◄── Set-Cookie: username ─│  (se válido)             │
   │◄── Set-Cookie: password  │                          │
   │◄── 302 Redirect: / ──────│                          │
```

### Fluxo de Requisição de Página

```
Browser                 Express                  Template
   │                       │                      Engine
   │─── GET /products ─────►│                        │
   │                       │── res.render() ─────────►│
   │                       │   "pages/products"       │
   │                       │◄── HTML gerado ──────────│
   │◄── 200 HTML ──────────│                          │
```

---

## Contribuição

1. Faça um fork do repositório
2. Crie uma branch para sua feature: `git checkout -b feature/minha-feature`
3. Faça commit das suas alterações: `git commit -m 'feat: adiciona minha feature'`
4. Envie para o branch: `git push origin feature/minha-feature`
5. Abra um Pull Request

---

## Licença

Este projeto está licenciado sob a licença **ISC**. Veja o arquivo `package.json` para mais detalhes.

---

<p align="center">
  <em>Feito com ☕ e capivaras 🦫</em>
</p>
