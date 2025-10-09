const htmlToPdfBuffer = async (html) => {
  // Check if we should use external PDF service (Browserless.io)
  const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY;
  
  // Detect Vercel environment (Vercel sets VERCEL_ENV or we can check for other Vercel-specific vars)
  const isVercel = process.env.VERCEL_ENV || process.env.VERCEL_URL || process.env.VERCEL;
  
  // Use Browserless if we have the API key (required for Vercel)
  if (BROWSERLESS_API_KEY) {
    // Use Browserless.io for production/Vercel deployment
    console.log('Using Browserless.io for PDF generation');
    return await generatePdfWithBrowserless(html, BROWSERLESS_API_KEY);
  } else if (isVercel) {
    // Running on Vercel but no Browserless API key
    throw new Error('PDF generation requires BROWSERLESS_API_KEY environment variable on Vercel. Get your API key at https://browserless.io');
  } else {
    // Use local Puppeteer for development
    console.log('Using local Puppeteer for PDF generation');
    return await generatePdfLocally(html);
  }
};

// Browserless.io implementation for production
const generatePdfWithBrowserless = async (html, apiKey) => {
  // Try multiple Browserless API endpoints and authentication methods
  const apiConfigs = [
    {
      name: 'Browserless v2 (Bearer Auth)',
      url: 'https://production-sfo.browserless.io/pdf',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'Cache-Control': 'no-cache'
      }
    },
    {
      name: 'Browserless v1 (Token in URL)',
      url: `https://chrome.browserless.io/pdf?token=${apiKey}`,
      headers: {
        'Content-Type': 'application/json',
        'Cache-Control': 'no-cache'
      }
    },
    {
      name: 'Browserless v1 (Header Auth)',
      url: 'https://chrome.browserless.io/pdf',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
        'Cache-Control': 'no-cache'
      }
    }
  ];

  const requestBody = JSON.stringify({
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
    // Try both property names for media emulation
    emulateMediaType: 'print',
    emulateMedia: 'print'
  });

  let lastError = null;

  // Try each API configuration
  for (const config of apiConfigs) {
    try {
      console.log(`Attempting Browserless connection: ${config.name}...`);
      
      const response = await fetch(config.url, {
        method: 'POST',
        headers: config.headers,
        body: requestBody
      });

      console.log(`${config.name} - Response Status: ${response.status}`);
      
      if (response.ok) {
        // Success! Generate and return the PDF
        const buffer = await response.arrayBuffer();
        console.log(`PDF generated successfully using ${config.name}, size: ${buffer.byteLength} bytes`);
        return Buffer.from(buffer);
      }
      
      // Log the error but continue trying other endpoints
      const errorText = await response.text().catch(() => response.statusText);
      console.error(`${config.name} failed:`, response.status, errorText);
      lastError = { config: config.name, status: response.status, error: errorText };
      
    } catch (error) {
      console.error(`${config.name} connection error:`, error.message);
      lastError = { config: config.name, error: error.message };
    }
  }

  // All attempts failed, provide detailed error message
  console.error('All Browserless API attempts failed. Last error:', lastError);
  
  if (lastError?.status === 403 || lastError?.status === 401) {
    throw new Error(
      `Browserless API authentication failed. Please verify:\n` +
      `1. Your API key is correct and active\n` +
      `2. Your account is not suspended\n` +
      `3. You haven't exceeded your plan limits\n` +
      `Check your dashboard at https://www.browserless.io/dashboard`
    );
  }
  
  if (lastError?.status === 429) {
    throw new Error('Browserless API rate limit exceeded. Please check your usage at https://www.browserless.io/dashboard');
  }
  
  throw new Error(
    `Failed to generate PDF with Browserless. ` +
    `Last attempt (${lastError?.config}) failed with: ${lastError?.error || lastError?.status || 'Unknown error'}. ` +
    `Please check your API key and account status at https://www.browserless.io/dashboard`
  );
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