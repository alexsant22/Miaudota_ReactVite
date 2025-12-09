# Miaudota - Plataforma de Adoção de Pets

Miaudota é uma aplicação web completa projetada para conectar animais de estimação que precisam de um lar com pessoas que desejam adotar. A plataforma permite o cadastro de pets, visualização de detalhes, interesse em adoção e gerenciamento de favoritos.

## 🚀 Funcionalidades

*   **Autenticação de Usuários**: Registro e login de usuários para acessar funcionalidades exclusivas.
*   **Listagem de Pets**: Visualize todos os pets disponíveis para adoção com filtros por espécie, gênero, porte e localização.
*   **Detalhes do Pet**: Informações detalhadas sobre cada pet, incluindo fotos, descrição, saúde e temperamento.
*   **Favoritos**: Salve os pets que você mais gostou para visualizar depois.
*   **Interesse em Adoção**: Envie um formulário demonstrando interesse em adotar um pet específico.
*   **Gerenciamento de Perfil**: Atualize suas informações pessoais.

## 🛠️ Tecnologias Utilizadas

O projeto é dividido em **Frontend** e **Backend**:

### Frontend
*   **React** (com Vite): Biblioteca para construção da interface do usuário.
*   **Tailwind CSS**: Framework CSS utilitário para estilização rápida e responsiva.
*   **React Router**: Gerenciamento de rotas e navegação.
*   **Axios**: Cliente HTTP para comunicação com o backend.
*   **React Icons & Toastify**: Ícones e notificações para melhor experiência do usuário.

### Backend
*   **Node.js**: Ambiente de execução JavaScript.
*   **Express**: Framework web rápido e minimalista.
*   **MySQL**: Banco de dados relacional para armazenar usuários, pets e adoções.
*   **MySQL2**: Cliente MySQL para Node.js.
*   **Bcryptjs**: Hash de senhas para segurança.
*   **Cors**: Middleware para permitir requisições de diferentes origens.

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado em sua máquina:
*   [Node.js](https://nodejs.org/) (versão 18 ou superior recomendada)
*   [MySQL](https://www.mysql.com/) (Servidor de banco de dados rodando)

## 🔧 Instalação e Configuração

Siga os passos abaixo para rodar o projeto localmente.

### 1. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/miaudota.git
cd miaudota
```

### 2. Configurar o Backend

1.  Acesse a pasta do backend:
    ```bash
    cd backend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Configure as variáveis de ambiente:
    Crie um arquivo `.env` na raiz da pasta `backend` com as configurações do seu banco de dados MySQL (ou use os valores padrão definidos no código):

    ```env
    PORT=3001
    DB_HOST=localhost
    DB_USER=root
    DB_PASSWORD=sua_senha_mysql
    DB_NAME=miaudota
    DB_PORT=3306
    ```
    *Nota: Se você não criar o arquivo `.env`, o sistema tentará usar as credenciais padrão (`root`/`root`).*

4.  Inicialize o Banco de Dados:
    Este comando cria o banco de dados `miaudota`, as tabelas necessárias e popula com dados de exemplo.
    ```bash
    npm run init-db
    ```

5.  Inicie o servidor backend:
    ```bash
    npm run dev
    # ou para produção: npm start
    ```
    O servidor estará rodando em `http://localhost:3001`.

### 3. Configurar o Frontend

1.  Abra um novo terminal e acesse a pasta do frontend:
    ```bash
    cd frontend
    ```

2.  Instale as dependências:
    ```bash
    npm install
    ```

3.  Inicie a aplicação frontend:
    ```bash
    npm run dev
    ```
    A aplicação estará disponível geralmente em `http://localhost:5173`.

## 📚 Documentação da API

O backend fornece os seguintes endpoints principais:

*   **Autenticação**:
    *   `POST /api/auth/register`: Criar conta.
    *   `POST /api/auth/login`: Entrar na conta.
    *   `GET /api/auth/profile/:id`: Obter perfil do usuário.
*   **Pets**:
    *   `GET /api/pets`: Listar pets (suporta filtros).
    *   `GET /api/pets/:id`: Detalhes de um pet.
    *   `POST /api/pets`: Cadastrar um novo pet.
*   **Favoritos**:
    *   `POST /api/favorites`: Adicionar aos favoritos.
    *   `GET /api/favorites/user/:userId`: Listar favoritos do usuário.
*   **Adoção**:
    *   `POST /api/adoption/interest`: Registrar interesse em um pet.

Para verificar se a API está online, acesse: `http://localhost:3001/api/health`.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

## 📄 Licença

Este projeto está sob a licença MIT.
