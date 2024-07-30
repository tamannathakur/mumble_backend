const mongoose = require('mongoose');
const Profile = require('./models/Profile'); // Adjust the path as needed
require('dotenv').config();
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
  .then(() => console.log('MongoDB connected successfully'))
  .catch(err => console.error('MongoDB connection error:', err));


const seedData = [
  {
    email: 'tamannathakur@gmail.com',
    points: 100,
    vouchers: [
      {
        name: '10% OFF',
        expires: '2024-12-31',
        expired: false,
      },
      {
        name: 'Free Shipping',
        expires: '2024-12-31',
        expired: true,
      },
    ],
    outfits: [
      {
        id: 'outfit1',
        name: 'Summer Dress',
        likes: 50,
        image: 'https://firebasestorage.googleapis.com/v0/b/mumble-8140f.appspot.com/o/1722317536253.jpg?alt=media',
      },
      {
        id: 'outfit2',
        name: 'Winter Jacket',
        likes: 30,
        image: 'https://firebasestorage.googleapis.com/v0/b/mumble-8140f.appspot.com/o/1722317536253.jpg?alt=media',
      },
    ],
    savedOutfits: [
      {
        id: 'outfit3',
        name: 'Formal Suit',
        likes: 20,
        image: 'https://firebasestorage.googleapis.com/v0/b/mumble-8140f.appspot.com/o/1722317536253.jpg?alt=media',
      },
    ],
    badges: [
      {
        image: 'https://firebasestorage.googleapis.com/v0/b/mumble-8140f.appspot.com/o/1722317536253.jpg?alt=media',
        description: 'First Login',
      },
      {
        image: 'https://firebasestorage.googleapis.com/v0/b/mumble-8140f.appspot.com/o/1722317536253.jpg?alt=media',
        description: 'Top Contributor',
      },
    ],
    userPreferences: ['Casual', 'Formal'],
  },
  // Add more profiles if needed
];
const seedDatabase = async () => {
  try {
    await Profile.deleteMany({}); // Clear existing profiles
    await Profile.insertMany(seedData); // Insert seed data
    console.log('Database seeded successfully');
  } catch (error) {
    console.error('Error seeding database', error);
  } finally {
    mongoose.disconnect(); // Close connection
  }
};
seedDatabase();
