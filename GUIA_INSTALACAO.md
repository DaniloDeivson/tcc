# 🚀 Guia de Instalação - Projeto NestFin

## ⚠️ Pré-requisitos Necessários

Para executar o projeto NestFin, você precisa instalar as seguintes ferramentas:

### 1. Node.js (para o Frontend)
- **Download**: https://nodejs.org/
- **Versão recomendada**: 18.x ou superior
- **Verificação**: Após instalar, execute `node --version` no terminal

### 2. .NET 8.0 SDK (para o Backend)
- **Download**: https://dotnet.microsoft.com/download/dotnet/8.0
- **Versão**: .NET 8.0 SDK
- **Verificação**: Após instalar, execute `dotnet --version` no terminal

### 3. Docker Desktop (opcional, mas recomendado)
- **Download**: https://www.docker.com/products/docker-desktop/
- **Verificação**: Após instalar, execute `docker --version` no terminal

## 📋 Passos de Instalação

### Passo 1: Instalar Node.js
1. Acesse https://nodejs.org/
2. Baixe a versão LTS (recomendada)
3. Execute o instalador
4. Reinicie o terminal/PowerShell
5. Verifique com: `node --version` e `npm --version`

### Passo 2: Instalar .NET 8.0 SDK
1. Acesse https://dotnet.microsoft.com/download/dotnet/8.0
2. Baixe o SDK para Windows
3. Execute o instalador
4. Reinicie o terminal/PowerShell
5. Verifique com: `dotnet --version`

### Passo 3: Instalar Docker Desktop (opcional)
1. Acesse https://www.docker.com/products/docker-desktop/
2. Baixe o Docker Desktop para Windows
3. Execute o instalador
4. Reinicie o computador se necessário
5. Verifique com: `docker --version`

## 🚀 Após a Instalação

Depois de instalar todas as ferramentas, execute os seguintes comandos:

### Opção 1: Desenvolvimento Local (Recomendado)

```bash
# 1. Instalar dependências do frontend
cd web
npm install

# 2. Instalar dependências do backend
cd ../backend
dotnet restore

# 3. Executar migrações do banco
dotnet ef database update

# 4. Iniciar o backend
dotnet run

# 5. Em outro terminal, iniciar o frontend
cd web
npm run dev
```

### Opção 2: Docker (Mais simples)

```bash
# Executar tudo com Docker
docker-compose up -d
```

## 🌐 URLs de Acesso

Após iniciar os serviços:

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:5000
- **Swagger**: http://localhost:5000/swagger
- **MySQL**: localhost:3306

## 🔧 Configurações Importantes

### Banco de Dados
- **Host**: localhost
- **Porta**: 3306
- **Database**: nestfin_db
- **User**: root
- **Password**: Amordemae2602

### JWT Settings
- **Secret**: sua_chave_secreta_muito_longa_aqui
- **Issuer**: NestFin
- **Audience**: NestFinUsers
- **Expiration**: 60 minutos

## 🆘 Solução de Problemas

### Erro: "npm não é reconhecido"
- Verifique se o Node.js foi instalado corretamente
- Reinicie o terminal/PowerShell
- Verifique se o Node.js está no PATH do sistema

### Erro: "dotnet não é reconhecido"
- Verifique se o .NET SDK foi instalado corretamente
- Reinicie o terminal/PowerShell
- Verifique se o .NET está no PATH do sistema

### Erro: "docker não é reconhecido"
- Verifique se o Docker Desktop foi instalado corretamente
- Reinicie o computador se necessário
- Verifique se o Docker está rodando

## 📞 Próximos Passos

Após instalar as ferramentas, volte aqui e eu ajudarei você a:

1. ✅ Instalar dependências
2. ✅ Configurar banco de dados
3. ✅ Executar migrações
4. ✅ Iniciar todos os serviços
5. ✅ Verificar funcionamento

---

**Instale as ferramentas necessárias e depois me avise para continuarmos!** 🚀
