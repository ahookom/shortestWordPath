/*given a starting word and a target word, can you find a path of acceptable words
that are each a distance of 1 (add,remove,change) from each other that go from
the start to the finish?*/

let { getAllCommonReachableWords } = require('./utils/wordutils.js')

const startWord = 'YET';
const targetWord = 'TOUCH';
const initialSize = 500;
const minWordLength = 3;
const maxWordLength = Infinity;
const minChainLength = 4;
const maxChainLength = 10;
const initialPopulation = seedPopulation();

function randomInt(min, max){
  return min + (Math.floor(Math.random() * (max - min + 1)))
}

function seedPopulation(){
	let initialPop = [];
	while (initialPop.length < initialSize){
		let nextStartPathLength = randomInt(minChainLength, maxChainLength)
    let nextFinishPathLength = randomInt(minChainLength, maxChainLength)
    initialPop.push({
      fromStart: getRandomPath(startWord, nextStartPathLength),
      fromFinish: getRandomPath(targetWord, nextFinishPathLength)
    })
	}
	return initialPop;
}

function getRandomPath(seedWord, length, alreadyUsedWords = []){
  let newPath = [seedWord];
	while (newPath.length < length){
		let mostRecentWord = newPath[newPath.length - 1];
		let possibleWords = getAllCommonReachableWords(newPath.concat(alreadyUsedWords), mostRecentWord);
		if (possibleWords.length){newPath.push(possibleWords[randomInt(0, possibleWords.length - 1)]);
		} else {
			break;
		}
	}
	return newPath;
}

function singleSidedMutationFunction(phenotype) {
  let pathLength = phenotype.length;
	let actionIndex = randomInt(0, pathLength - 1);
	let newPhenotype = [];
	if (Math.random() > 0.5){
		let lengthAfterIndex = pathLength - 1 - actionIndex;
		let salvagedPath = phenotype.slice(0, actionIndex);
		newPhenotype = salvagedPath.concat(getRandomPath(phenotype[actionIndex], lengthAfterIndex, salvagedPath));
	} else {
		if (Math.random() > 0.5 && phenotype.length > minChainLength){
			phenotype.pop()
			newPhenotype = phenotype;
		} else {
			newPhenotype = phenotype.concat(getRandomPath(phenotype[phenotype.length - 1], 1, phenotype))
		}
	}
  return newPhenotype
}

function mutationFunction(phenotype) {
  if (Math.random() > 0.5){
    phenotype.fromStart = singleSidedMutationFunction(phenotype.fromStart)
  } else {
    phenotype.fromFinish = singleSidedMutationFunction(phenotype.fromFinish)
  }
  return phenotype
}

function crossoverFunction(phenotypeA, phenotypeB) {
	// move, copy, or append some values from a to b and from b to a
  let temp = phenotypeA.fromStart
  phenotypeA.fromStart = phenotypeB.fromStart
  phenotypeB.fromStart = temp
	return [ phenotypeA, phenotypeB ]
}

function fitnessFunction(phenotype) {
	var score = 0
	let lastWordinFromStart = phenotype.fromStart[phenotype.fromStart.length - 1]
  let lastWordinFromFinish = phenotype.fromFinish[phenotype.fromFinish.length - 1]

  score = 5 * lastWordinFromStart.split('').filter((letter, index) => letter === lastWordinFromFinish[index]).length

	score -= (phenotype.fromStart.length + phenotype.fromFinish.length) * .1

	return score

}

function yourDiversityFunc(phenA, phenB){
  let middlesForA = [phenA.fromStart[phenA.fromStart.length-1], phenA.fromFinish[phenA.fromFinish.length-1]]
  let middlesForB = [phenB.fromStart[phenB.fromStart.length-1], phenB.fromFinish[phenB.fromFinish.length-1]]
  let percentageUniquefromStart = middlesForA[0].split('').filter((char, index)=>char!==middlesForB[0][index]).length/middlesForA[0].length
  let percentageUniquefromFinish = middlesForA[1].split('').filter((char, index)=>char!==middlesForB[1][index]).length/middlesForA[1].length
  return percentageUniquefromStart + percentageUniquefromFinish / 2
}

function doesABeatBFunction(phenoTypeA, phenoTypeB) {

  // if too genetically different to consider
  if ( yourDiversityFunc(phenoTypeA, phenoTypeB) > 0.65 ) {
    return false;
  }

  // if phenoTypeA isn't better than phenoTypeB
  if ( fitnessFunction(phenoTypeA) <= fitnessFunction(phenoTypeB) ) {
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
while(geneticAlgorithm.bestScore() < 20){
	 best = geneticAlgorithm.evolve().best()
	 console.log(best, geneticAlgorithm.bestScore(), generations)
	 generations++;
}
console.log('Finished with:')
console.log(best)

