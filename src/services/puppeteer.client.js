const playwright = require('playwright-aws-lambda');

const htmlToPdfBuffer = async (html) => {
  let browser = null;
  
  try {
    // Launch browser using playwright-aws-lambda which handles serverless compatibility
    browser = await playwright.launchChromium();
    const page = await browser.newPage();
    
    // Set content with proper options
    await page.setContent(html, {
      waitUntil: 'networkidle'
    });
    
    // Add CSS for print media
    await page.emulateMedia({ media: 'print' });
    
    // Generate PDF with A4 format
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    });
    
    return pdfBuffer;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
}

module.exports = {
  htmlToPdfBuffer
}