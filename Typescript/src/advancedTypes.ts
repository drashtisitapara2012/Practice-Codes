//Mapped Type Transform every property of an object type into a new type using a single template
type Flags<T> = {
  [K in keyof T]: boolean;
};

interface User {
  id: number;
  name: string;
  email: string;
}

const user: User = { id: 1, name: "Alice", email: "alice@example.com" };

function createFlags<T extends object>(obj: T): Flags<T> {
  const out: any = {};
  for (const k in obj) out[k] = true;
  return out;
}

const userFlags = createFlags(user);
console.log(userFlags.id);
console.log(userFlags.name);
console.log(userFlags.email);