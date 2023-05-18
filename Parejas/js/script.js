document.addEventListener("DOMContentLoaded", function() {
  const cards = ["🐶", "🐱", "🐭", "🐹", "🐰", "🦊", "🐻", "🐼", "🐯", "🦁", "🐷", "🐸"];

  const gamePanel = document.getElementById("game-panel");
  
  const turnsDisplay = document.getElementById("turns");
  const matchesDisplay = document.getElementById("matches");
  const mistakesDisplay = document.getElementById("mistakes");
  const timerDisplay = document.getElementById("timer");
  
  const btnStart = document.getElementById("start");
  const btnRestart = document.getElementById("restart");
  const btnPausePlay = document.getElementById("pause");
  
  // Asociar las funciones a los botones
  btnStart.addEventListener("click", startGame);
  btnRestart.addEventListener("click", resetGame);
  btnPausePlay.addEventListener("click", togglePause);
  
  // Variable para controlar si el juego está pausado o no
  let isPaused = false;
  
  // Función para alternar entre pausa y reproducción
  function togglePause() {
    if (isPaused) {
      startGame();
      btnPausePlay.textContent = "Pausar Juego";
    } else {
      pauseGame();
      btnPausePlay.textContent = "Continuar Juego";
    }
  
    isPaused = !isPaused;
  }
  let cardsFlipped = [];
  let cardsMatched = [];
  let turns = 0;
  let matches = 0;
  let mistakes = 0;
  let timer = 0;
  let timerInterval;

  generateGame();

  function generateGame() {
    // Duplicar el arreglo de cartas
    const duplicatedCards = [...cards, ...cards];

    // Barajar las cartas aleatoriamente
    const shuffledCards = shuffleArray(duplicatedCards);

    // Limpiar el panel de juego
    gamePanel.innerHTML = "";

    // Crear las cartas en el panel de juego
    shuffledCards.forEach(function(card) {
      const cardElement = document.createElement("div");
      cardElement.classList.add("card");
      const cardInnerElement = document.createElement("div");
      cardInnerElement.classList.add("card-inner");
      cardInnerElement.classList.add("card-back");
      cardInnerElement.textContent = card;
      cardElement.addEventListener("click", flipCard);
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
    timerDisplay.textContent = timer;
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
    const card = event.target;
    if (cardsFlipped.length < 2 && !cardsFlipped.includes(card)) {
      card.classList.add("flipped");
      if (card.classList.contains("card-back")) {
        card.classList.remove("card-back");
        card.classList.add("card-front");
      } else {
        card.classList.remove("card-front");
        card.classList.add("card-back");
      }
      cardsFlipped.push(card);

      if (cardsFlipped.length === 2) {
        turns++;
        turnsDisplay.textContent = turns;

        const card1 = cardsFlipped[0];
        const card2 = cardsFlipped[1];

        if (card1.textContent === card2.textContent) {
          // Las cartas coinciden
          cardsMatched.push(card1, card2);
          matches++;
          matchesDisplay.textContent = matches;

          if (matches === cards.length / 2) {
            // Juego completado
            clearInterval(timerInterval);
            alert("¡Felicitaciones! Has completado el juego.");
          }
        } else {
          // Las cartas no coinciden
          mistakes++;
          mistakesDisplay.textContent = mistakes;

          setTimeout(function() {
            card1.classList.remove("flipped");
            card2.classList.remove("flipped");
          }, 1000);
        }

        cardsFlipped = [];
      }
    }
  }

  // Función para iniciar la partida
  function startGame() {
    generateGame();
    startTimer();
  }

  // Función para pausar la partida
  function pauseGame() {
    clearInterval(timerInterval);
  }

  // Función para reiniciar la partida
  function resetGame() {
    clearInterval(timerInterval);
    generateGame();
  }

  // Función para iniciar el temporizador
  function startTimer() {
    timerInterval = setInterval(function() {
      timer++;

      // Calcular minutos y segundos
      const minutes = Math.floor(timer / 60);
      const seconds = timer % 60;

      // Formatear el tiempo como mm:ss
      const formattedTime = `${padZero(minutes)}:${padZero(seconds)}`;

      // Mostrar el tiempo en el elemento con el id "timer"
      timerDisplay.textContent = formattedTime;
    }, 1000);
  }

  // Función para agregar un cero a la izquierda si el número es menor a 10
  function padZero(num) {
    return num < 10 ? `0${num}` : num;
  }
});
