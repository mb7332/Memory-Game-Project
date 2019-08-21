
// Runs startup after DOM is fully loaded
document.addEventListener('DOMContentLoaded', (event) => {
  startSetup();
});


// ***Global Variables Section***

const deck = document.querySelector('.deck');
const cards = deck.querySelectorAll('.card');

// Starting array for clicked cards
let openCardsList = [];

// Starting counters
let moves = 0;
let time = 0;
let timeMinutes = 0;
let clockID;
let starNumber = 3;

// Stops timer from starting multiple times
let timerOff = true;

// For timer
let clockIDMinutes;
const timer = document.querySelector('.timer');
const timerMinutes = document.querySelector('.timerMinutes');

// Assigning Restart Button
const restartButton = document.querySelector('.restart');

// For Modal Data Input
const modalMoves = document.querySelector('.modal_moves');
const movesText = document.querySelector('.moves');
const modalStars = document.querySelector('.modal_stars');
const starList = document.querySelectorAll('.stars li');

// For endGame
let matchedCards = 0;
const amountOfMatches = 8;





// ***Event Listeners Section***

// Click on card action
deck.addEventListener('click', (event) => {
  const cardTarget = event.target;
  if (cardParameterGood(cardTarget)) {
    if (timerOff) {
      startTimer();
      startMinutesCounter();
      timerOff = false;
    }
    cardClassToggle(cardTarget);
    addToList(cardTarget);
    if (openCardsList.length === 2) {
      doTheyMatch(openCardsList);
      openCardsList = [];
      addMove();
      checkScore();
    }
  }
});


// Click on restart button action
restartButton.addEventListener('click', (event) => {
  startSetup();
  moves = 0;
  movesText.innerHTML = moves;
  resetStars();
  matchedCards = 0;
  stopTimer();
  time = 0;
  timer.innerHTML = time;
  timeMinutes = 0;
  timerMinutes.innerHTML = timeMinutes;
  timerOff = true;
});


// ***Functions Section***


// Runs after DOM is loaded to reset everything
function startSetup() {
  shuffleCards();
  showAllCards();
  setTimeout(function hideCards() {
    for (card of cards) {
      card.classList.remove('open', 'show', 'match');
    }
  }, 1000);
}


// Shows front of card
function cardClassToggle(cardTarget) {
  cardTarget.classList.toggle('open');
  cardTarget.classList.toggle('show');
}


// Adds clicked card to array
function addToList(cardTarget) {
  openCardsList.push(cardTarget);
}


/*
 * Checks both cards in array for a match then
 * adds matched cards counter
 * triggers end of game if all cards match
 * if cards do not match sends reset
*/
function doTheyMatch(openCardsList) {
  if (
    openCardsList[0].firstElementChild.className ===
    openCardsList[1].firstElementChild.className) {
      openCardsList[0].classList.toggle('match');
      openCardsList[1].classList.toggle('match');
      matchedCards++;
      if (amountOfMatches === matchedCards){
        endGame();
      }
  } else {
    setTimeout(() => {
      resetCards(openCardsList);
    }, 1500);
  }
}


// Resets clicked cards to face down
function resetCards(openCardsList) {
  openCardsList[0].classList.toggle('open');
  openCardsList[0].classList.toggle('show');
  openCardsList[1].classList.toggle('open');
  openCardsList[1].classList.toggle('show');
}


// Verifies that same card is not added to array
function cardParameterGood(cardTarget) {
  return (
    cardTarget.classList.contains('card') &&
    !cardTarget.classList.contains('match') &&
    openCardsList.length < 2 &&
    !openCardsList.includes(cardTarget)
  );
}


/*
 * Adds move to move counter
 * increases move counter
 * updates modal data for moves
*/
function addMove() {
  moves++;
  movesText.innerHTML = moves;
  modalMoves.innerHTML = 'Moves: ' + moves;
}


/*
 * If moves is 16 or 24 removes a star
 * decreases star counter
 * updates star count modal data
*/
function checkScore() {
  if (moves === 16 || moves === 24) {
    hideStars();
    starNumber--;
    modalStars.innerHTML = 'Stars: ' + starNumber;
  }
}


// Takes away display of a star
function hideStars() {
  for (star of starList) {
    if (star.style.display !== 'none') {
      star.style.display = 'none';
      break;
    }
  }
}


// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}


/*
 * Puts cards into Array format
 * triggers provided shuffle function
 * updates html for cards
*/
function shuffleCards() {
  const cardsToShuffle = Array.from(document.querySelectorAll('.deck li'));
  const shuffledCards = shuffle(cardsToShuffle);
  for (card of shuffledCards) {
    deck.appendChild(card);
  }
}




// Resets to show all three stars
function resetStars() {
  for (star of starList) {
    if (star.style.display === 'none') {
      star.style.display = 'inline-block';
    }
  }
}


// Flips all cards face up
function showAllCards() {
  for (card of cards) {
    card.classList.add('open', 'show');
    card.classList.remove('match');
  }
}


/*
 * Seconds timer interval
 * increased time counter and updates timer html
 * starts over after 60 seconds
*/
function startTimer() {
  clockID = setInterval(() => {
    time++;
    timer.innerHTML = time;
    if (time === 60) {
      stopTimer();
      time = 0;
      startTimer();
    }
  }, 1000);
}


// Stops seconds timer
function stopTimer() {
  clearInterval(clockID);
}


/*
  * Minutes counter interval
  * increases minutes counter
  * updates minutes html
 */
function startMinutesCounter() {
  clockIDMinutes = setInterval(() => {
    timeMinutes++;
    timerMinutes.innerHTML = timeMinutes;
  }, 60000);
}


// Stops the minutes timer
function stopMinutesTimer() {
  clearInterval(clockIDMinutes);
}


// Shows modal and triggers time data
function modalPopUp() {
  const modal = document.querySelector('.modal_background');
  modal.classList.toggle('hide');
  modalTimeData();
}


// Updates time data for modal
function modalTimeData() {
  const modalTime = document.querySelector('.modal_time');
  modalTime.innerHTML = 'Time: '+ timeMinutes + ':' + time;
}


// Resets all aspects of game when replay button in modal selected
function replayGame() {
  starNumber = 3;
  startSetup();
  moves = 0;
  movesText.innerHTML = moves;
  time = 0;
  timer.innerHTML = time;
  timeMinutes = 0;
  timerMinutes.innerHTML = timeMinutes;
  timerOff = true;
  resetStars();
  matchedCards = 0;
}


// ***Modal Buttons Actions***

// Cancel Button closes Modal window
document.querySelector('.modal_cancel_button').addEventListener('click', () => {
  modalPopUp();
});


// Replay Button closes Modal window and resets game
document.querySelector('.modal_replay_button').addEventListener('click', () => {
  modalPopUp();
  replayGame();
})

// ***End of game section***

// Stops timers and shows modal with data
function endGame() {
  stopTimer();
  stopMinutesTimer();
  modalTimeData();
  modalPopUp();
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
