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
      { new: true, runValidators: true  } // Return the updated document
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

router.post('/swipeRight', async (req, res) => {
  const { email, tags } = req.body;

  try {
    const profile = await Profile.findOne({ email });
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    tags.forEach(tag => {
      const preference = profile.userPreferences.find(pref => pref.tag === tag);
      if (preference) {
        preference.weight += 1;
        preference.lastUpdated = new Date();
      } else {
        profile.userPreferences.push({ tag, weight: 1, lastUpdated: new Date() });
      }
    });

    await profile.save();
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Endpoint for left swipe
router.post('/swipeLeft', async (req, res) => {
  const { email, tags } = req.body;

  try {
    const profile = await Profile.findOne({ email });
    if (!profile) {
      return res.status(404).json({ message: 'User not found' });
    }

    tags.forEach(tag => {
      const preference = profile.userPreferences.find(pref => pref.tag === tag);
      if (preference) {
        preference.weight -= 1;
        if (preference.weight <= 0) {
          profile.userPreferences = profile.userPreferences.filter(pref => pref.tag !== tag);
        }
      }
    });

    await profile.save();
    res.status(200).json(profile);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
