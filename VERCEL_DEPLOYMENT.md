# Vercel Deployment Guide for CV-AI

## PDF Generation Setup

This application uses different PDF generation methods depending on the environment:
- **Local Development**: Uses Puppeteer (installed as devDependency)
- **Vercel/Production**: Uses Browserless.io (cloud-based Chrome service)

## Required Environment Variables for Vercel

### 1. Get a Browserless.io API Key

Vercel's serverless environment cannot run Puppeteer directly. You need to use Browserless.io:

1. Go to [https://browserless.io](https://browserless.io)
2. Sign up for a free account (includes 1,000 free PDFs per month)
3. Get your API key from the dashboard

### 2. Set Environment Variables in Vercel

Add these environment variables in your Vercel project settings:

```env
# Required for PDF generation on Vercel
BROWSERLESS_API_KEY=your_browserless_api_key_here

# OpenAI API key for HTML generation
OPEN_AI_API_KEY=your_openai_api_key_here

# MongoDB connection
MONGODB_URI=your_mongodb_connection_string

# JWT secret for authentication
JWT_SECRET=your_jwt_secret_key

# Optional: Cloudinary for image uploads
CLOUDINARY_CLOUD_NAME=your_cloudinary_name
CLOUDINARY_API_KEY=your_cloudinary_key
CLOUDINARY_API_SECRET=your_cloudinary_secret

# Optional: Redis for caching (Upstash recommended)
REDIS_URL=your_redis_url
REDIS_TOKEN=your_redis_token
```

### 3. Deploy to Vercel

```bash
# Install Vercel CLI if not already installed
npm i -g vercel

# Deploy
vercel

# Or link to existing project and deploy
vercel --prod
```

## Troubleshooting

### Error: "Failed to generate PDF: Could not find Chromium"
**Solution**: You haven't set the `BROWSERLESS_API_KEY` environment variable in Vercel.

### Error: "PDF generation requires BROWSERLESS_API_KEY environment variable on Vercel"
**Solution**: Add the `BROWSERLESS_API_KEY` to your Vercel environment variables.

### Error: "Browserless API error: 403 Forbidden" or "401 Unauthorized"
**Solutions**:
1. **Check API Key Format**: 
   - Make sure you're copying the ENTIRE API key from Browserless dashboard
   - The key should look like: `bless_xxxxxxxxxxxxxxxxxxxxx` or similar format
   - Don't include any quotes or extra spaces
   
2. **Verify in Vercel Dashboard**:
   - Go to your Vercel project → Settings → Environment Variables
   - Make sure `BROWSERLESS_API_KEY` is set correctly
   - Re-deploy after changing environment variables: `vercel --prod`
   
3. **Check Browserless Account**:
   - Log into [browserless.io/dashboard](https://browserless.io/dashboard)
   - Verify your account is active and not suspended
   - Check if API key is still valid (they may expire)
   - Try regenerating the API key if needed
   
4. **Test Your API Key Locally**:
   ```bash
   # Test your API key with curl
   curl -X POST \
     "https://chrome.browserless.io/pdf?token=YOUR_API_KEY" \
     -H "Content-Type: application/json" \
     -d '{"html":"<h1>Test</h1>"}' \
     --output test.pdf
   ```

### Error: "Browserless API error: 429 Too Many Requests"
**Solution**: You've exceeded your Browserless plan limits. Check your usage at browserless.io.

### Debug Mode
The application will now try multiple Browserless API endpoints and formats automatically. Check your Vercel Function logs to see which attempts are being made:
1. Go to Vercel Dashboard → Functions tab
2. Click on your function logs
3. Look for messages like "Attempting Browserless connection..."

## Local Development

For local development, Puppeteer is installed as a devDependency and will work automatically:

```bash
# Install dependencies including dev dependencies
npm install

# Run locally
npm run dev
```

No Browserless API key is needed for local development.

## Cost Considerations

- **Browserless Free Tier**: 1,000 PDFs per month
- **Paid Plans**: Start at $50/month for 10,000 PDFs
- **Alternative**: If you need more PDFs, consider caching generated PDFs in your database (which the app already does)

## Architecture Notes

The PDF generation flow:
1. User data is fetched from MongoDB
2. OpenAI generates HTML from templates and user data
3. HTML is converted to PDF:
   - Local: Puppeteer renders the PDF
   - Vercel: Browserless.io API renders the PDF
4. PDF is sent to the client and cached in the database

## Performance Tips

1. **Enable PDF Caching**: The app already saves generated PDFs to the database. Consider serving cached PDFs when possible.
2. **Optimize HTML**: Keep HTML/CSS simple for faster rendering
3. **Monitor Usage**: Track your Browserless API usage to avoid hitting limits

## Support

If you encounter issues:
1. Check Vercel function logs for detailed error messages
2. Verify all environment variables are set correctly
3. Test locally first to isolate Vercel-specific issues
4. Check Browserless.io status page for service availability
