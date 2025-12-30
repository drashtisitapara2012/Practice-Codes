function returnType<T>(val:T):T{
    return val;
}
const numVal:number=returnType<number>(100);
const strVal:string=returnType<string>("Hello world");
const arrVal:number[]=returnType<number[]>([1,2,3,4,5]);

console.log(`Number Value: ${numVal}`);
console.log(`String Value :${strVal}`);
console.log(`Array Value : ${arrVal}`);