const express = require('express');
const bodyParser = require("body-parser");

const app = express();
const PORT = 3000;

app.use(bodyParser.json()); //Parse JSON body

//Endpoint to handle form submission 
app.post("/submit-form", (req, res) => {
    const {name, email, message} = req.body;

    if (!name || !email || !message){
        return  res.status(400).json({error: "All fields are required"});
    }
    console.log(`Received: Name - ${name}, Email - ${email}, Message - ${message}`);

    res.status(200).json({success: "Form submitted successfully"});

});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);

});