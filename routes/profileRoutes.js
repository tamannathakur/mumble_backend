// routes/profileRoutes.js
const express = require('express');
const Profile = require('../models/Profile'); // Profile model for profile-specific data
const auth = require('../middleware/auth'); // Authentication middleware

const router = express.Router();

// Get authenticated user's profile information or by email if provided (admin use case)
router.get('/profile/:email?', auth, async (req, res) => {
  const email = req.params.email || req.user.email;

  try {
    // Ensure the user is only accessing their own profile or has appropriate permissions
    if (req.params.email && req.user.email !== req.params.email && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    const profile = await Profile.findOne({ email });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

// Update authenticated user's profile information or by email if provided (admin use case)
router.put('/profile/:email?', auth, async (req, res) => {
  const email = req.params.email || req.user.email;
  const updateData = req.body;

  try {
    // Ensure the user is only updating their own profile or has appropriate permissions
    if (req.params.email && req.user.email !== req.params.email && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Access forbidden' });
    }

    const profile = await Profile.findOneAndUpdate({ email }, updateData, { new: true });

    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

module.exports = router;
