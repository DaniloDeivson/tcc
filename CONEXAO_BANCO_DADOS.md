# 🗄️ Guia de Conexão com Banco de Dados - NestFin

## 📋 Opções de Conexão

Você tem **3 opções** para conectar ao banco de dados:

### 1. 🐳 **Docker (Recomendado - Mais Fácil)**
### 2. 💻 **MySQL Local (Desenvolvimento)**
### 3. ☁️ **MySQL na Nuvem (Produção)**

---

## 🐳 Opção 1: Docker (Recomendado)

### ✅ Vantagens:
- ✅ Configuração automática
- ✅ Isolamento completo
- ✅ Fácil de gerenciar
- ✅ Sem conflitos no sistema

### 🚀 Como usar:

#### 1. **Iniciar o banco com Docker:**
```bash
# Iniciar apenas o MySQL
docker-compose up mysql -d

# Ou iniciar tudo (MySQL + Backend + Frontend)
docker-compose up -d
```

#### 2. **Verificar se está rodando:**
```bash
docker ps
```

#### 3. **Conectar ao banco:**
- **Host:** localhost
- **Porta:** 3306
- **Database:** nestfin_db
- **User:** nestfin_user
- **Password:** nestfin_pass

---

## 💻 Opção 2: MySQL Local

### 📥 **Instalação do MySQL:**

#### **Windows:**
1. Baixe o MySQL Installer: https://dev.mysql.com/downloads/installer/
2. Execute o instalador
3. Escolha "MySQL Server" e "MySQL Workbench"
4. Configure a senha do root

#### **Linux (Ubuntu/Debian):**
```bash
sudo apt update
sudo apt install mysql-server
sudo mysql_secure_installation
```

#### **macOS:**
```bash
brew install mysql
brew services start mysql
```

### 🔧 **Configuração:**

#### 1. **Criar o banco de dados:**
```sql
CREATE DATABASE nestfin_db;
CREATE USER 'nestfin_user'@'localhost' IDENTIFIED BY 'nestfin_pass';
GRANT ALL PRIVILEGES ON nestfin_db.* TO 'nestfin_user'@'localhost';
FLUSH PRIVILEGES;
```

#### 2. **Atualizar appsettings.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=nestfin_db;user=nestfin_user;password=nestfin_pass"
  }
}
```

---

## ☁️ Opção 3: MySQL na Nuvem

### 🌐 **Provedores Recomendados:**

#### **AWS RDS:**
- Serviço gerenciado
- Alta disponibilidade
- Backup automático

#### **Google Cloud SQL:**
- Integração com GCP
- Escalabilidade automática
- Monitoramento avançado

#### **Azure Database:**
- Integração com Azure
- Segurança avançada
- Compliance automático

### 🔧 **Configuração na Nuvem:**

#### 1. **Criar instância MySQL:**
- Escolher região próxima
- Configurar senha forte
- Liberar porta 3306

#### 2. **Atualizar appsettings.json:**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=seu-servidor.mysql.database.azure.com;port=3306;database=nestfin_db;user=seu_usuario;password=sua_senha;SslMode=Required"
  }
}
```

---

## 🔧 Configuração Atual do Projeto

### 📁 **Arquivo: backend/appsettings.json**
```json
{
  "ConnectionStrings": {
    "DefaultConnection": "server=localhost;port=3306;database=nestfin_db;user=root;password=Amordemae2602"
  }
}
```

### 🐳 **Arquivo: docker-compose.yml**
```yaml
mysql:
  image: mysql:8.0
  environment:
    MYSQL_ROOT_PASSWORD: suasenha
    MYSQL_DATABASE: nestfin_db
    MYSQL_USER: nestfin_user
    MYSQL_PASSWORD: nestfin_pass
  ports:
    - "3306:3306"
```

---

## 🚀 Como Conectar Agora

### **Método 1: Docker (Mais Fácil)**

```bash
# 1. Iniciar o banco
docker-compose up mysql -d

# 2. Verificar se está rodando
docker ps

# 3. Executar migrações
cd backend
dotnet ef database update

# 4. Iniciar o backend
dotnet run
```

### **Método 2: MySQL Local**

```bash
# 1. Instalar MySQL (se não tiver)
# 2. Criar banco e usuário
# 3. Atualizar appsettings.json
# 4. Executar migrações
cd backend
dotnet ef database update

# 5. Iniciar o backend
dotnet run
```

---

## 🔍 Verificar Conexão

### **Teste 1: Via Código**
```csharp
// No Program.cs, adicionar:
app.MapGet("/test-db", async (ApplicationDbContext context) => {
    try {
        await context.Database.CanConnectAsync();
        return "✅ Banco conectado com sucesso!";
    } catch (Exception ex) {
        return $"❌ Erro: {ex.Message}";
    }
});
```

### **Teste 2: Via MySQL Workbench**
- Host: localhost
- Port: 3306
- Username: nestfin_user
- Password: nestfin_pass
- Database: nestfin_db

### **Teste 3: Via Terminal**
```bash
# Conectar via linha de comando
mysql -h localhost -P 3306 -u nestfin_user -p nestfin_db
```

---

## 🛠️ Solução de Problemas

### **Erro: "Unable to connect to any of the specified MySQL hosts"**
```bash
# Verificar se MySQL está rodando
docker ps | grep mysql

# Reiniciar se necessário
docker-compose restart mysql
```

### **Erro: "Access denied for user"**
```bash
# Verificar credenciais no appsettings.json
# Testar conexão manual
mysql -u nestfin_user -p
```

### **Erro: "Database does not exist"**
```bash
# Criar banco manualmente
docker exec -it nestfin-mysql mysql -u root -p
CREATE DATABASE nestfin_db;
```

### **Erro: "Port 3306 is already in use"**
```bash
# Parar outros serviços MySQL
sudo service mysql stop

# Ou usar porta diferente
# Alterar no docker-compose.yml: "3307:3306"
```

---

## 📊 Ferramentas Recomendadas

### **MySQL Workbench**
- Interface gráfica oficial
- Gerenciamento visual
- Query builder
- Modelagem de dados

### **DBeaver**
- Gratuito e open-source
- Suporte a múltiplos bancos
- Interface moderna
- Funcionalidades avançadas

### **phpMyAdmin**
- Interface web
- Fácil de usar
- Gerenciamento completo
- Backup/restore

---

## 🎯 Recomendação Final

### **Para Desenvolvimento:**
🐳 **Use Docker** - Mais fácil e isolado

### **Para Produção:**
☁️ **Use AWS RDS** - Mais seguro e escalável

### **Para Testes:**
💻 **Use MySQL Local** - Mais rápido para testes

---

**Escolha a opção que melhor se adapta ao seu ambiente! 🚀**



