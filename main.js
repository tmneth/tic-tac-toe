let sessionData = {};

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
  const currPlayer = playerId === 0 ? "X" : "O";
  sessionData[currPlayer] = newName;
  setProps(
    playerId,
    "fa-floppy-disk",
    "fa-pen-to-square",
    false,
    modifyPlayerName
  );
};
