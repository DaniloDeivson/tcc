# ⚠️ Passo Inicial: Instale as Dependências

Antes de começar a desenvolver, instale as dependências do frontend e backend:

```bash
# Frontend
cd web
npm install

# Backend
cd backend
dotnet restore
```

---

# 📁 Documentação da Estrutura do Projeto NestFin

## Visão Geral

Este documento descreve a organização e estrutura de pastas do projeto full-stack NestFin, que utiliza Next.js para o frontend e ASP.NET Core para o backend.

## 🏗️ Arquitetura Geral

```
Project_NestFin/
├── web/                 # Frontend Next.js
├── backend/             # Backend ASP.NET Core
├── docker-compose.yml   # Orquestração de containers
├── .gitignore          # Arquivos ignorados pelo Git
└── README.md           # Documentação principal
```

---

## 🎨 Frontend (Next.js) - `/web`

### Estrutura de Pastas

```
web/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── layout.tsx         # Layout principal da aplicação (RootLayout)
│   │   └── page.tsx           # Página inicial (dashboard/tab principal)
│   │
│   ├── components/            # Componentes React organizados por domínio/função
│   │   ├── ui/                # Componentes de UI básicos e reutilizáveis (design system)
│   │   │   ├── button.tsx         # Botão customizado (shadcn/ui)
│   │   │   ├── icon.tsx           # Wrapper para Material Icons
│   │   │   ├── avatar.tsx         # Avatar de usuário
│   │   │   └── ...                # Outros componentes de UI (inputs, modals, etc.)
│   │   ├── forms/             # Formulários reutilizáveis (ex: LoginForm, RegisterForm)
│   │   ├── layout/            # Componentes de layout (Header, Footer, DashboardTabs, etc.)
│   │   │   ├── Header.tsx         # Cabeçalho fixo com navegação e notificações
│   │   │   ├── Footer.tsx         # Rodapé padronizado
│   │   │   ├── DashboardTabs.tsx  # Tabs para navegação entre dashboards
│   │   │   └── TitleDashboard.tsx # Título e subtítulo do dashboard
│   │   ├── dashboard/         # Dashboards e widgets principais
│   │   │   ├── PatrimonioDashboard.tsx      # Dashboard de patrimônio líquido (com gráfico)
│   │   │   ├── ContaCorrenteDashboard.tsx   # Dashboard de conta corrente (com gráfico e tabela)
│   │   │   ├── PoupancaDashboard.tsx        # Dashboard de poupança (com gráfico)
│   │   │   └── RecentTransactionsTable.tsx  # Tabela de transações recentes
│   │   ├── metas/               # Componentes relacionados a metas financeiras
│   │   │   └── Metas.tsx        # Tela principal de metas (adicionar, listar, etc.)
│   │   └── charts/              # Componentes de gráficos customizados (separados dos dashboards)
│   │
│   ├── hooks/                # Custom hooks React (ex: useAuth, useApi, useLocalStorage)
│   ├── lib/                  # Bibliotecas utilitárias e integrações externas
│   │   └── utils.ts          # Funções utilitárias (ex: cn para className)
│   ├── utils/                # Helpers e funções utilitárias específicas do projeto
│   ├── types/                # Definições TypeScript (interfaces, tipos, enums)
│   ├── styles/               # Estilos globais e configurações CSS
│   │   └── globals.css       # Estilos globais com Tailwind
│   └── public/               # Arquivos estáticos (imagens, ícones, etc.)
│
├── package.json              # Dependências e scripts do projeto
├── next.config.js            # Configuração do Next.js
├── tailwind.config.js        # Configuração do Tailwind CSS
├── postcss.config.js         # Configuração do PostCSS
├── tsconfig.json             # Configuração do TypeScript
└── Dockerfile                # Containerização do frontend
```

### Estrutura Detalhada do Frontend (`/web`)

