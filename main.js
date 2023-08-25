let imgs = [
  {
    name: "cs",
    src: "imgs/cs.jpg",
  },
  {
    name: "css",
    src: "imgs/css.jpg",
  },
  {
    name: "gulp",
    src: "imgs/gulp.jpg",
  },
  {
    name: "html",
    src: "imgs/html.jpg",
  },
  {
    name: "react",
    src: "imgs/react.jpg",
  },
  {
    name: "python",
    src: "imgs/python.jpg",
  },
  {
    name: "mongo",
    src: "imgs/mongo.jpg",
  },
  {
    name: "laravel",
    src: "imgs/laravel.jpg",
  },
  {
    name: "js",
    src: "imgs/js.jpg",
  },
  {
    name: "java",
    src: "imgs/java.jpg",
  },
];
let audio = {
  correct: "audios/correct-choice.mp3",
  wrong: "audios/wronganswer.mp3",
  win: "audios/finalSuccess.mp3",
  lose: "audios/finalFail.mp3",
};
let duration = 500;
let mainTime = 120;
let correctCounter = 0;
let time = mainTime;
let name = "";
let nameContainer = document.querySelector(".name");
let mistakes = document.querySelector(".mistakes");
let _audio = document.querySelector("audio");
let counter;
let timeContainer = document.querySelector(".time span");
let cardsContainer = document.querySelector("main .container");
let scoreArray;
if (localStorage.getItem("score") !== null) {
  scoreArray = JSON.parse(localStorage.getItem("score"));
  addToTbody();
} else {
  scoreArray = [];
}
start(document.querySelector(".start-playing"));
formatTime(time);
function start(btn) {
  btn.addEventListener("click", (e) => {
    name = prompt("Eenter Your Name: ");
    if (name !== "") {
      nameContainer.innerHTML = name;
    } else {
      nameContainer.innerHTML = "unknown";
    }
    e.target.parentElement.remove();
    counter = setInterval(() => {
      formatTime(time);
      time--;
      if (time < 0) {
        clearInterval(counter);
        endGame();
      }
    }, 1000);
  });
}
function createCards(imgsArray) {
  imgsArray.forEach((img) => {
    let card = `<div class="card" data-tech="${img.name}">
        <div class="front"></div>
        <div class="back">
        <img src="${img.src}" alt="Alt" />
        </div>
        </div>`;
    let card1 = `<div class="card" data-tech="${img.name}">
        <div class="front"></div>
        <div class="back">
        <img src="${img.src}" alt="Alt" />
        </div>
        </div>`;
    cardsContainer.innerHTML += card;
    cardsContainer.innerHTML += card1;
  });
}
createCards(imgs);
let allCards = document.querySelectorAll(".card");
shuffleCards();
function shuffleCards() {
  let randomArr = createRandomArray(cardsContainer);
  for (let i = 0; i < allCards.length; i++) {
    allCards[i].style.order = randomArr[i];
  }
}

function createRandomArray(arr) {
  let length = arr.children.length,
    tmp,
    random;
  let randomArr = [...[...arr.children].keys()];
  for (let i = 0; i < length; i++) {
    random = Math.floor(Math.random() * length);
    tmp = randomArr[i];
    randomArr[i] = randomArr[random];
    randomArr[random] = tmp;
  }
  return randomArr;
}
allCards.forEach((card) => {
  card.addEventListener("click", (e) => {
    flip(card);
  });
});
function flip(card) {
  card.classList.add("flipped");
  let allFlipped = document.querySelectorAll(".flipped");
  if (allFlipped.length === 2) {
    cardsContainer.classList.add("stop");
    let fisrtCard = allFlipped[0];
    let secondCard = allFlipped[1];
    if (fisrtCard.dataset.tech !== secondCard.dataset.tech) {
      mistakes.innerHTML = +mistakes.innerHTML + 1;
      _audio.src = audio.wrong;
      setTimeout(() => {
        fisrtCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        cardsContainer.classList.remove("stop");
      }, duration);
    } else {
      correctCounter++;
      console.log(correctCounter);
      if (correctCounter === imgs.length ) {
        winner();
        createObj(scoreArray);
        addToTbody();
      } else {
        _audio.src = audio.correct;
        fisrtCard.classList.remove("flipped");
        secondCard.classList.remove("flipped");
        fisrtCard.classList.add("match");
        secondCard.classList.add("match");
        fisrtCard.classList.add("stop");
        secondCard.classList.add("stop");
        cardsContainer.classList.remove("stop");
      }
    }
    _audio.play();
  }
}

function formatTime(time) {
  let min = Math.trunc(time / 60);
  let sec = time % 60;
  min = min < 10 ? `0${min}` : min;
  sec = sec < 10 ? `0${sec}` : sec;
  timeContainer.innerHTML = `${min}:${sec}`;
}

function endGame() {
  let end = document.querySelector(".end");
  end.style.display = "flex";
  cardsContainer.classList.add("stop");
  _audio.src = audio.lose;
  _audio.play();
}

function winner() {
  clearInterval(counter);
  let end = document.querySelector(".win");
  end.style.display = "flex";
  cardsContainer.classList.add("stop");
  _audio.src = audio.win;
  _audio.play();
}

document.querySelector(".loser").onclick = () => {
  location.reload();
};
document.querySelector(".winner").onclick = () => {
  location.reload();
};

function formatEndTime(time) {
  let min = Math.trunc(time / 60);
  let sec = time % 60;
  min = min < 10 ? `0${min}` : min;
  sec = sec < 10 ? `0${sec}` : sec;
  return `${min}:${sec}`;
}
function createObj(scoreArray) {
  let endTime = formatEndTime(mainTime - time);
  let obj = {
    name: `${name}` || "unknown",
    time: `${endTime}`,
    mistakes: `${mistakes.innerHTML}`,
  };
  scoreArray.push(obj);
  localStorage.setItem("score", JSON.stringify(scoreArray));
}
function fillLeaderboard(obj) {
  let tr = `<tr>
  <td><h3 class="plaer-name">${obj.name}</h3></td>
  <td><p class="player-time">${obj.time}</p></td>
  <td>
    <p class="player-mistakes">${obj.mistakes}</p>
  </td>
</tr>`;
  document.querySelector("tbody").innerHTML += tr;
}

function addToTbody() {
  document.querySelector("tbody").innerHTML = "";
  let localArray = JSON.parse(localStorage.getItem("score"));
  localArray.forEach((ele) => {
    fillLeaderboard(ele);
  });
}

// localStorage.clear();
