"use strict";
function returnType(val) {
    return val;
}
const numVal = returnType(100);
const strVal = returnType("Hello world");
const arrVal = returnType([1, 2, 3, 4, 5]);
console.log(`Number Value: ${numVal}`);
console.log(`String Value :${strVal}`);
console.log(`Array Value : ${arrVal}`);
