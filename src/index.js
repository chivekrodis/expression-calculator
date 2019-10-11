function eval() {
  // Do not use eval!!!
  return;
}

// check Brackets
const checkBrackets = (str) => {
  let status = false;
  const leftBrackets = /\(/;
  const rightBrackets = /\)/;
  let countLeftBrackets = 0;
  let countRightBrackets = 0;
  while (leftBrackets.test(str)) {
    str = str.replace(leftBrackets, '');
    countLeftBrackets++;

  }
  while (rightBrackets.test(str)) {
    str = str.replace(rightBrackets, '');
    countRightBrackets++;
  }
  if (countLeftBrackets !== countRightBrackets) {
    return status = true;
  }
  return status;
}

// check Division By Zero
const divisionByZero = (str) => {
  let status = false;
  const spaces = /\s+/;
  while (spaces.test(str)) {
    str = str.replace(spaces, '');
  }
  const re = /\/0/;
  if (re.test(str)) {
    return status = true;
  }
  return status;
}
// cacl with switch
const calc = (oper, a, b) => {
  switch (oper) {
    case '+':
      return a + b;
      break;
    case '-':
      return a - b;
      break;
    case '*':
      return a * b;
      break;
    case '/':
      return a / b;
      break;
    default:
      return NaN;
  }
}

function expressionCalculator(expr) {
  let array = [];

  //check brackets, all must have pair
  if (checkBrackets(expr) === true) {
    throw 'ExpressionError: Brackets must be paired'
  }

  //cut spaces before & after string
  expr = expr.trim();

  //check divisionByZero
  if (divisionByZero(expr) === true) {
    throw 'TypeError: Division by zero.'
  }

  //small expression without spaces
  if (expr.length < 4) {
    expr = expr.split('');
    return calc(expr[1], Number(expr[0]), Number(expr[2]));

  }

  //replace all spaces to '!'
  const spaces = /\s+/;
  while (spaces.test(expr)) {
    expr = expr.replace(spaces, '!');
  }
  //split string by '!'
  array = expr.split('!'); // array is done
  //create object with operators weight
  let symbols = {
    '(': -1,
    ')': 0,
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  let result = 0;
  let stackNumbers = [];
  let stackSymbols = [];
  let curr = 0; // current value
  let prev = 0; // previous value
  let operator;

  array.forEach(function (e, i) {
    //  if symbol is number -> push into stack
    if (isNaN(e) === false) {
      stackNumbers.push(Number(e));
    }
    //  if symbol is not a number
    if (isNaN(e) === true) {
      // stack with symbol is empty -> push char
      if (stackSymbols.length === 0) {
        stackSymbols.push(e);
      } else {
        // stack with symbol is not empty
        //check for weight symbol
        //check for '(', ')'
        if (symbols[e] > symbols[stackSymbols[stackSymbols.length - 1]]) {
          stackSymbols.push(e);
        } else if (e === '(') {
          stackSymbols.push(e);
        } else if (e === ')') {
          let index = stackSymbols.length - 1;
          while (stackSymbols[index] !== '(') {
            curr = stackNumbers.pop();
            prev = stackNumbers.pop();
            operator = stackSymbols.pop();
            stackNumbers.push((calc(operator, Number(prev), Number(curr))));
            index--;
          }
          stackSymbols.pop();
        } else if (symbols[e] <= symbols[stackSymbols[stackSymbols.length - 1]]) {
          while (symbols[e] <= symbols[stackSymbols[stackSymbols.length - 1]]) {
            if (stackSymbols.length === 0) {
              break
            }
            if (stackSymbols[stackSymbols.length - 1] === '(') {
              break
            }
            curr = stackNumbers.pop();
            prev = stackNumbers.pop();
            operator = stackSymbols.pop();
            stackNumbers.push((calc(operator, Number(prev), Number(curr))));
          }
          stackSymbols.push(e);
        }
      }
    }
    return result;
  });
  // calc result
  while (stackSymbols.length !== 0) {
    curr = stackNumbers.pop();
    prev = stackNumbers.pop();
    let operator = stackSymbols[stackSymbols.length - 1];
    stackNumbers.push((calc(operator, Number(prev), Number(curr))));
    stackSymbols.pop();

  }

  result = stackNumbers[0];

  return result;
}

module.exports = {
  expressionCalculator
}