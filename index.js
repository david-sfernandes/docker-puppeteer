const express = require("express");
const puppeteer = require("puppeteer");

const app = express();
const port = 3000;

app.get("/screenshot", async (req, res) => {
  const url = req.query.url;
  if (!url) {
    return res.status(400).send("URL is required");
  }

  try {
    const browser = await puppeteer.launch({
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.goto(url);
    const screenshot = await page.screenshot({ encoding: "base64" });
    await browser.close();

    res.setHeader("Content-Type", "image/png");
    res.send(Buffer.from(screenshot, "base64"));
  } catch (error) {
    res.status(500).send(`Error taking screenshot: ${error.message}`);
  }
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
