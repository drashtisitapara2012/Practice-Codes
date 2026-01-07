const car: { type: string, model: string, year: number } = {
    type: "Toyota",
    model: "Corolla",
    year: 2009
};

console.log(car);

//optional parameter
const details: { name: string, age?: number } = {
    name: "Drashti"
};
details.age = 21;
console.log(details);

//Enums
enum CardinalDirections{
    North=1,
    East,
    South,
    West
}
let currentDirection=CardinalDirections.North;
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

type User4 = typeof users[number]; //use typeof to extract element type from array

type UserKey = keyof User4;
// "id" | "name" | "active"

function getUserValue(
  userList: User4[],
  index: number,
  key: UserKey
) {
  return userList[index][key];
}

const name1 = getUserValue(users, 0, "name");
const status1 = getUserValue(users, 1, "active");

console.log(name1);    
console.log(status1); 

