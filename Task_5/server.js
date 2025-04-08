const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const cors = require("cors");

const app = express();
const port = 5000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// Serve static HTML form
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "userform.html"));
});

// Mock database (for now, using an array)
let users = [
  { id: 1, name: "Given Teboho", email: "given@cognify.com" },
  { id: 2, name: "Elias Metsing", email: "elias@cognify.com" },
  { id: 3, name: "Waamanda Phaswana", email: "waamanda@cognify.com" }
];

//  **CREATE**: Add a new user
app.post("/users", (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ message: "Name and Email are required" });
  }
  const newUser = { id: users.length + 1, name, email };
  users.push(newUser);
  res.status(201).json(newUser);
});

//  **READ**: Get all users
app.get("/users", (req, res) => {
  res.json(users);
});

//  **READ**: Get a single user by ID
app.get("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });
  res.json(user);
});

//  **UPDATE**: Modify user data
app.put("/users/:id", (req, res) => {
  const user = users.find((u) => u.id === parseInt(req.params.id));
  if (!user) return res.status(404).json({ message: "User not found" });

  const { name, email } = req.body;
  if (name) user.name = name;
  if (email) user.email = email;

  res.json(user);
});

// **DELETE**: Remove a user
app.delete("/users/:id", (req, res) => {
  users = users.filter((u) => u.id !== parseInt(req.params.id));
  res.json({ message: "User deleted successfully" });
});

//  **Handle Form Submission (POST /submit)**
app.post("/submit", (req, res) => {
  const { name, email, password } = req.body;

  if (!password) { 
    return res.status(400).json({ message: "Password is required" });
  }

  const { strength, message } = checkPasswordStrength(password);

  if (strength === "Weak") {
    return res.json({ strength, message });
  }

  if (!name || name.trim() === "") {
    return res.status(400).json({ message: "Name is required!" });
  }

  const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
  if (!email || !email.match(emailRegex)) {
    return res.status(400).json({ message: "Invalid email address!" });
  }

  res.json({ strength, message: "<h5>Form submitted successfully!</h5>" });
});

// **Password Strength Checker**
function checkPasswordStrength(password) {
  const passwordLength = password.length;
  const hasUpperCase = /[A-Z]/.test(password);
  const hasLowerCase = /[a-z]/.test(password);
  const hasNumbers = /\d/.test(password);
  const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  if (passwordLength < 8) return { strength: "Weak", message: "Password must be at least 8 characters long." };
  if (!hasUpperCase) return { strength: "Weak", message: "Password must contain at least one uppercase letter." };
  if (!hasLowerCase) return { strength: "Weak", message: "Password must contain at least one lowercase letter." };
  if (!hasNumbers) return { strength: "Weak", message: "Password must contain at least one number." };
  if (!hasSpecialChar) return { strength: "Weak", message: "Password must contain at least one special character." };

  return { strength: "Strong", message: "Password is strong!" };
}

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
