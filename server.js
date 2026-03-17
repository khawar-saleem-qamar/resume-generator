const express = require("express");
const path = require("path");
const { pathToFileURL } = require("url");
const puppeteer = require("puppeteer");

const app = express();
const PORT = 3000;

app.use(express.static(__dirname));

app.get("/resume.pdf", async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const filePath = path.join(__dirname, "khawar cv.html");
    const fileUrl = pathToFileURL(filePath).href;

    await page.goto(fileUrl, { waitUntil: "networkidle0" });
    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=\"Khawar_Saleem_Qamar_Resume.pdf\"",
    );
    res.send(pdfBuffer);
  } catch (error) {
    console.error("PDF Generation Error:", error);
    res.status(500).send("Failed to generate PDF");
  } finally {
    if (browser) {
      await browser.close();
    }
  }
});

app.listen(PORT, () => {
  console.log(`Resume server running at http://localhost:${PORT}`);
});
