//A JavaScript Generator can return multiple values, one by one.It can be paused and resumed.
function* myStream(){
    yield 1;  //yield keyword is used to pause and resume a generator function
    yield 2;
    yield 3;
}
let stream = myStream();
let text="";
for(let value of stream){
    text += value + "\n";
}
console.log(text);