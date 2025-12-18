//An async function always returns a Promise.
//await pauses the execution until the promise is resolved or rejected
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
async function displayUser() {
  try {
    const userId = await getUserId();

    const userDetails = await getUserDetails(userId);
    console.log("User Details:", userDetails);
  } catch (error) {
    console.error("Error:", error);
  }
}
displayUser(); 