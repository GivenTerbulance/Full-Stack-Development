require("dotenv").config();
const express = require("express");
const mysql = require("mysql2");

const cors = require("cors");
const path = require("path");
const bcrypt = require("bcryptjs");
const auth = require("basic-auth");


const app = express();
app.use(express.json()); //  This allows Express to parse JSON data
app.use(express.urlencoded({ extended: true })); // Handle form data (optional)
app.use(cors());
app.use(express.static("public")); // Allow requests from frontend
const port = 5000; // Ensure it's different from React app

const users = {
  admin: bcrypt.hashSync("admin123", 10),
  user: bcrypt.hashSync("user123", 10),
};



// Route to handle registration form
app.post("/register", (req, res) => {
  console.log("Received data:", req.body); // Debugging
  const { name, email } = req.body;

 

  // Redirect to the login page after successful registration
  res.redirect("/login"); 
});

app.post("/login", (req, res) => {
  const { name, email } = req.body;
  
  // Check if the name and email match any registered user
  const user = users.find(u => u.name === name && u.email === email);

  if (user) {
    return res.json({ success: true });  // User found, login successful
  }

  return res.json({ success: false });  // User not found, invalid credentials
});

app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

// Serve dashboard (you can customize this for logged-in users)
app.get("/dashboard", (req, res) => {
  res.send("<h1>Welcome to your dashboard!</h1>");
});




//Middleware for authentication on the server 
const authenticate = (req, res, next) => {
  const credentials = auth(req);

  if (!credentials || !users[credentials.name]) {
      return res.status(401).json({ message: "Access denied: Invalid credentials" });
  }

  const passwordMatch = bcrypt.compareSync(credentials.pass, users[credentials.name]);

  if (!passwordMatch) {
      return res.status(401).json({ message: "Access denied: Wrong password" });
  }

  req.user = credentials.name; // Attach user info to request
  next();
};


app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "userform.html"));  // Serve the HTML form
});


//  Create MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "P@$$W0Rd",
  database: "user_db",
  port: 3306
});

//  Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err);
    return;
  }
  console.log("Connected to MySQL database.");
});

//  CREATE TABLE IF NOT EXISTS
db.query(
  `CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100)
  )`,
  (err) => {
    if (err) console.error("Error creating table:", err);
  }
);

// **CREATE**: Add a new user

app.post("/submit", (req, res) => {
  console.log("Received data:", req.body); //Debugging
  const {name, email } = req.body;
  if (!name || !email) return res.status(400).json({ message: "Form submitted successfully!" });

 
  

  const query = "INSERT INTO users (name, email) VALUES (?, ?)";
  db.query(query, [name, email], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.status(201).json({ id: result.insertId, name, email });
  });
});

// **READ**: Get all users
app.get("/users", (req, res) => {
  db.query("SELECT * FROM users", (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json(results);
  });
});

// **READ**: Get user by ID
app.get("/users/:id", (req, res) => {
  db.query("SELECT * FROM users WHERE id = ?", [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });
    res.json(results[0]);
  });
});



// **UPDATE**: Modify user data
app.put("/users/:id", (req, res) => {
  const { name, email } = req.body;
  db.query("UPDATE users SET name = ?, email = ? WHERE id = ?", [name, email, req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "User updated successfully" });
  });
});

// **DELETE**: Remove a user
app.delete("/users/:id", (req, res) => {
  db.query("DELETE FROM users WHERE id = ?", [req.params.id], (err, result) => {
    if (err) return res.status(500).json({ message: "Database error", error: err });
    res.json({ message: "User deleted successfully" });
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
