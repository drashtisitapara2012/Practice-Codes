//An async function always returns a Promise.
//await pauses the execution until the promise is resolved or rejected
// function getUserId() {
//   return new Promise(resolve => {
//     setTimeout(() => resolve(101), 1000);
//   });
// }

// function getUserDetails(id) {
//   return new Promise(resolve => {
//     setTimeout(() => {
//       resolve({ id, name: "Drashti", role: "Developer" });
//     }, 1000);
//   });
// }
// async function displayUser() {
//   try {
//     const userId = await getUserId();

//     const userDetails = await getUserDetails(userId);
//     console.log("User Details:", userDetails);
//   } catch (error) {
//     console.error("Error:", error);
//   }
// }
// displayUser(); 

//Removing async/await does not throw a syntax or runtime error, but it causes a logical error because promises are not resolved, resulting in pending promises instead of actual values.
function getUserId() {
  return new Promise(resolve => {
    setTimeout(() => resolve(101), 1000);
  });
}

function getUserDetails(id) {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({ id, name: "Drashti", role: "Developer" });
    }, 1000);
  });
}
 function displayUser() {
  try {
    const userId =  getUserId();

    const userDetails =  getUserDetails(userId);
    console.log("User Details:", userDetails);
  } catch (error) {
    console.error("Error:", error);
  }
}
displayUser(); 