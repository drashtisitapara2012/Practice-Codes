const person = new Object({
  firstName: "John",
  lastName: "Doe",
  age: 50,
  eyeColor: "blue",
  fullName : function() {
    return this.firstName + " " + this.lastName;
  }
});
console.log(person.age); // Accessing property
console.log(person.fullName()); // Calling method
person.city = "New York"; // Adding new property
delete person.eyeColor; // Deleting property

//nesting of objects
myObj = {
  name:"John",
  age:30,
  myCars: {
    car1:"Ford",
    car2:"BMW",
    car3:"Fiat"
  }
};
console.log(myObj.myCars.car2); // Accessing nested object property
const myArray = Object.values(person); // Get object values as an array
let text = myArray.toString();
console.log(text); // Convert object values to string

//object destructuring
const {firstName, lastName} = person;
console.log(firstName + " " + lastName);

//rest parameter with objects
const numbers = [10, 20, 30, 40, 50, 60, 70];

const [a,b, ...num] = numbers;
console.log(num);

//object methods

const person1 = {
  firstName: "John",
  lastName: "Doe",
  age: 50,
  eyeColor: "blue"
};

const person2 = {firstName: "Anne",lastName: "Smith"};

// Assign Source to Target
Object.assign(person1, person2);
let data=Object.entries(person1);
console.log(data); // Convert object to array of key-value pairs 

let data1=Object.values(person1);
console.log(data1); // similar to object.entries() but Get object values as an array

const fruits = [
  ["apples", 300],
  ["pears", 900],
  ["bananas", 500]
];

const myObj1 = Object.fromEntries(fruits);
console.log(myObj1); // Convert array of key-value pairs to object

Object.defineProperty(person1, "gender",{value:"male"});
console.log(Object.getOwnPropertyNames(person1)); // Get object property names

//getters and setters
const user = {
  firstName: "John",
  lastName: "Doe",
  language: "",
  get fullName() {
    return this.firstName + " " + this.lastName;
  },
  set lang(lang){
    this.language=lang;
  }
};
user.lang="en";
console.log(user.fullName);
console.log(user.language);

Object.preventExtensions(user);
user.age=30;
console.log(user.age); // undefined, as new property cannot be added
let answer=Object.isExtensible(user);
console.log(answer); // false 

Object.seal(user); //will prevent adding or deleting properties but can modify 
delete user.firstName;
console.log(user.firstName);
let ans=Object.isSealed(user);
console.log(ans); // true 

Object.freeze(user); // will prevent any modification to existing properties it will be read-only
user.lastName="Smith";
console.log(user.lastName);
let ans1=Object.isFrozen(user);
console.log(ans1); // true