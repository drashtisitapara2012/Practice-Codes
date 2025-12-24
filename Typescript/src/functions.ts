//the type void an be used to indicate a function doesn't return any value
function printHello(): void {
  console.log('Hello!');
}
printHello();


//Optional Parameters
function add(a: number, b: number, c?: number) {
  return a + b + (c || 0);
}
console.log(add(2,5))


//Default Parameters
function pow(value: number, exponent: number = 10) {
  return value ** exponent;
}
console.log(pow(10));


//Rest Parameter
function total(a:number,b:number,...rest:number[]){
    return a+b+rest.reduce((p,c)=>p+c,0);
}
console.log(total(10,10,10,10,10));