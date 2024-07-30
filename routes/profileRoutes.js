// routes/profileRoutes.js
const express = require('express');
const Profile = require('../models/Profile');
const auth = require('../middleware/auth'); // Ensure this is your authentication middleware
const router = express.Router();

// Route to get the profile of the currently authenticated user
router.get('/profile', auth, async (req, res) => {
  try {
    const userEmail = req.user.email; // Assuming email is stored in req.user
    const profile = await Profile.findOne({ email: userEmail });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Internal server error', error: error.message });
  }
});

module.exports = router;
