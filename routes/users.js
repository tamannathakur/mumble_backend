const express = require('express');
const router = express.Router();
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Profile = require('../models/Profile');
 // Adjust the path as needed

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

   // Hash password before saving
   const salt = await bcryptjs.genSalt(10);
   const hashedPassword = await bcryptjs.hash(password, salt);

   const user = new User({ name, email, password: hashedPassword });
   await user.save();

    const profile = new Profile({
      email, // Same email as user
      // You can set default values for other fields here if necessary
    });
    await profile.save();

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error('Registration error:', error); // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: 'Invalid email' });
    }
    const isMatch = await bcryptjs.compare(password, user.password);  // Use comparePassword method
    if (!isMatch) {
      return res.status(400).json({ error: 'password' });
    }

    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET);
    res.status(200).json({ token, user: { name: user.name, email: user.email } });
  } catch (error) {
    console.error('Login error:', error); // Log the error for debugging
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
