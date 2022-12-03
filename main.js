let sessionData = JSON.parse(window.localStorage.getItem("sessionData"));

(function updateGameState() {
  document.title = sessionData.sessionName;

  document.getElementById("player-x-name").innerHTML = sessionData["X"].name;
  document.getElementById("player-o-name").innerHTML = sessionData["O"].name;
})();

currPlayer = "X";
currGameNum = 0;
gameIsFinished = false;

const strike = document.getElementById("strike");
const firstPlayerWinsCount = document.getElementById("x-wins");
const secondPlayerWinsCount = document.getElementById("o-wins");
const tiesCount = document.getElementById("ties");
const turn = document.getElementById("turn");
const startNewGame = document.getElementById("new-game");

const squares = document.querySelectorAll(".square");

const padState = Array(squares.length);
padState.fill(null);

console.log(padState);

squares.forEach((square) => square.addEventListener("click", squareClick));

function squareClick(event) {
  const square = event.target;
  const squareNum = square.dataset.index;

  if (gameIsFinished) return;

  if (square.innerHTML) {
    return;
  } else if (currPlayer === "X") {
    square.innerHTML = "X";
    padState[squareNum - 1] = "X";
    currPlayer = "O";
  } else {
    square.innerHTML = "O";
    padState[squareNum - 1] = "O";
    currPlayer = "X";
  }
  turn.innerHTML = `${currPlayer}'s Turn`;
  squareHover();
  identifyWinner();
  //   console.log(padState);
}

document.body.addEventListener("keydown", squareKeyTrigger, false);

function squareKeyTrigger(event) {
  const keyCode = event.keyCode;

  for (let numCode = 49, i = 0; numCode <= 57; numCode++, i++) {
    if (keyCode === numCode) {
      const square = squares[i];
      const squareNum = square.dataset.index;
      if (gameIsFinished) return;

      if (square.innerHTML) {
        return;
      } else if (currPlayer === "X") {
        square.innerHTML = "X";
        padState[squareNum - 1] = "X";
        currPlayer = "O";
      } else {
        square.innerHTML = "O";
        padState[squareNum - 1] = "O";
        currPlayer = "X";
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

const winningCombinations = [
  { combination: [1, 2, 3], strikeThrough: "s-row-1" },
  { combination: [4, 5, 6], strikeThrough: "s-row-2" },
  { combination: [7, 8, 9], strikeThrough: "s-row-3" },
  { combination: [1, 4, 7], strikeThrough: "s-col-1" },
  { combination: [2, 5, 8], strikeThrough: "s-col-2" },
  { combination: [3, 6, 9], strikeThrough: "s-col-3" },
  { combination: [1, 5, 9], strikeThrough: "s-diag-1" },
  { combination: [3, 5, 7], strikeThrough: "s-diag-2" },
];

function identifyWinner() {
  for (winningSet of winningCombinations) {
    const firstSquare = padState[winningSet.combination[0] - 1];
    const secondSquare = padState[winningSet.combination[1] - 1];
    const thirdSquare = padState[winningSet.combination[2] - 1];

    if (
      firstSquare &&
      firstSquare == secondSquare &&
      firstSquare == thirdSquare
    ) {
      updateWinsCount(firstSquare);
      strike.classList.add(winningSet.strikeThrough);
      gameIsFinished = true;
      turn.innerHTML = `${sessionData[firstSquare].name} WON!`;
      updateTitle();
      return;
    }

    const allSquaresFilled = padState.every((square) => square != null);

    if (allSquaresFilled && !gameIsFinished) {
      updateTieCount();
      gameIsFinished = true;
      turn.innerHTML = "TIE!";
      updateTitle();
      return;
    }
  }
}

function updateTieCount() {
  sessionData.ties++;
  tiesCount.innerHTML = sessionData.ties;
}

function updateWinsCount(userId) {
  sessionData[userId].wins++;
  if (userId === "X") firstPlayerWinsCount.innerHTML = sessionData[userId].wins;
  else secondPlayerWinsCount.innerHTML = sessionData[userId].wins;
}

function newGame() {
  gameIsFinished = false;

  padState.fill(null);

  strike.className = "strike";

  squares.forEach((square) => (square.innerText = ""));

  currPlayer = "X";
  turn.innerHTML = `${currPlayer}'s Turn`;

  squareHover();
}

function updateTitle() {
  document.title = `${sessionData["X"].wins}/${sessionData["O"].wins}/${sessionData.ties}`;
}

startNewGame.addEventListener("click", newGame);
