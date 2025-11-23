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