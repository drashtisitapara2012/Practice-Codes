let text="Hello, World!";
console.log(text.charAt(1));
console.log(text.charCodeAt(2)); //works well with basic characters not with emoji or symbols
console.log(text.codePointAt(3));  //works well with emoji or symbols also
//console.log(text.at(2));  //similar to charAt but supports negative indexing 

console.log(text.concat(" Welcome to JavaScript.")); 

let text1 = "Apple, Banana, Kiwi";
let part = text1.slice(7, 13);
console.log(text1.slice(-10)); //supports negative indexing
console.log(part); 

console.log(text1.substring(5, 13)); //similar to slice but cannot accept negative indexing

console.log(text.toUpperCase());
console.log(text.toLowerCase()); 

let a= "   Hello World!   ";
console.log(a.trim()); //removes whitespace from both sides
console.log(a.trimStart()); //removes whitespace from start
console.log(a.trimEnd()); //removes whitespace from end

let text2 = "Hello";
console.log(text2.padStart(10, "*")); //pads the string to a total length of 10 with * at the start
console.log(text2.padEnd(10, "-"));  //pads the string to a total length of 10 with - at the end 

console.log(text2.repeat(3)); //repeats the string 3 times

let text3 = "Hello World, welcome to the World.";
console.log(text3.replace("World", "JavaScript")); //replaces first occurrence

console.log(text3.replace(/World/g, "JavaScript")); //replaces all occurrences using regex
 
let text4="hello";
console.log(text4.split("")); //splits each character into an array

console.log(text3.indexOf("World")); //returns the index of first occurrence
console.log(text3.lastIndexOf("World")); //returns the index of last occurrence

console.log(text3.match(/World/g)); //returns an array of all matches. If not used g modifier it will return only the first occurrence

console.log(text3.includes("welcome")); //returns true if substring is found else false
console.log(text3.startsWith("Hello")); //returns true if string starts with the substring else false
console.log(text3.endsWith("World.")); //returns true if string ends with the substring else false

