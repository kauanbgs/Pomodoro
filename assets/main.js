const timer1 = document.querySelector(".container .main .pomo #min");
const startButton = document.querySelector(".container .main .pomo .buttons .start");
const stopButton = document.querySelector(".container .main .pomo .buttons .pause");
const resetButton = document.querySelector(".container .main .pomo .buttons .restart");
const perce = document.querySelector(".container .main .pomo .slider .teste");

let seconds = 3;
let minutes = 0;
let rodando = false;
let intervalo = null;

var buzina = new Audio('assets\campainha-331260.mp3');

function tornarFalse() {
  rodando = false;
  clearInterval(intervalo);
  intervalo = null;
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
  tornarFalse();
  minutes = 25;
  seconds = 0;
  atualizarDisplay();
}

function timer() {
  if (rodando) return;

  rodando = true;
  atualizarDisplay();

  intervalo = setInterval(function () {
    seconds--;
    if (seconds < 0) {
      seconds = 59;
      minutes--;
      if (minutes < 0) {
        tornarFalse()
        tempoDescanso()
      }
    }
    atualizarDisplay();
  }, 1000);
}

function tempoDescanso(){
  buzina.play();
  minutes = 5
  seconds = 0
  intervalo = setInterval(function () {
    atualizarDisplay();

    seconds--

    if (seconds < 0){
      seconds = 59
      minutes --
    }
  }, 1000);
}

startButton.addEventListener("click", timer);
stopButton.addEventListener("click", tornarFalse);
resetButton.addEventListener("click", resetar);

atualizarDisplay();