```
web/
├── src/
│   ├── app/                    # App Router (Next.js 14)
│   │   ├── layout.tsx         # Layout principal da aplicação (RootLayout)
│   │   └── page.tsx           # Página inicial (dashboard/tab principal)
│   │
│   ├── components/            # Componentes React organizados por domínio/função
│   │   ├── ui/                # Componentes de UI básicos e reutilizáveis (design system)
│   │   │   ├── button.tsx         # Botão customizado (shadcn/ui)
│   │   │   ├── icon.tsx           # Wrapper para Material Icons
│   │   │   ├── avatar.tsx         # Avatar de usuário
│   │   │   └── ...                # Outros componentes de UI (inputs, modals, etc.)
│   │   ├── forms/             # Formulários reutilizáveis (ex: LoginForm, RegisterForm)
│   │   ├── layout/            # Componentes de layout (Header, Footer, DashboardTabs, etc.)
│   │   │   ├── Header.tsx         # Cabeçalho fixo com navegação e notificações
│   │   │   ├── Footer.tsx         # Rodapé padronizado
│   │   │   ├── DashboardTabs.tsx  # Tabs para navegação entre dashboards
│   │   │   └── TitleDashboard.tsx # Título e subtítulo do dashboard
│   │   ├── dashboard/         # Dashboards e widgets principais
│   │   │   ├── PatrimonioDashboard.tsx      # Dashboard de patrimônio líquido (com gráfico)
│   │   │   ├── ContaCorrenteDashboard.tsx   # Dashboard de conta corrente (com gráfico e tabela)
│   │   │   ├── PoupancaDashboard.tsx        # Dashboard de poupança (com gráfico)
│   │   │   └── RecentTransactionsTable.tsx  # Tabela de transações recentes
│   │   ├── metas/               # Componentes relacionados a metas financeiras
│   │   │   └── Metas.tsx        # Tela principal de metas (adicionar, listar, etc.)
│   │   └── charts/              # Componentes de gráficos customizados (separados dos dashboards)
│   │
│   ├── hooks/                # Custom hooks React (ex: useAuth, useApi, useLocalStorage)
│   ├── lib/                  # Bibliotecas utilitárias e integrações externas
│   │   └── utils.ts          # Funções utilitárias (ex: cn para className)
│   ├── utils/                # Helpers e funções utilitárias específicas do projeto
│   ├── types/                # Definições TypeScript (interfaces, tipos, enums)
│   ├── styles/               # Estilos globais e configurações CSS
│   │   └── globals.css       # Estilos globais com Tailwind
│   └── public/               # Arquivos estáticos (imagens, ícones, etc.)
│
├── package.json              # Dependências e scripts do projeto
├── next.config.js            # Configuração do Next.js
├── tailwind.config.js        # Configuração do Tailwind CSS
├── postcss.config.js         # Configuração do PostCSS
├── tsconfig.json             # Configuração do TypeScript
└── Dockerfile                # Containerização do frontend
```

---

#### 📁 Detalhamento das Pastas

