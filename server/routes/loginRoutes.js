const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const { User } = require('../models/userModel'); // Import your user model

// Middleware to parse JSON request bodies
router.use(express.json());
// not working yet
// Define a route to verify a user during login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Retrieve the user document from the database based on the provided email
    const user = await User.findOne({ email });

    if (!user) {
      // User not found
      return res.status(401).json({ error: 'Authentication failed' });
    }

    // Compare the entered password with the stored hash
    const passwordMatch = await bcrypt.compare(password, user.password_hashed);

    if (passwordMatch) {
      // Passwords match, allow the user to log in
      res.json({ message: 'Authentication successful' });
    } else {
      // Passwords do not match, deny login
      res.status(401).json({ error: 'Authentication failed' });
    }
  } catch (error) {
    console.error('Error during authentication:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
