const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ,._?-=()*!@#$%^&~<>'

const { getAllCommonReachableWords } = require('./wordutils.js')

function getRandomChar(){
  return possibleCharacters[getRandomInt(0, possibleCharacters.length - 1)]
}

function getRandomInt(min, max){
  return min + (Math.floor(Math.random() * (max - min + 1)))
}

function getRandomPath(seedWord, length, alreadyUsedWords = []){
  let newPath = [seedWord];
	while (newPath.length < length){
		let mostRecentWord = newPath[newPath.length - 1];
		let possibleWords = getAllCommonReachableWords(newPath.concat(alreadyUsedWords), mostRecentWord);
		if (possibleWords.length){newPath.push(possibleWords[getRandomInt(0, possibleWords.length - 1)]);
		} else {
			break;
		}
	}
	return newPath;
}

function randomStrings(desiredNumberOfStrings = 100, desiredLengthOfEachString = 64){
  let arrOfStrings = [];
  let currentIndex = 0;
  while (arrOfStrings.length < desiredNumberOfStrings){
    arrOfStrings.push('');
    while (arrOfStrings[currentIndex].length < desiredLengthOfEachString){
      arrOfStrings[currentIndex] = arrOfStrings[currentIndex].concat(getRandomChar());
    }
    currentIndex++
  }
  return arrOfStrings;
}

module.exports = { randomStrings, getRandomChar, getRandomInt, getRandomPath }
