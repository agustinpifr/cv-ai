let chromium;
let puppeteer;

// Detect if running in Vercel/serverless environment
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  // Use chrome-aws-lambda for serverless environments
  chromium = require('chrome-aws-lambda');
  puppeteer = require('puppeteer-core');
} else {
  // Use regular puppeteer for local development
  puppeteer = require('puppeteer');
}

const htmlToPdfBuffer = async (html) => {
  let browser = null;
  
  try {
    // Different browser launch configurations for different environments
    const launchOptions = process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME
      ? {
          args: chromium.args,
          defaultViewport: chromium.defaultViewport,
          executablePath: await chromium.executablePath,
          headless: chromium.headless,
          ignoreHTTPSErrors: true,
        }
      : {
          args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-dev-shm-usage',
            '--disable-accelerated-2d-canvas',
            '--no-first-run',
            '--no-zygote',
            '--single-process',
            '--disable-gpu'
          ],
          headless: true,
        };

    browser = await puppeteer.launch(launchOptions);
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