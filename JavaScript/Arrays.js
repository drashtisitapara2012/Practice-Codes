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