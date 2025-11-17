document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const dropdown = document.querySelector('.dropdown');
    const dropdownMenu = dropdown.querySelector('.dropdown-menu');
    const dropdownLink = dropdown.querySelector('a'); // link principal "Projetos"

        if (!dropdown || !dropdownLink || !dropdownMenu) return;

    // Menu mobile
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('show');
    });

dropdown.addEventListener('click', (e) => {
        if (window.innerWidth <= 992) {
            const isMainLink = e.target === dropdownLink;
            const isSubLink = e.target.closest('.dropdown-menu a');

            if (isMainLink) return; // vai para projetos.html
            if (isSubLink) return; // vai para o projeto específico

            e.preventDefault();
            dropdownMenu.classList.toggle('show');
        }
    });
});