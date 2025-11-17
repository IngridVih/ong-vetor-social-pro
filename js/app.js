// js/app.js
import { db } from './database.js'; // Importa banco de dados

// --- LÓGICA DO TEMPLATE JS  ---

function createProjectCard(project, isPageAllProjects = false) {
    let statusClass = project.status === 'ativo' ? 'ativo' : 'planejamento';
    let iconClass = project.icon || 'fa-palette';

    const buttonHtml = isPageAllProjects
        ? `<a href="/cadastro" class="btn btn-primary btn-small nav-link">Ser Voluntário</a>`
        : `<a href="/projetos" class="btn btn-primary btn-small nav-link">Ver Projetos <i class="fa-solid fa-arrow-right"></i></a>`;

    const authorHtml = `<span>Por: <strong>${project.author}</strong></span>`;

    return `
    <div class="project-card" data-title="${project.title}" data-category="${project.category}">
        <div class="project-image">
            <picture>
                <source srcset="${project.imgWebp}" type="image/webp">
                <img src="${project.imgSrc}" alt="${project.alt}">
            </picture>
            <span class="project-tag-status ${statusClass}">${project.status}</span>
            <span class="project-tag-category"><i class="fa-solid ${iconClass}"></i> ${project.category}</span>
        </div>
        <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <div class="progress-bar">
                <span class="progress-label">${project.progress}%</span>
                <div class="progress" style="width: ${project.progress}%;"></div>
            </div>
            <div class="project-meta-compact">
                <span><strong>Arrecadado:</strong> ${project.raised}</span>
                <span><strong>Meta:</strong> ${project.goal}</span>
            </div>
            <div class="project-meta-icons">
                <span><i class="fa-solid fa-users"></i> ${project.volunteers} voluntários</span>
                <span><i class="fa-solid fa-calendar-check"></i> ${project.endDate}</span>
            </div>
            <hr>
            <div class="project-footer">
                ${authorHtml}
                ${buttonHtml}
            </div>
        </div>
    </div>
    `;
}

function createTestimonialCard(testimonial) {
    return `
    <div class="testimonial-card">
        <i class="fa-solid fa-quote-left"></i>
        <p>"${testimonial.quote}"</p>
        <div class="author">
            <picture>
                <source srcset="${testimonial.imgWebp}" type="image/webp">
                <img src="${testimonial.imgSrc}" alt="${testimonial.author}">
            </picture>
            <div>
                <strong>${testimonial.author}</strong>
                <span>${testimonial.role}</span>
            </div>
        </div>
    </div>
    `;
}

// --- FUNÇÕES DE INICIALIZAÇÃO (Lógica das páginas) ---

