const express = require("express");
const { captureScreenshot } = require("./screenshotFx.js");
const app = express();

const PORT = process.env.PORT;
const PASS = process.env.PASS;


const authorize = (req, res, next) => {
  const { password } = req.query;
  if (password !== PASS) {
    return res.status(401).send("Unauthorized");
  }
  next();
};

app.get("/screenshot", authorize, async (req, res) => {
  const { url, mobile } = req.query;
  if (!url) {
    return res.status(400).send("URL parameter is missing");
  }

  try {
    const result = await captureScreenshot(url, mobile === "true");
    if (result.success) {
      res.set("Content-Type", "image/png");
      return res.send(result.image);
    } else {
      return res.status(500).send("Error capturing screenshot");
    }
  } catch (error) {
    console.error("Error capturing screenshot:", error);
    return res.status(500).send("Error capturing screenshot");
  }
});

app.get("/", (req, res) => {
  res.send("Screenshot api is UP");
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});