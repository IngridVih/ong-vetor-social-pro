// js/router.js
import * as App from './app.js'; // Importa todas as nossas funções

// Função de navegação que será passada para o form de cadastro
const navigateTo = (path) => {
    history.pushState(null, null, path);
    loadPage(path);
};

// 1. Define as rotas e os templates
const routes = {
    '/': { 
        path: 'templates/inicio.html', 
        title: 'Vetor Social - Início', 
        init: () => {
            App.renderHomeProjects();
            App.renderTestimonials();
            App.initCarousel();
        }
    },
    '/sobre': { 
        path: 'templates/sobre.html', 
        title: 'Sobre Nós - Vetor Social', 
        init: () => {}
    },
    '/projetos': { 
        path: 'templates/projetos.html', 
        title: 'Projetos - Vetor Social', 
        init: () => {
            App.renderAllProjects(); // Renderiza TODOS os projetos e inicia o filtro
        }
    },
    '/contato': { 
        path: 'templates/contato.html', 
        title: 'Contato - Vetor Social', 
        init: () => {
            App.initContatoForm(); // Inicia a lógica do modal
        }
    },
    '/cadastro': { 
        path: 'templates/cadastro.html', 
        title: 'Cadastro - Vetor Social', 
        init: () => {
            App.initCadastroForm(navigateTo); // Passa a função de navegar
        }
    },
    '/cadastro-sucesso': { 
        path: 'templates/cadastro-sucesso.html', 
        title: 'Cadastro Realizado - Vetor Social', 
        init: () => {} 
    },
    '/doar': { 
        path: 'templates/doar.html', 
        title: 'Doação - Vetor Social', 
        init: () => {
            App.initDoacaoForm(); // Inicia a lógica do form de doação
        }
    },
    '/404': { 
        path: 'templates/404.html', 
        title: 'Página Não Encontrada', 
        init: () => {}
    }
};

// 2. Função para carregar o conteúdo da página
const loadPage = async (path) => {
    const cleanPath = path.split('?')[0] || '/';
    const route = routes[cleanPath] || routes['/404'];

    const response = await fetch(route.path);
    const html = await response.text();

    const appRoot = document.getElementById('app-root');
    appRoot.innerHTML = html;
    document.title = route.title;

    // --- MELHORIA DE ACESSIBILIDADE ---
    // 1. Encontra o novo título principal (h1 ou h2)
    const newMainHeading = appRoot.querySelector('h1, h2');
    if (newMainHeading) {
        // 2. Torna-o "focável"
        newMainHeading.setAttribute('tabindex', '-1');
        // 3. Move o foco do leitor de tela para ele
        newMainHeading.focus();
    } else {
        // Se não houver título, foca no próprio <main>
        appRoot.setAttribute('tabindex', '-1');
        appRoot.focus();
    }
    // --- FIM DA MELHORIA ---

    // Executa o JS específico daquela página
    route.init();

    // Rola para o topo
    window.scrollTo(0, 0);

    // ATUALIZA O LINK ATIVO DO MENU
    App.updateActiveNavLink();
};

// 3. Lida com a navegação (cliques nos links)
document.addEventListener('click', (e) => {
    const link = e.target.closest('a.nav-link'); 
    
    if (!link) return; 
    
    e.preventDefault();
    const path = link.getAttribute('href'); 
    
    if (path !== window.location.pathname + window.location.search) {
        navigateTo(path); 
    }
});

// 4. Lida com os botões "Voltar" e "Avançar"
window.addEventListener('popstate', () => {
    loadPage(window.location.pathname + window.location.search);
});

// 5. Carrega a página inicial
document.addEventListener('DOMContentLoaded', () => {

    // O Menu é estático, então só inicializamos UMA VEZ.
    App.initMenu(); 
    
    // Adiciona o listener de submit do cadastro
    document.body.addEventListener('submit', (e) => {
        if (e.target.id === 'volunteerForm') {
            e.preventDefault(); 
        }
    });
    
    loadPage(window.location.pathname + window.location.search);
});