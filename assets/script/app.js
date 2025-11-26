'use strict';
import { select, selectAll, listen } from './utils.js';

class Score {
    #date;
    #hits;
    #percentage;

    constructor(date, hits, percentage) {
        this.#date = date;
        this.#hits = hits;
        this.#percentage = percentage;
    }

get date() {return this.#date;}

get hits() {return this.#hits;}

get percentage() {return this.#percentage;}
}



//Select or create all variables will be used later.

// HUD elements
const timeRemaining = select('#time-remaining');
const hitsDisplay = select('#hits');
const accuracyDisplay = select('#accuracy');

// Word display & input
const currentWord = select('#current-word');
const wordInput = select('#word-input');

// Buttons
const startBtn = select('#start-btn');
const restartBtn = select('#restart-btn');
const muteBtn = select('#mute-btn');

// Scoreboard & modal
const lastScoreBox = select('#last-score');
const gameOverModal = select('#game-over-modal');
const finalMessage = select('#final-message');
const finalHits = select('#final-hits');
const finalAccuracy = select('#final-accuracy');
const modalRestartBtn = select('#modal-restart-btn');
const closeModalBtn = select('#close-modal-btn');

// 90 Words Array//
const words =

['dinosaur', 'love', 'pineapple', 'calendar', 'robot', 'building', 'population', 'weather', 'bottle', 'history', 
'dream', 'character', 'money', 'absolute', 'discipline', 'machine', 'accurate', 'connection', 'rainbow', 'bicycle', 
'eclipse', 'calculator', 'trouble', 'watermelon', 'developer', 'philosophy', 'database', 'periodic', 'capitalism',
'abominable', 'component', 'future', 'pasta', 'microwave', 'jungle', 'wallet', 'canada', 'coffee', 'beauty', 'agency',
'chocolate', 'eleven', 'technology', 'alphabet', 'knowledge', 'magician', 'professor', 'triangle', 'earthquake',
'baseball', 'beyond', 'evolution', 'banana', 'perfumer', 'computer', 'management', 'discovery', 'ambition', 'music',
'eagle', 'crown', 'chess', 'laptop', 'bedroom', 'delivery', 'enemy', 'button', 'superman', 'library', 'unboxing', 
'bookstore', 'language', 'homework', 'fantastic', 'economy', 'interview', 'awesome', 'challenge', 'science', 'mystery',
'famous', 'league', 'memory', 'leather', 'planet', 'software', 'update', 'yellow', 'keyboard', 'window'];

//initializing variables.
let gameWords = [];
let currentIndex = 0;
let hits = 0;
let totalTyped = 0;
let timeLeft = 99;
let timeEachsecond = null;
const bgm = new Audio('./assets/media/audio/Background.mp3');
bgm.type = 'audio/mp3';
bgm.loop = true;

const correct = new Audio('./assets/media/audio/correct.mp3');
const wrong = new Audio('./assets/media/audio/wrong.mp3');

// Shuffle function//
let shuffle = function(array) {
  let currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
};

function startGame() {
    gameWords = shuffle([...words]); //run shuffle function and make sure we shuffle the words array every time
    currentIndex = 0;
    hits = 0;
    totalTyped = 0;
    timeLeft = 99;
    bgm.currentTime = 0;
    bgm.play();

    //for updating the HUD page in every new game.
    hitsDisplay.textContent = hits;
    accuracyDisplay.textContent = "0%";
    timeRemaining.textContent = timeLeft;   

  
    // Show the first word in this new game
    currentWord.textContent = gameWords[currentIndex]; 
    
    // Make sure palyers are able to input words
    wordInput.disabled = false;
    wordInput.value = "";
    wordInput.focus();  

    // Adjust button states
    startBtn.disabled = true;
    restartBtn.disabled = false;    
    
    // Initializing the time
    startTimer();
}
listen(startBtn, "click", function () {
    startGame();
});



function startTimer() {
    timeLeft = 99;

    timeEachsecond = setInterval(function() {
        timeLeft--;
        timeRemaining.textContent = timeLeft;

        if (timeLeft <= 0) {  
            clearInterval(timeEachsecond);
            gameOver();
    }
}, 1000);
}
listen(restartBtn, "click", function () {
    clearInterval(timeEachsecond);
    startGame();
});





listen(wordInput, "keydown", function (keyEnter) {
    if (keyEnter.key === "Enter") {
        checkInput();
    }
}); 

listen(wordInput, "input", autoCheck);


function autoCheck() {
    const correctWord = gameWords[currentIndex];
    const typed = wordInput.value.trim();

    
    if (typed === correctWord) {
        totalTyped++;
        hits++;
        hitsDisplay.textContent = hits;
        correct.play();
        updateAccuracy();

        
        currentWord.classList.add("up-jump");
        setTimeout(() => currentWord.classList.remove("up-jump"), 1000);

       
        wordInput.value = "";
        nextWord();
    }
}


function checkInput() {
    const correctWord = gameWords[currentIndex];
    const userWord = wordInput.value.trim();
    totalTyped++;

    if (userWord === correctWord) {
        hits++;
        hitsDisplay.textContent = hits;
        correct.play();
        currentWord.classList.add("up-jump");
        setTimeout(() => currentWord.classList.remove("up-jump"), 1000);
        updateAccuracy();
        wordInput.value = "";
        nextWord();
        return;
    }
    wrong.play();
    updateAccuracy();
    wordInput.value = "";
    nextWord();
}


function updateAccuracy() {
    if (totalTyped === 0) {
        accuracyDisplay.textContent = "0%";
        return;
    }

    const acc = ((hits / totalTyped) * 100).toFixed(2);
    accuracyDisplay.textContent = acc + "%";
}


function nextWord() {
    currentIndex++;
    if (currentIndex >= gameWords.length) {
        gameOver();
        return;
    }
    currentWord.textContent = gameWords[currentIndex];
}



//  the end of game
function gameOver() {
    clearInterval(timeEachsecond);
    wordInput.disabled = true;
    finalMessage.textContent = "Game Over!";
    finalHits.textContent = hits;

    let finalAcc = totalTyped === 0 ? 0 : ((hits / totalTyped) * 100).toFixed(2);
    finalAccuracy.textContent = finalAcc + "%";


    const now = new Date().toLocaleString();
    const lastScore = new Score(now, hits, finalAcc);

    lastScoreBox.innerHTML =
        `Date: ${lastScore.date}&nbsp&nbsp&nbsp&nbsp&nbsp;  Hits: ${lastScore.hits}&nbsp&nbsp&nbsp&nbsp&nbsp;  Accuracy: ${lastScore.percentage}%`;

    restartBtn.disabled = false;

    bgm.pause();
    bgm.currentTime = 0;
    gameOverModal.classList.remove("hidden");
}

listen(closeModalBtn, "click", function () {
    gameOverModal.classList.add("hidden");
});

listen(modalRestartBtn, "click", function () {
    gameOverModal.classList.add("hidden");
    clearInterval(timeEachsecond);
    startGame();
});


listen(muteBtn, "click", function () {
    if (bgm.paused) {
        bgm.play();
        muteBtn.textContent = "Sound: ON";
    } else {
        bgm.pause();
        muteBtn.textContent = "Sound: OFF";
    }
});




