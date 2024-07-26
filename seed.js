const mongoose = require('mongoose');
const Outfit = require('./models/Outfit');
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
    image: 'https://imgur.com/iF3YZ5j',
    items: [
      { name: 'Floral White Top', price: 'Rs. 349', image: 'https://imgur.com/undefined', id: '26028258', webUrl: 'https://www.myntra.com/topwear/stylecast-x-slyck/stylecast-x-slyck-self-design-off-shoulder-puff-sleeves-smocking-bardot-top/26028258/buy' },
      { name: 'Straight Leg Denim', price: 'Rs. 1,449', image: 'https://imgur.com/VEcwrTI', id: '18810122', webUrl: 'https://www.myntra.com/jeans/stylecast/stylecast-women-blue-mildly-distressed-jeans/18810122/buy' },
      { name: 'Locket', price: 'Rs. 469', image:'https://imgur.com/DqYNjJ5', id: '29883395', webUrl: 'https://www.myntra.com/pendant/salty/salty-stainless-steel-legacy-locket-pendant-with-chain/29883395/buy' },
    ],
  },
  {
    name: 'Art museum date',
    image: 'https://imgur.com/QUi92cy',
    items: [
      { name: 'Party pumps', price: 'Rs. 999', image:'https://imgur.com/undefined', id: '29574732', webUrl: 'https://www.myntra.com/shoes/oroh/oroh-suede-party-slim-heeled-pumps/29574732/buy' },
      { name: 'Blue Bootcut Jeans', price: 'Rs. 1,395', image: 'https://imgur.com/1YnqwJP', id: '27572266', webUrl: 'https://www.myntra.com/bottomwear/dolce-crudo/dolce-crudo-women-navy-blue-bootcut-high-rise-stretchable-jeans/27572266/buy' },
      { name: 'Open Knit One-Shoulder Pullover', price: 'Rs. 799', image: 'https://imgur.com/qsA0a4i', id: '23071436', webUrl: 'https://www.myntra.com/topwear/roadster/the-roadster-life-co.-self-design-open-knit-one-shoulder-pullover/23071436/buy' },
      { name: 'Textured PU Sling Bag', price: 'Rs. 1,113', image: 'https://imgur.com/f200J8D', id: '29867584', webUrl: 'https://www.myntra.com/bags/baggit/baggit-textured-pu-structured-sling-bag/29867584/buy' },
    ],
  },
  {
    name: 'Casual outgoing',
    image: 'https://imgur.com/iewY5x0',
    items: [
      { name: 'Floral Shorts', price: 'Rs. 415', image: 'https://imgur.com/undefined', id: '26251224', webUrl: 'https://www.myntra.com/bottomwear/berrylush/berrylush-women-floral-printed-high-rise-wrap-shorts/26251224/buy' },
      { name: 'Ruffles Top', price: 'Rs. 349', image: 'https://imgur.com/RQAxTHL', id: '26022348', webUrl: 'https://www.myntra.com/topwear/stylecast-x-slyck/stylecast-x-slyck-shoulder-straps-ruffles-top/26022348/buy' },
    ],
  },
  {
    name: 'Summer Resort look',
    image: 'https://imgur.com/7XDIJx6',
    items: [
      { name: 'Ruffled Dress', price: 'Rs.1,299', image: 'https://imgur.com/undefined', id: '28416864', webUrl: 'https://www.myntra.com/dress/stylecast-x-revolte/stylecast-x-revolte-white-self-design-ruffled-tiered-fit-&-flare-dress/28416864/buy' },
      { name: 'Lace-Up Sneakers', price: 'Rs. 1,405', image: 'https://imgur.com/p5eHYHk', id: '28313528', webUrl: 'https://www.myntra.com/shoes/forever-glam-by-pantaloons/forever-glam-by-pantaloons-women-round-toe-mid-top-lace-ups-sneakers/28313528/buy' },
    ],
  },
  {
    name: 'Business Casual',
    image: 'https://imgur.com/ARIWBMt',
    items: [
      { name: 'Off-White Overcoat', price: 'Rs 1,999', image: 'https://imgur.com/undefined', id: '26556690', webUrl: 'https://www.myntra.com/topwear/stylecast/stylecast-off-white-double-breasted-overcoat/26556690/buy' },
      { name: 'Bodycon Mini Dress', price: 'Rs. 1,239', image: 'https://imgur.com/YSEHRUK', id: '30081398', webUrl: 'https://www.myntra.com/dress/showoff/showoff-sleeveless-bodycon-mini-dress/30081398/buy' },
      { name: 'Laptop Shoulder Bag', price: 'Rs. 1,528', image: 'https://imgur.com/FsExiP7', id: '23023886', webUrl: 'https://www.myntra.com/bags/lino-perros/lino-perros-women-textured-structured-laptop-shoulder-bag/23023886/buy' },
    ],
  },
  {
    name: 'Old Money',
    image: 'https://imgur.com/sSMNVyx',
    items: [
      { name: 'Long Sleeves Pullover', price: 'Rs. 899', image:'https://imgur.com/undefined', id: '24055360', webUrl: 'https://www.myntra.com/sweaters/only/only-onlcaviar-ls-striped-long-sleeves-acrylic-pullover/24055360/buy' },
      { name: 'White Polo Crop T-shirt', price: 'Rs. 279', image:'https://imgur.com/N19FZix', id: '22832906', webUrl: 'https://www.myntra.com/tshirts/street+9/street-9-white-polo-collar-sleeveless-pure-cotton-crop-t-shirt/22832906/buy' },
      { name: ' High-Rise Trousers', price: 'Rs. 1,249', image:'https://imgur.com/hzqcJ4Y', id: '28279156', webUrl: 'https://www.myntra.com/trousers/magre/magre-flex-fit-solid-flared-high-rise-trousers/28279156/buy' },
      { name: 'Structured Satchel', price: 'Rs. 1,469', image:'https://imgur.com/0cX4NlN', id: '29912407', webUrl: 'https://www.myntra.com/handbags/allen+solly/allen-solly-structured-satchel/29912407/buy' }
    ],
  },
];

const seedDatabase = async () => {
  try {
    // Clear existing data
    await Outfit.deleteMany();

    // Insert initial data
    await Outfit.insertMany(outfits);
    console.log('Database seeded successfully');
  } catch (err) {
    console.error('Error seeding database', err);
  } finally {
    mongoose.disconnect();
  }
};
