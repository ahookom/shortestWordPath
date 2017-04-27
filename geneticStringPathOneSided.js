/*given a starting word and a target word, can you find a path of acceptable words
that are each a distance of 1 (add,remove,change) from each other that go from
the start to the finish?*/

let { getAllCommonReachableWords } = require('./utils/wordutils.js')
let { getRandomInt, getRandomPath } = require('./utils/randomutils.js')

const startWord = 'BOLD';
const targetWord = 'SCAM';
const initialSize = 1000;
const minWordLength = 3;
const maxWordLength = 5;
const minChainLength = 2;
const maxChainLength = 30;
const initialPopulation = seedPopulation(startWord, minWordLength, maxWordLength, initialSize, minChainLength, maxChainLength);

function seedPopulation(){
	let initialPop = [];
	while (initialPop.length < initialSize){
		let nextPathLength = getRandomInt(minChainLength, maxChainLength)
    initialPop.push(getRandomPath(startWord, nextPathLength))
	}
	return initialPop;
}

function mutationFunction(phenotype) {
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

function crossoverFunction(phenotypeA, phenotypeB) {
	return [ mutationFunction(phenotypeA), mutationFunction(phenotypeB) ]
}

function fitnessFunction(phenotype) {
	if (phenotype.length < 2) return -Infinity
	var score = 0
	let lastWord = phenotype[phenotype.length - 1]

	if (lastWord === targetWord){
		score += 1000
	} else {
		score = lastWord.split('').filter((letter, index) => letter === targetWord[index]).length
	}
	if (lastWord.length !== phenotype.length)score -= 0.005;
	if (score > 100) score -= phenotype.length * 20
	return score

}

var geneticAlgorithmConstructor = require('geneticalgorithm')
var geneticAlgorithm = geneticAlgorithmConstructor({
    mutationFunction: mutationFunction,
    crossoverFunction: crossoverFunction,
    fitnessFunction: fitnessFunction,
    population: initialPopulation,
		populationSize: initialSize
});

console.log('Starting with:')
// console.log( initialPopulation )
let best = 0;
let generations = 0;
while (geneticAlgorithm.bestScore() < 998){
	 best = geneticAlgorithm.evolve().best()
	 console.log(best, geneticAlgorithm.bestScore(), 'length ', best.length, 'generation ', generations)
	 generations++;
}
console.log('Finished with:')
console.log(best)