- **/app/**

  - layout.tsx: Define o layout global (head, fontes, estilos globais).
  - page.tsx: Página principal, controla o estado das tabs/dashboards/metas.

- **/components/ui/**

  - Design System: Botões, ícones, avatares, inputs, modais, etc.
  - Reutilizáveis: Usados em qualquer parte do projeto.

- **/components/layout/**

  - Header.tsx: Cabeçalho fixo, navegação, botão de notificações, integração com modal.
  - Footer.tsx: Rodapé centralizado, links institucionais.
  - DashboardTabs.tsx: Tabs para alternar entre dashboards.
  - TitleDashboard.tsx: Título e subtítulo dinâmicos conforme a tab.

- **/components/dashboard/**

  - PatrimonioDashboard.tsx: Card com valor, variação e gráfico de barras.
  - ContaCorrenteDashboard.tsx: Card com valor, gráfico de barras e tabela de transações.
  - PoupancaDashboard.tsx: Card com valor, variação e gráfico de barras.
  - RecentTransactionsTable.tsx: Tabela de transações recentes, visual escuro.

- **/components/metas/**

  - Metas.tsx: Tela principal de metas, com botão para adicionar, lista de metas atuais e alcançadas.

- **/components/charts/**

  - Gráficos customizados: Caso queira separar componentes de gráficos puros dos dashboards.

- **/hooks/**

  - useAuth.ts: Hook de autenticação.
  - useApi.ts: Hook para requisições.
  - useLocalStorage.ts: Hook para persistência local.

- **/lib/**

  - utils.ts: Funções utilitárias globais (ex: cn para className).

- **/utils/**

  - Helpers: Funções utilitárias específicas do domínio do projeto.

- **/types/**

  - TypeScript: Interfaces, tipos, enums globais.

- **/styles/**

  - globals.css: Estilos globais, customizações do Tailwind.

- **/public/**
  - Imagens, ícones, favicons: Arquivos estáticos acessíveis publicamente.

---

### 🧩 Boas Práticas

- **Componentização**: Separe componentes por domínio/função para facilitar manutenção e escalabilidade.
- **Reutilização**: Use a pasta `ui/` para tudo que pode ser reaproveitado em várias telas.
- **Expansão**: Se precisar de mais áreas (ex: relatórios, perfil), crie novas pastas em `components/`.
- **Hooks**: Centralize lógica reutilizável em `hooks/`.
- **Types**: Defina todos os tipos e interfaces em `types/` para tipagem forte e autocompletar.

---

## ⚙️ Backend (ASP.NET Core) - `/backend`

### Estrutura de Pastas Atualizada

```
backend/
├── Controllers/                # Controllers da API REST
│   ├── AuthController.cs      # Autenticação e registro
│   ├── PersonalController.cs  # Gestão de informações pessoais
│   └── UsersController.cs     # CRUD de usuários com padrão repository
│
├── Models/                    # Modelos do Entity Framework
│   ├── Goal.cs               # Modelo de metas financeiras
│   ├── PersonalInfo.cs       # Modelo de informações pessoais
│   └── User.cs               # Modelo de usuário
│
├── Data/                      # Camada de acesso a dados
│   └── ApplicationDbContext.cs # Contexto do Entity Framework com configurações
│
├── Services/                  # Lógica de negócio
│   ├── Interfaces/           # Interfaces dos serviços
│   │   └── IUserService.cs   # Interface do serviço de usuários
│   └── UserService.cs        # Implementação do serviço de usuários
│
├── Repositories/             # Padrão Repository
│   ├── Interfaces/          # Interfaces dos repositories
│   │   ├── IBaseRepository.cs  # Interface base genérica
│   │   └── IUserRepository.cs  # Interface do repository de usuários
│   ├── BaseRepository.cs     # Implementação base genérica
│   └── UserRepository.cs     # Implementação do repository de usuários
│
├── Middleware/               # Middlewares customizados
├── Extensions/               # Extensões de métodos
├── Configurations/           # Configurações da aplicação
├── Migrations/               # Migrações do Entity Framework
│   ├── 20250827054417_InitialCreate.cs
│   └── 20250827083425_AddPersonalAndGoals.cs
│
├── Program.cs               # Configuração da aplicação, DI e JWT
├── appsettings.json        # Configurações (connection strings, etc.)
├── NestFin.API.csproj      # Arquivo de projeto .NET
└── Dockerfile              # Containerização do backend
```

### Propósito de Cada Pasta

#### `/Controllers/`

- Controllers da API REST
- Endpoints HTTP (GET, POST, PUT, DELETE)
- Validação de entrada e retorno de respostas

#### `/Models/`

- Entidades do Entity Framework
- Representação das tabelas do banco de dados
- Anotações de validação e relacionamentos

#### `/Data/`

- Contexto do Entity Framework
- Configuração do banco de dados
- DbSets e configurações de modelo

#### `/Services/`

- Lógica de negócio da aplicação
- Regras de negócio complexas
- Integração com serviços externos

#### `/DTOs/`

- Data Transfer Objects
- Objetos para transferência de dados entre camadas
- Separação entre modelos de domínio e API

#### `/Repositories/`

- Padrão Repository
- Abstração do acesso a dados
- Operações CRUD reutilizáveis

#### `/Middleware/`

- Middlewares customizados
- Autenticação, logging, tratamento de erros
- Pipeline de requisições HTTP

#### `/Extensions/`

- Extensões de métodos
- Métodos de extensão para classes existentes
- Utilitários para configuração de serviços

#### `/Configurations/`

- Classes de configuração
- Mapeamento de configurações do appsettings.json
- Configurações de serviços

#### `/Migrations/`

- Migrações do Entity Framework
- Controle de versão do banco de dados
- Scripts de criação e alteração de tabelas

---

## 🐳 DevOps e Containerização

### Arquivos de Configuração

#### `docker-compose.yml`

- Orquestração de todos os serviços
- MySQL, Backend e Frontend
- Redes e volumes compartilhados

#### `Dockerfile` (Frontend)

- Containerização do Next.js
- Build otimizado para produção
- Configuração de segurança

#### `Dockerfile` (Backend)

- Containerização do ASP.NET Core
- Build multi-stage para otimização
- Configuração de runtime

#### `.gitignore`

- Arquivos e pastas ignorados pelo Git
- Configurações específicas para .NET e Node.js
- Arquivos temporários e de build

---

## 🚀 Como Usar

### Desenvolvimento Local

1. **Instalar dependências do frontend:**

   ```bash
   cd web
   npm install
   ```

2. **Configurar o backend:**

   ```bash
   cd backend
   dotnet restore
   dotnet build
   ```

3. **Executar com Docker:**
   ```bash
   docker-compose up -d
   ```

### URLs de Desenvolvimento

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger
- **MySQL**: localhost:3306

---

## 📋 Convenções de Nomenclatura

### Frontend

- **Componentes**: PascalCase (ex: `UserCard.tsx`)
- **Hooks**: camelCase com prefixo "use" (ex: `useAuth.ts`)
- **Utilitários**: camelCase (ex: `formatCurrency.ts`)
- **Tipos**: PascalCase (ex: `UserType.ts`)

### Backend

- **Controllers**: PascalCase + "Controller" (ex: `UsersController.cs`)
- **Models**: PascalCase (ex: `User.cs`)
- **Services**: PascalCase + "Service" (ex: `UserService.cs`)
- **DTOs**: PascalCase + "DTO" (ex: `UserDTO.cs`)

---

## 🔧 Configurações Importantes

### Frontend

- **Next.js 14** com App Router
- **TypeScript** para tipagem estática
- **Tailwind CSS** para estilização
- **Path mapping** configurado para imports limpos

### Backend

- **ASP.NET Core 8.0**
- **Entity Framework Core** com MySQL
- **AutoMapper** para mapeamento de objetos
- **Swagger** para documentação da API
- **JWT** para autenticação

---

## 📝 Próximos Passos

1. ✅ **Implementar autenticação JWT** - Concluído
2. ✅ **Criar mais modelos de dados** - Concluído (User, PersonalInfo, Goal)
3. ✅ **Implementar validações básicas** - Concluído
4. ✅ **Implementar padrão Repository** - Concluído
5. ✅ **Implementar camada de Serviço** - Concluído
6. **Adicionar testes unitários**
7. **Configurar CI/CD**
8. **Implementar logging**
9. **Adicionar monitoramento**
10. **Melhorar tratamento de erros**

---

## 🎨 Mudanças Recentes (Última Atualização)

### Frontend - Implementações do Dia

#### ✅ Componentes UI (shadcn/ui)

- **Button Component**: Implementado com class-variance-authority
- **Variantes**: default, destructive, outline, secondary, ghost, link
- **Tamanhos**: default, sm, lg, icon
- **Integração**: Radix UI Slot para composição
- **Icon Component**: Wrapper para Material Icons do Google Fonts
- **Variantes de Ícones**: filled, outlined, round
- **Tamanhos de Ícones**: sm, md, lg, xl

#### ✅ Header Component

- **Localização**: `/components/layout/Header.tsx`
- **Tema**: Escuro (#122112) com bordas brancas
- **Navegação**: Dashboard e Metas com ícones
- **Responsivo**: Layout adaptável
- **Integração**: Usa Button e Icon components do shadcn/ui
- **Ícones**: account_balance, dashboard, flag, login

#### ✅ Página Principal

- **Tema**: Fundo escuro (#122112) em toda a aplicação
- **Layout**: Flexbox com altura mínima de tela
- **Header**: Integrado na página principal

#### ✅ Utilitários

- **cn function**: Implementada em `/lib/utils.ts`
- **Class merging**: Para combinação de classes CSS
- **Tailwind**: Integração otimizada

### Design System

- **Cores**: Tema escuro consistente
- **Tipografia**: Texto branco sobre fundo escuro
- **Componentes**: Reutilizáveis e consistentes
- **Responsividade**: Mobile-first approach

---

_Esta documentação deve ser atualizada conforme o projeto evolui._
