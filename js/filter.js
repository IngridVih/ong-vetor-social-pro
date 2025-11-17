document.addEventListener("DOMContentLoaded", () => {
    const searchInput = document.getElementById('searchInput');
    const projectCards = document.querySelectorAll('.projects-grid-page .project-card');
    const projectCountSpan = document.getElementById('projectCount');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const filterMessage = document.getElementById('activeFilterMessage');
    const filterText = document.getElementById('filterText');
    const clearFilterBtn = document.getElementById('clearFilterBtn');

    if (projectCards.length > 0 && projectCountSpan && noResultsMessage) {

        // Função de filtro principal
        function filterProjects() {
            // 1. MUDANÇA: Lemos a URL *dentro* da função
            // Isso garante que sempre temos a URL mais atual.
            const urlParams = new URLSearchParams(window.location.search);
            const categoriaParam = urlParams.get('categoria');

            const searchTerm = (searchInput?.value || '').toLowerCase().trim();
            const categoriaFiltro = categoriaParam ? categoriaParam.toLowerCase() : null;
            let count = 0;

            projectCards.forEach(card => {
                const title = (card.dataset.title || '').toLowerCase();
                const description = card.querySelector('.project-content p')?.textContent.toLowerCase() || '';
                const category = (card.dataset.category || '').toLowerCase();

                const matchesSearch = title.includes(searchTerm) || description.includes(searchTerm);
                const matchesCategory = categoriaFiltro ? category.includes(categoriaFiltro) : true;

                if (matchesSearch && matchesCategory) {
                    card.style.display = 'block';
                    count++;
                } else {
                    card.style.display = 'none';
                }
            });

            projectCountSpan.textContent = `${count} projeto${count !== 1 ? 's' : ''} encontrado${count !== 1 ? 's' : ''}`;
            noResultsMessage.style.display = count === 0 ? 'block' : 'none';

            // 2. MUDANÇA: A própria função agora controla a mensagem de filtro
            if (categoriaParam && filterMessage && filterText) {
                filterMessage.style.display = 'flex';
                filterText.innerHTML = `🔍 Mostrando projetos da categoria <strong>${categoriaParam}</strong>`;
            } else if (filterMessage) {
                filterMessage.style.display = 'none';
            }
        }

        // Aplica o filtro inicial
        filterProjects();

        // 3. REMOÇÃO: Não precisamos mais desta lógica separada
        // (A filterProjects() já cuida disso)
        /*
        if (categoriaParam && filterMessage && filterText) {
            filterMessage.style.display = 'flex';
            filterText.innerHTML = `🔍 Mostrando projetos da categoria <strong>${categoriaParam}</strong>`;
        }
        */

        // Ao clicar em "Remover filtro"
        if (clearFilterBtn) {
            clearFilterBtn.addEventListener('click', () => {
                // Remove o parâmetro da URL sem recarregar
                const url = new URL(window.location.href);
                url.searchParams.delete('categoria');
                window.history.replaceState({}, '', url);

                // 4. MUDANÇA: Apenas chamamos a função principal.
                // Ela vai ler a URL (agora limpa) e mostrar todos os projetos.
                filterProjects();
            });
        }

        // Atualiza filtro conforme busca
        if (searchInput) {
            searchInput.addEventListener('keyup', filterProjects);
        }
    }
});