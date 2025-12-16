//let and const have block scope
//var has function scope

//let cannot be hoisted meaning it cannot be used before declaration it will generate reference error
// name="mary";
// console.log(name);
// let name;

let x="john Doe";
console.log(x);
x=5; //let cannot be redeclared but can be reassigned
console.log(x);

//var can be hoisted meaning it can be used before declaration
b="I am Hoisted";
console.log(b);
var b;

var a=3;
console.log(a);
var a=10; //var can be redeclared and reassigned
console.log(a);

const y=10;
console.log(y);
//y=15; //const cannot be reassigned
//const z; //const must be initialized during declaration