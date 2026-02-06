//A Promise is an Object that links Producing code and Consuming code (Producing code is code that takes some time and Consuming code is code that waits for the result)
//A Promise is in one of these states: pending, fulfilled, or rejected
// let checkEvenNumber = new Promise(function(resolve, reject) {
//     let number = 4;
//     if(number % 2 === 0) {
//         resolve('The number is even.');
//     }
//     else{
//         reject('The number is not even.');
//     }
// });
// checkEvenNumber
// .then((message)=>console.log(message))
// .catch((error)=>console.log(error))
// .finally(()=>console.log('Execution completed.'));

//Chaining Promises
// let fetchData = new Promise(function(resolve,reject) {
//     let data = {name: 'John', age: 30};
//     resolve(data);
// });

// fetchData
// .then((data)=>{
//     console.log('Data fetched:', data);
//     return data.age;
// })
// .then((age)=>{
//     console.log('Age is:', age);
//     return age >= 18;
// })
// .then((isAdult)=>{
//     if(isAdult) {
//         console.log('The person is an adult.');
//     } else {
//         console.log('The person is not an adult.');
//     }
// })
// .catch((error)=>console.log('Error:', error)); 

//Promise.all() : Waits for all promises to resolve and returns their results as an array. If any promise is rejected, it immediately rejects. 
Promise.all([
    Promise.resolve("Task 1 completed"),
    Promise.resolve("Task 2 completed"),
    Promise.reject("Task 3 failed")
])
    .then((results) => console.log(results))
    .catch((error) => console.error(error));

//Promise.allSettled()  : Waits for all promises to settle (either fulfilled or rejected) and returns an array of their results.
Promise.allSettled([
    Promise.resolve("Task A completed"),
    Promise.reject("Task B failed"),
    Promise.resolve("Task C completed")
])
    .then((results) => console.log(results));

//Promise.race() : Returns a single Promise from a list of promises. When the faster promise settles
Promise.race([
    new Promise((resolve) => setTimeout(() => resolve("Fast task completed"), 100)),
    new Promise((resolve) => setTimeout(() => resolve("Slow task completed"), 700))
])
    .then((result) => console.log(result));

//Promise.any() : Returns a single Promise that resolves as soon as any of the promises in the array fulfills. If all promises are rejected, it rejects with an AggregateError.
Promise.any([
    Promise.reject("Task X failed"),
    Promise.resolve("Task Y completed"),
    Promise.reject("Task Z failed")
])
    .then((result) => console.log(result))
    .catch((error) => console.error(error));


//Promise.withResolvers() : Promise.withResolvers() is a static method that simplifies the creation and management of Promises.
const { promise, resolve, reject } = Promise.withResolvers();

setTimeout(() => {
  reject("Something went wrong");
}, 1000);

promise
  .then(res => console.log(res))
  .catch(err => console.log(err));

  //there will be issue of .then() and  .catch() chain so async await is the solution for that