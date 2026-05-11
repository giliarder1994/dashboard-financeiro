# 💰 Dashboard Financeiro - API REST

API REST para gerenciamento financeiro pessoal, permitindo controle de receitas, despesas, categorias e autenticação de usuários.
Desenvolvida com **Node.js**, **Express** e **MySQL**, utilizando autenticação JWT e organização em camadas para manter o código escalável e de fácil manutenção.

---

## 🚀 Tecnologias

* **Node.js** — Ambiente de execução JavaScript
* **Express** — Framework web para APIs REST
* **MySQL** — Banco de dados relacional
* **mysql2** — Driver MySQL para Node.js
* **JWT (JSON Web Token)** — Autenticação segura
* **bcrypt** — Criptografia de senhas
* **dotenv** — Gerenciamento de variáveis de ambiente
* **cors** — Liberação de acesso entre aplicações

---

## 📁 Estrutura do Projeto

```bash id="i89rt2"
src/
 ├── controllers/      # Regras das requisições HTTP
 ├── middlewares/      # Autenticação JWT e tratamento de erros
 ├── routes/           # Endpoints da aplicação
 ├── db.js             # Configuração da conexão MySQL
 └── app.js            # Inicialização do servidor Express

criarTabelas.js        # Script de criação das tabelas do banco
package.json
```

---

## ⚙️ Funcionalidades

### 🔐 Autenticação de Usuários

* Cadastro de usuário
* Login com JWT
* Atualização de perfil
* Alteração de senha com validação

### 📂 Categorias

* Criar categorias
* Listar categorias
* Atualizar categorias
* Remover categorias

### 💸 Transações Financeiras

* Cadastro de receitas e despesas
* Listagem com paginação
* Filtro por tipo
* Atualização e exclusão de transações

### 📊 Relatórios Financeiros

* Resumo financeiro:

  * Total de receitas
  * Total de despesas
  * Saldo geral
* Relatório mensal dos últimos meses

---

## 🗄️ Estrutura do Banco de Dados

O sistema possui 3 tabelas principais:

### 👤 Usuários

Armazena informações de autenticação e perfil.

### 📁 Categorias

Categorias personalizadas por usuário:

* Receita
* Despesa

### 💰 Transações

Registro das movimentações financeiras vinculadas às categorias.

---

## ⚙️ Como rodar localmente

### 1. Clone o repositório

```bash id="a1b2c3"
git clone https://github.com/seu-usuario/dashboard-financeiro.git

cd dashboard-financeiro
```

---

### 2. Instale as dependências

```bash id="q8w7e6"
npm install
```

---

### 3. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto:

```env id="m4n5b6"
PORT=3000

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=dashboard_financeiro
DB_PORT=3306

JWT_SECRET=sua_chave_secreta
```

---

### 4. Crie as tabelas do banco

```bash id="x9y8z7"
npm run criar-tabelas
```

---

### 5. Inicie o servidor

### Ambiente de desenvolvimento

```bash id="d5f6g7"
npm run dev
```

### Ambiente normal

```bash id="h1j2k3"
npm start
```

Servidor disponível em:

👉 [http://localhost:3000](http://localhost:3000)

---

# 📋 Principais Rotas

## 🔐 Autenticação

| Método | Rota          | Descrição          |
| ------ | ------------- | ------------------ |
| POST   | /cadastrar    | Criar conta        |
| POST   | /login        | Autenticar usuário |
| GET    | /perfil       | Buscar perfil      |
| PUT    | /perfil       | Atualizar nome     |
| PUT    | /perfil/senha | Atualizar senha    |

---

## 📂 Categorias

| Método | Rota            | Descrição           |
| ------ | --------------- | ------------------- |
| GET    | /categorias     | Listar categorias   |
| POST   | /categorias     | Criar categoria     |
| PUT    | /categorias/:id | Atualizar categoria |
| DELETE | /categorias/:id | Remover categoria   |

---

## 💸 Transações

| Método | Rota               | Descrição           |
| ------ | ------------------ | ------------------- |
| GET    | /transacoes        | Listar transações   |
| GET    | /transacoes/resumo | Resumo financeiro   |
| GET    | /transacoes/mensal | Relatório mensal    |
| POST   | /transacoes        | Criar transação     |
| PUT    | /transacoes/:id    | Atualizar transação |
| DELETE | /transacoes/:id    | Remover transação   |

---

## 🔒 Segurança

A API utiliza:

* Senhas criptografadas com **bcrypt**
* Autenticação via **JWT**
* Rotas protegidas por middleware
* Validações básicas de entrada de dados

---

## 📈 Recursos Implementados

* Arquitetura em camadas
* Middleware global de erros
* Paginação de resultados
* Filtro por tipo de transação
* Relatórios financeiros agregados
* Relacionamento entre usuários, categorias e transações

---

## 👨‍💻 Autor

Desenvolvido por **Giliarde Rodrigues**

Estudante de Engenharia de Software focado em desenvolvimento Back-end com Node.js, APIs REST e bancos relacionais.
