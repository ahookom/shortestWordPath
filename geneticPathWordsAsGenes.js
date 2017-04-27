/*given a starting word and a target word, can you find a path of acceptable words
that are each a distance of 1 (add,remove,change) from each other that go from
the start to the finish?*/

let { getAllCommonReachableWords, letterFrequencyTable, getPossibleWords, randomWord } = require('./utils/wordutils.js')

const startWord = 'LAKES';
const targetWord = 'ELSE';
const initialSize = 1000;
const minWordLength = 3;
const maxWordLength = Infinity;
const minChainLength = 2;
const maxChainLength = 17;
const initialPopulation = seedPopulation();

function randomInt(min, max){
  return min + (Math.floor(Math.random() * (max - min + 1)))
}

function seedPopulation(){
	let initialPop = [];
	while (initialPop.length < initialSize){
		let desiredNextPathLength = randomInt(minChainLength, maxChainLength)
    let nextPath = [startWord]
    while (nextPath.length < desiredNextPathLength - 1){
      nextPath.push(randomWord())
    }
    nextPath.push(targetWord)
    initialPop.push(nextPath)
	}
	return initialPop;
}

function isLegalPath(firstWord, secondWord){
  let firstWordArr = firstWord.split('')
  let secondWordArr = secondWord.split('')
  let differences = 0
  while(firstWordArr.length && secondWordArr.length){
    if(firstWordArr[0]===secondWordArr[0]){
      firstWordArr.shift()
      secondWordArr.shift()
    }else if(firstWordArr[firstWordArr.length-1]===secondWordArr[secondWordArr.length-1]){
      firstWordArr.pop()
      secondWordArr.pop()
    }else if(firstWordArr[1]===secondWordArr[0]){
      firstWordArr.shift()
      differences++
    }else if(secondWordArr[1]===firstWordArr[0]){
      secondWordArr.shift()
      differences++
    }else {
      let isLegal = (!firstWordArr.length && !secondWordArr.length && differences===1)||(!differences && firstWordArr.length === 1 && secondWordArr.length === 1)

      return isLegal
    }
  }
  if (differences + firstWordArr.length + secondWordArr.length === 1){

    return true
  }
  return false
}

// function isLegalPath(wordA, wordB){
//   return getAllCommonReachableWords([], wordA).includes(wordB)
// }

function swapTwoWords(phenotype){
  console.log('swapping words in path', phenotype)
  let firstRandomIndex = randomInt(1, phenotype.length - 2);
  let secondRandomIndex = randomInt(1, phenotype.length - 2);
  let temp = phenotype[firstRandomIndex];
  phenotype[firstRandomIndex] = phenotype[secondRandomIndex]
  phenotype[secondRandomIndex] = temp;
  console.log('result', phenotype)
}

function changeAWord(phenotype){
  console.log('changing a word in path: ', phenotype,phenotype.length)
  let length = phenotype.length
  let randomIndex = randomInt(1, length - 2);
  let reachable = getAllCommonReachableWords([],phenotype[randomIndex-1])
  while(!reachable.length){
    randomIndex = randomInt(1, length - 2);
    reachable = getAllCommonReachableWords([],phenotype[randomIndex-1])
  }
  phenotype[randomIndex] = reachable[randomInt(0,reachable.length-1)]
  console.log('to: ',phenotype, phenotype.length)
}

function addAWord(phenotype){
  console.log('adding a word in path', phenotype, phenotype.length)
  let length = phenotype.length
  let randomIndex = randomInt(0, length - 1)
  let reachable = getAllCommonReachableWords([],phenotype[randomIndex])
  while(!reachable.length){
    randomIndex = randomInt(1, length - 1);
    reachable = getAllCommonReachableWords([],phenotype[randomIndex-1])
  }
  phenotype.splice(randomIndex, 0, reachable[randomInt(0,reachable.length-1)])
  console.log('got', phenotype,phenotype.length)
}

function mutationFunction(phenotype){
  let typeOfMutation = randomInt(0, 2);

  if (typeOfMutation === 0 ) swapTwoWords(phenotype)
  else if (typeOfMutation === 1 ) changeAWord(phenotype)
  else if (typeOfMutation === 2 ) addAWord(phenotype)

  return phenotype
}

function randomZipper(arrA, arrB){
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

function swapAtRandomIndex(phenotypeA, phenotypeB){
  let lengthOfShortest = phenotypeA.length > phenotypeB.length ? phenotypeA.length : phenotypeB.length
  let randomIndex = randomInt(1, lengthOfShortest)
  let leftHalfA = phenotypeA.slice(0, randomIndex)
  let leftHalfB = phenotypeB.slice(0, randomIndex)
  let rightHalfA = phenotypeA.slice(randomIndex)
  let rightHalfB = phenotypeB.slice(randomIndex)
  return [ leftHalfA.concat(rightHalfB),leftHalfB.concat(rightHalfA) ]
}


function crossoverFunction(phenotypeA, phenotypeB) {
	// move, copy, or append some values from a to b and from b to a
  // return randomZipper(phenotypeA, phenotypeB)
  return swapAtRandomIndex(phenotypeA, phenotypeB)
}

function fitnessFunction(phenotype) {
  if (phenotype.length < 2) return -Infinity
	var score = 0
  let length = phenotype.length
  if (phenotype[0] === startWord)score += 1000
  if (phenotype[length - 1] === targetWord)score += 1000
  let memo = {}
  let counter = 0
  while (counter < length - 1){
    if(memo[phenotype[counter]])score-=400
    memo[phenotype[counter]]=true
    if (isLegalPath(phenotype[counter], phenotype[counter + 1])&&phenotype[counter+2]!==phenotype[counter]) score += 100
    counter++;
  }

  score -= phenotype.length

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
while (generations < 1000 && geneticAlgorithm.bestScore() < 10000){
	 best = geneticAlgorithm.evolve().best()
	 console.log(best, geneticAlgorithm.bestScore(), generations)
	 generations++;
}
console.log('Finished with:')
console.log(best)

