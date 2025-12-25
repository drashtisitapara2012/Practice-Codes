//Mapped types iterate over the keys of an existing type to create a new transformed type dynamically.
type User2 = {
  id: number;
  name: string;
  email: string;
};
type OptionalUser = {
  [K in keyof User2]?: User2[K];
};

function updateUser(user: OptionalUser) {
  console.log("Updating user:", user);
}

updateUser({ name: "Drashti" });
updateUser({ email: "test@example.com" });
updateUser({ id: 1, name: "Alex" });

const fullUser: User2 = {
  id: 1,
  name: "Drashti",
  email: "drashti@example.com",
};

updateUser(fullUser);


//Built in mapped types

interface User3 {
  id: number;
  name: string;
  email?: string;
  age: number;
}

const updateUser3: Partial<User3> = {
  name: "Drashti"
};

const fullUser3: Required<User3> = {
  id: 1,
  name: "Drashti",
  email: "drashti@gmail.com",
  age: 22
};


const readonlyUser3: Readonly<User3> = {
  id: 2,
  name: "Amit",
  email: "amit@gmail.com",
  age: 25
};

// readonlyUser.name = "Changed";

const userPreview3: Pick<User3, "id" | "name"> = {
  id: 3,
  name: "Neha"
};


const userWithoutEmail3: Omit<User3, "email"> = {
  id: 4,
  name: "Rahul",
  age: 30
};


console.log("updateUser:", updateUser3);
console.log("fullUser:", fullUser3);
console.log("readonlyUser:", readonlyUser3);
console.log("userPreview:", userPreview3);
console.log("userWithoutEmail:", userWithoutEmail3);