// Lógica de js/menu.js
export function initMenu() {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdown = document.querySelector('.dropdown');

    // Se os elementos não existirem (ex: erro no HTML), pare a função
    if (!menuToggle || !navLinks || !dropdown) {
        console.warn("Elementos do menu não encontrados. O menu.js não será inicializado.");
        return;
    }

    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    const dropdownLink = dropdown.querySelector('a'); // link principal "Projetos"

    if (!dropdownLink || !dropdownMenu) {
        console.warn("Dropdown do menu não encontrado.");
        return;
    }

    // 1. Lógica para abrir/fechar o menu hambúrguer
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

    // 2. Lógica para o dropdown no mobile (exatamente a sua lógica original)
    dropdown.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            const isMainLink = e.target === dropdownLink;
            const isSubLink = e.target.closest('.dropdown-menu a');

            if (isMainLink) return; // Deixa o clique no link principal navegar
            if (isSubLink) return; // Deixa o clique no submenu navegar

            // Se clicou na área do LI (mas não num link), abre/fecha o submenu
            e.preventDefault();
            dropdownMenu.classList.toggle('show');
        }
    });

    // 3. [MELHORIA SPA] Fecha o menu hambúrguer ao clicar em qualquer link
    navLinks.addEventListener('click', (e) => {
        if (e.target.closest('a')) {
            navLinks.classList.remove('show');
        }
    });

    // =================================================================
    // ### NOVA LÓGICA DE ACESSIBILIDADE PARA DROPDOWN DESKTOP ###
    // =================================================================

    // Seletores específicos para o dropdown de desktop
    const desktopDropdownButton = document.getElementById('projetos-menu-button');
    const desktopDropdownMenu = document.getElementById('projetos-menu');

    if (desktopDropdownButton && desktopDropdownMenu) {
        const desktopDropdownItems = desktopDropdownMenu.querySelectorAll('a.nav-link');

        // Função para abrir/fechar o menu
        const toggleMenu = (shouldOpen) => {
            const isExpanded = shouldOpen;
            desktopDropdownButton.setAttribute('aria-expanded', isExpanded);
            // Adiciona/remove a classe .show do elemento <li> pai
            desktopDropdownButton.parentElement.classList.toggle('show', isExpanded);
        };

        // 1. Abrir/Fechar com Clique
        desktopDropdownButton.addEventListener('click', (e) => {
            // Previne que o router.js navegue para a página /projetos
            e.preventDefault();
            // Previne que o listener de "clique fora" feche o menu imediatamente
            e.stopPropagation();

            const isExpanded = desktopDropdownButton.getAttribute('aria-expanded') === 'true';
            toggleMenu(!isExpanded);
        });

        // 2. Abrir/Fechar com Teclado (no botão principal)
        desktopDropdownButton.addEventListener('keydown', (e) => {
            // Abre com Enter, Espaço ou Seta para Baixo
            if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
                e.preventDefault();
                e.stopPropagation();
                toggleMenu(true);
                // Move o foco para o primeiro item do menu
                if (desktopDropdownItems.length > 0) desktopDropdownItems[0].focus();
            }
            // Fecha com Seta para Cima
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                toggleMenu(false);
            }
            // Fecha com Escape
            if (e.key === 'Escape') {
                toggleMenu(false);
                desktopDropdownButton.focus(); // Devolve o foco ao botão
            }
        });

        // 3. Navegação com Teclado (dentro do menu)
        desktopDropdownItems.forEach((item, index) => {
            item.addEventListener('keydown', (e) => {
                // Move para baixo
                if (e.key === 'ArrowDown') {
                    e.preventDefault();
                    if (index < desktopDropdownItems.length - 1) {
                        desktopDropdownItems[index + 1].focus();
                    }
                }
                // Move para cima
                if (e.key === 'ArrowUp') {
                    e.preventDefault();
                    if (index > 0) {
                        desktopDropdownItems[index - 1].focus();
                    } else {
                        // Se estiver no primeiro, volta para o botão principal
                        desktopDropdownButton.focus();
                        toggleMenu(false);
                    }
                }
                // Fecha com Escape
                if (e.key === 'Escape') {
                    toggleMenu(false);
                    desktopDropdownButton.focus(); // Devolve o foco ao botão
                }
                // Fecha ao dar Tab no último item
                if (e.key === 'Tab' && !e.shiftKey && index === desktopDropdownItems.length - 1) {
                    toggleMenu(false);
                    // O comportamento padrão do Tab moverá para "Sobre"
                }
            });
        });

        // 4. Fechar ao clicar fora
        document.addEventListener('click', (e) => {
            // Se o clique foi fora do <li>.dropdown
            if (!dropdown.contains(e.target)) {
                toggleMenu(false);
            }
        });
    }
}

// Lógica de js/carousel.js
export function initCarousel() {
    const track = document.querySelector('.carousel-track');
    if (!track) return;

    const slides = Array.from(track.children);
    if (slides.length === 0) return;

    const nextButton = document.querySelector('.carousel-btn.next');
    const prevButton = document.querySelector('.carousel-btn.prev');
    let currentIndex = 0;

    function updateCarousel() {
        const width = slides[0].getBoundingClientRect().width;
        if (width === 0) return; // Evita erro se o carrossel estiver oculto
        track.style.transform = `translateX(-${currentIndex * width}px)`;
    }

    nextButton.addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    });

    prevButton.addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + slides.length) % slides.length;
        updateCarousel();
    });

    window.addEventListener('resize', updateCarousel);

    setInterval(() => {
        currentIndex = (currentIndex + 1) % slides.length;
        updateCarousel();
    }, 5000);

    updateCarousel();
}

