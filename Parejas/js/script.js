document.addEventListener("DOMContentLoaded", function () {
  const cards = [
    "🐶",
    "🐱",
    "🐭",
    "🐹",
    "🐰",
    "🦊",
    "🐻",
    "🐼",
    "🐯",
    "🦁",
    "🐷",
    "🐸"
  ];

  // const cards = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊"];

  const gamePanel = document.getElementById("game-panel");

  const turnsDisplay = document.getElementById("turns");
  const matchesDisplay = document.getElementById("matches");
  const mistakesDisplay = document.getElementById("mistakes");
  const scoreDisplay = document.getElementById("score");
  const timerDisplay = document.getElementById("timer");

  const btnStart = document.getElementById("start");
  const btnRestart = document.getElementById("restart");
  const btnPausePlay = document.getElementById("pause");

  const myModal = document.getElementById("myModal");

  const closeBtn = document.getElementById("close_modal_header");
  const close = document.getElementById("close_modal");
  const restartGame = document.getElementById("restore_game");

  const maxturns = 20;
  const maxTime = 300; // en segundos
  // Asociar las funciones a los botones
  btnStart.addEventListener("click", startGame);
  btnRestart.addEventListener("click", resetGame);
  btnPausePlay.addEventListener("click", togglePause);

  closeBtn.addEventListener("click", closeModal);
  close.addEventListener("click", closeModal);
  restartGame.addEventListener("click", restoreGame);

  // Variable para controlar si el juego está pausado o no
  let isPaused = false;
  let cardsFlipped = [];
  let cardsMatched = [];
  let turns = 0;
  let matches = 0;
  let mistakes = 0;
  let minutes = 0;
  let seconds = 0;
  let timer = 0;
  let timerInterval;

  // Función para alternar entre pausa y reproducción
  function togglePause() {
    if (isPaused) {
      startTimer();
      btnPausePlay.textContent = "Pausar Juego";
      isPaused = false;
    } else {
      pause();
      isPaused = true;
      btnPausePlay.textContent = "Continuar Juego";
    }
  }

  // Función para cerrar modal
  function closeModal() {
    const modalInstance = bootstrap.Modal.getInstance(myModal);
    modalInstance.hide();
  }

  generateGame();

  function generateGame() {
    // Duplicar el arreglo de cartas
    const duplicatedCards = [...cards, ...cards];

    // Barajar las cartas aleatoriamente
    const shuffledCards = shuffleArray(duplicatedCards);

    // Limpiar el panel de juego
    gamePanel.innerHTML = "";

    // Crear las cartas en el panel de juego
    shuffledCards.forEach(function (card) {
      const cardElement = document.createElement("div");
      const cardInnerElement = document.createElement("div");
      const span = document.createElement("span");
      cardElement.classList.add("card");
      cardInnerElement.classList.add("card-inner");
      span.textContent = card;
      cardElement.addEventListener("click", flipCard);
      cardInnerElement.appendChild(span);
      cardElement.appendChild(cardInnerElement);
      gamePanel.appendChild(cardElement);
    });

    // Reiniciar las variables y los contadores
    cardsFlipped = [];
    cardsMatched = [];
    turns = 0;
    matches = 0;
    mistakes = 0;
    timer = 0;
    clearInterval(timerInterval);
    turnsDisplay.textContent = turns;
    matchesDisplay.textContent = matches;
    mistakesDisplay.textContent = mistakes;
  }

  // Función para barajar un arreglo utilizando el algoritmo Fisher-Yates
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  // Función que selecciona la carta
  function flipCard(event) {
    const card = event.target.closest(".card");
    if (cardsFlipped.length < 2 && !cardsFlipped.includes(card)) {
      card.classList.add("flipped");
      cardsFlipped.push(card);
      if (cardsFlipped.length === 2) {
        turns++;
        turnsDisplay.textContent = turns;

        const card1 = cardsFlipped[0];
        const card2 = cardsFlipped[1];

        if (card1.textContent === card2.textContent) {
          // Las cartas coinciden
          cardsMatched.push(card1, card2);
          setTimeout(() => {
            card1.classList.add("success");
            card2.classList.add("success");
          }, 300);
          setTimeout(() => {
            card1.classList.remove("success");
            card2.classList.remove("success");
          }, 1000);
          matches++;
          matchesDisplay.textContent = matches;

          if (matches === cards.length) {
            // Juego completado
            clearInterval(timerInterval);
            setTimeout(() => {
              const text =
                "¡Felicitaciones! Has completado el juego. Tu puntuacion es de: " +
                calcStore();
              document.getElementById("text-modal").innerText = text;
              new bootstrap.Modal(myModal).show();
            }, 300);
            pause();
          }
        } else {
          // Las cartas no coinciden, tienes un fallo y a esas cartas hay que darles la vuelta
          mistakes++;
          mistakesDisplay.textContent = mistakes;
          setTimeout(() => {
            card1.classList.add("error");
            card2.classList.add("error");
          }, 100);

          setTimeout(function () {
            card1.classList.remove("error");
            card2.classList.remove("error");
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
          }, 1000);
        }
        scoreDisplay.textContent = calcStore();
        cardsFlipped = [];
      }
    }
  }
  // Funcion
  function calcStore() {
    // Calcular la puntuación basada en los intentos y el tiempo
    const turnsRatio = (maxturns - turns) / maxturns;
    const tiempoRatio = (maxTime - timer) / maxTime;

    // Puntuación total
    const store = Math.round((turnsRatio + tiempoRatio) * 100);

    return store;
  }

  // Función para iniciar la partida
  function startGame() {
    if (!timerInterval) {
      generateGame();
      startTimer();
      btnStart.disabled = true;
      btnPausePlay.disabled = false;
      btnRestart.disabled = false;
      isPaused = false;
    }
  }

  function restoreGame() {
    closeModal();
    resetGame();
    startGame();
    btnStart.disabled = true;
    btnPausePlay.disabled = false;
    btnRestart.disabled = false;
  }

  // Función para reiniciar la partida
  function resetGame() {
    reset();
    btnPausePlay.disabled = true;
    btnRestart.disabled = true;
    btnStart.disabled = false;
  }

  function startTimer() {
    gamePanel.classList.add("play");
    if (!timer) {
      timer = setInterval(runTimer, 1000);
    }
  }

  function runTimer() {
    seconds++;
    if (seconds === 60) {
      seconds = 0;
      minutes++;
    }
    timerDisplay.textContent = formatTime(minutes) + ":" + formatTime(seconds);
  }

  function pause() {
    gamePanel.classList.remove("play");
    clearInterval(timer);
    timer = null;
  }

  function reset() {
    pause();
    generateGame();
    minutes = 0;
    seconds = 0;
    // Mostrar el tiempo en el elemento con el id "timer"
    timerDisplay.textContent = "00:00";
  }
  // Función para agregar un cero a la izquierda si el número es menor a 10
  function formatTime(time) {
    return time < 10 ? "0" + time : time;
  }
});
