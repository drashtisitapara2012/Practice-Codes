"use strict";
// Function Return Type Inference
// In TypeScript, return types would be inferred automatically
function greet(name) {
    return `Hello, ${name}!`;
}
function add1(a, b) {
    return a + b;
}
function getValue(key) {
    if (key === "name") {
        return "Alice";
    }
    else {
        return 42;
    }
}
console.log("greet function:");
const greeting = greet("Bob");
console.log("Return value:", greeting);
console.log("Return type:", typeof greeting);
console.log("");
console.log("add function:");
const sum = add1(5, 3);
console.log("Return value:", sum);
console.log("Return type:", typeof sum);
console.log("");
console.log("getValue function with key='name':");
const value2 = getValue("name");
console.log("Return value:", value2);
console.log("Return type:", typeof value2);
console.log("");
console.log("getValue function with key='age':");
const value3 = getValue("age");
console.log("Return value:", value3);
console.log("Return type:", typeof value3);
console.log("");
