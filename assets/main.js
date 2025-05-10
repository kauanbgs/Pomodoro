const timer1 = document.querySelector(".container .main .pomo #min");
const startButton = document.querySelector(".container .main .pomo .buttons .start");
const stopButton = document.querySelector(".container .main .pomo .buttons .pause");
const changeModeButton = document.querySelector(".container .main .pomo .buttons .changeMode");
const perce = document.querySelector(".container .main .pomo .slider .teste");

let seconds = 3;
let minutes = 0;
let rodando = false;
let intervalo = null;
let descansoAtivo = false;
let modoDescanso = false; // Indica se o timer está no modo de descanso

let buzina = new Audio('/assets/campainha-331260.mp3');
stopButton.classList.add("botao-stop-false"); // Adiciona a classe inicialmente

function tornarFalse() {
  rodando = false;
  clearInterval(intervalo);
  intervalo = null;
  startButton.classList.remove("botao-rodando"); // Remove a classe ao pausar
  stopButton.classList.add("botao-stop-false"); // Adiciona a classe ao pausar
}

function atualizarSlider() {
  const totalSegundos = (minutes * 60) + seconds; // Total de segundos restantes
  const totalSegundosInicial = 25 * 60; // Total de segundos no início
  const segundosPassados = totalSegundosInicial - totalSegundos;
  const porcentagem = (segundosPassados / totalSegundosInicial) * 100;
  perce.style.width = `${porcentagem}%`;
}

function atualizarDisplay() {
  const minutosFormatadas = String(minutes).padStart(2, '0');
  const segundosFormatados = String(seconds).padStart(2, '0');
  timer1.innerHTML = `${minutosFormatadas}:${segundosFormatados}`;
  atualizarSlider();
}

function resetar() {
  tornarFalse(); // Garante que qualquer intervalo seja parado
  minutes = 25;
  seconds = 0;
  modoDescanso = false; // Reseta o modo de descanso
  descansoAtivo = false; // Reseta o estado de descanso ativo
  startButton.classList.remove("botao-rodando"); // Remove qualquer classe de "rodando"
  atualizarDisplay();
}

function timer() {
  if (rodando) return;

  rodando = true;
  atualizarDisplay();
  startButton.classList.add("botao-rodando"); // Adiciona a classe
  stopButton.classList.remove("botao-stop-false"); // Remove a classe

  intervalo = setInterval(function () {
    seconds--;
    if (seconds < 0) {
      seconds = 59;
      minutes--;
      if (minutes < 0) {
        tornarFalse();
        buzina.play();
        modoDescanso = true; // Entra no modo de descanso
        minutes = 5;
        seconds = 0;
        atualizarDisplay();
        startButton.classList.remove("botao-rodando"); // Remove a classe ao terminar o pomodoro
      }
    }
    atualizarDisplay();
  }, 1000);
}

function tempoDescanso() {
  tornarFalse(); // <- aqui garante que não haverá múltiplos intervalos
  buzina.play();
  minutes = 5;
  seconds = 0;
  atualizarDisplay();
  rodando = true;
  startButton.classList.add("botao-rodando");
  stopButton.classList.remove("botao-stop-false");
  descansoAtivo = true;

  intervalo = setInterval(function () {
    atualizarDisplay();
    seconds--;
    if (seconds < 0) {
      seconds = 59;
      minutes--;
    }
    if (minutes < 0) {
      finalizarDescanso();
    }
  }, 1000);
}


function finalizarDescanso() {
  tornarFalse();
  resetar();
  startButton.classList.remove("botao-rodando");
  modoDescanso = false;
  descansoAtivo = false;
}

function changeMode(){
  if(!descansoAtivo){
    timer()
  }
  else{
    tempoDescanso()
  }
}

startButton.addEventListener("click", function() {
  if (!rodando && !modoDescanso) {
    timer(); // Inicia o timer principal
  } else if (!rodando && modoDescanso && !descansoAtivo) {
    tempoDescanso(); // Inicia o tempo de descanso pela primeira vez
  } else if (!rodando && modoDescanso && descansoAtivo) {
    // Se não estiver rodando, estiver no modo descanso E o descanso já estiver ativo, apenas reinicie o intervalo
    rodando = true;
    startButton.classList.add("botao-rodando");
    stopButton.classList.remove("botao-stop-false");
    intervalo = setInterval(function () {
      atualizarDisplay();
      seconds--;
      if (seconds < 0) {
        seconds = 59;
        minutes--;
      }
      if (minutes < 0) {
        finalizarDescanso();
      }
    }, 1000);
  } else if (rodando) {
    tornarFalse(); // Pausa o timer (principal ou descanso)
  }
});

stopButton.addEventListener("click", tornarFalse);
changeModeButton.addEventListener("click", changeMode)
