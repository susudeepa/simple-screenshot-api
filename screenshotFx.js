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
    await page.goto(url);

    if (mobile) {
      await page.setViewport({ width: 375, height: 812, isMobile: true });
    } else {
      await page.setViewport({ width: 1080, height: 1024 });
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