const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../models/userModel'); // Import your user model

// Middleware to parse JSON request bodies
router.use(express.json());

// Define a route to register a user
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone_number, password, member } = req.body;

    // Hash the provided password
    const saltRounds = 10;
    const password_hashed = await bcrypt.hash(password, saltRounds);

    // Create a new user document with the hashed password
    const newUser = new User({
      name,
      email,
      phone_number,
      password_hashed,
      member,
    });

    // Save the user document to the database
    await newUser.save();

    res.json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
