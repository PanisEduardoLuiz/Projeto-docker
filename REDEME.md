Manual de Execução do Projeto (Ambiente Híbrido)
Este guia explica de forma resumida como instalar as dependências e executar o projeto de Login e Cadastro, que utiliza uma abordagem de desenvolvimento híbrida.

Arquitetura do Projeto
Base de Dados (PostgreSQL): Roda de forma isolada e estável dentro de um contentor Docker.

Backend (Node.js): Roda localmente ("na mão") para desenvolvimento ágil.

Frontend (HTML/CSS): Roda localmente através de um servidor simples.

1. Pré-requisitos (Instalação das Dependências)
Antes de começar, garanta que tem as seguintes ferramentas instaladas na sua máquina.

Docker: Para executar o contentor da base de dados.

Git: Para clonar o projeto.

Node.js e npm (via NVM): Para executar o backend e o servidor do frontend. Se não tiver, instale com os seguintes comandos no terminal:

# Instala o NVM (gestor de versões do Node)
curl -o- [https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh](https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh) | bash

# Feche e reabra o seu terminal

# Instala e usa a versão 20 do Node.js
nvm install 20
nvm use 20

Servidor serve: Para o frontend. Instale globalmente com:

sudo npm install -g serve

2. Configuração Inicial do Projeto
Clone o Projeto:

git clone [https://github.com/PanisEduardoLuiz/Projeto-docker.git](https://github.com/PanisEduardoLuiz/Projeto-docker.git)
cd Projeto-docker

Crie o Ficheiro de Ambiente: Na raiz do projeto, crie um ficheiro chamado .env e adicione o seguinte conteúdo:

POSTGRES_USER=meuusuario
POSTGRES_PASSWORD=minhasenha_super_secreta
POSTGRES_DB=meubanco

Instale as Dependências do Backend:

# Navegue até à pasta do backend
cd backend

# Instale os pacotes necessários
npm install

3. Execução do Projeto (Processo de 3 Terminais)
Você precisará de três terminais abertos em simultâneo.

Terminal 1: Iniciar a Base de Dados
Pasta: Raiz do projeto (~/Área de trabalho/Projeto)

Comando:

docker compose up

Objetivo: Inicia o contentor do PostgreSQL. Deixe este terminal aberto.

Terminal 2: Iniciar o Backend
Pasta: backend (~/Área de trabalho/Projeto/backend)

Comando:

node -r dotenv/config server.js dotenv_config_path=../.env

Objetivo: Inicia a sua API Node.js na porta 3000. Deixe este terminal aberto.

Terminal 3: Iniciar o Frontend
Pasta: frontend (~/Área de trabalho/Projeto/frontend)

Comando:

serve -p 8080

Objetivo: Inicia o servidor que mostra as suas páginas HTML na porta 8080. Deixe este terminal aberto.

4. Aceder à Aplicação
Com os três terminais a funcionar, o seu projeto está totalmente no ar.

URL de Acesso: Abra o seu navegador e vá para http://localhost:8080

5. Como Parar o Projeto
Nos Terminais 2 e 3, pressione Ctrl + C para parar os servidores do backend e frontend.

No Terminal 1, pressione Ctrl + C e depois execute o seguinte comando para parar e remover o contentor da base de dados:

docker compose down
