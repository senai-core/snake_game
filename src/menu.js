const CHAVE_RECORDE = "snake_recorde";
const CHAVE_INTERVALO = "snake_intervalo";

const recordeSalvo = localStorage.getItem(CHAVE_RECORDE) || 0;
document.getElementById("recorde-barra").textContent = recordeSalvo;
document.getElementById("recorde-painel").textContent = recordeSalvo;

const formPartida = document.getElementById("form-partida");

formPartida.addEventListener("submit", (evento) => {
    evento.preventDefault();

    const nivelEscolhido = formPartida.querySelector("input[name='nivel']:checked");
    localStorage.setItem(CHAVE_INTERVALO, nivelEscolhido.value);

    window.location.href = formPartida.getAttribute("action");
});
