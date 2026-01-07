"use strict";
function updateUser(user) {
    console.log("Updating user:", user);
}
updateUser({ name: "Drashti" });
updateUser({ email: "test@example.com" });
updateUser({ id: 1, name: "Alex" });
const fullUser = {
    id: 1,
    name: "Drashti",
    email: "drashti@example.com",
};
updateUser(fullUser);
const updateUser3 = {
    name: "Drashti"
};
const fullUser3 = {
    id: 1,
    name: "Drashti",
    email: "drashti@gmail.com",
    age: 22
};
const readonlyUser3 = {
    id: 2,
    name: "Amit",
    email: "amit@gmail.com",
    age: 25
};
// readonlyUser.name = "Changed";
const userPreview3 = {
    id: 3,
    name: "Neha"
};
const userWithoutEmail3 = {
    id: 4,
    name: "Rahul",
    age: 30
};
console.log("updateUser:", updateUser3);
console.log("fullUser:", fullUser3);
console.log("readonlyUser:", readonlyUser3);
console.log("userPreview:", userPreview3);
console.log("userWithoutEmail:", userWithoutEmail3);
