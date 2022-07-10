const tileDisplay = document.querySelector(".tile-container");
const keyboard = document.querySelector(".key-container");
const messageDisplay = document.querySelector(".message-container");
const scoreDisplay = document.querySelector(".modal-body");
const openModalButtons = document.querySelectorAll("[data-modal-target]");
const closeModalButtons = document.querySelectorAll("[data-close-button]");
const overlay = document.getElementById("overlay");
const sharebtns = document.querySelectorAll("[share-button]");
const endModal = document.getElementById("end-modal");
const stat = document.querySelector(".modal-winstat");
const score = document.querySelector(".modal-score");
const copymsg = document.querySelector(".popup");
const thumbsup = document.querySelector("[thumbs-up]");
const thumbsdown = document.querySelector("[thumbs-down]");
const feedback = document.querySelector(".modal-feedback");
const timer_div = document.getElementById("timer_div");
const timer_end = document.querySelector(".countdown");

var wordle;
var dailyScore;
var weekScore;
var week;
var leaderBoard;
var guessRows;
var currentRow;
var gamesplayed;
var gussed;
var flag = true;
const keys = [
  "Q",
  "W",
  "E",
  "R",
  "T",
  "Y",
  "U",
  "I",
  "O",
  "P",
  "A",
  "S",
  "D",
  "F",
  "G",
  "H",
  "J",
  "K",
  "L",
  "ENT",
  "Z",
  "X",
  "C",
  "V",
  "B",
  "N",
  "M",
  "«",
];
var currentTile = 0;
currentRow = localStorage.getItem("CurrentRow");
if (currentRow == null) {
  currentRow = 0;
}
gussed = JSON.parse(localStorage.getItem("gusses"));
if (gussed == null) {
  gussed = [];
}

guessRows = [
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
  ["", "", "", "", ""],
];

const countdown = () => {
  var current = new Date();
  var h = current.getHours();
  var m = current.getMinutes();
  var s = current.getSeconds();
  if (h <= 11) {
    h = 11 - h;
    m = 60 - m;
    s = 60 - s;
  }
  if (h > 11) {
    h = 23 - h;
    m = 60 - m;
    s = 60 - s;
  }
  if (h < 10) {
    h = "0" + h;
  }
  if (m < 10) {
    m = "0" + m;
  }
  if (s < 10) {
    s = "0" + s;
  }
  var time = h + ":" + m + ":" + s;
  timer_div.innerHTML = time;
  timer_end.innerHTML = time;
  my_timer = setInterval(function () {
    var hr = 0;
    var min = 0;
    var sec = 0;
    var time_up = false;
    var t = time.split(":");
    hr = parseInt(t[0]);
    min = parseInt(t[1]);
    sec = parseInt(t[2]);
    if (sec == 0) {
      if (min > 0) {
        sec = 59;
        min--;
      } else if (hr > 0) {
        min = 59;
        sec = 59;
        hr--;
      } else {
        time_up = true;
      }
    } else {
      sec--;
    }
    if (hr < 10) {
      hr = "0" + hr;
    }
    if (min < 10) {
      min = "0" + min;
    }
    if (sec < 10) {
      sec = "0" + sec;
    }
    time = hr + ":" + min + ":" + sec;
    timer_div.innerHTML = time;
    timer_end.innerHTML = time;
    if (time_up) {
      clearInterval(my_timer);
    }
  }, 1000);
};
countdown();

openModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = document.querySelector(button.dataset.modalTarget);

    let ds = localStorage.getItem("DailyScore");
    let ws = localStorage.getItem("WeeklyScore");
    let gp = localStorage.getItem("gamesplayed");
    if (ds == null) {
      ds = 0;
    }
    if (ws == null) {
      ws = 0;
    }
    if (gp == null) {
      gp = 0;
    }
    let messageElement = document.createElement("h3");
    messageElement.textContent = "Daily Score: " + ds;
    scoreDisplay.append(messageElement);

    messageElement = document.createElement("h3");
    messageElement.textContent = "Weekly Score: " + ws;
    scoreDisplay.append(messageElement);

    messageElement = document.createElement("h3");
    messageElement.textContent = "Games Played: " + gp + "/14";
    scoreDisplay.append(messageElement);

    openModal(modal);
  });
});

