"use strict";
const car = {
    type: "Toyota",
    model: "Corolla",
    year: 2009
};
console.log(car);
//optional parameter
const details = {
    name: "Drashti"
};
details.age = 21;
console.log(details);
//Enums
var CardinalDirections;
(function (CardinalDirections) {
    CardinalDirections[CardinalDirections["North"] = 1] = "North";
    CardinalDirections[CardinalDirections["East"] = 2] = "East";
    CardinalDirections[CardinalDirections["South"] = 3] = "South";
    CardinalDirections[CardinalDirections["West"] = 4] = "West";
})(CardinalDirections || (CardinalDirections = {}));
let currentDirection = CardinalDirections.North;
console.log(currentDirection);
function printPersonProperty(person, property) {
    console.log(`Printing person property ${property}: "${person[property]}"`);
}
let person1 = {
    name: "Max",
    age: 27
};
printPersonProperty(person1, "name");
