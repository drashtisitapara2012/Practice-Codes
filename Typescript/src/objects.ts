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
interface Person1 {
  name: string;
  age: number;
}

function printPersonProperty(person: Person1, property: keyof Person1) {
  console.log(`Printing person property ${property}: "${person[property]}"`);
}

let person1 = {
  name: "Max",
  age: 27
};

printPersonProperty(person1, "name");