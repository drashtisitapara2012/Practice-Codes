//Conditional types allow TypeScript to select one type or another based on a condition, enabling powerful type transformations and generic utilities

type Normalize<T> =
    T extends string ? string[] :
    T extends number ? number[] :
    T;

function normalizeValue<T>(value: T): Normalize<T> {
    if (typeof value === "string") {
        return [value] as Normalize<T>;
    }

    if (typeof value === "number") {
        return [value] as Normalize<T>;
    }

    return value as Normalize<T>;
}


const a = normalizeValue("hello");
const b = normalizeValue(100);
const c = normalizeValue(true);

console.log("a:", a); // string[]
console.log("b:", b); // number[]
console.log("c:", c); // boolean

const mixed: string | number =
    Math.random() > 0.5 ? "TypeScript" : 42;

const result = normalizeValue(mixed);

console.log("result:", result);

//The infer keyword allows TypeScript to capture and reuse a type from within another type inside a conditional type, enabling powerful type extraction patterns.

type ElementType<T> =
    T extends (infer U)[] ? U : T;

function getFirstElement<T>(value: T): ElementType<T> {
    if (Array.isArray(value)) {
        return value[0] as ElementType<T>;
    }
    return value as ElementType<T>;
}
const a1 = getFirstElement([1, 2, 3]);
const b1 = getFirstElement(["a", "b", "c"]);
const c1 = getFirstElement(100);

console.log("a:", a1);
console.log("b:", b1);
console.log("c:", c1);

const mixed1: string[] | number[] =
    Math.random() > 0.5 ? ["hello"] : [10];

const result1 = getFirstElement(mixed1);

console.log("result:", result1);

