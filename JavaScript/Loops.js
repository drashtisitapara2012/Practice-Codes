const cars = ["BMW", "Volvo", "Saab", "Ford"];
let len = cars.length;

// For Loop
let text = " ";
for (let i = 0; i < len; i++) {
    text += cars[i];
    console.log(text);
}

//while Loop
let i = 0;
while (i < 10) {
    console.log(i);
    i++;
}

//do...while Loop
let a = 10;
do {
    console.log("The number is " + a);
    a++;
}
while (a < 10);

//break statement
for (let i = 0; i < 10; i++) {
    if (i == 3) { break; }
    console.log("The number is " + i);
}

//continue statement
for (let i = 1; i < 10; i++) {
    if (i == 5) { continue; }
    console.log("The number is " + i);
}

//for...in Loop uesd for working with objects
const person = { fname: "John", lname: "Doe", age: 25 };

for (let x in person) {
    console.log(x,person[x]);
}

//for each Loop used for working with arrays
const numbers = [10, 20, 30];

numbers.forEach((value, index) => {
  console.log(index, value);
});

//for...of Loop used for working with iterable objects like arrays, strings, maps, sets etc. gives full control to iterate over data can user break and continue statements
const colors = ["Red", "Green", "Blue"];

for (let color of colors) {
    console.log(color);
}