const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Set Pug as the template engine
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views")); // Ensure views folder is correctly set

// Serve the static HTML form at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname,  "userform.html"));
});

// Handle form submission
app.post('/submit', (req, res) => {
  const { name, email, message} = req.body;
  


  if (!name || name.trim() === '') {
        return res.send('<h3 style="color:red;">Name is required!</h3>');
    }

    const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
    if (!email || !email.match(emailRegex)) {
        return res.send('<h3 style="color:red;">Invalid email address!</h3>');
    }
/*
    const PhoneRegex = /^\d{10}$/;
if (!Phone || !String(Phone).trim().match(PhoneRegex)) {
    return res.status(400).send('<h3 style="color:red;">Phone number must be exactly 10 digits!</h3>');
}
*/
    // If validation passes
    res.send('<h3 style="color:green;">Form submitted successfully!</h3>');

  console.log(`Received Form Data: Name: ${name}, Email: ${email}, Message: ${message}`);

  // Render the Pug template and pass form data
  res.render('index', { name, email, message });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
