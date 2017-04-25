var GeneticAlgorithmConstructor = require('geneticalgorithm');

const targetString = 'We so excited for the weekend, with Rebecca Black!! Front seat? Back seat? Which one should I TAAKKEE?';
const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ,._?-=()*!@#$%^&~<>'
const populationSize = 1000;
var initialPop = randomStrings(1000, targetString.length);

function getRandomChar(){
  return possibleCharacters[Math.floor(Math.random() * possibleCharacters.length)]
}

function randomStrings(desiredNumberOfStrings = 100, desiredLengthOfEachString = 20){
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

function multipleMutations(numberOfMutations){
  return function(oldPhenotype){
    let counter = numberOfMutations;
    let newPhenotype=oldPhenotype.slice();
    while (counter){
    newPhenotype = mutation(newPhenotype)
    counter--;
    }
  return newPhenotype
  }
}

function mutation (oldPhenotype){
  let actionType = Math.floor(Math.random() * 2)
  let actionIndex = Math.floor(Math.random() * oldPhenotype.length)
  let newPhenotype = ''
  const swapIndex = Math.floor(Math.random() * oldPhenotype.length)

  switch (actionType) {
    //change a character
    case 0:
      newPhenotype = oldPhenotype.slice();
      newPhenotype[actionIndex] = getRandomChar();
    break;
    //swap two characters
    case 1:
      newPhenotype = oldPhenotype.slice()
      newPhenotype[actionIndex] = oldPhenotype[swapIndex]
      newPhenotype[swapIndex] = oldPhenotype[actionIndex]
    break;
    // case 2:
    //  newPhenotype = randomStrings(1, targetString.length)[0]
    default:
    break;
  }
  // console.log(newPhenotype)
  return newPhenotype
}

function crossover (phenotypeA, phenotypeB){
  let arrA = phenotypeA.split('')
  let arrB = phenotypeB.split('')
  let firstResult = []
  let secondResult = []
  let swap = Math.round(Math.random());
  while (arrA.length && arrB.length){
    if (swap){
      firstResult.push(arrB.shift())
      secondResult.push(arrA.shift())
    }else {
      firstResult.push(arrA.shift())
      secondResult.push(arrB.shift())
    }
    swap = Math.round(Math.random())
  }
  let shorterResult = firstResult.length < secondResult.length ? firstResult : secondResult;
  while (arrA.length){
     shorterResult.push(arrA.shift())
  }
  while (arrB.length){
     shorterResult.push(arrB.shift())
  }
  return [firstResult.join(''), secondResult.join('')];
}

// function doesABeatBFunction (phenotypeA, phenotypeB){
//   if(fitness(phenotypeA) < fitness(phenotypeB))return false;
//   return phenotypeA.split('').filter((char, index) => char!==phenotypeB[index]).length>.5*targetString.length
// }

function fitness(phenotype){
  let matchedChars = phenotype.split('').filter((char, index) => char === targetString[index]).length * 5
  let differenceInLength = Math.abs(phenotype.length - targetString.length)
  return matchedChars - differenceInLength
}

let config = {
  mutationFunction: multipleMutations(2),
  crossoverFunction: crossover,
  fitnessFunction: fitness,
  // doesABeatBFunction: doesABeatBFunction,
  population: initialPop,
  populationSize: populationSize
}

let geneticAl = new GeneticAlgorithmConstructor(
  config
)
let counter = 0
while (counter < 10000 && geneticAl.best()!==targetString){
geneticAl.evolve()
console.log(geneticAl.best(), counter)
counter++;
}

