const puppeteer = require('puppeteer');

const extractDetails = async (itemLink) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set a common user-agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Increase navigation timeout to 60 seconds
    await page.goto(itemLink, { waitUntil: 'networkidle2', timeout: 60000 });

    // Extract image and price
    const details = await page.evaluate(() => {
      // Extract price
      const priceElement = document.querySelector('span.pdp-price strong');
      const price = priceElement ? priceElement.innerText.trim() : '';

      // Extract image URL
      const imageElement = document.querySelector('div.image-grid-image');
      const imageUrl = imageElement ? imageElement.style.backgroundImage.replace(/^url\(["']/, '').replace(/["']\)$/, '') : '';

      return { price, imageUrl };
    });

    console.log('Extracted Details:', details);
    await browser.close();
    return details;
  } catch (error) {
    console.error('Error extracting details:', error.message);
    return { price: '', imageUrl: '' };
  }
};

const testLink = 'https://www.myntra.com/Jeans/Hubberholme/Hubberholme-Men-Relaxed-Fit-Clean-Look-Light-Fade-Jeans/27485940/buy';
extractDetails(testLink);
