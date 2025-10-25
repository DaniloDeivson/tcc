# 📘 Documentação do Projeto Full-Stack da NestFin

## Stack: Next.js, C# (.NET), MySQL e AWS

## Sumário Executivo

Este documento descreve a arquitetura, tecnologias, estrutura de pastas e estratégia de deploy para o projeto full-stack da NestFin:

- Frontend Web: Next.js
- Backend: C# com [ASP.NET](http://asp.net/) Core
- Banco de Dados: MySQL
- Infraestrutura: AWS (Amplify, RDS, Elastic Beanstalk/App Runner, etc.)

## 1. Arquitetura do Sistema

- Next.js → [ASP.NET](http://asp.net/) Core → MySQL (AWS RDS)
- Frontend hospedado no Amplify
- Backend no App Runner ou Elastic Beanstalk

## 2. Tecnologias Utilizadas

| Componente | Tecnologia                      | Versão | Documentação                                                              |
| ---------- | ------------------------------- | ------ | ------------------------------------------------------------------------- |
| Frontend   | Next.js                         | v14    | [nextjs.org/docs](http://nextjs.org/docs)                                 |
| Backend    | [ASP.NET](http://asp.net/) Core | 8.0    | [learn.microsoft.com/aspnet/core](http://learn.microsoft.com/aspnet/core) |
| Banco      | MySQL                           | 8.0+   | [dev.mysql.com/doc](http://dev.mysql.com/doc)                             |
| ORM        | Entity Framework                | 8.0    | [learn.microsoft.com/ef/core](http://learn.microsoft.com/ef/core)         |
| Infra      | AWS                             | -      | [aws.amazon.com](http://aws.amazon.com/)                                  |

## 3. Estrutura de Diretórios

nestfin/
├── web/ # Frontend Next.js
├── backend/ # Backend [ASP.NET](http://asp.net/) Core
├── [README.md](http://readme.md/) # Documentação

## 4. Backend em C# ([ASP.NET](http://asp.net/) Core)

Pacotes:

- Pomelo.EntityFrameworkCore.MySql
- Microsoft.EntityFrameworkCore.Design

Configuração: appsettings.json

```json
"ConnectionStrings": {
  "DefaultConnection": "server=localhost;port=3306;database=nestfin_db;user=root;password=suasenha"
}

```

Modelo:

```csharp
public class User {
  public int Id { get; set; }
  public string Name { get; set; }
  public string Email { get; set; }
}

```

Controller:

```csharp
[HttpGet]
public async Task<IActionResult> Get() => Ok(await _context.Users.ToListAsync());

```

## 5. Comunicação Frontend-Backend

Next.js (exemplo de chamada à API):

```tsx
useEffect(() => {
  fetch("<https://api.seudominio.com/api/users>")
    .then((res) => res.json())
    .then(setUsers);
}, []);
```

## 6. Deploy na AWS

Frontend:

- AWS Amplify conectado ao GitHub

Backend:

- App Runner ou Elastic Beanstalk com Dockerfile

MySQL:

- Amazon RDS
- Porta 3306 liberada para backend

## 7. Segurança

- AWS Secrets Manager
- HTTPS em todas as rotas
- JWT para autenticação
- Rate limiting
- AWS WAF

## 8. CI/CD

- GitHub Actions para deploy do frontend (Amplify)
- Docker + deploy no App Runner
- Migrations automáticas via EF Core