// Lógica de js/filter.js
export function initFilter() {
    // Seleciona todos os elementos do filter.js
    const searchInput = document.getElementById('searchInput');
    const projectCards = document.querySelectorAll('.projects-grid-page .project-card');
    const projectCountSpan = document.getElementById('projectCount');
    const noResultsMessage = document.getElementById('noResultsMessage');
    const filterMessage = document.getElementById('activeFilterMessage');
    const filterText = document.getElementById('filterText');
    const clearFilterBtn = document.getElementById('clearFilterBtn');

    // Para se a página de projetos não tiver os elementos corretos
    if (projectCards.length === 0 || !projectCountSpan || !noResultsMessage) {
        console.warn("Elementos do filtro não encontrados. initFilter() não será executado.");
        return;
    }

    // Função de filtro principal
    function filterProjects() {
        const searchTerm = (searchInput?.value || '').toLowerCase().trim();

        // Pega a categoria da URL ATUALMENTE
        const urlParams = new URLSearchParams(window.location.search);
        const categoriaParam = urlParams.get('categoria');
        const categoriaFiltro = categoriaParam ? categoriaParam.toLowerCase().replace('%20', ' ') : null;

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

        // --- LÓGICA DO BOTÃO "REMOVER FILTRO" ADICIONADA ---

        // Se veio com uma categoria na URL, exibe a mensagem
        if (categoriaParam && filterMessage && filterText) {
            filterMessage.style.display = 'flex';
            filterText.innerHTML = `🔍 Mostrando projetos da categoria <strong>${categoriaParam}</strong>`;
        } else if (filterMessage) {
            // Garante que a mensagem esteja oculta se não houver filtro
            filterMessage.style.display = 'none';
        }
    }

    // Aplica o filtro inicial (para contar e mostrar/ocultar a mensagem de filtro)
    filterProjects();

    // Ao clicar em "Remover filtro"
    if (clearFilterBtn) {
        clearFilterBtn.addEventListener('click', () => {
            // Remove o parâmetro da URL sem recarregar
            const url = new URL(window.location.href);
            url.searchParams.delete('categoria');
            // Avisa o router da mudança de URL
            window.history.pushState({}, '', url);

            // Oculta a mensagem
            if (filterMessage) filterMessage.style.display = 'none';

            // Re-executa o filtro (que agora não achará categoria)
            filterProjects();
        });
    }

    // Atualiza filtro conforme busca
    if (searchInput) {
        searchInput.addEventListener('keyup', filterProjects);
    }
}

