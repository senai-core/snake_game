const TAMANHO = 20;
const PONTOS_POR_FRUTA = 10;
const CHAVE_RECORDE = "snake_recorde";
const CHAVE_INTERVALO = "snake_intervalo";
const INTERVALO = Number(localStorage.getItem(CHAVE_INTERVALO)) || 120;

const DIRECOES = {
    cima: { x: 0, y: -1 },
    baixo: { x: 0, y: 1 },
    esquerda: { x: -1, y: 0 },
    direita: { x: 1, y: 0 },
};

const TECLAS = {
    ArrowUp: "cima",
    ArrowDown: "baixo",
    ArrowLeft: "esquerda",
    ArrowRight: "direita",
    w: "cima",
    s: "baixo",
    a: "esquerda",
    d: "direita",
};

const tabuleiro = document.getElementById("tabuleiro");
const painelFim = document.getElementById("fim");
const quadrados = [];

let cobra = [];
let fruta = null;
let movimento = DIRECOES.direita;
let proximoMovimento = DIRECOES.direita;
let pontos = 0;
let recorde = Number(localStorage.getItem(CHAVE_RECORDE)) || 0;
let relogio = null;

function montarTabuleiro() {
    for (let i = 0; i < TAMANHO * TAMANHO; i++) {
        const quadrado = document.createElement("div");
        quadrado.className = "quadrado";
        tabuleiro.appendChild(quadrado);
        quadrados.push(quadrado);
    }
}

function quadradoEm(posicao) {
    return quadrados[posicao.y * TAMANHO + posicao.x];
}

function mesmaPosicao(a, b) {
    return a.x === b.x && a.y === b.y;
}

function ocupadoPelaCobra(posicao) {
    return cobra.some((parte) => mesmaPosicao(parte, posicao));
}

function foraDoTabuleiro(posicao) {
    return posicao.x < 0 || posicao.y < 0 || posicao.x >= TAMANHO || posicao.y >= TAMANHO;
}

function sortearFruta() {
    let posicao;

    do {
        posicao = {
            x: Math.floor(Math.random() * TAMANHO),
            y: Math.floor(Math.random() * TAMANHO),
        };
    } while (ocupadoPelaCobra(posicao));

    fruta = posicao;
}

function desenhar() {
    quadrados.forEach((quadrado) => {
        quadrado.className = "quadrado";
    });

    quadradoEm(fruta).classList.add("fruta");
    cobra.forEach((parte, indice) => {
        quadradoEm(parte).classList.add(indice === 0 ? "cabeca" : "corpo");
    });
}

function atualizarPlacar() {
    document.getElementById("pontos").textContent = pontos;
    document.getElementById("recorde").textContent = Math.max(pontos, recorde);
}

function trocarDirecao(nome) {
    const nova = DIRECOES[nome];
    if (!nova) return;

    const ehContraria = nova.x === -movimento.x && nova.y === -movimento.y;
    if (!ehContraria) {
        proximoMovimento = nova;
    }
}

function passo() {
    movimento = proximoMovimento;

    const cabeca = cobra[0];
    const novaCabeca = { x: cabeca.x + movimento.x, y: cabeca.y + movimento.y };

    if (foraDoTabuleiro(novaCabeca) || ocupadoPelaCobra(novaCabeca)) {
        terminarPartida();
        return;
    }

    cobra.unshift(novaCabeca);

    if (mesmaPosicao(novaCabeca, fruta)) {
        pontos += PONTOS_POR_FRUTA;
        atualizarPlacar();
        sortearFruta();
    } else {
        cobra.pop();
    }

    desenhar();
}

function comecarPartida() {
    cobra = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 },
    ];
    movimento = DIRECOES.direita;
    proximoMovimento = DIRECOES.direita;
    pontos = 0;

    painelFim.classList.remove("aberto");
    sortearFruta();
    atualizarPlacar();
    desenhar();

    clearInterval(relogio);
    relogio = setInterval(passo, INTERVALO);
}

function terminarPartida() {
    clearInterval(relogio);

    const bateuRecorde = pontos > recorde;
    if (bateuRecorde) {
        recorde = pontos;
        localStorage.setItem(CHAVE_RECORDE, recorde);
    }

    document.getElementById("fim-pontos").textContent = pontos + " pontos";
    document.getElementById("fim-recorde").textContent = bateuRecorde
        ? "Novo recorde!"
        : "Recorde atual: " + recorde;

    painelFim.classList.add("aberto");
}

document.addEventListener("keydown", (evento) => {
    const nome = TECLAS[evento.key] || TECLAS[evento.key.toLowerCase()];
    if (!nome) return;

    evento.preventDefault();
    trocarDirecao(nome);
});

document.querySelectorAll(".seta").forEach((seta) => {
    seta.addEventListener("click", () => trocarDirecao(seta.dataset.direcao));
});

document.getElementById("botao-denovo").addEventListener("click", comecarPartida);

montarTabuleiro();
comecarPartida();
