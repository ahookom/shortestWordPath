const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ,._?-=()*!@#$%^&~<>'

function getRandomChar(){
  return possibleCharacters[getRandomInt(0, possibleCharacters.length - 1)]
}

function getRandomInt(min, max){
  return min + (Math.floor(Math.random() * (max - min + 1)))
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

module.exports = { randomStrings, getRandomChar, getRandomInt }
