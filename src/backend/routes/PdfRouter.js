const express = require('express');
const router = express.Router();
const puppeteer = require('puppeteer');
const path = require('path');

router.post('/pdf', async (req, res) => {
  const { html, landscape } = req.body;
  try {
    const browser = await puppeteer.launch();

    const page = await browser.newPage();
    const htmlContent = `${html}`;
    await page.setContent(htmlContent);

    const outputPath = path.join(__dirname, '../public/pdf/output.pdf');

    const pdfOptions = {
      path: outputPath,
      format: 'A4',
      landscape: landscape,
      margin: {
        top: '2cm',
        bottom: '2cm',
        left: '1cm',
        right: '1cm'
      },
    };
    await page.pdf(pdfOptions);
    await browser.close();
    res.sendFile(outputPath);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('Internal Server Error');
  }
});

module.exports = router;