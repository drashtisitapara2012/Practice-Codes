"use strict";
//Conditional types allow TypeScript to select one type or another based on a condition, enabling powerful type transformations and generic utilities
function normalizeValue(value) {
    if (typeof value === "string") {
        return [value];
    }
    if (typeof value === "number") {
        return [value];
    }
    return value;
}
const a = normalizeValue("hello");
const b = normalizeValue(100);
const c = normalizeValue(true);
console.log("a:", a); // string[]
console.log("b:", b); // number[]
console.log("c:", c); // boolean
const mixed = Math.random() > 0.5 ? "TypeScript" : 42;
const result = normalizeValue(mixed);
console.log("result:", result);
function getFirstElement(value) {
    if (Array.isArray(value)) {
        return value[0];
    }
    return value;
}
const a1 = getFirstElement([1, 2, 3]);
const b1 = getFirstElement(["a", "b", "c"]);
const c1 = getFirstElement(100);
console.log("a:", a1);
console.log("b:", b1);
console.log("c:", c1);
const mixed1 = Math.random() > 0.5 ? ["hello"] : [10];
const result1 = getFirstElement(mixed1);
console.log("result:", result1);
