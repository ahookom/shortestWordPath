/*given a starting word and a target word, can you find a path of acceptable words
that are each a distance of 1 (add,remove,change) from each other that go from
the start to the finish?*/

let { getAllCommonReachableWords, letterFrequencyTable, getPossibleWords } = require('./utils/wordutils.js')

const startWord = 'DAD';
const targetWord = 'ZOO';
const initialSize = 100;
const minWordLength = 3;
const maxWordLength = 5;
const minChainLength = 2;
const maxChainLength = 30;
const initialPopulation = seedPopulation(startWord, minWordLength, maxWordLength, initialSize, minChainLength, maxChainLength);

function randomInt(min, max){
  return min + (Math.floor(Math.random() * (max - min + 1)))
}

function seedPopulation(){
	let initialPop = [];
	while (initialPop.length < initialSize){
		let nextPathLength = randomInt(minChainLength, maxChainLength)
    initialPop.push(getRandomPath(startWord, nextPathLength))
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

function mutationFunction(phenotype) {
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

function crossoverFunction(phenotypeA, phenotypeB) {
	return [ mutationFunction(phenotypeA), mutationFunction(phenotypeB) ]
}

function fitnessFunction(phenotype) {
	if(phenotype.length<2)return -Infinity
	var score = 0
	let lastWord = phenotype[phenotype.length - 1]
	// use your phenotype data to figure out a fitness score
	//compare last word in the chain with the target word, give 5 points
	if (lastWord === targetWord){
		score += 1000
	} else {
		if(typeof lastWord !== 'string')console.log('You have polluted the data with', lastWord,' in the array', phenotype)
		score = lastWord.split('').filter((letter, index) => letter === targetWord[index]).length
	}
	if (lastWord.length !== phenotype.length)score -= 0.5;
	score -= phenotype.length * 0.00001
	if(phenotype.length!==20)score -= 1000;
	return score

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
		populationSize: initialSize
});

console.log('Starting with:')
console.log( initialPopulation )
let best = 0;
let generations = 0;
while(geneticAlgorithm.bestScore() < 998){
	 best = geneticAlgorithm.evolve().best()
	 console.log(best, geneticAlgorithm.bestScore(), generations)
	 generations++;
}
console.log('Finished with:')
console.log(best)

