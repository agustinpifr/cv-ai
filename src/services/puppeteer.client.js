const htmlToPdfBuffer = async (html) => {
  // Check if we should use external PDF service (Browserless.io)
  const BROWSERLESS_API_KEY = process.env.BROWSERLESS_API_KEY?.trim(); // Trim any whitespace
  
  // Detect Vercel environment (Vercel sets VERCEL_ENV or we can check for other Vercel-specific vars)
  const isVercel = process.env.VERCEL_ENV || process.env.VERCEL_URL || process.env.VERCEL;
  
  // Use Browserless if we have the API key (required for Vercel)
  if (BROWSERLESS_API_KEY) {
    // Use Browserless.io for production/Vercel deployment
    console.log('Using Browserless.io for PDF generation');
    console.log('API Key present:', !!BROWSERLESS_API_KEY);
    console.log('API Key length:', BROWSERLESS_API_KEY.length);
    console.log('API Key first 4 chars:', BROWSERLESS_API_KEY.substring(0, 4) + '...');
    console.log('Environment:', isVercel ? 'Vercel' : 'Local with Browserless');
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
  // First, let's test if the API key works at all
  console.log('Testing Browserless API key connectivity...');
  try {
    const testResponse = await fetch(`https://production-sfo.browserless.io/pdf?token=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        html: '<h1>Test</h1>'
      })
    });
    console.log('Browserless test response:', testResponse.status, testResponse.statusText);
    if (testResponse.status === 403) {
      const errorBody = await testResponse.text();
      console.error('Browserless API key test failed with 403. Response:', errorBody);
      console.error('Please verify your API key format. It should look like: bless_xxxxx or similar');
    }
  } catch (testError) {
    console.error('Browserless connectivity test failed:', testError.message);
  }

  // Updated API configs - prioritize the new production endpoint
  const apiConfigs = [
    {
      name: 'Browserless Production (Token in URL)',
      url: `https://production-sfo.browserless.io/pdf?token=${apiKey}`,
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Node.js/Vercel'
      }
    },
    {
      name: 'Browserless Production (Bearer)',
      url: 'https://production-sfo.browserless.io/pdf',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': 'Node.js/Vercel'
      }
    },
    {
      name: 'Browserless Alternative Auth',
      url: 'https://production-sfo.browserless.io/pdf',
      headers: {
        'Content-Type': 'application/json',
        'X-API-KEY': apiKey,
        'User-Agent': 'Node.js/Vercel'
      }
    }
  ];

  // Try two different request body formats
  const requestBodies = [
    // Format 1: Simple format with options at root level
    JSON.stringify({
      html: html,
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '20mm',
        bottom: '20mm',
        left: '20mm'
      }
    }),
    // Format 2: Nested options format
    JSON.stringify({
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
      emulateMediaType: 'print'
    })
  ];

  let lastError = null;

  // Try each API configuration with each request body format
  for (const config of apiConfigs) {
    for (let i = 0; i < requestBodies.length; i++) {
      const requestBody = requestBodies[i];
      const formatName = i === 0 ? 'simple' : 'nested';
      
      try {
        console.log(`Attempting Browserless connection: ${config.name} with ${formatName} format...`);
        
        const response = await fetch(config.url, {
          method: 'POST',
          headers: config.headers,
          body: requestBody
        });

        console.log(`${config.name} (${formatName}) - Response Status: ${response.status}`);
        
        if (response.ok) {
          // Success! Generate and return the PDF
          const buffer = await response.arrayBuffer();
          console.log(`PDF generated successfully using ${config.name} with ${formatName} format, size: ${buffer.byteLength} bytes`);
          return Buffer.from(buffer);
        }
        
        // Log the error but continue trying other endpoints
        const errorText = await response.text().catch(() => response.statusText);
        console.error(`${config.name} (${formatName}) failed:`, response.status, errorText);
        lastError = { config: `${config.name} (${formatName})`, status: response.status, error: errorText };
        
      } catch (error) {
        console.error(`${config.name} (${formatName}) connection error:`, error.message);
        lastError = { config: `${config.name} (${formatName})`, error: error.message };
      }
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