const PuppeteerHTMLPDF = require("puppeteer-html-pdf");

const htmlToPdfBuffer = async (html) => {
  const htmlPDF = new PuppeteerHTMLPDF();
  htmlPDF.setOptions({ 
    format: "A4",
    printBackground: true,
    waitForPageLoad: true,
    waitForNetworkIdle: true,
    emulateMediaType: 'print',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    headless: true
  });
  const buffer = await htmlPDF.create(html, { returnBuffer: true });
  return buffer;
}

module.exports = {
  htmlToPdfBuffer
}