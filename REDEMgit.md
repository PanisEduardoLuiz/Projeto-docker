Guia Rápido: Como Atualizar Seu Projeto no GitHub
Siga estes passos no terminal, na pasta raiz do seu projeto, para enviar as suas últimas alterações para o GitHub.

Passo 1: Verifique as Alterações (Opcional, mas recomendado)
Este comando mostra quais ficheiros foram modificados desde o seu último "save" (commit). É ótimo para ter a certeza do que você está a enviar.

git status

Passo 2: Adicione Todas as Alterações
Este comando prepara todos os ficheiros modificados e novos para serem guardados no seu próximo "ponto de salvamento". O ponto . significa "tudo nesta pasta".

git add .

Passo 3: Salve as Alterações Localmente (Commit)
Crie um novo "ponto de salvamento" com uma mensagem que descreva o que você fez. É uma boa prática ser claro nas suas mensagens.

git commit -m "Adiciona página inicial e corrige ícone"

(Use uma mensagem que faça sentido para as alterações que você fez.)

Passo 4: Envie as Alterações para o GitHub (Push)
Este é o comando final que envia os seus "pontos de salvamento" locais para o seu repositório online no GitHub.

Como você já configurou a ligação com o comando -u da primeira vez, agora só precisa de usar o comando simples:

git push
