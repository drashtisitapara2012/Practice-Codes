const fruits = ["Banana", "Orange", "Apple", "Mango"];

console.log(fruits[0]);  //accessing first element
console.log(fruits[fruits.length - 1]);  //accessing last element 

fruits.push("Pineapple"); //adding element at the end
console.log(fruits);

fruits.pop();   //removing last element
console.log(fruits);

fruits.shift();  //removing first element
console.log(fruits);

fruits.unshift("Strawberry"); //adding element at the beginning
console.log(fruits);

fruits[1] = "Kiwi";  //modifying element at index 1
console.log(fruits);

Array.isArray(fruits); //checking if it is an array 
console.log(fruits);

console.log(fruits.join(" * ")); //joining array elements into a string with separator

const myGirls = ["Cecilie", "Lone"];
const myBoys = ["Emil", "Tobias", "Linus"];

const myChildren = myGirls.concat(myBoys);
console.log(myChildren); //merging two arrays 

console.log(fruits.splice(2, 0, "Lemon")); //adding elements at index 2 without removing any element
console.log(fruits);    

console.log(fruits.slice(1, 3)); //extracting elements from index 1 to 3 (3 not included)

console.log(fruits.sort()); //sorting array elements

console.log(fruits.reverse()); //reversing array elements 


//map() method creates a new array by performing a function on each array element
const numbers1 = [45, 4, 9, 16, 25];
const numbers2 = numbers1.map(myFunction);

function myFunction(value, index, array) {
  return value * 2;
}
console.log(numbers2); 

//issue with map is it will create nested arrays so flatmap() method is used to remove the nested arrays
const words = ["hello", "world"];
const letters = words.map(word => word.split(""));
console.log(letters);


//flatMap() flattens only one level 
const lettersFlat = words.flatMap(word => word.split(""));
console.log(lettersFlat);


//filter() method creates a new array with array elements that pass a test function
const numbers3 = [45, 4, 9, 16, 25];
const over18 = numbers3.filter(myFunction1);
function myFunction1(value, index, array) {
  return value > 18;
}
console.log(over18); 


//reduce() method reduces the array to a single value by executing a reducer function on each element
const numbers4 = [45, 4, 9, 16, 25];
const sum = numbers4.reduce(myFunction2);
let sum1 = numbers4.reduceRight(myFunction2); //reduces from right to left

function myFunction2(total, value, index, array) {
  return total + value;
}
console.log(sum);
console.log(sum1); 


//The every() method checks if all array values pass a test. It returns true if all values pass the test, otherwise false.
const numbers5 = [45, 4, 9, 16, 25];
const allOver18 = numbers5.every(myFunction3);

function myFunction3(value, index, array) {
  return value > 18;
}
console.log(allOver18);

//The some() method checks if any array value passes a test. It returns true if any value passes the test, otherwise false.
const numbers6 = [45, 4, 9, 16, 25];
const someOver18 = numbers6.some(myFunction4);

function myFunction4(value, index, array) {
  return value > 18;
}
console.log(someOver18);