# Sistema de Controle de Gastos Residenciais

Aplicação full stack para controle de gastos residenciais, permitindo o cadastro de pessoas, categorias e transações (receitas e despesas), além da geração de relatórios consolidados por pessoa e por categoria.

O projeto foi desenvolvido com foco em organização de código, separação de responsabilidades, regras de negócio claras e facilidade de execução.

---

## 🧩 Visão Geral

O sistema é composto por:

- **Back-end**: API REST em ASP.NET Core com Entity Framework Core e SQLite
- **Front-end**: Aplicação React com Vite
- **Banco de dados**: SQLite
- **Infraestrutura**: Docker e Docker Compose

Todo o ambiente pode ser executado com **um único comando**, sem necessidade de configuração manual.

---

## 🚀 Funcionalidades

### Pessoas
- Cadastro de pessoas
- Listagem de pessoas
- Exclusão de pessoas

### Categorias
- Cadastro de categorias
- Classificação por finalidade (Despesa, Receita ou Ambas)
- Listagem de categorias

### Transações
- Cadastro de transações (receitas e despesas)
- Associação com pessoa e categoria
- Validações de regras de negócio
- Listagem do histórico de transações

### Relatórios
- Relatório consolidado por pessoa
- Relatório consolidado por categoria
- Totais de receitas, despesas e saldo líquido

---

## 🛠️ Tecnologias Utilizadas

### Back-end
- ASP.NET Core
- Entity Framework Core
- SQLite
- Swagger
- Middleware de tratamento global de exceções

### Front-end
- React
- TypeScript
- Vite
- Axios

### Infra
- Docker
- Docker Compose

---

## 📁 Estrutura do Projeto

````
/
├── ControleDeGastosResidencias.Api   # API ASP.NET Core
│   ├── Controllers
│   ├── Services
│   ├── Models
│   ├── DTOs
│   ├── Data
│   ├── Middlewares
│   └── Migrations
│
├── controle-gastos-front             # Front-end React
│   ├── src
│   ├── public
│   └── vite.config.ts
│
├── docker-compose.yml
└── README.md

````

---

## ▶️ Como Executar o Projeto

### Pré-requisitos
- Docker
- Docker Compose

### Passo único para executar

Na raiz do projeto, execute:

```bash
docker compose up --build
````

Esse comando irá:

* Subir a API
* Subir o front-end
* Criar o banco SQLite automaticamente
* Aplicar as migrations do Entity Framework
* Deixar o sistema pronto para uso

---

## 🌐 Acessos

Após subir os containers:

* **Front-end**:
  👉 [http://localhost:5173](http://localhost:5173)

* **API (Swagger)**:
  👉 [http://localhost:5000/swagger](http://localhost:5000/swagger)

---

## 🗄️ Banco de Dados

* O banco de dados utilizado é **SQLite**
* As tabelas são criadas automaticamente no startup da aplicação
* Não é necessário executar comandos manuais de migration

---

## ⚠️ Observações Técnicas

* As regras de negócio estão concentradas na camada de **Services**
* Controllers atuam apenas como intermediários HTTP
* O tratamento de erros é feito por um **middleware global**, garantindo respostas padronizadas
* DTOs são utilizados para evitar exposição direta das entidades

---

## 📌 Padrões e Boas Práticas

* Separação clara de responsabilidades
* Validações de negócio fora do controller
* Uso de DTOs para entrada e saída
* Commits semânticos
* Código organizado para fácil manutenção e evolução

---

