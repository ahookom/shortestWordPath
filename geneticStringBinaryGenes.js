/*given a starting word and a target word, can you find a path of acceptable words
that are each a distance of 1 (add,remove,change) from each other that go from
the start to the finish?*/

let { getAllCommonReachableWords, letterFrequencyTable, getPossibleWords, randomWord } = require('./utils/wordutils.js')

const startWord = 'LAKES';
const targetWord = 'ELSE';
const initialSize = 500;
const minWordLength = 3;
const maxWordLength = Infinity;
const minChainLength = 2;
const maxChainLength = 4;
const initialPopulation = seedPopulation();

function randomInt(min, max){
  return min + (Math.floor(Math.random() * (max - min + 1)))
}

function getWordPair(firstWord){
  let candidatePairs;
  if (firstWord){
    candidatePairs = getAllCommonReachableWords([], firstWord)
    if (!candidatePairs.length) return null
  } else{
    firstWord = randomWord()
    candidatePairs = getAllCommonReachableWords([], firstWord)
    while (candidatePairs.length < 1){
      firstWord = randomWord()
      candidatePairs = getAllCommonReachableWords([], firstWord)
    }
  }
  let secondWord = candidatePairs[randomInt(0, candidatePairs.length - 1)]
  return [firstWord, secondWord];
}

function seedPopulation(){
	let initialPop = [];
	while (initialPop.length < initialSize){
		let desiredNextPathLength = randomInt(minChainLength, maxChainLength)
    let nextPath = [getWordPair(startWord)]
    while (nextPath.length < desiredNextPathLength){
      nextPath.push(getWordPair())
    }
    nextPath.push(getWordPair(targetWord).reverse())
    initialPop.push(nextPath)
	}
	return initialPop;
}

// function getRandomPath(seedWord, length, alreadyUsedWords = []){
//   let newPath = [seedWord];
// 	while (newPath.length < length){
// 		let mostRecentWord = newPath[newPath.length - 1];
// 		let possibleWords = getAllCommonReachableWords(newPath.concat(alreadyUsedWords), mostRecentWord);
// 		if (possibleWords.length){newPath.push(possibleWords[randomInt(0, possibleWords.length - 1)]);
// 		} else {
// 			break;
// 		}
// 	}
// 	return newPath;
// }

// function singleSidedMutationFunction(phenotype) {
//   let pathLength = phenotype.length;
// 	let actionIndex = randomInt(0, pathLength - 1);
// 	let newPhenotype = [];
// 	if (Math.random() > 0.5){
// 		let lengthAfterIndex = pathLength - 1 - actionIndex;
// 		let salvagedPath = phenotype.slice(0, actionIndex);
// 		newPhenotype = salvagedPath.concat(getRandomPath(phenotype[actionIndex], lengthAfterIndex, salvagedPath));
// 	} else {
// 		if (Math.random() > 0.5 && phenotype.length > minChainLength){
// 			phenotype.pop()
// 			newPhenotype = phenotype;
// 		} else {
// 			newPhenotype = phenotype.concat(getRandomPath(phenotype[phenotype.length - 1], 1, phenotype))
// 		}
// 	}
//   return newPhenotype
// }

// function mutationFunction(phenotype) {
//   if (Math.random() > 0.5){
//     phenotype.fromStart = singleSidedMutationFunction(phenotype.fromStart)
//   } else {
//     phenotype.fromFinish = singleSidedMutationFunction(phenotype.fromFinish)
//   }
//   return phenotype
// }
function swapTwoPairs(phenotype){
  let firstRandomIndex = randomInt(0, phenotype.length - 1)
  let secondRandomIndex = randomInt(0, phenotype.length - 1)
  let temp = phenotype[firstRandomIndex]
  phenotype[firstRandomIndex] = phenotype[secondRandomIndex]
  phenotype[secondRandomIndex] = temp
  return phenotype
}

function deleteAPair(phenotype){
  let randomIndex = randomInt(0, phenotype.length - 1)
  return phenotype.slice(0, randomIndex).concat(phenotype.slice(randomIndex + 1))
}

function insertAPair(phenotype){
  let newPair = getWordPair()
  let randomIndex = randomInt(0, phenotype.length - 1)
  let firstPartOfResult = phenotype.slice(0, randomIndex)
  firstPartOfResult.push(newPair)
  return firstPartOfResult.concat(phenotype.slice(randomIndex))
}

