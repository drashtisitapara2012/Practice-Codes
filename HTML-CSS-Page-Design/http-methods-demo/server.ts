import express from "express";

const app = express();
app.use(express.json());
app.use(express.static("public"));

let user = {
  id: 1,
  name: "John",
  email: "john@example.com"
};

/* GET — READ */
app.get("/api/user", (req, res) => {
  res.status(200).json(user);
});

/* POST — CREATE */
app.post("/api/user", (req, res) => {
  user = { id: 1, ...req.body };
  res.status(201).json({
    message: "User created",
    user
  });
});

/* PUT — FULL UPDATE */
app.put("/api/user", (req, res) => {
  user = { id: 1, ...req.body };
  res.status(200).json({
    message: "User fully updated",
    user
  });
});

/* PATCH — PARTIAL UPDATE */
app.patch("/api/user", (req, res) => {
  user = { ...user, ...req.body };
  res.status(200).json({
    message: "User partially updated",
    user
  });
});

/* DELETE — REMOVE */
app.delete("/api/user", (req, res) => {
  user = null as any;
  res.status(204).send();
});

app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
