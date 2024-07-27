const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config(); // Load environment variables from .env file

const uploadRoute = require('./routes/upload');
const usersRouter = require('./routes/users');
const outfitsRouter = require('./routes/outfits');

const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Connect to MongoDB
const dbUri = process.env.MONGODB_URI;
mongoose.connect(dbUri)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

// Register routes
app.use('/api/users', usersRouter);
app.use('/api/outfits', outfitsRouter);
app.use('/api/upload', uploadRoute); // This will make the upload route available at /api/upload

// Error-handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));