overlay.addEventListener("click", () => {
  const modals = document.querySelectorAll(".modal.active");
  modals.forEach((modal) => {
    closeModal(modal);
  });
});

closeModalButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const modal = button.closest(".modal");
    closeModal(modal);
  });
});

function openModal(modal) {
  if (modal == null) return;
  modal.classList.add("active");
  overlay.classList.add("active");
}

function closeModal(modal) {
  if (modal == null) return;
  modal.classList.remove("active");
  overlay.classList.remove("active");
  scoreDisplay.innerHTML = "";
}

for (sharebtn of sharebtns) {
  sharebtn.addEventListener("click", function () {
    let ds = localStorage.getItem("DailyScore");
    let ws = localStorage.getItem("WeeklyScore");
    if (ds == null) {
      ds = 0;
    }
    if (ws == null) {
      ws = 0;
    }

    url = "https://stark-peak-11066.herokuapp.com/share";
    params = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    };
    fetch(url, params).then((response) => response.json());

    const textarea = document.createElement("textarea");
    const text =
      "Hey, I came across Wordle with Daily and Weekly Score." +
      "\n\nDaily Score: " +
      ds +
      " | Weekly Score: " +
      ws +
      "\n\nHere is my score☝️, What's yours?";
    textarea.setAttribute("readonly", "");
    textarea.style.position = "absolute";
    textarea.style.opacity = 0;
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    popup("Copied to clipboard");
  });
}

const getWordle = () => {
  fetch("https://stark-peak-11066.herokuapp.com/word")
    .then((response) => response.json())
    .then((json) => {
      wordle = json.toUpperCase();

      if (localStorage.getItem("Wordle") != md5(wordle)) {
        localStorage.setItem("CurrentRow", parseInt(0));
        gussed = [];
        localStorage.setItem("gusses", JSON.stringify(gussed));
        currentRow = 0;
      }

      if (
        localStorage.getItem("Played") == null ||
        localStorage.getItem("Wordle") != md5(wordle) ||
        localStorage.getItem("Played") == md5("No")
      ) {
        localStorage.setItem("Played", md5("No"));
        localStorage.setItem("Wordle", md5(wordle));
        localStorage.setItem("currentRow", parseInt(0));
        dailyScore = 0;
      } else {
        endResult();
      }

      guessRows.forEach((guessRow, guessRowIndex) => {
        const rowElement = document.createElement("div");
        rowElement.setAttribute("id", "guessRow-" + guessRowIndex);
        guessRow.forEach((_guess, guessIndex) => {
          const tileElement = document.createElement("div");
          tileElement.setAttribute(
            "id",
            "guessRow-" + guessRowIndex + "-tile-" + guessIndex
          );

          if (guessRowIndex < gussed.length) {
            tileElement.innerText = gussed[guessRowIndex][guessIndex].letter;
            tileElement.classList.add(gussed[guessRowIndex][guessIndex].color);
            tileElement.classList.add("flip");
            addColorToKey(
              gussed[guessRowIndex][guessIndex].letter,
              gussed[guessRowIndex][guessIndex].color
            );
          }
          tileElement.classList.add("tile");
          rowElement.append(tileElement);
        });

        tileDisplay.append(rowElement);
      });

      fetch("https://stark-peak-11066.herokuapp.com/weekno")
        .then((response) => response.json())
        .then((json) => {
          week = json;
          if (
            localStorage.getItem("WeeklyScore") == null ||
            localStorage.getItem("Week") != week
          ) {
            openModalButtons[1].click();
            weekScore = parseInt(0);
            gamesplayed = parseInt(0);
            localStorage.setItem("Week", week);
            localStorage.setItem("WeeklyScore", weekScore);
            localStorage.setItem("gamesplayed", gamesplayed);
          } else {
            weekScore = parseInt(localStorage.getItem("WeeklyScore"));
            gamesplayed = parseInt(localStorage.getItem("gamesplayed"));
          }
        });
    })
    .catch((err) => console.log(err));
};
getWordle();

const addColorToKey = (keyLetter, color) => {
  const key = document.getElementById(keyLetter);
  key.classList.add(color);
};

