const mongoose = require('mongoose');
const Outfit = require('./models/Outfit');
const bucket = require('./firebaseAdmin');
const path = require('path');
const puppeteer = require('puppeteer');
const fs = require('fs');
require('dotenv').config();
const dbURI = process.env.MONGODB_URI;

mongoose.connect(dbURI)
  .then(() => {
    console.log('Connected to MongoDB');
    seedDatabase();
  })
  .catch(err => console.error('Could not connect to MongoDB', err));

const outfits = [
  
  {
    name: 'Classics',
    image: '../frontend/assets/card1.png',
    items: [
      { name: 'Floral White Top', id: '26028258', itemLink: 'https://www.myntra.com/topwear/stylecast-x-slyck/stylecast-x-slyck-self-design-off-shoulder-puff-sleeves-smocking-bardot-top/26028258/buy' },
      { name: 'Straight Leg Denim', id: '18810122', itemLink: 'https://www.myntra.com/jeans/stylecast/stylecast-women-blue-mildly-distressed-jeans/18810122/buy' },
      { name: 'Locket',id: '29883395', itemLink: 'https://www.myntra.com/pendant/salty/salty-stainless-steel-legacy-locket-pendant-with-chain/29883395/buy' },
    ],
    tags: ['Casual', 'Everyday', 'Classic'], // Add tags here
  },
  {
    name: 'Art museum date',
    image: '../frontend/assets/card2.png',
    items: [
      { name: 'Party pumps', id: '29574732', itemLink: 'https://www.myntra.com/shoes/oroh/oroh-suede-party-slim-heeled-pumps/29574732/buy' },
      { name: 'Blue Bootcut Jeans', id: '27572266', itemLink: 'https://www.myntra.com/bottomwear/dolce-crudo/dolce-crudo-women-navy-blue-bootcut-high-rise-stretchable-jeans/27572266/buy' },
      { name: 'Open Knit One-Shoulder Pullover',  id: '23071436', itemLink: 'https://www.myntra.com/topwear/roadster/the-roadster-life-co.-self-design-open-knit-one-shoulder-pullover/23071436/buy' },
      { name: 'Textured PU Sling Bag',  id: '29867584', itemLink: 'https://www.myntra.com/bags/baggit/baggit-textured-pu-structured-sling-bag/29867584/buy' },
    ],
    tags: ['Date Night', 'Chic', 'Stylish'], // Add tags here
  },
  {
    name: 'Casual outgoing',
    image: '../frontend/assets/card3.png',
    items: [
      { name: 'Floral Shorts', id: '26251224', itemLink: 'https://www.myntra.com/bottomwear/berrylush/berrylush-women-floral-printed-high-rise-wrap-shorts/26251224/buy' },
      { name: 'Ruffles Top',  id: '26022348', itemLink: 'https://www.myntra.com/topwear/stylecast-x-slyck/stylecast-x-slyck-shoulder-straps-ruffles-top/26022348/buy' },
    ],
    tags: ['Casual', 'Summer', 'Comfort'], // Add tags here
  },
  {
    name: 'Summer Resort look',
    image: '../frontend/assets/card4.png',
    items: [
      { name: 'Ruffled Dress', id: '28416864', itemLink: 'https://www.myntra.com/dress/stylecast-x-revolte/stylecast-x-revolte-white-self-design-ruffled-tiered-fit-&-flare-dress/28416864/buy' },
      { name: 'Lace-Up Sneakers', id: '28313528', itemLink: 'https://www.myntra.com/shoes/forever-glam-by-pantaloons/forever-glam-by-pantaloons-women-round-toe-mid-top-lace-ups-sneakers/28313528/buy' },
    ],
    tags: ['Summer', 'Vacation', 'Beach'], // Add tags here
  },
  {
    name: 'Business Casual',
    image: '../frontend/assets/card5.png',
    items: [
      { name: 'Off-White Overcoat', id: '26556690', itemLink: 'https://www.myntra.com/topwear/stylecast/stylecast-off-white-double-breasted-overcoat/26556690/buy' },
      { name: 'Bodycon Mini Dress', id: '30081398', itemLink: 'https://www.myntra.com/dress/showoff/showoff-sleeveless-bodycon-mini-dress/30081398/buy' },
      { name: 'Laptop Shoulder Bag', id: '23023886', itemLink: 'https://www.myntra.com/bags/lino-perros/lino-perros-women-textured-structured-laptop-shoulder-bag/23023886/buy' },
    ],
    tags: ['Business', 'Formal', 'Professional'], // Add tags here
  },
  {
    name: 'Old Money',
    image: '../frontend/assets/card6.png',
    items: [
      { name: 'Long Sleeves Pullover', id: '24055360', itemLink: 'https://www.myntra.com/sweaters/only/only-onlcaviar-ls-striped-long-sleeves-acrylic-pullover/24055360/buy' },
      { name: 'White Polo Crop T-shirt', id: '22832906', itemLink: 'https://www.myntra.com/tshirts/street+9/street-9-white-polo-collar-sleeveless-pure-cotton-crop-t-shirt/22832906/buy' },
      { name: 'High-Rise Trousers', id: '28279156', itemLink: 'https://www.myntra.com/trousers/magre/magre-flex-fit-solid-flared-high-rise-trousers/28279156/buy' },
      { name: 'Structured Satchel', id: '29912407', itemLink: 'https://www.myntra.com/handbags/allen+solly/allen-solly-structured-satchel/29912407/buy' }
    ],
    tags: ['Vintage', 'Elegant', 'Classy'], // Add tags here
  },
];

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const uploadFile = async (filePath, delayTime = 500) => {
  const fileName = path.basename(filePath);
  await delay(delayTime);
  
  return new Promise((resolve, reject) => {
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream({
      resumable: false,
      gzip: true,
    });

    blobStream.on('error', (err) => {
      reject(err);
    });

    blobStream.on('finish', () => {
      const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(fileName)}?alt=media`;
      resolve(publicUrl);
    });

    fs.createReadStream(filePath).pipe(blobStream);
  });
};

const extractDetails = async (itemLink) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');
    await page.goto(itemLink, { waitUntil: 'networkidle2', timeout: 60000 });

    const details = await page.evaluate(() => {
      const priceElement = document.querySelector('span.pdp-price strong');
      const price = priceElement ? priceElement.innerText.trim() : '';

      const imageElement = document.querySelector('div.image-grid-image');
      const imageUrl = imageElement ? imageElement.style.backgroundImage.replace(/^url\(["']/, '').replace(/["']\)$/, '') : '';

      return { price, imageUrl };
    });

    await browser.close();
    return details;
  } catch (error) {
    console.error('Error extracting details:', error.message);
    return { price: '', imageUrl: '' };
  }
};

const seedDatabase = async () => {
  try {
    await Outfit.deleteMany();

    for (const outfit of outfits) {
      const uploadedImageURL = await uploadFile(outfit.image);
      const items = [];

      for (const item of outfit.items) {
        const { price, imageUrl } = await extractDetails(item.itemLink);
        items.push({
          itemName: item.name,
          itemLink: item.itemLink,
          itemId: item.id,
          imageUrl,
          price,
        });
      }

      const newOutfit = {
        name: outfit.name,
        photo: uploadedImageURL,
        tags: outfit.tags,
        items: items,
      };

      await Outfit.create(newOutfit);
    }

    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database', err);
  } finally {
    mongoose.disconnect();
  }
};