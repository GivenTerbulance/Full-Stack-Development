// Login page (GET)
app.get('/login', (req, res) => {
    // Get the name from the query parameter (passed from the registration)
    const { name } = req.query;
  
    res.send(`
      <form action="/login" method="POST">
        <label>Name: <input type="text" name="name" value="${name || ''}" required></label><br>
        <label>Password: <input type="password" name="password" required></label><br>
        <button type="submit">Login</button>
      </form>
    `);
  });
  
  // Handle login form submission (POST)
  app.post('/login', (req, res) => {
    const { name, password } = req.body;
  
    // Validate credentials
    if (name === userCredentials.name && password === userCredentials.password) {
      res.send("<h3>Login successful!</h3>");
    } else {
      res.status(401).send(`
        <h3>Invalid credentials. Please try again.</h3>
        <a href="/login">Go back to Login Page</a>
      `);
    }
  });
  
  // Start the server
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });
  