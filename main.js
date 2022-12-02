let sessionData = {
  X: { name: "XXX", wins: 0 },
  O: { name: "OOO", wins: 0 },
  ties: 0,
};

currPlayer = "X";
currGameNum = 0;
gameIsFinished = false;

const strike = document.getElementById("strike");
const firstPlayerWinsCount = document.getElementById("x-wins");
const secondPlayerWinsCount = document.getElementById("y-wins");
const tiesCount = document.getElementById("ties");
const messageBanner = document.getElementById("banner");
const bannerText = document.getElementById("banner-text");
const startNewGame = document.getElementById("new-game");

const setProps = (playerId, oldIcon, newIcon, isEnabled, newOnClick) => {
  const playerNameSection =
    document.getElementsByClassName("player-name-group")[playerId];

  let currPlayerName = playerNameSection.getElementsByTagName("input");
  let currIcon = playerNameSection.getElementsByTagName("i");

  for (let i = 0; i < currPlayerName.length; i++) {
    currPlayerName[i].disabled = !isEnabled;
    currIcon[i].classList.replace(oldIcon, newIcon);
    currIcon[i].onclick = function () {
      newOnClick(playerId, currPlayerName[i].value);
    };
  }
};

const modifyPlayerName = (playerId) => {
  setProps(playerId, "fa-pen-to-square", "fa-floppy-disk", true, setPlayerName);
};

const setPlayerName = (playerId, newName) => {
  const currPlayer = playerId === 0 ? "player-X" : "player-O";
  sessionData[currPlayer] = newName;
  setProps(
    playerId,
    "fa-floppy-disk",
    "fa-pen-to-square",
    false,
    modifyPlayerName
  );
};

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
  identifyWinner();
  //   console.log(padState);
}

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
      messageBanner.style.display = "block";
      bannerText.innerHTML = `${sessionData[firstSquare].name} WON!`;
      updateTitle();
      return;
    }

    const allSquaresFilled = padState.every((square) => square != null);

    if (allSquaresFilled && !gameIsFinished) {
      updateTieCount();
      gameIsFinished = true;
      messageBanner.style.display = "block";
      bannerText.innerHTML = "TIE!";
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

  messageBanner.style.display = "none";

  padState.fill(null);

  strike.className = "strike";

  squares.forEach((square) => (square.innerText = ""));
}

function updateTitle() {
  document.title = `${sessionData["X"].wins}/${sessionData["O"].wins}/${sessionData.ties}`;
}

startNewGame.addEventListener("click", newGame);
