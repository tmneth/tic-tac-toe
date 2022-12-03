(function isSessionUp() {
  if (!window.sessionStorage.length) window.location.assign("auth.html");
})();

let sessionData = JSON.parse(window.sessionStorage.getItem("sessionData"));

const strike = document.getElementById("strike");
const firstPlayerName = document.getElementById("player-x-name");
const secondPlayerName = document.getElementById("player-o-name");
const firstPlayerWinsCount = document.getElementById("x-wins");
const secondPlayerWinsCount = document.getElementById("o-wins");
const tiesCount = document.getElementById("ties");
const turn = document.getElementById("turn");
const startNewGame = document.getElementById("new-game");
const squares = document.querySelectorAll(".square");

(function updateGameState() {
  document.title = `session: ${sessionData.sessionName}`;

  firstPlayerName.innerHTML = sessionData["X"].name;
  secondPlayerName.innerHTML = sessionData["O"].name;
  firstPlayerWinsCount.innerHTML = sessionData["X"].wins;
  secondPlayerWinsCount.innerHTML = sessionData["O"].wins;
  tiesCount.innerHTML = sessionData.ties;

  currPlayer = "X";
  gameIsFinished = false;
})();

const padState = Array(squares.length);
padState.fill(null);

squares.forEach((square) => square.addEventListener("click", squareClick));

function recordMove(firstPlayer, secondPlayer, square) {
  const squareNum = square.dataset.index;

  square.innerHTML = firstPlayer;
  padState[squareNum - 1] = firstPlayer;
  currPlayer = secondPlayer;
}

function squareClick(event) {
  const square = event.target;

  if (gameIsFinished) return;

  if (square.innerHTML) {
    return;
  } else if (currPlayer === "X") {
    recordMove("X", "O", square);
  } else {
    recordMove("O", "X", square);
  }

  turn.innerHTML = `${currPlayer}'s Turn`;

  squareHover();
  identifyWinner();
}

document.body.addEventListener("keydown", squareKeyTrigger, false);

function squareKeyTrigger(event) {
  const keyCode = event.keyCode;

  navigator.vibrate(150);

  for (let numCode = 49, i = 0; numCode <= 57; numCode++, i++) {
    if (keyCode === numCode) {
      const square = squares[i];
      if (gameIsFinished) return;

      if (square.innerHTML) {
        return;
      } else if (currPlayer === "X") {
        recordMove("X", "O", square);
      } else {
        recordMove("O", "X", square);
      }

      turn.innerHTML = `${currPlayer}'s Turn`;
      squareHover();
      identifyWinner();
    }
  }
}

function squareHover() {
  squares.forEach((square) => {
    square.classList.remove("X-hover");
    square.classList.remove("O-hover");
  });

  const hoverClass = `${currPlayer}-hover`;

  squares.forEach((square) => {
    if (square.innerHTML == "") {
      square.classList.add(hoverClass);
    }
  });
}

squareHover();

const highlightWinner = (combination) => {
  for (let i = 0; i < combination.length; ++i)
    squares[combination[i] - 1].classList.add("winning-square");
};

const highlightTie = () => {
  squares.forEach((square) => square.classList.add("tie-animation"));
};

const winningCombinations = [
  { combination: [1, 2, 3] },
  { combination: [4, 5, 6] },
  { combination: [7, 8, 9] },
  { combination: [1, 4, 7] },
  { combination: [2, 5, 8] },
  { combination: [3, 6, 9] },
  { combination: [1, 5, 9] },
  { combination: [3, 5, 7] },
];

function identifyWinner() {
  for (winningSet of winningCombinations) {
    const firstSquare = padState[winningSet.combination[0] - 1];
    const secondSquare = padState[winningSet.combination[1] - 1];
    const thirdSquare = padState[winningSet.combination[2] - 1];

    // console.log(
    //   `set: ${winningSet.combination}, 1:${firstSquare}, 2: ${secondSquare}, 3:${thirdSquare}`
    // );

    if (
      firstSquare &&
      firstSquare == secondSquare &&
      firstSquare == thirdSquare
    ) {
      updateWinsCount(firstSquare);
      highlightWinner(winningSet.combination);
      gameIsFinished = true;
      turn.innerHTML = `${sessionData[firstSquare].name} WON!`;
      return;
    }
  }

  const allSquaresFilled = padState.every((square) => square != null);

  if (allSquaresFilled && !gameIsFinished) {
    updateTieCount();
    highlightTie();
    gameIsFinished = true;
    turn.innerHTML = "TIE!";
    return;
  }
}

function updateTieCount() {
  sessionData.ties++;
  tiesCount.innerHTML = sessionData.ties;
  window.sessionStorage.setItem("sessionData", JSON.stringify(sessionData));
}

function updateWinsCount(userId) {
  sessionData[userId].wins++;
  if (userId === "X") {
    firstPlayerWinsCount.innerHTML = sessionData[userId].wins;
  } else {
    secondPlayerWinsCount.innerHTML = sessionData[userId].wins;
  }
  window.sessionStorage.setItem("sessionData", JSON.stringify(sessionData));
}

function newGame() {
  gameIsFinished = false;

  padState.fill(null);

  squares.forEach((square) => (square.className = "strike"));

  squares.forEach((square) => (square.innerText = ""));

  currPlayer = "X";
  turn.innerHTML = `${currPlayer}'s Turn`;

  squareHover();
}

startNewGame.addEventListener("click", newGame);
