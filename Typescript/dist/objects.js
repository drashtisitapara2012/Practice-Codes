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
//keyof is a keyword in TypeScript which is used to extract the key type from an object type.
// interface Person1 {
//   name: string;
//   age: number;
// }
// function printPersonProperty(person: Person1, property: keyof Person1) {
//   console.log(`Printing person property ${property}: "${person[property]}"`);
// }
// let person1 = {
//   name: "Max",
//   age: 27
// };
// printPersonProperty(person1, "name");
const users = [
    { id: 1, name: "Drashti", active: true },
    { id: 2, name: "Amit", active: false }
];
// "id" | "name" | "active"
function getUserValue(userList, index, key) {
    return userList[index][key];
}
const name1 = getUserValue(users, 0, "name");
const status1 = getUserValue(users, 1, "active");
console.log(name1);
console.log(status1);