// Lógica de js/cadastro.js
export function initCadastroForm(navigate) { // <-- A função 'navigate' do router
    const form = document.getElementById("volunteerForm");
    if (!form) return;

    // (Código de máscaras original - está correto)
    const nomeInput = document.getElementById("nome");
    const cpfInput = document.getElementById("cpf");
    const telefoneInput = document.getElementById("telefone");
    const cepInput = document.getElementById("cep");
    const cidadeInput = document.getElementById("cidade");
    const maskCPF = (value) => value.replace(/\D/g, "").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d)/, "$1.$2").replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    const maskTelefone = (value) => value.replace(/\D/g, "").replace(/(\d{2})(\d)/, "($1) $2").replace(/(\d{5})(\d)/, "$1-$2");
    const maskCEP = (value) => value.replace(/\D/g, "").replace(/(\d{5})(\d)/, "$1-$2");
    cpfInput.addEventListener("input", (e) => (e.target.value = maskCPF(e.target.value)));
    telefoneInput.addEventListener("input", (e) => (e.target.value = maskTelefone(e.target.value)));
    cepInput.addEventListener("input", (e) => (e.target.value = maskCEP(e.target.value)));
    nomeInput.addEventListener("input", (e) => { e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, ""); });
    cidadeInput.addEventListener("input", (e) => { e.target.value = e.target.value.replace(/[^A-Za-zÀ-ÖØ-öø-ÿ\s]/g, ""); });

    // (Código de validação original - Etapa 4)
    const areaCheckboxes = document.querySelectorAll('input[name="areaInteresse"]');
    const areaError = document.getElementById("areaError");
    const motivacaoInput = document.getElementById("motivacao");
    const motivacaoCounter = document.getElementById("motivacaoCounter");
    const motivacaoError = document.getElementById("motivacaoError");

    // --- NOVA VALIDAÇÃO (Etapa 3) ---
    const habilidadeCheckboxes = document.querySelectorAll('input[name="habilidade"]');
    const habilidadeError = document.getElementById("habilidadeError");
    const diasCheckboxes = document.querySelectorAll('input[name="dias"]');
    const diasError = document.getElementById("diasError");

    // Listeners para limpar os erros da Etapa 3
    habilidadeCheckboxes.forEach(cb => cb.addEventListener('change', () => {
        habilidadeError.style.display = 'none';
    }));
    diasCheckboxes.forEach(cb => cb.addEventListener('change', () => {
        diasError.style.display = 'none';
    }));

    motivacaoInput.addEventListener("input", () => {
        motivacaoCounter.textContent = `${motivacaoInput.value.length}/300 caracteres`;
        motivacaoInput.classList.remove("error");
        motivacaoError.style.display = "none";
    });
    form.querySelectorAll("input, select, textarea").forEach((input) => {
        input.addEventListener("input", () => {
            input.classList.remove("error");

            // Adiciona estas 3 linhas
            const errorSpan = document.getElementById(input.id + 'Error');
            if (errorSpan) {
                errorSpan.style.display = "none";
            }
        });
    });
    areaCheckboxes.forEach(cb => cb.addEventListener('change', () => {
        areaError.style.display = 'none';
        document.querySelectorAll('.card-checkbox-group.error').forEach(c => c.classList.remove('error'));
    }));

    const nextButtons = document.querySelectorAll(".btn-next");
    const prevButtons = document.querySelectorAll(".btn-prev");
    const steps = document.querySelectorAll(".form-step");
    const stepIndicators = document.querySelectorAll(".stepper li");
    let currentStep = 0;

    // =================================================================
    // FUNÇÃO 'showStep' (COM AS CORREÇÕES DE ACESSIBILIDADE)
    // =================================================================
    const showStep = (index) => {
        // Mostra o painel do formulário correto
        steps.forEach((s, i) => s.classList.toggle("active", i === index));

        // Atualiza os indicadores do stepper
        stepIndicators.forEach((li, i) => {
            // 1. Atualiza o visual (classe .active)
            li.classList.toggle("active", i <= index);

            // 2. CORREÇÃO DE ACESSIBILIDADE (aria-current)
            li.removeAttribute('aria-current');
            if (i === index) {
                li.setAttribute('aria-current', 'step');
            }
        });

        currentStep = index;

        // 3. CORREÇÃO DE ACESSIBILIDADE (Mover Foco)
        const novaEtapa = steps[index];
        const novoTitulo = novaEtapa.querySelector('h3');

        if (novoTitulo) {
            // Torna o título focável
            novoTitulo.setAttribute('tabindex', '-1');
            // Move o foco do leitor de tela para ele
            novoTitulo.focus();
        }
    };

    // =================================================================
    // FUNÇÃO 'validateStep'
    // =================================================================
    const validateStep = (stepIndex) => {
        let valid = true;
        const stepInputs = steps[stepIndex].querySelectorAll("input[required], select[required], textarea[required]");

        stepInputs.forEach((input) => {
            // Encontra o <span> de erro correspondente (ex: "nomeError")
            const errorSpan = document.getElementById(input.id + 'Error');

            if (!input.checkValidity()) {
                input.classList.add("error");
                // MOSTRA o erro
                if (errorSpan) {
                    errorSpan.style.display = "block";
                }
                valid = false;
            } else {
                input.classList.remove("error");
                // ESCONDE o erro
                if (errorSpan) {
                    errorSpan.style.display = "none";
                }
            }
        });

        if (stepIndex === 2) {
            let habilidadeChecked = false;
            habilidadeCheckboxes.forEach((cb) => { if (cb.checked) habilidadeChecked = true; });
            if (!habilidadeChecked) {
                habilidadeError.style.display = "block";
                valid = false;
            } else {
                habilidadeError.style.display = "none";
            }

            let diaChecked = false;
            diasCheckboxes.forEach((cb) => { if (cb.checked) diaChecked = true; });
            if (!diaChecked) {
                diasError.style.display = "block";
                valid = false;
            } else {
                diasError.style.display = "none";
            }
        }

        if (stepIndex === 3) {
            let anyChecked = false;
            areaCheckboxes.forEach((cb) => { if (cb.checked) anyChecked = true; });
            if (!anyChecked) {
                areaError.style.display = "block";
                // Adiciona classe de erro ao wrapper do label para feedback visual
                document.querySelectorAll('label[for^="area-"]').forEach(label => {
                    label.closest('.card-checkbox-group').classList.add('error');
                });
                valid = false;
            } else {
                areaError.style.display = "none";
            }

            if (!motivacaoInput.value.trim()) {
                motivacaoInput.classList.add("error");
                document.getElementById("motivacaoError").style.display = "block";
                valid = false;
            } else {
                document.getElementById("motivacaoError").style.display = "none";
            }
        }

        // 4. CORREÇÃO DE ACESSIBILIDADE (Foco no Erro, sem alert)
        if (!valid) {
            // Encontra o primeiro input ou fieldset com erro e foca nele
            const firstError = form.querySelector('.error');
            if (firstError) {
                // Se for um input, foca nele
                if (firstError.tagName === 'INPUT' || firstError.tagName === 'SELECT' || firstError.tagName === 'TEXTAREA') {
                    firstError.focus();
                } else {
                    // Se for um 'span' (erro de checkbox), foca no primeiro checkbox do grupo
                    const fieldset = firstError.closest('fieldset');
                    if (fieldset) {
                        fieldset.querySelector('input[type="checkbox"]').focus();
                    }
                }
            }
        }
        return valid;
    };

    // BOTÕES "PRÓXIMO" (Sem alert)
    nextButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (validateStep(currentStep)) {
                currentStep++;
                if (currentStep < steps.length) {
                    showStep(currentStep);
                }
            }
            // A função validateStep() agora cuida do foco.
        });
    });

    // BOTÕES "ANTERIOR"
    prevButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            currentStep--;
            if (currentStep >= 0) {
                showStep(currentStep);
            }
        });
    });

    // BOTÃO "FINALIZAR CADASTRO"
    form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (validateStep(currentStep)) {
            navigate('/cadastro-sucesso');
        }
    });

    showStep(0); // Inicia na primeira etapa
}

