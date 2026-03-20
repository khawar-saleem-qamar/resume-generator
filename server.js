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
      displayHeaderFooter: true,
      headerTemplate: "<span></span>",
      footerTemplate: `
        <div style="width:100%; font-size:9px; color:#475569; padding:0 26px; box-sizing:border-box; display:flex; justify-content:space-between; align-items:center;">
          <div style="display:flex; align-items:center; gap:6px;">
            <svg width="10" height="10" viewBox="0 0 24 24" fill="#0a66c2" xmlns="http://www.w3.org/2000/svg">
              <path d="M4.98 3.5C4.98 4.88 3.88 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM0.2 8h4.6v15H0.2V8zM7.7 8h4.4v2.1h.1c.6-1.1 2.1-2.3 4.4-2.3 4.7 0 5.6 3.1 5.6 7.1V23h-4.6v-6.7c0-1.6 0-3.7-2.2-3.7-2.2 0-2.6 1.8-2.6 3.6V23H7.7V8z"/>
            </svg>
            <a href="https://www.linkedin.com/in/khawar-saleem-qamar" style="color:#0f172a; text-decoration:none; font-weight:600;">khawar-saleem-qamar</a>
          </div>
          <div style="color:#64748b;">
            Page <span class="pageNumber"></span> of <span class="totalPages"></span>
          </div>
        </div>
      `,
      margin: {
        top: "0in",
        bottom: "0.6in",
        left: "0in",
        right: "0in",
      },
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

app.get("/react-questions.pdf", async (req, res) => {
  let browser;
  try {
    browser = await puppeteer.launch({
      headless: "new",
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
    });

    const page = await browser.newPage();
    const fileUrl = `http://localhost:${PORT}/react-questions.html`;

    await page.goto(fileUrl, { waitUntil: "networkidle0" });
    await page.emulateMediaType("print");

    const pdfBuffer = await page.pdf({
      format: "Letter",
      printBackground: true,
    });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=\"React_Interview_Questions.pdf\"",
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
  console.log(`Download resume at http://localhost:${PORT}/resume.pdf`);
  console.log(
    `Download React questions at http://localhost:${PORT}/react-questions.pdf`,
  );
});
