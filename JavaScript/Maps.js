const fruits = new Map();

fruits.set("apples", 500);
fruits.set("bananas", 300);
fruits.set("oranges", 200);
console.log(fruits);

console.log(fruits.get("bananas")); //accessing value by key 
console.log(fruits.size); //size of the map
console.log(fruits.delete("apples")); //deleting element by key
console.log(fruits); 
console.log(fruits.has("oranges")); //checking if key exists
//console.log(fruits.clear()); //removing all elements 

//WeakMap is a collection of key-value pairs in which the keys are objects and the values can be any arbitrary value. If there is no other reference to the object used as a key, they can be garbage collected. 
let myMap = new WeakMap();

let myObj = {fname:"John", lname:"Doe"};

myMap.set(myObj, "player");

let type = myMap.get(myObj);
console.log(type);