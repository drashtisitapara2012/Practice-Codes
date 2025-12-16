function toCelsius(fahrenheit) {
    return (5 / 9) * (fahrenheit - 32);
}

let value = toCelsius(77);
console.log(value);

//arrow function
myFunction = (a, b) => a * b;
let result = myFunction(4, 5);
console.log(result);

//default parameters
function myFunction(x, y = 10) {
    return x + y;
}
let z = myFunction(5);
console.log(z);

//rest parameters
function sum(...args) {
  let sum = 0;
  for (let arg of args) sum += arg;
  return sum;
}
let x = sum(4, 9, 16, 25, 29, 100, 66, 77);
console.log(x);