function commonChars(firstWord, secondWord){
  let commonChars = firstWord.split('').reduce((accum, letter, index) => {if (letter===secondWord[index])accum++}, 0)
  return commonChars;
}

function isHelpfulPath(binaryA, binaryB){
  let similarity = commonChars(binaryA[0], binaryB[binaryB.length - 1])
  if (binaryA[0] !== binaryB[0] && similarity > 0) return true
  return false
}

function isLegalPath(binaryA, binaryB){
  return getAllCommonReachableWords([], binaryA[binaryA.length - 1]).includes(binaryB[0])
}

function swapTwoWords(phenotype){
  let randomIndex = randomInt(1, phenotype.length - 2);
  let arrayToChange = phenotype[randomIndex]
  let temp = arrayToChange[0];
  arrayToChange[0] = arrayToChange[arrayToChange.length - 1]
  arrayToChange[arrayToChange.length - 1] = temp;
}

function changeAWord(phenotype){
  let length = phenotype.length
  let randomIndex = randomInt(0, length - 1);
  let baseWord;
  let baseIndex;
  if(randomIndex===0){
    baseIndex = 0
  }else if(randomIndex===length-1){
    baseIndex = 1
  }else{
    baseIndex = Math.floor(Math.random() * phenotype[randomIndex].length)
  }
  baseWord = phenotype[baseIndex]

  phenotype[0][1]=getAllCommonReachableWords([],phenotype[0][0])
}

function mutationFunction(phenotype){
  let typeOfMutation = randomInt(0, 2);
  if (Math.random() > 0.5){
    //move words within the arrays
    if (typeOfMutation === 0 ) swapTwoWords(phenotype)
    else if (typeOfMutation === 1 ) changeAWord(phenotype)
    else if (typeOfMutation === 2 ) growABinaryLonger(phenotype)
  } else {
    //move the arrays themselves
    if (typeOfMutation === 0 )phenotype = swapTwoPairs(phenotype)
    else if (typeOfMutation === 1 )phenotype = deleteAPair(phenotype)
    else if (typeOfMutation === 2 )phenotype = insertAPair(phenotype)
  }
  return phenotype
}

function crossoverFunction(phenotypeA, phenotypeB) {
	// move, copy, or append some values from a to b and from b to a
  let arrA = phenotypeA.slice()
  let arrB = phenotypeB.slice()
  let firstResult = []
  let secondResult = []
  let swap = Math.round(Math.random());
  while (arrA.length && arrB.length){
    if (swap){
      firstResult.push(arrB.shift())
      secondResult.push(arrA.shift())
    } else {
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
	return [ firstResult, secondResult ]
}

function fitnessFunction(phenotype) {
  if (!phenotype.length) return -Infinity
	var score = 0
  let length = phenotype.length
  if (phenotype[0][0] === startWord)score += 10
  if (phenotype[length - 1][1] === targetWord)score += 100

  let counter = 0
  while (counter < length - 1){
    if (isLegalPath(phenotype[counter], phenotype[counter + 1])){
      let joined = phenotype[counter].concat(phenotype[counter + 1])
      phenotype[counter] = joined
      phenotype.splice(counter, 1)
      score += 20
      length = phenotype.length
    }
    counter++;
  }

	return score

}


function doesABeatBFunction(phenotypeA, phenotypeB) {

  // if too genetically different to consider
  // if ( yourDiversityFunc(phenoTypeA, phenoTypeB) > 0.65 ) {
  //   return false;
  // }

  // if phenoTypeA isn't better than phenoTypeB
  if ( fitnessFunction(phenotypeA) <= fitnessFunction(phenotypeB) ) {
    return false;
  }

  // else phenoTypeA beats phenoTypeB
  return true;
}


// var firstPhenotype = {
// 	dummyKey: 'dummyValue'
// 	// enter phenotype data here
// }

var geneticAlgorithmConstructor = require('geneticalgorithm')
var geneticAlgorithm = geneticAlgorithmConstructor({
    mutationFunction: mutationFunction,
    crossoverFunction: crossoverFunction,
    fitnessFunction: fitnessFunction,
    population: initialPopulation,
		populationSize: initialSize,
    doesABeatBFunction: doesABeatBFunction
});

console.log('Starting with:')
// console.log( initialPopulation )
let best = 0;
let generations = 0;
while (generations < 200 && geneticAlgorithm.bestScore() < 1000){
	 best = geneticAlgorithm.evolve().best()
	 console.log(best, geneticAlgorithm.bestScore(), generations)
	 generations++;
}
console.log('Finished with:')
console.log(best)

