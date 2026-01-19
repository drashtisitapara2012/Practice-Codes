const letters = new Set(["a","b","c"]);
letters.add("d");
letters.add("e");
letters.add("a");  //duplicate values are ignored in set
console.log(letters); 
console.log(letters.size);

console.log(letters.has("b")); 

const myIterator = letters.entries();  //The entries() method returns an Iterator with [value,value] pairs from a Set.
// List all Entries
let text = "";
for (const entry of myIterator) {
  text += entry;
}
console.log(text);


// const A = new Set(['a','b','c']);
// const B = new Set(['b','c','d']);

// const C = A.intersection(B);
// let text1 = "";
// for (const x of C) {
//   text1 += x;
// }
// console.log(text1); 

//WeakSet  is a collection of values where the values must be objects.If there is no reference they can be garbage collected.
let myset= new WeakSet();
let myobj={fname:"John" ,lname:"doe"};
myset.add(myobj);
console.log(myset.has(myobj));
