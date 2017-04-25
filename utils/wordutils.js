Dictionary = require('../Dictionary/Dictionary.js');
wordlist = require('../Dictionary/wordlist.js');
commonWordList = require('../Dictionary/commonwordlist.js');

const MIN_WORD_LENGTH = 3;
const MAX_WORD_LENGTH = 5;

const LETTER_FREQUENCIES = {
  A: 8.12,
  B: 1.49,
  C: 2.71,
  D: 4.32,
  E: 12.02,
  F: 2.30,
  G: 2.03,
  H: 5.92,
  I: 7.31,
  J: 0.10,
  K: 0.69,
  L: 3.98,
  M: 2.61,
  N: 6.95,
  O: 7.68,
  P: 1.82,
  Q: 0.11,
  R: 6.02,
  S: 6.28,
  T: 9.10,
  U: 2.88,
  V: 1.11,
  W: 2.09,
  X: 0.17,
  Y: 2.11,
  Z: 0.07
}

const letterFrequencyTable = [];

const dictionary = new Dictionary;

dictionary.bulkAddWords(wordlist);
seedLetterFrequencyTable();

function getPathStart(desiredPathLength){
    let newCards = [];
    let newWord = randomWord(3 + Math.floor(Math.random() * 2));
    let wordArr = [];
    let updatedWord;
    wordArr.push(newWord);
    let changes = 0;
    while (wordArr.length < desiredPathLength){
      let possible = getAllCommonReachableWords(wordArr, wordArr[changes]);
      if (possible.length < 1) return getPathStart();
      updatedWord = possible[Math.floor(Math.random() * possible.length)];
      wordArr.push(updatedWord);
      if (updatedWord.length >= wordArr[changes].length){
        let diff;
        let index = 0;
        while (updatedWord.charAt(index) === wordArr[changes].charAt(index)){
          index++;
        }
        diff = updatedWord[index];
        newCards = newCards.concat(diff);
      }
      changes++;
    }
    let targetWord = wordArr[wordArr.length - 1];
    console.log('end of pathstart', wordArr, targetWord);
    return {newWord, newCards, targetWord};
}

// function getStandardStart(){
//     let newCards = [];
//     let newWord = randomWord(4);
//     while (newCards.length < 10) {
//       newCards.push(getNewCard(newCards, newWord, []));
//     }
//     return {newWord, newCards};
// }

function randomWord(length) {
  let temp = commonWordList[Math.floor(Math.random() * commonWordList.length)];
  while (length && temp.length !== length){
    temp = commonWordList[Math.floor(Math.random() * commonWordList.length)];
  }
  return temp;
}

function isValidWord(word) {
    return dictionary.search(word);
}

function getNewCard(currentCards = [], word = '', mostRecent = []) {
  if (letterFrequencyTable.length === 0)seedLetterTable();

  let invalid = currentCards.join('') + word + mostRecent.join('');

  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

  let pick = letterFrequencyTable[Math.floor(Math.random() * letterFrequencyTable.length)];

  while (invalid.includes(pick)) {
    pick = letterFrequencyTable[Math.floor(Math.random() * letterFrequencyTable.length)];
  }

  return pick;

}

function seedLetterFrequencyTable(){
  let letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  let letterArr = letters.split('');
  letterArr.forEach(letter => {
    let desiredNumber = Math.round(LETTER_FREQUENCIES[letter] * 100);
    while (desiredNumber){
      letterFrequencyTable.push(letter);
      desiredNumber--;
    }
  })
}

function getPossibleWords(word, cards = [], min=3, max=5) {
  let possibleWords = [];
  const currentCards = cards === 'allLetters' ? 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('') : cards;
  //try removing each letter
  if (word.length > min){
    for (let i = 0 ; i < word.length;i++){
      let newWord = word.slice(0, i) + word.slice(i + 1);
      if (isValidWord(newWord)){
        possibleWords.push(newWord)
      }
    }
  }
  //try adding each letter to each position
  if (word.length < max){
    currentCards.forEach(letter => {
      for (let i = 0 ; i <= word.length;i++){
        let newWord = word.slice(0, i) + letter + word.slice(i);
        if (isValidWord(newWord)){
          possibleWords.push(newWord)
        }
      }
    })
  }
  //try substituting each letter into each position
  currentCards.forEach(letter => {
    for (let i = 0 ; i < word.length;i++){
      let newWord = word.slice(0, i) + letter + word.slice(i + 1);
      if (isValidWord(newWord)){
        possibleWords.push(newWord)
      }
    }
  })
  possibleWords = possibleWords.filter(thisWord => thisWord !== word);
  return possibleWords;

}

function getAllCommonReachableWords(alreadyUsed = [], word, cards = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')) {
  let possibleWords = [];
  const currentCards = cards;
  //try removing each letter
  for (let i = 0 ; i < word.length;i++){
    let newWord = word.slice(0, i) + word.slice(i + 1);
    if (newWord !== word && isCommonWord(newWord) && !alreadyUsed.includes(newWord)){
      possibleWords.push(newWord)
    }
  }
  //try adding each letter to each position
  currentCards.forEach(letter => {
    for (let i = 0 ; i <= word.length;i++){
      let newWord = word.slice(0, i) + letter + word.slice(i);
      if (newWord !== word && isCommonWord(newWord) && !alreadyUsed.includes(newWord)){
        possibleWords.push(newWord)
      }
    }
  })
  //try substituting each letter into each position
  currentCards.forEach(letter => {
    for (let i = 0 ; i < word.length;i++){
      let newWord = word.slice(0, i) + letter + word.slice(i + 1);
      if (newWord !== word && isCommonWord(newWord) && !alreadyUsed.includes(newWord)){
        possibleWords.push(newWord)
      }
    }
  })
  return possibleWords;
}

function isCommonWord(word){
  return commonWordList.includes(word);
}

module.exports = { letterFrequencyTable, getPathStart, dictionary, isValidWord, getPossibleWords, getAllCommonReachableWords }
