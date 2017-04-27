let GeneticAlgorithmConstructor = require('geneticalgorithm');
const secondTestString = 'Can I slow this amazing genetic algorithm down by making it longer?'
const { getRandomInt, getRandomChar, randomStrings } = require('./utils/randomutils')


const targetString = "Hello World!"
const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ,._?-=()*!@#$%^&~<>'
const populationSize = 1000
var initialPop = randomStrings(1000, targetString.length)

let config = {
  mutationFunction: multipleMutations(4),
  crossoverFunction: zipperCrossover,
  fitnessFunction: fitness,
  // doesABeatBFunction: doesABeatBFunction,
  population: initialPop,
  populationSize: populationSize
}

let geneticAl = new GeneticAlgorithmConstructor(
  config
)
let counter = 0
while (counter < 10000 && geneticAl.best() !== targetString){
geneticAl.evolve()
console.log(geneticAl.best(), counter)
counter++
}

function fitness(phenotype){
  let matchedChars = phenotype.split('').filter((char, index) => char === targetString[index]).length * 5
  let differenceInLength = Math.abs(phenotype.length - targetString.length)
  return matchedChars - differenceInLength
}

function multipleMutations(maxMutations){
  return function(oldPhenotype){
    let counter = maxMutations * Math.random()
    let newPhenotype = oldPhenotype.slice()
    while (counter > 0){
    newPhenotype = mutation(newPhenotype)
    counter--
    }
  return newPhenotype
  }
}

function mutation(oldPhenotype){
  let actionType = getRandomInt(0, 2)
  let actionIndex = getRandomInt(0, possibleCharacters.length - 1)
  let newPhenotype = ''
  const swapIndex = getRandomInt(0, oldPhenotype.length - 1)

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
    case 2:
     newPhenotype = randomStrings(1, targetString.length)[0]
    default:
    break;
  }
  // console.log(newPhenotype)
  return newPhenotype
}

function zipperCrossover(phenotypeA, phenotypeB){
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

function swapAtRandomIndex(phenotypeA, phenotypeB){
  let lengthOfShortest = phenotypeA.length > phenotypeB.length ? phenotypeA.length : phenotypeB.length
  let randomIndex = getRandomInt(1, lengthOfShortest)
  let leftHalfA = phenotypeA.slice(0, randomIndex)
  let leftHalfB = phenotypeB.slice(0, randomIndex)
  let rightHalfA = phenotypeA.slice(randomIndex)
  let rightHalfB = phenotypeB.slice(randomIndex)
  return [ leftHalfA.concat(rightHalfB), leftHalfB.concat(rightHalfA) ]
}

function crossover (phenotypeA, phenotypeB){
  return swapAtRandomIndex(phenotypeA, phenotypeB)
}

function doesABeatBFunction (phenotypeA, phenotypeB){
  if (fitness(phenotypeA) < fitness(phenotypeB)) return false
  return phenotypeA.split('').filter((char, index) => char !== phenotypeB[index]).length > .3 * targetString.length
}





