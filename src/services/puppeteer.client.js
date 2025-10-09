const htmlToPdfBuffer = async (html) => {
  // Check if we should use external PDF service (Browserless.io)
  const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;
  const USE_BROWSERLESS = process.env.VERCEL && BROWSERLESS_API_KEY;
  
  if (USE_BROWSERLESS) {
    // Use Browserless.io for Vercel deployment
    return await generatePdfWithBrowserless(html, BROWSERLESS_API_KEY);
  } else {
    // Use local Puppeteer for development
    return await generatePdfLocally(html);
  }
};

// Browserless.io implementation for production
const generatePdfWithBrowserless = async (html, apiKey) => {
  try {
    const response = await fetch(`https://chrome.browserless.io/pdf?token=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        html: html,
        options: {
          format: 'A4',
          printBackground: true,
          margin: {
            top: '20mm',
            right: '20mm',
            bottom: '20mm',
            left: '20mm'
          },
          preferCSSPageSize: false,
          displayHeaderFooter: false
        },
        emulateMedia: 'print'
      })
    });

    if (!response.ok) {
      throw new Error(`Browserless API error: ${response.status} ${response.statusText}`);
    }

    const buffer = await response.arrayBuffer();
    return Buffer.from(buffer);
    
  } catch (error) {
    console.error('Error generating PDF with Browserless:', error);
    throw new Error(`Failed to generate PDF: ${error.message}`);
  }
};

// Local Puppeteer implementation for development
const generatePdfLocally = async (html) => {
  let browser = null;
  
  try {
    // Only require puppeteer when needed (for local development)
    const puppeteer = require('puppeteer');
    
    // Launch browser with minimal options for local development
    browser = await puppeteer.launch({
      args: [
        '--no-sandbox',
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage',
        '--disable-gpu'
      ],
      headless: 'new'
    });
    
    const page = await browser.newPage();
    
    // Set content with proper options
    await page.setContent(html, {
      waitUntil: ['networkidle0', 'domcontentloaded']
    });
    
    // Add CSS for print media
    await page.emulateMediaType('print');
    
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
    console.error('Error generating PDF locally:', error);
    
    // If local Puppeteer fails, provide helpful error message
    if (error.message.includes('Cannot find module')) {
      throw new Error('Puppeteer is not installed. For local development, run: npm install puppeteer --save-dev');
    }
    
    throw new Error(`Failed to generate PDF: ${error.message}`);
  } finally {
    if (browser) {
      await browser.close();
    }
  }
};

module.exports = {
  htmlToPdfBuffer
}