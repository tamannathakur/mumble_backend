const bucket = require('./firebaseAdmin');
const fs = require('fs');
const path = require('path');

const uploadImage = async (filePath, destination) => {
  try {
    // Upload the file using resumable uploads
    const [file] = await bucket.upload(filePath, {
      destination: destination,
      resumable: true, // Ensure resumable uploads are enabled
      metadata: {
        contentType: 'image/jpeg', // Adjust as necessary based on your file type
      },
    });

    // Generate the public URL
    const publicUrl = `https://storage.googleapis.com/${bucket.name}/${destination}`;
    console.log(`${filePath} uploaded to ${destination}`);
    return publicUrl;
  } catch (error) {
    console.error('Error uploading image to Firebase:', error);
    throw new Error('Failed to upload image');
  } finally {
    // Clean up the local file
    fs.unlink(filePath, (err) => {
      if (err) console.error('Error deleting local file:', err);
    });
  }
};

module.exports = uploadImage;
