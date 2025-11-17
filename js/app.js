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
            if(filterMessage) filterMessage.style.display = 'none';
            
            // Re-executa o filtro (que agora não achará categoria)
            filterProjects();
        });
    }

    // Atualiza filtro conforme busca
    if (searchInput) {
        searchInput.addEventListener('keyup', filterProjects);
    }
}

// js/app.js

// ... (o resto do seu app.js, initMenu, etc. fica igual) ...

// Lógica de js/cadastro.js (AGORA COM VALIDAÇÃO DA ETAPA 3)
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
    // --- FIM DA NOVA VALIDAÇÃO ---


    motivacaoInput.addEventListener("input", () => {
        motivacaoCounter.textContent = `${motivacaoInput.value.length}/300 caracteres`;
        motivacaoInput.classList.remove("error");
        motivacaoError.style.display = "none";
    });
    form.querySelectorAll("input, select, textarea").forEach((input) => {
        input.addEventListener("input", () => input.classList.remove("error"));
    });
    areaCheckboxes.forEach(cb => cb.addEventListener('change', () => {
        areaError.style.display = 'none';
        document.querySelectorAll('.card-checkbox-group.error').forEach(c => c.classList.remove('error'));
    }));

    // (Seu código de stepper original - está correto)
    const nextButtons = document.querySelectorAll(".btn-next");
    const prevButtons = document.querySelectorAll(".btn-prev");
    const steps = document.querySelectorAll(".form-step");
    const stepIndicators = document.querySelectorAll(".step");
    let currentStep = 0;

    const showStep = (index) => {
        steps.forEach((s, i) => s.classList.toggle("active", i === index));
        stepIndicators.forEach((si, i) => si.classList.toggle("active", i <= index));
        currentStep = index;
    };
    
    // (Função validateStep ATUALIZADA)
    const validateStep = (stepIndex) => {
        let valid = true;
        const stepInputs = steps[stepIndex].querySelectorAll("input[required], select[required], textarea[required]");
        
        stepInputs.forEach((input) => {
            if (!input.checkValidity()) {
                input.classList.add("error");
                valid = false;
            } else {
                input.classList.remove("error");
            }
        });
        
        // --- NOVA VALIDAÇÃO PARA ETAPA 3 (stepIndex == 2) ---
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
        // --- FIM DA NOVA VALIDAÇÃO ---

        // Validação da Etapa 4 (stepIndex == 3)
        if (stepIndex === 3) {
            let anyChecked = false;
            areaCheckboxes.forEach((cb) => { if (cb.checked) anyChecked = true; });
            if (!anyChecked) {
                areaError.style.display = "block";
                document.querySelectorAll('.card-checkbox-group').forEach(c => c.classList.add('error'));
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
        return valid;
    };

    // BOTÕES "PRÓXIMO" (com novo alert)
    nextButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            if (validateStep(currentStep)) {
                currentStep++;
                if (currentStep < steps.length) {
                    showStep(currentStep);
                }
            } else {
                alert("Por favor, corrija os campos obrigatórios para avançar.");
                window.scrollTo({ top: 0, behavior: "smooth" });
            }
        });
    });

    prevButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            currentStep--;
            if (currentStep >= 0) {
                showStep(currentStep);
            }
        });
    });
    
    // BOTÃO "FINALIZAR CADASTRO" (com novo alert)
    form.addEventListener("submit", function (e) {
        e.preventDefault(); 
        if (validateStep(currentStep)) {
            // Se for válido, navega para a página de sucesso
            navigate('/cadastro-sucesso');
        } else {
            alert("Por favor, corrija os campos obrigatórios para finalizar.");
            window.scrollTo({ top: 0, behavior: "smooth" });
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

// Lógica do formulário de contato (REVERTIDO PARA ALERT)
export function initContatoForm() { // <-- Não precisa mais do 'navigate'
    const form = document.getElementById('contactForm');
    if (!form) return;
    
    // --- LÓGICA DO LOCALSTORAGE (Sua lógica existente) ---
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');

    if(nomeInput) {
        nomeInput.value = localStorage.getItem('contactName') || '';
        nomeInput.addEventListener('input', (e) => {
            localStorage.setItem('contactName', e.target.value);
        });
    }
    if(emailInput) {
        emailInput.value = localStorage.getItem('contactEmail') || '';
        emailInput.addEventListener('input', (e) => {
            localStorage.setItem('contactEmail', e.target.value);
        });
    }
    // --- FIM DO LOCALSTORAGE ---

    // --- LÓGICA DE SUBMIT (Agora usa 'alert') ---
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

        // Caso especial para "Projetos":
        // Se o link é "/projetos" e o caminho atual é "/projetos", já funciona.
        // Se o caminho for "/" (Início), apenas o link "/" será ativado.
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