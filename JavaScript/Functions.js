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

//function constructor
const myFunction1 = new Function("a", "b", "return a * b");

let y = myFunction1(4, 3);
console.log(y);



//this Keyword
//this refers to the object that is currently executing the function
//Alone this will refer to the global object
let a = this;
console.log(a);

//In a function, this also refers to the global object
//"use strict"; //in strict mode, this is undefined in functions 
function myFunction2() {
  return this;
}
console.log(myFunction2());

//in the event, this refers to the element that received the event
/*
<button onclick="this.style.display='none'">
  Click to Remove Me!
</button>
*/

//Arrow functions do not have their own this. They inherit this from the parent scope.this is called lexical this.
const user = {
  name: "Drashti",
  sayName() {               //regular function
    const inner = () => {
      console.log(this.name);
    };
    inner();
  }
};

user.sayName();   //this refers to user object
//arrow function borrows that same this 



//IIFEs (Immediately Invoked Function Expressions)
(function () {
  console.log("IIFE executed");
})();

//IIFE with parameters
(function (a, b) {
  console.log(a + b);
})(5, 10);

//arrow function IIFE
((x, y) => {
  console.log(x * y);
})(4, 6);


//call() Method : With call(), an object can use a method belonging to another object.
const person = {
  fullName: function() {
    return this.firstName + " " + this.lastName;
  }
}
const person1 = {
  firstName:"John",
  lastName: "Doe"
}
const person2 = {
  firstName:"Mary",
  lastName: "Doe"
}
console.log(person.fullName.call(person1));

// The call() method takes arguments separately.
// The apply() method takes arguments as an array.


//apply() Method 
const people = {
  fullName: function(city, country) {
    return this.firstName + " " + this.lastName + "," + city + "," + country;
  }
}

const people1 = {
  firstName:"John",
  lastName: "Doe"
}

console.log(people.fullName.apply(people1, ["Oslo", "Norway"]));
//in call() we pass agruments as : person.fullName.call(person1, "Oslo", "Norway");


//bind() Method : With the bind() method, an object can borrow a method from another object.
// The bind() method returns a new function, so you can store it in a variable.
const per = {
  firstName:"John",
  lastName: "Doe",
  fullName: function () {
    return this.firstName + " " + this.lastName;
  }
}

const member = {
  firstName:"Hege",
  lastName: "Nilsen",
}
let fullName = per.fullName.bind(member);
console.log(fullName());
