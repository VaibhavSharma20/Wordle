const StatsBtn = document.querySelector("[Stats]");
const WordsBtn = document.querySelector("[Words]");
const StatDiv = document.querySelector(".stats");
const WordDiv = document.querySelector(".words");
const AddBtn = document.querySelector("[Add]");
const DeleteBtn = document.querySelector("[Delete]");
const Input = document.querySelector(".input");
const Msg = document.querySelector(".message-container");
const WordListDiv = document.querySelector(".word-list");
const TotalWords = document.getElementById("Total");
const TodayDiv = document.querySelector(".today");

var wordList = [];

const Statistics = () => {
  let messageElement1 = document.createElement("h1");
  let messageElement2 = document.createElement("h1");
  let messageElement3 = document.createElement("h1");
  let messageElement4 = document.createElement("h1");
  let messageElement5 = document.createElement("h1");

  setInterval(function () {
    fetch(`https://stark-peak-11066.herokuapp.com/dashboard`)
      .then((response) => response.json())
      .then((json) => {
        values = json;

        messageElement1.textContent = "Games Played: " + values.games;
        StatDiv.append(messageElement1);
        messageElement2.textContent = "Shares: " + values.share;
        StatDiv.append(messageElement2);
        messageElement3.textContent = "ThumbsUp: " + values.thumbsup;
        StatDiv.append(messageElement3);
        messageElement4.textContent = "ThumbsDown: " + values.thumbsdown;
        StatDiv.append(messageElement4);

        fetch("https://stark-peak-11066.herokuapp.com/word")
          .then((response) => response.json())
          .then((json) => {
            var wordle = json.toUpperCase();
            messageElement5.textContent = wordle;
            TodayDiv.append(messageElement5);
          });
      });
  }, 1000);
};
Statistics();

const GetWords = () => {
  TotalWords.innerHTML = "WORDS (" + wordList.length + ")";
  url = "https://stark-peak-11066.herokuapp.com/get";
  params = {
    method: "get",
    headers: {
      "Content-Type": "application/json",
    },
  };

  fetch(url, params)
    .then((response) => response.json())
    .then((json) => {
      json.forEach((val) => {
        if (wordList.includes(val.word) == false) {
          wordList.push(val.word);
          var p = document.createElement("p");
          p.classList.add("list");
          p.textContent = val.word;
          WordListDiv.append(p);
          TotalWords.innerHTML = "WORDS (" + wordList.length + ")";
        }
      });
    });
};
GetWords();

StatsBtn.addEventListener("click", () => {
  StatDiv.classList.remove("inactive");
  WordDiv.classList.add("inactive");
  TodayDiv.classList.remove("inactive");
});

WordsBtn.addEventListener("click", () => {
  StatDiv.classList.add("inactive");
  WordDiv.classList.remove("inactive");
  TodayDiv.classList.add("inactive");
});

const showMessage = (message) => {
  const messageElement = document.createElement("p");
  messageElement.textContent = message;
  Msg.append(messageElement);
  setTimeout(() => Msg.removeChild(messageElement), 2000);
};

AddBtn.addEventListener("click", () => {
  let word = Input.value;
  word = word.toUpperCase();
  if (word.length == 5) {
    url = "https://stark-peak-11066.herokuapp.com/create";
    data = { word: word };
    params = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(url, params)
      .then((response) => response.json())
      .then((json) => {
        if (json.msg == "Added") {
          if (wordList.includes(word)) {
            showMessage("Word Present In List");
          } else {
            showMessage("Word Added Successfully");
          }
        }
        Input.value = "";
        GetWords();
      });
  } else {
    showMessage("Word Length Is Less Than 5");
  }
});

DeleteBtn.addEventListener("click", () => {
  let word = Input.value;
  word = word.toUpperCase();
  if (word.length == 5) {
    url = "https://stark-peak-11066.herokuapp.com/delete";
    data = { word: word };
    params = {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    };

    fetch(url, params)
      .then((response) => response.json())
      .then((json) => {
        if (json.msg == "Deleted") {
          if (wordList.includes(word) == true) {
            showMessage("Word Deleted Successfully");
            const divs = document.querySelectorAll(".list");
            divs.forEach((div) => {
              if (div.innerHTML == word) {
                div.remove();
              }
              for (var i = 0; i < wordList.length; i++) {
                if (wordList[i] == word) {
                  wordList.splice(i, 1);
                  i--;
                  TotalWords.innerHTML = "WORDS (" + wordList.length + ")";
                }
              }
            });
          } else {
            showMessage("Word Not Present In List");
          }
        }
        Input.value = "";
        GetWords();
      });
  } else {
    showMessage("Word Length Is Less Than 5");
  }
});
