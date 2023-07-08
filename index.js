const gridContainer = document.querySelector(".grid-container");
let cards = [];
let firstCard, secondCard;
let lockBoard = false;
let score = 0;
let point=0
document.querySelector(".score").textContent = score;


// FETCHING OF DATA FROM DATA FOLDER  using json file.
// one will ask what a json is 
// 
// JSON stands for JavaScript Object Notation
// JSON is a lightweight format for storing and transporting data
// JSON is often used when data is sent from a server to a web page
// JSON is "self-describing" and easy to understand 
fetch("./data/cards.json")
  .then((res) => res.json())
  .then((data) => {
    cards = [...data, ...data];
    shuffleCards();
    generateCards();
  });
  
// SHUFFLE CARDS FUNCTION
function shuffleCards() {
  let currentIndex = cards.length,
    randomIndex,
    temporaryValue;
  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = cards[currentIndex];
    cards[currentIndex] = cards[randomIndex];
    cards[randomIndex] = temporaryValue;
  }
}
//FUNCTION TO CREATE A CARD AND FLIP IT ON CLICK 
function generateCards() {
  for (let card of cards) {
    const cardElement = document.createElement("div");
    cardElement.classList.add("card");
    cardElement.setAttribute("data-name", card.name);
    cardElement.innerHTML = `
      <div class="front">
        <img class="front-image" src=${card.image} />
      </div>
      <div class="back"></div>
    `;
    gridContainer.appendChild(cardElement);
    cardElement.addEventListener("click", flipCard);
  }
}

// FUNCTION TO FLIP TWO CARDS.
function flipCard() {
  if (lockBoard) return;
  if (this === firstCard) return;

  this.classList.add("flipped");

  if (!firstCard) {
    firstCard = this;
    return;
  }

  secondCard = this;
  lockBoard = true;

  checkForMatch();

}

// FUNCTION TO CHECK IF FLIPPED CARDS MATCH
function checkForMatch() {
  let isMatch = firstCard.dataset.name === secondCard.dataset.name;
  isMatch ? disableCards() : unflipCards();
  if(isMatch==true){
    point++;
    score++;


  }
  document.querySelector(".score").innerHTML = score;

  // console.log(score);


}

// FUNCTION TO DISABLE CARDS IF THEY DONT MATCH
function disableCards() {
  firstCard.removeEventListener("click", flipCard);
  secondCard.removeEventListener("click", flipCard);


  resetBoard();
}

// TIMEOUT FUNCTION TO UNFLIP WHEN CARDS DO NOT MATCH
function unflipCards() {
  setTimeout(() => {
    firstCard.classList.remove("flipped");
    secondCard.classList.remove("flipped");
    resetBoard();
  }, 1000);
}

// FUNCTION TO RESET BOARD WHEN CARDS DO NOT MATCH
function resetBoard() {
  firstCard = null;
  secondCard = null;
  lockBoard = false;

}


// FUNCTION TO RESET AND SHUFFLE BOARD WHEN ONE WINS.
function restart() {
  resetBoard();
  shuffleCards();
  score = 0;
  document.querySelector(".score").textContent = score;
  gridContainer.innerHTML = "";
  generateCards();
}