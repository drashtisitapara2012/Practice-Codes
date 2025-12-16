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