let { navigate } = require('./DijkstraShortestStringPath')
let { getPathStart } = require('./utils/wordutils.js')

console.log(navigate('YET', 'TOUCH'))
// console.log(navigate('CATS', 'PURE'))
// console.log(navigate('WANT', 'BOOL'))
// console.log(navigate('HIV', 'BREAK'))
// let memo = [];
// for(let i = 0 ; i<100 ; i++){
//   memo.push(getPathStart(20))
// }

// while(memo.length){
//   let currentPath = memo.pop()
//   console.log(navigate(currentPath.newWord, currentPath.targetWord))
// }
let paths = {};
let longestPath = 0;
let averagePath = undefined;
let iterations = 0;
while (iterations < 10000 && longestPath < 20){
  let currentParams = getPathStart(Infinity)
  let shortestPathArr = navigate(currentParams.newWord, currentParams.targetWord)
  const currentLength = shortestPathArr.length
  if(averagePath){
    averagePath = (averagePath * iterations + currentLength) / (iterations + 1)
  } else {
    averagePath = currentLength
  }
  console.log(currentParams.newWord, currentParams.targetWord, currentLength, longestPath, averagePath)
  if (longestPath < currentLength)longestPath = currentLength
  paths[currentLength] ? paths[currentLength].push(currentParams) : paths[currentLength] = [currentParams]
  iterations++;
}
for(let key in paths){
  console.log('paths of length ', key, ' include ', paths[key])
}
