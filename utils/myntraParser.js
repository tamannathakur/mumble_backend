const axios = require('axios');
const cheerio = require('cheerio');

const parseMyntraLink = async (url) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);

    // Extract item image URL and price from the Myntra page
    const imageUrl = $('meta[property="og:image"]').attr('content');
    const price = $('.pdp-price').text().trim();

    return { imageUrl, price };
  } catch (error) {
    console.error('Error parsing Myntra link:', error);
    return { imageUrl: null, price: null };
  }
};

module.exports = { parseMyntraLink };
