let x=123;
console.log(x.toString()); //convert number to string
console.log(x.toString(2)); //binary

x=23.754;
console.log(x.toExponential(2)); //convert to exponential notation with 2 decimal places 
console.log(x.toFixed(1)); //convert to fixed-point notation with 1 decimal place
console.log(x.toPrecision(4)); //convert to specified length 4

console.log(Number.isInteger(23)); //check if number is integer
console.log(Number.isFinite(23/0)); //check if number is finite
console.log(Number.isNaN("hello")); //check if value is NaN 

console.log(Number.MAX_VALUE); //largest possible number
console.log(Number.MIN_VALUE); //smallest possible number 