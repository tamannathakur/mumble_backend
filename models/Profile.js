const mongoose = require('mongoose');
const { Schema } = mongoose;

const itemSchema = new Schema({
  itemName: String,
  itemLink: String,
  itemId: String,
  imageUrl: String,  // Added field for item image URL
  price: String,     // Added field for item price
});

const outfitSchema = new Schema({
  id: String,
  name: { type: String, required: true },
  photo: { type: String, required: true },
  tags: [String],
  items: [itemSchema],
});

const profileSchema = new Schema({
  email: { type: String, required: true, unique: true },
  points: { type: Number, default: 0 },
  vouchers: [{
    name: String,
    expires: String,
    expired: Boolean,
  }],
  outfits: [outfitSchema],
  savedOutfits: [outfitSchema],
  badges: [{
    name: String,
    description: String,
    image: String
  }],
  userPreferences: {
    type: [
      {
        tag: { type: String, default: 'female' },
        weight: { type: Number, default: 0 },
        lastUpdated: { type: Date, default: Date.now }
      }
    ],
    default: [
      {
        tag: 'female',
        weight: 0,
        lastUpdated: Date.now
      }
    ]
  }
});

const Profile = mongoose.model('Profile', profileSchema);
module.exports = Profile;