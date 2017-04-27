const Dictionary = require('../Dictionary/Dictionary.js');
// const wordlist = require('../Dictionary/wordlist.js');
const commonWordList = require('../Dictionary/commonwordlist.js');

const MIN_WORD_LENGTH = 3;
const MAX_WORD_LENGTH = Infinity;

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

// const dictionary = new Dictionary;
const commonDictionary = new Dictionary;

// dictionary.bulkAddWords(wordlist);
commonDictionary.bulkAddWords(commonWordList);

function getPathStart(desiredPathLength){
    let newCards = [];
    let newWord = randomWord(3 + Math.floor(Math.random() * 5));
    let wordArr = [newWord];
    let nextWord;
    let changes = 0;
    while (wordArr.length < desiredPathLength){
      let possible = getAllCommonReachableWords(wordArr, wordArr[changes]);
      if (possible.length < 1) return {newWord: wordArr[0], targetWord: wordArr[wordArr.length-1]}
      nextWord = possible[Math.floor(Math.random() * possible.length)];
      wordArr.push(nextWord);
      changes++;
    }
    let targetWord = wordArr[wordArr.length - 1];
    return {newWord, targetWord};
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
  let count = 0;
  let temp = commonWordList[Math.floor(Math.random() * commonWordList.length)];
  while (count < 1000 && length && temp.length !== length){
    temp = commonWordList[Math.floor(Math.random() * commonWordList.length)];
    count++;
  }
  return temp;
}

function isValidWord(word) {
    return dictionary.search(word);
}

function getPossibleWords(word, cards = [], min = 3, max = Infinity) {
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
  for (let i = 0 ; i < word.length ; i++){
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
  return commonDictionary.search(word);
}

module.exports = { letterFrequencyTable, getPathStart, isValidWord, getPossibleWords, getAllCommonReachableWords, randomWord }
