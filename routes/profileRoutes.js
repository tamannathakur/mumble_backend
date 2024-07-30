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

router.put('/preferences', auth, async (req, res) => {
  const { email, userPreferences } = req.body;

  try {
    // Find the user by email and update preferences
    const updatedProfile = await Profile.findOneAndUpdate(
      { email: email },
      { userPreferences: userPreferences },
      { new: true } // Return the updated document
    );

    if (!updatedProfile) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(updatedProfile);
  } catch (error) {
    console.error('Error updating preferences:', error);
    res.status(500).json({ message: 'Failed to update preferences' });
  }
});
module.exports = router;