const calculate = () => {
  dailyScore = 0;
  gussed.forEach((guessRow, guessRowIndex) => {
    guessRow.forEach((_guess, guessIndex) => {
      const check = _guess.color;
      if (check == "green-overlay") {
        dailyScore = dailyScore + 10;
      } else if (check == "yellow-overlay") {
        dailyScore = dailyScore + 3;
      } else if (check == "grey-overlay") {
        dailyScore = dailyScore - 1;
      }
    });
  });
  dailyScore = dailyScore / currentRow;
  dailyScore = Math.floor(dailyScore + (7 - currentRow) * 20);
  localStorage.setItem("DailyScore", dailyScore);
  postData(dailyScore);
  weekScore = weekScore + dailyScore;
  localStorage.setItem("WeeklyScore", weekScore);
  gamesplayed = gamesplayed + 1;
  localStorage.setItem("gamesplayed", gamesplayed);

  url = "https://stark-peak-11066.herokuapp.com/gamesplayed";
  params = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
  };
  fetch(url, params).then((response) => response.json());

  setTimeout(endResult, 3000);
};

keys.forEach((key) => {
  const buttonElement = document.getElementById(key);
  buttonElement.addEventListener("click", () => handleClick(key));
});

window.addEventListener("keydown", function (e) {
  keycode = e.keyCode;
  if ((keycode > 64 && keycode < 91) || keycode == 13 || keycode == 8) {
    key = e.key.toUpperCase();
    handleClick(key);
  }
});

const handleClick = (letter) => {
  if (localStorage.getItem("Played") != md5("Yes") && flag == true) {
    if (letter === "«" || letter == "BACKSPACE") {
      deleteLetter();
      return;
    }
    if (letter === "ENT" || letter == "ENTER") {
      if (guessRows[currentRow][4] != "") {
        checkRow();
      }
      return;
    }
    addLetter(letter);
  }
};

const addLetter = (letter) => {
  if (currentTile < 5 && currentRow < 6) {
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = letter;
    guessRows[currentRow][currentTile] = letter;
    tile.setAttribute("data", letter);
    currentTile++;
  }
};

const deleteLetter = () => {
  if (currentTile > 0) {
    currentTile--;
    const tile = document.getElementById(
      "guessRow-" + currentRow + "-tile-" + currentTile
    );
    tile.textContent = "";
    guessRows[currentRow][currentTile] = "";
    tile.setAttribute("data", "");
  }
};

const checkRow = () => {
  flag = false;
  const guess = guessRows[currentRow].join("");
  if (currentTile > 4) {
    fetch(`https://stark-peak-11066.herokuapp.com/check/?word=${guess}`)
      .then((response) => response.json())
      .then((json) => {
        const f = JSON.parse("false");
        if (json == f) {
          showMessage("Oops, not a word!! 🤭");
          flag = true;
          return;
        } else {
          flipTile();
          if (wordle == guess) {
            showMessage("You got that right!! 😉");
            localStorage.setItem("Played", md5("Yes"));
            currentRow++;
            calculate();
            return;
          } else {
            if (currentRow >= 5) {
              showMessage("Game Over");
              localStorage.setItem("Played", md5("Yes"));
              currentRow++;
              calculate();
              return;
            }
            if (currentRow < 5) {
              currentRow++;
              localStorage.setItem("CurrentRow", currentRow);
              currentTile = 0;
            }
          }
        }
      })
      .catch((err) => console.log(err));
  }
};

const showMessage = (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  messageDisplay.append(messageElement);
  setTimeout(() => messageDisplay.removeChild(messageElement), 2000);
};

const popup = (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  copymsg.style.opacity = 100;
  copymsg.append(messageElement);
  setTimeout(() => {
    copymsg.removeChild(messageElement);
    copymsg.style.opacity = 0;
  }, 2000);
};

