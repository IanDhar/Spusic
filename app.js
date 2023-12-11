const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 3000;
const MONGODB_URI = 'mongodb+srv://idhar01:bearniles7@cluster0.m9zr1ap.mongodb.net/?retryWrites=true&w=majority'


// Connect to MongoDB
mongoose.connect(MONGODB_URI);
const db = mongoose.connection;

// Create a schema for the login collection
const loginSchema = new mongoose.Schema({
  username: String,
  password: String,
  highScore: Number,
});

const Login = mongoose.model('login', loginSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve the login page
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/login.html');
});

// Handle login form submission
app.post('/login', async (req, res) => {
        const { username, password } = req.body;

        console.log('Request Body:', req.body);
      
        // Basic data validation
        if (!username || !password) {
          return res.status(400).send('Username and password are required.');
        }
      
        try {
          // Check login information against the database
          const user = await Login.findOne({ username, password }).exec();
          console.log('Found User:', user);
      
          if (user) {
            res.send(`Welcome, ${username}! Your high score is ${user.highScore}`);
          } else {
            res.status(401).send('Invalid username or password.');
          }
        } catch (error) {
          console.error(error);
          res.status(500).send('Internal Server Error');
        }
      });
      

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
