 //DEMO FOR THE STATUS CODES 

// import express from "express";

// const app = express();
// app.use(express.json());
// app.use(express.static("public"));

// let users = [{ email: "admin@test.com", role: "admin" }];
// let requestCount = 0;

// /* 200 OK – Fetch profile */
// app.get("/api/profile", (req, res) => {
//   res.status(200).json({ name: "Drashti", role: "user" });
// });

// /* 201 Created – Register user */
// app.post("/api/register", (req, res) => {
//   const { email } = req.body;
//   if (!email) return res.status(400).json({ message: "Email required" });

//   const exists = users.find(u => u.email === email);
//   if (exists) return res.status(409).json({ message: "Email already exists" });

//   users.push({ email, role: "user" });
//   res.status(201).json({ message: "User registered" });
// });

// /* 204 No Content – Logout */
// app.post("/api/logout", (req, res) => {
//   res.status(204).send();
// });

// /* 401 Unauthorized */
// app.get("/api/private", (req, res) => {
//   res.status(401).json({ message: "Login required" });
// });

// /* 403 Forbidden */
// app.get("/api/admin", (req, res) => {
//   res.status(403).json({ message: "Admin access only" });
// });

// /* 404 Not Found */
// app.get("/api/user/:id", (req, res) => {
//   res.status(404).json({ message: "User not found" });
// });

// /* 422 Validation Error */
// app.post("/api/validate", (req, res) => {
//   const { password } = req.body;
//   if (password.length < 8) {
//     return res.status(422).json({ message: "Password too short" });
//   }
//   res.status(200).json({ message: "Valid password" });
// });

// /* 429 Too Many Requests */
// app.get("/api/otp", (req, res) => {
//   requestCount++;
//   if (requestCount > 3) {
//     return res.status(429).json({ message: "Too many OTP requests" });
//   }
//   res.status(200).json({ message: "OTP sent" });
// });

// /* 500 Server Error */
// app.get("/api/error", () => {
//   throw new Error("Server crashed");
// });

// /* Global error handler */
// app.use((err: Error, req: any, res: any, next: any) => {
//   res.status(500).json({ message: "Internal Server Error" });
// });

// app.listen(3000, () =>
//   console.log("Server running on http://localhost:3000")
// );



//HOW 429 ERROR IS HANDLED
import express from "express";
import path from "path";
import { otpLimiter } from './rateLimiter';

const app = express();

app.use(express.json());
app.use(express.static("public"));

/* OTP API (RATE LIMITED) */
app.post("/api/otp/send", otpLimiter, (req, res) => {
  res.status(200).json({
    message: "OTP sent successfully"
  });
});

/* Server start */
app.listen(3000, () => {
  console.log("Server running at http://localhost:3000");
});
