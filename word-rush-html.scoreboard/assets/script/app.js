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
const topScoreList = select('#top-score-list'); //new feature section
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

//declare an empty array to store the highscore players
let highScores = [];
const MAX_SCORES = 10; 

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

    lastScoreBox.innerHTML =`
        <div><strong>Hits:</strong> ${lastScore.hits}</div>
        <div><strong>Accuracy:</strong> ${lastScore.percentage}%</div>
        <div><strong>Date:</strong> <span class="date-small">${lastScore.date}</span></div>
        `; //Rearrange the arrangments of last game score information

    addHighScore(lastScore);//new added to run in addHighscore fun

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


//new functions:

// Loading the strings
function loadHighScores() {
    const stored = localStorage.getItem('wordRushHighScores');

    try {
        highScores = stored ? JSON.parse(stored) : [];
    } catch (error) {
        console.error("Some errors happened during the loading:", error);
        highScores = [];
    }
}

//save 10 highscore to localStorage

function saveHighScores() {
    highScores.sort((a, b) => {
        if (b.hits !== a.hits) {
            return b.hits - a.hits;
        }
        return parseFloat(b.percentage) - parseFloat(a.percentage);
    });
    
    highScores = highScores.slice(0, MAX_SCORES);
    localStorage.setItem('wordRushHighScores', JSON.stringify(highScores));
}

//Add scores to high score arrays when games over(parameter accepted through gameover function ())
function addHighScore(scoreObject) {
    const plainScore = {
        date: scoreObject.date,
        hits: scoreObject.hits,
        percentage: scoreObject.percentage
    };
    
    highScores.push(plainScore);
    
    saveHighScores();
    displayTopScores();
}

// To display Top scores
function displayTopScores() {
    topScoreList.innerHTML = '';

    if (highScores.length === 0) {
        topScoreList.innerHTML = `<li class="empty-score-msg">There is no recording yet! </li>`;
        return;
    }

    highScores.forEach((score, index) => {
        const li = document.createElement('li');
        li.classList.add('score-item');

        li.innerHTML = `
            <span class="score-rank">#${index + 1}</span>
            <div class="score-details">
                <div><strong>hits:</strong> ${score.hits}</div>
                <div><strong>percentage:</strong> ${score.percentage}%</div>
                <div class="score-date">${score.date}</div>
            </div>
        `;

        topScoreList.appendChild(li);
    });
}

loadHighScores();
displayTopScores();



