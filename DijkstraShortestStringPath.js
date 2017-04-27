//This solution is based on Dijkstra's Algorithm.
let { getAllCommonReachableWords } = require('./utils/wordutils.js')

function navigate(start, end){
  //an object to store each intersection as a key and the name of the intersection to approach from as its value
  let approachFrom = {};
  //an object to store each intersection and the current shortest time to reach it
  let cost = {};
  cost[start] = 0;
  //an object of the intersections we just reached
  let openSet = [start];
  //an object of the intersections we have already visited
  let closedSet = [];

  let selected = start;

  while (selected !== end){
    openSet = openSet.filter(a => a !== selected);
    let neighbors = getAllCommonReachableWords(closedSet, selected);
    closedSet.push(selected);
    neighbors.forEach(neighbor => {
      if (!closedSet.includes(neighbor)){
        openSet.push(neighbor);
        let addedCost = 1;
        if (!cost[neighbor] || cost[neighbor] > addedCost + cost[selected]){
          cost[neighbor] = addedCost + cost[selected];
          approachFrom[neighbor] = selected;
        }
      }
    });
 //select element from openSet with lowest cost
    selected = lowestCostIntersection(openSet, cost);
    if (selected === undefined) return null;
  }

  return getPath(approachFrom, start, end);

}

function lowestCostIntersection(openSet, cost){
  let currentLowest = Infinity;
  let currentIntersection;
  for (let intersection of openSet){
    if (cost[intersection] < currentLowest){
      currentLowest = cost[intersection];
      currentIntersection = intersection;
    }
  }
  return currentIntersection;
}

function getPath(objOfBestFroms, start, end){
  let current = end;
  let returnArr = [end];
  while (current !== start){
    returnArr.push(objOfBestFroms[current]);
    current = objOfBestFroms[current];
  }
  return returnArr.reverse();
}

module.exports = { navigate }
