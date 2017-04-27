
let { getAllCommonReachableWords } = require('./utils/wordutils.js')
const { getRandomPath, getRandomInt, getRandomWord } = require('./utils/randomutils.js')

const startWord = 'YET';
const targetWord = 'TOUCH';
const initialSize = 1000;
const minWordLength = 3;
const maxWordLength = Infinity;
const minChainLength = 4;
const maxChainLength = 20;
const initialPopulation = seedPopulation();

function seedPopulation(){
	let initialPop = [];
	while (initialPop.length < initialSize){
		let nextStartPathLength = getRandomInt(minChainLength, maxChainLength)
    let nextFinishPathLength = getRandomInt(minChainLength, maxChainLength)
    initialPop.push({
      fromStart: getRandomPath(startWord, nextStartPathLength),
      fromFinish: getRandomPath(targetWord, nextFinishPathLength)
    })
	}
	return initialPop;
}

function singleSidedMutationFunction(phenotype) {
  let pathLength = phenotype.length;
	let actionIndex = getRandomInt(0, pathLength - 1);
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

  score -= Math.abs(lastWordinFromStart.length - lastWordinFromFinish.length)

	if (score >= 15) score -= (phenotype.fromStart.length + phenotype.fromFinish.length) * .1

	return score

}

function yourDiversityFunc(phenA, phenB){
  let middlesForA = [phenA.fromStart[phenA.fromStart.length - 1], phenA.fromFinish[phenA.fromFinish.length - 1]]
  let middlesForB = [phenB.fromStart[phenB.fromStart.length - 1], phenB.fromFinish[phenB.fromFinish.length - 1]]
  let fractionUniquefromStart = middlesForA[0].split('').filter((char, index)=>char !== middlesForB[0][index]).length / middlesForA[0].length
  let fractionUniquefromFinish = middlesForA[1].split('').filter((char, index)=>char !== middlesForB[1][index]).length / middlesForA[1].length
  return fractionUniquefromStart + fractionUniquefromFinish
}

function doesABeatBFunction(phenoTypeA, phenoTypeB) {

  // if too genetically different to consider
  if ( yourDiversityFunc(phenoTypeA, phenoTypeB) > 1 ) {
    return false;
  }

  // if phenoTypeA isn't better than phenoTypeB
  if ( fitnessFunction(phenoTypeA) <= fitnessFunction(phenoTypeB) ) {
    return false;
  }

  // else phenoTypeA beats phenoTypeB
  return true;
}


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
let best = 0;
let generations = 0;
while (generations < 1000){
	 best = geneticAlgorithm.evolve().best()
	 console.log(best, geneticAlgorithm.bestScore(), generations)
	 generations++;
}
console.log('Finished with:')
console.log(best)

