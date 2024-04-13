const puppeteer = require("puppeteer");
const { Queue } = require("p-queue");
require("dotenv").config();

let browser; // Declare browser instance outside the function

const initializeBrowser = async () => {
  browser = await puppeteer.launch({
    args: [
      "--disable-setuid-sandbox",
      "--no-sandbox",
      "--single-process",
      "--no-zygote",
    ],
    executablePath: process.env.PUPPETEER_EXECUTABLE_PATH,
  });
};

const queue = new Queue(); // No concurrency option, so only one request will run at a time

const captureScreenshot = async (url, mobile = false) => {
  try {
    if (!browser) {
      await initializeBrowser(); // Initialize browser if it's not already initialized
    }

    const screenshotTask = async () => {
      const page = await browser.newPage();
      if (mobile) {
        await page.emulate(puppeteer.devices['iPhone 13 Pro Max']); // Changed from KnownDevices to devices
      }
      await page.setDefaultNavigationTimeout(60000);
      await page.goto(url);

      if (!mobile) {
        await page.setViewport({ width: 1920, height: 1080 });
      }

      const screenshotBuffer = await page.screenshot({ fullPage: false });

      await page.close(); // Close the page after capturing screenshot

      return { success: true, image: screenshotBuffer };
    };

    const result = await queue.add(screenshotTask);
    return result;
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    return { success: false, image: null };
  }
};

module.exports = { captureScreenshot };