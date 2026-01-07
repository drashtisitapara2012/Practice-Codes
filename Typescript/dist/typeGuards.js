"use strict";
//Type guards are expressions or functions that tell TypeScript what the exact type of a value is within a specific block of code.
//built in type guards: typeof, instanceof, in operator
//typeof works with primitives like string,number,boolean,undefined
function print1(value) {
    if (typeof value === "string") {
        console.log(value.toUpperCase());
    }
    else {
        console.log(value.toFixed(2));
    }
}
print1("hello");
print1(1234567);
//instanceof works with classes
class Dog {
    bark() {
        console.log("barkkkk....");
    }
}
class Cat {
    meow() {
        console.log("meowww...");
    }
}
function speak(animal) {
    if (animal instanceof Dog) {
        animal.bark();
    }
    else {
        animal.meow();
    }
}
const dog = new Dog();
const cat = new Cat();
speak(dog);
speak(cat);
function handle(person) {
    if ("permissions" in person) {
        console.log(person.permissions);
    }
    else {
        console.log(person.email);
    }
}
handle({
    role: "admin",
    permissions: ["read", "write", "delete"]
});
handle({
    role: "user",
    email: "user@example.com"
});
function area(shape) {
    switch (shape.kind) {
        case "circle":
            return Math.PI * shape.radius ** 2;
        case "square":
            return shape.side ** 2;
    }
}
const circleArea = area({
    kind: "circle",
    radius: 10
});
console.log(circleArea);
const squareArea = area({
    kind: "square",
    side: 5
});
console.log(squareArea);
function assertIsUser(data) {
    if (typeof data !== "object" ||
        typeof data.id !== "number" ||
        typeof data.name !== "string") {
        throw new Error("Invalid user data");
    }
}
const response = {
    id: 1,
    name: "Drashti"
};
assertIsUser(response);
console.log(response.id);
console.log(response.name);
