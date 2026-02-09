const d=new Date(2025,11,20,12,24,3);
console.log(d.toString());
console.log(d.toDateString()); 
console.log(d.toUTCString());
console.log(d.toISOString()); 
console.log(d.getFullYear());
console.log(d.getMonth());
console.log(d.getDate());
console.log(d.getDay());
console.log(d.getHours()); 
console.log(d.getMinutes()); 
console.log(d.getSeconds()); 
console.log(d.getTime());  //time in milliseconds since January 1, 1970 

const dt = new Date(2025,11,21,12,24,3);
console.log(dt.toString()); 
console.log(dt.setFullYear(2024));
console.log(dt.setMonth(5));
console.log(dt.setDate(15));
console.log(dt.setHours(10));
console.log(dt.setMinutes(30));
console.log(dt.setSeconds(45));
