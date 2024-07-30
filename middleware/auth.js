// middleware/auth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Extract token from the Authorization header
    const token = req.header('Authorization').replace('Bearer ', '');
    // Verify the token
    if (!token) {
      return res.status(401).json({ error: 'No token provided' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // Find the user by ID
    const user = await User.findOne({ _id: decoded.userId });

    // If no user is found, throw an error
    if (!user) {
      throw new Error();
    }

    // Attach the user to the request object
    req.user = user;
    next(); // Continue to the next middleware or route handler
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate.' });
  }
};

module.exports = auth;
