document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("donation-form");
  const msg = document.getElementById("mensagem-doacao");
  const pixInfo = document.getElementById("pix-info");
  const transfInfo = document.getElementById("transferencia-info");

  // alterna entre as opções de pagamento
  form.addEventListener("change", (e) => {
    if (e.target.name === "pagamento") {
      if (e.target.value === "pix") {
        pixInfo.classList.remove("hidden");
        transfInfo.classList.add("hidden");
      } else if (e.target.value === "transferencia") {
        transfInfo.classList.remove("hidden");
        pixInfo.classList.add("hidden");
      }
    }
  });

  // mensagem de agradecimento
  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const valor = document.getElementById("valor").value;
    const projeto = document.getElementById("projeto").options[
      document.getElementById("projeto").selectedIndex
    ].text;
    const pagamento = form.querySelector('input[name="pagamento"]:checked').value;

    msg.innerHTML = `💚 Obrigado por apoiar o projeto <strong>${projeto}</strong> com uma doação de <strong>R$ ${valor}</strong> via <strong>${pagamento.toUpperCase()}</strong>!`;
    msg.style.color = "var(--color-primary-dark)";
    msg.style.opacity = "1";

    form.reset();
    pixInfo.classList.add("hidden");
    transfInfo.classList.add("hidden");
  });
});