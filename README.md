# 📝 To-Do List Fullstack

Um sistema de lista de tarefas completo desenvolvido para praticar a integração entre um Frontend em React, um Backend em Node.js e um Banco de Dados MySQL.

## 🚀 Funcionalidades

- **Adicionar Tarefas:** Registro de novas tarefas com limite de 55 caracteres.
- **Formatação Automática:** O sistema coloca a primeira letra de cada tarefa em maiúsculo automaticamente.
- **Edição Direta:** É possível editar o texto de uma tarefa clicando no botão "Editar" e pressionando "Enter" para salvar.
- **Status de Conclusão:** Marque tarefas como feitas e visualize o horário exato em que foram finalizadas.
- **Validação de Texto:** Aviso visual caso o texto ultrapasse o limite permitido de caracteres.
- **Persistência de Dados:** Todas as informações são salvas e lidas de um banco de dados relacional.
- **Segurança:** Uso de variáveis de ambiente (.env) para esconder as credenciais do banco de dados.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React.js (Hooks: useState, useEffect).
- **Backend:** Node.js, Express.
- **Banco de Dados:** MySQL.
- **Comunicação:** API Rest com suporte a CORS e Dotenv.

## 🏁 Como Rodar o Projeto

### 1. Preparação do Banco de Dados
Certifique-se de ter o MySQL instalado. No seu terminal MySQL ou Workbench, execute:

```sql
CREATE DATABASE to_do_list;

USE to_do_list;

CREATE TABLE tarefas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    texto VARCHAR(55) NOT NULL,
    concluida BOOLEAN DEFAULT FALSE,
    concluida_em VARCHAR(50)
);
2. Configuração do Servidor (Backend)
Navegue até a pasta do projeto pelo terminal.

Instale as dependências necessárias:

Bash
npm install
Crie um arquivo chamado .env na raiz do projeto e preencha com seus dados:

Snippet de código
DB_HOST=localhost
DB_USER=seu_usuario_do_mysql
DB_PASS=sua_senha_do_mysql
DB_NAME=to_do_list
Inicie o servidor:

Bash
npm start
3. Configuração do React (Frontend)
Certifique-se de que o backend está rodando (geralmente na porta 3000).

Em um novo terminal (na pasta do frontend), rode:

Bash
npm start
📁 Estrutura de Arquivos Principais
server.js: Arquivo principal do backend com as rotas (GET, POST, PUT, PATCH, DELETE).

Dashboard.jsx: Componente React contendo toda a interface e lógica de consumo da API.

.gitignore: Configurado para não enviar a pasta node_modules e o arquivo .env para o GitHub.

.env: Armazena as senhas e acessos ao banco de dados localmente.

Desenvolvido por Zíltom para fins de estudo em desenvolvimento Fullstack.