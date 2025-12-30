const output = document.getElementById("output")!;

async function getUser() {
  const res = await fetch("/api/user");
  output.textContent = JSON.stringify(await res.json(), null, 2);
}

async function createUser() {
  const res = await fetch("/api/user", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Alice",
      email: "alice@example.com"
    })
  });
  output.textContent = JSON.stringify(await res.json(), null, 2);
}

async function updateUser() {
  const res = await fetch("/api/user", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      name: "Updated User",
      email: "updated@example.com"
    })
  });
  output.textContent = JSON.stringify(await res.json(), null, 2);
}

async function patchUser() {
  const res = await fetch("/api/user", {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: "patched@example.com"
    })
  });
  output.textContent = JSON.stringify(await res.json(), null, 2);
}

async function deleteUser() {
  await fetch("/api/user", { method: "DELETE" });
  output.textContent = "User deleted";
}
