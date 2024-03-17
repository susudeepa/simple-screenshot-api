const puppeteer = require("puppeteer");
require("dotenv").config();

const captureScreenshot = async (url, mobile = false) => {
  const browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  });
  
  try {
    const page = await browser.newPage();
    if (mobile) {
      await page.emulate(puppeteer.KnownDevices['iPhone 13 Pro Max']);
    }
    await page.setDefaultNavigationTimeout(60000);
    await page.goto(url);
    
    if (!mobile) {
      await page.setViewport({ width: 1920, height: 1080 });
    }

    const screenshotBuffer = await page.screenshot({ fullPage: true });

    return { success: true, image: screenshotBuffer };
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    return { success: false, image: null };
  } finally {
    await browser.close();
  }
};

module.exports = { captureScreenshot };