// Lógica de js/doacao.js
export function initDoacaoForm() {
    const form = document.getElementById("donation-form");
    if (!form) return;

    const msg = document.getElementById("mensagem-doacao");
    const pixInfo = document.getElementById("pix-info");
    const transfInfo = document.getElementById("transferencia-info");

    form.addEventListener("change", (e) => {
        if (e.target.name === "pagamento") {
            pixInfo.classList.toggle("hidden", e.target.value !== "pix");
            transfInfo.classList.toggle("hidden", e.target.value !== "transferencia");
        }
    });

    form.addEventListener("submit", (e) => {
        e.preventDefault();
        const valor = document.getElementById("valor").value;
        const projetoSelect = document.getElementById("projeto");
        const projeto = projetoSelect.options[projetoSelect.selectedIndex].text;

        // Verifica se um pagamento foi selecionado
        const pagamentoInput = form.querySelector('input[name="pagamento"]:checked');
        if (!pagamentoInput) {
            msg.innerHTML = `Por favor, selecione um método de pagamento.`;
            msg.style.color = "var(--color-secondary)";
            return;
        }
        const pagamento = pagamentoInput.value;

        msg.innerHTML = `💚 Obrigado por apoiar o projeto <strong>${projeto}</strong> com <strong>R$ ${valor}</strong> via <strong>${pagamento.toUpperCase()}</strong>!`;
        form.reset();
        pixInfo.classList.add("hidden");
        transfInfo.classList.add("hidden");
    });
}

// Lógica do formulário de contato
export function initContatoForm() {
    const form = document.getElementById('contactForm');
    if (!form) return;

    // --- LÓGICA DO LOCALSTORAGE  ---
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');

    if (nomeInput) {
        nomeInput.value = localStorage.getItem('contactName') || '';
        nomeInput.addEventListener('input', (e) => {
            localStorage.setItem('contactName', e.target.value);
        });
    }
    if (emailInput) {
        emailInput.value = localStorage.getItem('contactEmail') || '';
        emailInput.addEventListener('input', (e) => {
            localStorage.setItem('contactEmail', e.target.value);
        });
    }
    // --- FIM DO LOCALSTORAGE ---

    // --- LÓGICA DE SUBMIT ---
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Validação
        const nome = nomeInput.value;
        const email = emailInput.value;
        const assunto = document.getElementById('assunto').value;
        const mensagem = document.getElementById('mensagem').value;

        if (nome && email && assunto && mensagem) {
            // SUCESSO: Mostra o alerta
            alert(`Obrigado, ${nome}! Sua mensagem foi enviada com sucesso.`);
            form.reset();
            localStorage.removeItem('contactName');
            localStorage.removeItem('contactEmail');
        } else {
            // FALHA: Mostra o alerta de erro
            alert("Por favor, preencha todos os campos obrigatórios (*).");
        }
    });
}


