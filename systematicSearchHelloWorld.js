
const targetString = 'Hello World! Can I slow this amazing brute force algorithm down?';
const possibleCharacters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz ,._?-=()*!@#$%^&~<>'

function find(targetString){
  let resultString = ''
  let targetStringArr = targetString.split('')
  targetStringArr.forEach(targetCharacter => {
    let counter = 0
    while (possibleCharacters[counter] !== targetCharacter){
      counter++
    }
    resultString = resultString + possibleCharacters[counter]
  })
  return resultString
}

console.log('Found string is', find(targetString));
