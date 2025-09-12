Guia Rápido: Como Aceder à Base de Dados no Docker
Este é um manual resumido com os comandos essenciais para se conectar e consultar a sua base de dados PostgreSQL que está a ser executada num contentor Docker.

Passo 1: Entrar no Contentor
Abra um novo terminal e execute o comando abaixo para iniciar uma sessão de terminal dentro do seu contentor da base de dados.

docker exec -it meu_projeto_db sh

Passo 2: Ligar-se à Base de Dados
Uma vez dentro do contentor, use o psql para se ligar à sua base de dados específica.

psql -U meuusuario -d meubanco

O seu terminal irá mudar para meubanco=#.

Passo 3: Consultar os Dados
Agora pode executar comandos SQL para ver os seus dados. O comando mais útil é:

SELECT * FROM usuarios;

Este comando irá mostrar todos os utilizadores que foram registados através do seu site.

Como Sair
Para sair do psql, digite \q e pressione Enter.

Para sair do contentor e voltar ao seu terminal normal, digite exit e pressione Enter.exit
