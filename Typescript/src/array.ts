const names:string[]=["Mary"];
names.push("Drashti");
names.push("John");
//names.push(20); this will generate error 
console.log(names);


const numbers = [1, 2, 3]; // inferred to type number[]
numbers.push(4); // no error
//numbers.push("2"); // Error: Argument of type 'string' is not assignable to parameter of type 'number'.
let head: number = numbers[0]; 
console.log(head);


// define our tuple. In tuple the order matters
let ourTuple: [number, boolean, string];
// initialize correctly
ourTuple = [5, false, 'Coding God was here'];

const ourReadonlyTuple: readonly [number, boolean, string] = [5, true, 'The Real Coding God'];
// throws error as it is readonly.
//ourReadonlyTuple.push('Coding God took a day off');

const graph: [x: number, y: number] = [55.2, 41.3]; //named tuple

const graph1: [number, number] = [55.2, 41.3]; //destructuring tuple 
const [x, y] = graph1;
console.log(x);