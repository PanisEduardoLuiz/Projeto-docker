/*
  ======================================================
  ARQUIVO DE LÓGICA DO TEMA (tema/theme.js)
  ======================================================
  Este script controla a troca entre o tema claro e escuro
  e salva a preferência do usuário no navegador.
*/

// Garante que o DOM esteja completamente carregado antes de executar o script.
document.addEventListener('DOMContentLoaded', () => {
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const body = document.body;

    // Se o botão de tema não existir na página atual, o script não faz mais nada.
    if (!themeToggleBtn) {
        return;
    }

    // 1. VERIFICAR TEMA SALVO AO CARREGAR A PÁGINA
    // Pega o tema salvo no localStorage do navegador.
    const currentTheme = localStorage.getItem('theme');

    // Se o tema salvo for 'dark', aplica a classe e atualiza o ícone.
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeToggleBtn.innerHTML = '☀️'; // Ícone de sol
    } else {
        themeToggleBtn.innerHTML = '🌙'; // Ícone de lua
    }

    // 2. ADICIONAR EVENTO DE CLIQUE AO BOTÃO
    themeToggleBtn.addEventListener('click', () => {
        // Adiciona ou remove a classe 'dark-mode' do body.
        body.classList.toggle('dark-mode');

        let theme = 'light'; // Por padrão, o tema a ser salvo é 'light'.
        
        // Verifica se o body AGORA TEM a classe 'dark-mode'.
        if (body.classList.contains('dark-mode')) {
            theme = 'dark'; // Se tiver, o tema a ser salvo é 'dark'.
            themeToggleBtn.innerHTML = '☀️'; // Atualiza o ícone para sol.
        } else {
            themeToggleBtn.innerHTML = '🌙'; // Senão, atualiza para lua.
        }
        
        // Salva a preferência ('light' ou 'dark') no localStorage.
        localStorage.setItem('theme', theme);
    });
});