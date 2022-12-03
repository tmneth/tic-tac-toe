let sessionData = {
  sessionName: "",
  X: { name: "X", wins: 0 },
  O: { name: "O", wins: 0 },
  ties: 0,
};

let contactForm = document.getElementById("form");

contactForm.addEventListener("submit", function (e) {
  e.preventDefault();
  window.location.assign("index.html");

  sessionData.sessionName = document.getElementById("session-name").value;
  sessionData["X"].name = document.getElementById("player-x-name").value;
  sessionData["O"].name = document.getElementById("player-o-name").value;

  window.localStorage.setItem("sessionData", JSON.stringify(sessionData));
});
