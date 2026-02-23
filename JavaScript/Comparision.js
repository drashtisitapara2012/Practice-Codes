let a;
a = 2<12;
console.log(a);
//When comparing a string with a number, JavaScript will convert the string to a number when doing the comparison. An empty string converts to 0. A non-numeric string converts to NaN which is always false.

a= 2<"12";
console.log(a);

a=2>"john";
console.log(a);

a="2"<"12";
console.log(a);

x=undefined==null; 
console.log(x);

x=undefined===null; 
console.log(x);

//The nullish coalescing operator (??) returns the right-hand value only when the left-hand value is null or undefined, unlike || which checks all falsy values.
x= '' || null;
console.log(x);

x= null ?? null;
console.log(x); //null

x= null ?? 'hello';
console.log(x); //'hello' 