//Iterable = something you can loop over , example: array,string, map, set
//Iterator = something that gives next value on demand
let arr = [10, 20, 30];
let it = arr[Symbol.iterator]();

console.log(it.next()); // { value: 10, done: false }
console.log(it.next()); // { value: 20, done: false }
console.log(it.next()); // { value: 30, done: false }
console.log(it.next()); // { value: undefined, done: true }
