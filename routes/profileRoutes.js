// routes/profileRoutes.js
const express = require('express');
const Profile = require('../models/Profile');

const router = express.Router();

router.get('/profile/:email', async (req, res) => {
  const { email } = req.params;

  try {
    const profile = await Profile.findOne({ email });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching profile', error: err.message });
  }
});

router.put('/profile/:email', async (req, res) => {
  const { email } = req.params;
  const updateData = req.body;

  try {
    const profile = await Profile.findOneAndUpdate({ email }, updateData, { new: true });
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    res.status(500).json({ message: 'Error updating profile', error: err.message });
  }
});

module.exports = router;
