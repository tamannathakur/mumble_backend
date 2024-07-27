// imageUpload.js
const bucket = require('./firebaseAdmin');
const path = require('path');

const uploadImage = async (filePath, destination) => {
  await bucket.upload(filePath, {
    destination: destination,
  });
  console.log(`${filePath} uploaded to ${destination}`);
};

module.exports = uploadImage;
