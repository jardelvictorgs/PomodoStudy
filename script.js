// Seleção de elementos do DOM
const html = document.querySelector('html');
const focoBt = document.querySelector('.app__card-button--foco');
const curtoBt = document.querySelector('.app__card-button--curto');
const longoBt = document.querySelector('.app__card-button--longo');
const banner = document.querySelector('.app__image');
const titulo = document.querySelector('.app__title');
const botoes = document.querySelectorAll('.app__card-button');
const startPauseBt = document.querySelector('#start-pause');
const musicaFocoInput = document.querySelector('#alternar-musica');
const iniciarOuPausarBt = document.querySelector('#start-pause span');
const iniciarOuPausarBtIcone = document.querySelector(".app__card-primary-butto-icon");
const tempoNaTela = document.querySelector('#timer');

// Sons do sistema
const musica = new Audio('/sons/luna-rise-part-one.mp3');
const audioPlay = new Audio('/sons/play.wav');
const audioPausa = new Audio('/sons/pause.mp3');
const audioTempoFinalizado = new Audio('./sons/beep.mp3');

let tempoDecorridoEmSegundos = 30;
let intervaloId = null;

musica.loop = true;

// Alterna a música de fundo
musicaFocoInput.addEventListener('change', () => {
    musica.paused ? musica.play() : musica.pause();
});

// Botões de contexto
focoBt.addEventListener('click', () => alterarContexto('foco', 30, focoBt));
curtoBt.addEventListener('click', () => alterarContexto('descanso-curto', 5, curtoBt));
longoBt.addEventListener('click', () => alterarContexto('descanso-longo', 15, longoBt));

function alterarContexto(contexto, tempo, botao) {
    tempoDecorridoEmSegundos = tempo;
    botoes.forEach(bt => bt.classList.remove('active'));
    botao.classList.add('active');
    html.setAttribute('data-contexto', contexto);
    banner.setAttribute('src', `/imagens/${contexto}.png`);
    atualizarTitulo(contexto);
    mostrarTempo();
}

function atualizarTitulo(contexto) {
    const titulos = {
        "foco": "Otimize sua produtividade,<br><strong class='app__title-strong'>mergulhe no que importa.</strong>",
        "descanso-curto": "Que tal dar uma respirada? <strong class='app__title-strong'>Faça uma pausa curta!</strong>",
        "descanso-longo": "Hora de voltar à superfície.<strong class='app__title-strong'> Faça uma pausa longa.</strong>"
    };
    titulo.innerHTML = titulos[contexto] || "";
}

// Contagem regressiva e controle de tempo
const contagemRegressiva = () => {
    if (tempoDecorridoEmSegundos <= 0) {
        audioTempoFinalizado.play();
        alert('Tempo finalizado!');
        if (html.getAttribute('data-contexto') === 'foco') {
            document.dispatchEvent(new CustomEvent('FocoFinalizado'));
        }
        zerar();
        return;
    }
    tempoDecorridoEmSegundos--;
    mostrarTempo();
};

startPauseBt.addEventListener('click', iniciarOuPausar);

function iniciarOuPausar() {
    if (intervaloId) {
        audioPausa.play();
        zerar();
        return;
    }
    audioPlay.play();
    intervaloId = setInterval(contagemRegressiva, 1000);
    iniciarOuPausarBt.textContent = "Pausar";
    iniciarOuPausarBtIcone.setAttribute('src', `/imagens/pause.png`);
}

function zerar() {
    clearInterval(intervaloId);
    iniciarOuPausarBt.textContent = "Começar";
    iniciarOuPausarBtIcone.setAttribute('src', `/imagens/play_arrow.png`);
    intervaloId = null;
}

function mostrarTempo() {
    const tempo = new Date(tempoDecorridoEmSegundos * 1000);
    const tempoFormatado = tempo.toLocaleTimeString('pt-Br', { minute: '2-digit', second: '2-digit' });
    tempoNaTela.innerHTML = `${tempoFormatado}`;
}

mostrarTempo();
