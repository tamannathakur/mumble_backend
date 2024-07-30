// models/Profile.js
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const badgeSchema = new Schema({
  image: { type: String, required: true },
  description: { type: String, required: true },
});

const profileSchema = new Schema({
  email: { type: String, required: true, unique: true },
  savedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  uploadedPosts: [{ type: Schema.Types.ObjectId, ref: 'Post' }],
  points: { type: Number, default: 0 },
  vouchers: [{
    name: String,
    expires: String,
    expired: Boolean,
  }],
  outfits: [{
    id: String,
    name: String,
    likes: Number,
    image: String,
  }],
  savedOutfits: [{
    id: String,
    name: String,
    likes: Number,
    image: String,
  }],
  badges: [badgeSchema],
  userPreferences: [String],
});

const Profile = mongoose.model('Profile', profileSchema);

module.exports = Profile;