// --- FUNÇÕES DE RENDERIZAÇÃO (Para o Template JS) ---

export function renderHomeProjects() {
    const container = document.getElementById('projects-grid-container');
    if (!container) return;

    const featuredProjects = db.projects.slice(0, 3);
    let html = '';
    featuredProjects.forEach(project => {
        html += createProjectCard(project, false);
    });
    container.innerHTML = html;
}

export function updateActiveNavLink() {
    // Pega o caminho da URL (ex: "/sobre" ou "/projetos")
    // O split('?')[0] remove parâmetros (ex: ?categoria=...)
    const currentPath = window.location.pathname.split('?')[0];

    // Pega todos os links principais da navegação
    const navLinks = document.querySelectorAll('.nav-links > li > a.nav-link');

    navLinks.forEach(link => {
        const linkPath = link.getAttribute('href');

        // Remove a classe 'active' de TODOS os links
        link.classList.remove('active');

        // Adiciona a classe 'active' apenas se o href do link for igual
        // ao caminho atual da página.
        if (linkPath === currentPath) {
            link.classList.add('active');
        }
    });
}

export function renderAllProjects() {
    const container = document.getElementById('projects-grid-container');
    if (!container) return;

    let html = '';
    db.projects.forEach(project => {
        html += createProjectCard(project, true);
    });
    container.innerHTML = html;

    initFilter(); // Inicia o filtro DEPOIS de renderizar os cards
}

export function renderTestimonials() {
    const container = document.getElementById('testimonials-grid-container');
    if (!container) return;

    let html = '';
    db.testimonials.forEach(testimonial => {
        html += createTestimonialCard(testimonial);
    });
    container.innerHTML = html;
}

// =======================
// LÓGICA DE TEMA (LocalStorage)
// =======================

/**
 * Aplica o tema (classe) no <body> e salva no localStorage.
 * Também atualiza qual botão aparece como "ativo".
 */
function applyTheme(theme) {
    const body = document.body;

    // Seleciona os botões
    const lightBtn = document.getElementById('theme-light');
    const darkBtn = document.getElementById('theme-dark');
    const contrastBtn = document.getElementById('theme-contrast');

    // Reseta tudo
    body.classList.remove('theme-dark', 'theme-high-contrast');
    if (lightBtn) lightBtn.classList.remove('active');
    if (darkBtn) darkBtn.classList.remove('active');
    if (contrastBtn) contrastBtn.classList.remove('active');

    // Aplica o tema novo
    if (theme === 'dark') {
        body.classList.add('theme-dark');
        if (darkBtn) darkBtn.classList.add('active');
        localStorage.setItem('theme', 'dark'); // Salva
    } else if (theme === 'high-contrast') {
        body.classList.add('theme-high-contrast');
        if (contrastBtn) contrastBtn.classList.add('active');
        localStorage.setItem('theme', 'high-contrast'); // Salva
    } else {
        // 'light' é o padrão
        if (lightBtn) lightBtn.classList.add('active');
        localStorage.setItem('theme', 'light'); // Salva
    }
}

/**
 * Inicializa os event listeners dos botões de tema.
 */
export function initThemeSwitcher() {
    const lightBtn = document.getElementById('theme-light');
    const darkBtn = document.getElementById('theme-dark');
    const contrastBtn = document.getElementById('theme-contrast');

    if (lightBtn && darkBtn && contrastBtn) {
        lightBtn.addEventListener('click', () => applyTheme('light'));
        darkBtn.addEventListener('click', () => applyTheme('dark'));
        contrastBtn.addEventListener('click', () => applyTheme('high-contrast'));
    }
}

/**
 * Verifica o localStorage e aplica o tema salvo ao carregar o site.
 */
export function applySavedTheme() {
    const savedTheme = localStorage.getItem('theme') || 'light'; // Pega o tema salvo ou usa 'light'
    applyTheme(savedTheme);
}