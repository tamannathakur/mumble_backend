const puppeteer = require('puppeteer');

const extractPrice = async (itemLink) => {
  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    // Set a common user-agent
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36');

    // Increase navigation timeout to 60 seconds
    await page.goto(itemLink, { waitUntil: 'networkidle2', timeout: 60000 });

    // Extract price
    const price = await page.evaluate(() => {
      const priceElement = document.querySelector('span.pdp-price strong');
      return priceElement ? priceElement.innerText.trim() : '';
    });

    console.log('Extracted Price:', price);
    await browser.close();
    return price;
  } catch (error) {
    console.error('Error extracting price:', error.message);
    return '';
  }
};

const testLink = 'https://www.myntra.com/jeans/kotty/kotty-women-blue-jean-straight-fit-stretchable-jeans/20697592/buy?utm_source=dms_bing_shopping&utm_medium=bing_cpc_shopping&utm_campaign=Bing_Apparel_ShoppingCampaign&msclkid=509f701d1d311601d09c16bbba8e723b&utm_term=4578297737194806&utm_content=Bottomwear-%20Jeans';
extractPrice(testLink);