const flipTile = () => {
  const rowTiles = document.querySelector("#guessRow-" + currentRow).childNodes;
  let checkWordle = wordle;
  const guess = [];

  rowTiles.forEach((tile) => {
    guess.push({ letter: tile.getAttribute("data"), color: "grey-overlay" });
  });

  guess.forEach((guess, index) => {
    if (guess.letter == wordle[index]) {
      guess.color = "green-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  guess.forEach((guess) => {
    if (checkWordle.includes(guess.letter) && guess.color != "green-overlay") {
      guess.color = "yellow-overlay";
      checkWordle = checkWordle.replace(guess.letter, "");
    }
  });

  gussed.push(guess);
  localStorage.setItem("gusses", JSON.stringify(gussed));

  rowTiles.forEach((tile, index) => {
    setTimeout(() => {
      tile.classList.add("flip");
      tile.classList.add(guess[index].color);
      addColorToKey(guess[index].letter, guess[index].color);
      if (index == 4) {
        flag = true;
      }
    }, 500 * index);
  });
};

function postData(points) {
  url = "https://stark-peak-11066.herokuapp.com/leaderboard";
  data = { Score: points };
  params = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(url, params).then((response) => response.json());
}

function endResult() {
  overlay.classList.add("active");
  endModal.classList.add("active");

  let messageElement1 = document.createElement("h4");
  let messageElement2 = document.createElement("h4");
  fetch(`https://stark-peak-11066.herokuapp.com/getleaderboard`)
    .then((response) => response.json())
    .then((json) => {
      leaderBoard = json;
      var ds = parseInt(localStorage.getItem("DailyScore"));
      var lb = leaderBoard.leaderboard;
      if (lb.length == 5) {
        if (lb.includes(ds)) {
          messageElement1.textContent = "Congratulations!! 🎉";
          stat.append(messageElement1);
          messageElement2.textContent = "You are in Top 5 for the day!";
          stat.append(messageElement2);
        } else {
          messageElement1.textContent = "Oops!! 😟";
          stat.append(messageElement1);
          messageElement2.textContent =
            "You couldn't make it to the Top 5 today!";
          stat.append(messageElement2);
        }
      } else {
        messageElement1.textContent = "Congratulations!! 🎉";
        stat.append(messageElement1);
        messageElement2.textContent = "You are in Top 5 for the day!";
        stat.append(messageElement2);
      }

      messageElement = document.createElement("h3");
      messageElement.textContent =
        "🏆Daily Score: " + localStorage.getItem("DailyScore");
      score.append(messageElement);

      messageElement = document.createElement("h3");
      messageElement.textContent =
        "🏆Weekly Score: " + localStorage.getItem("WeeklyScore");
      score.append(messageElement);
    });
}

var thmubbtn = 0;
thumbsup.addEventListener("click", function () {
  if (document.querySelector(".fb") == null) {
    feedbackmsg();
    thumbsup.classList.add("thumb-changebg");
    sendfeedbackup(1);
    thmubbtn = 1;
  } else {
    document.querySelector(".fb").remove();
    document
      .querySelector(".thumb-changebg")
      .classList.remove("thumb-changebg");
    feedbackmsg();
    if (thmubbtn == 2) {
      thmubbtn = 1;
      sendfeedbackup(1);
      sendfeedbackdown(-1);
    }
  }

  function feedbackmsg() {
    thumbsup.classList.add("thumb-changebg");
    let messageElement = document.createElement("h4");
    messageElement.textContent =
      "Thanks for a positive feedback!";
    messageElement.classList.add("fb");
    feedback.append(messageElement);
  }
});

thumbsdown.addEventListener("click", function () {
  if (document.querySelector(".fb") == null) {
    feedbackmsg();
    thumbsdown.classList.add("thumb-changebg");
    sendfeedbackdown(1);
    thmubbtn = 2;
  } else {
    document.querySelector(".fb").remove();
    document
      .querySelector(".thumb-changebg")
      .classList.remove("thumb-changebg");
    feedbackmsg();
    if (thmubbtn == 1) {
      thmubbtn = 2;
      sendfeedbackup(-1);
      sendfeedbackdown(1);
    }
  }
  function feedbackmsg() {
    thumbsdown.classList.add("thumb-changebg");
    let messageElement = document.createElement("h4");
    messageElement.textContent = "Thanks for your feedback!";
    messageElement.classList.add("fb");
    feedback.append(messageElement);
  }
});

function sendfeedbackup(thumbs) {
  url = "https://stark-peak-11066.herokuapp.com/feedbackup";
  data = { up: thumbs };
  params = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(url, params).then((response) => response.json());
}

function sendfeedbackdown(thumbs) {
  url = "https://stark-peak-11066.herokuapp.com/feedbackdown";
  data = { down: thumbs };
  params = {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  };
  fetch(url, params).then((response) => response.json());
}
