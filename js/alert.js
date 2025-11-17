
    // Seleciona o formulário
    const form = document.querySelector('.contact-form form');

    // Adiciona o evento de envio
    form.addEventListener('submit', function(event) {
        event.preventDefault(); // previne o envio real do formulário
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const message = document.getElementById('message').value;

        // Verifica se os campos estão preenchidos (opcional)
        if(name && email && message) {
            alert(`Obrigado, ${name}! Sua mensagem foi enviada com sucesso.`);
            form.reset(); // limpa os campos do formulário
        } else {
            alert('Por favor, preencha todos os campos antes de enviar.');
        }
    });