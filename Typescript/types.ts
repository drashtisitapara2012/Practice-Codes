//any – Disable type checking .When working with dynamic content where the type is unknown we can use any. It essentially tells the compiler to skip type checking for a particular variable.
let v:any=true;
v="hello";
console.log(Math.round(v));

//The unknown type is a type-safe counterpart of any. unknown must be type-checked before use
let value:unknown="Hello"
if (typeof value === "string") {
  console.log(value.toUpperCase()); // ✅ Safe
}

//never – Something that never happens Represents no value . Function never returns .Code is unreachable
function throwError(message: string): never {
  throw new Error(message);
}

//undefined– Value not assigned yet. Variable declared but not initialized
let val: undefined;
console.log(val); // undefined

//null – Intentional empty value
let data: null = null;
console.log(data);