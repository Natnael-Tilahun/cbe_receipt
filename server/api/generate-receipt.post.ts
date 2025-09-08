// server/api/generate-receipt.post.ts
import puppeteerCore, { type Browser } from 'puppeteer-core'; // Import from puppeteer-core
import chromium from '@sparticuz/chromium'; // Import @sparticuz/chromium
import { defineEventHandler, readBody, H3Event } from 'h3';
import { promises as fs } from 'fs';
import path from 'path';

// Ensure this path is correct and the file is error-free
import { generateReceiptHtml } from '../utils/receiptHtmlTemplate'; // Assuming this is correct
import { CBEReceiptData } from '~/types'; // Assuming this is correct

export default defineEventHandler(async (event: H3Event) => {
  console.log('[API /generate-receipt] Request received.');

  let browser: Browser | null = null;

  try {
    const body = await readBody<CBEReceiptData>(event);
    if (!body) {
      console.error('[API /generate-receipt] No body received');
      event.node.res.statusCode = 400;
      return { error: 'No data provided.' };
    }
    // Your existing validations for company, customer, payment, amountInWords...
    if (!body.company) {
      console.error('[API /generate-receipt] Missing company data');
      event.node.res.statusCode = 400;
      return { error: 'Company information is required.' };
    }
    if (!body.customer) {
      console.error('[API /generate-receipt] Missing customer data');
      event.node.res.statusCode = 400;
      return { error: 'Customer information is required.' };
    }
    if (!body.payment) {
      console.error('[API /generate-receipt] Missing payment data');
      event.node.res.statusCode = 400;
      return { error: 'Payment information is required.' };
    }
    if (!body.amountInWords) {
      console.error('[API /generate-receipt] Missing amount in words');
      event.node.res.statusCode = 400;
      return { error: 'Amount in words is required.' };
    }

    // Read compiled CSS for offline server injection
    let cssContent = '';
    const isOfflineServer = process.env.NODE_ENV === 'production' && !process.env.VERCEL_ENV;
    if (isOfflineServer) {
      try {
        const cssPath = path.resolve(process.cwd(), '.output/public/css/tailwind-built.css');
        cssContent = await fs.readFile(cssPath, 'utf-8');
        console.log(`[API /generate-receipt] Inlined CSS from: .output/public/css/tailwind-built.css`);
      } catch (e) {
        console.error('[API /generate-receipt] Critical error: Could not read inline CSS for PDF:', e);
        // Do not block PDF generation, it will just be unstyled
      }
    }

    const htmlContent = generateReceiptHtml(body, cssContent);
    console.log('[API /generate-receipt] HTML content generated. Length:', htmlContent.length);

    // --- Puppeteer Logic ---
    console.log('[API /generate-receipt] Determining Chromium executable path...');
    let executablePath: string | undefined;

    if (process.env.VERCEL_ENV === 'production' || process.env.VERCEL_ENV === 'preview') {
      // Vercel environment
      console.log('[API /generate-receipt] Using @sparticuz/chromium for Vercel.');
      executablePath = await chromium.executablePath();
    } else if (process.env.NODE_ENV === 'production') {
      // For production servers (UAT, Prod)
      console.log('[API /generate-receipt] Using @sparticuz/chromium with custom path for production server.');
      const downloadPath = '/usr/share/nginx/html/chromium-bin';
      // Ensure the directory exists before attempting to download
      await fs.mkdir(downloadPath, { recursive: true });
      executablePath = await chromium.executablePath({
        downloadPath,
      });
    } else {
      // Local development
      console.log('[API /generate-receipt] Using local Chromium for development.');
      try {
        executablePath = process.env.PUPPETEER_EXECUTABLE_PATH || puppeteerCore.executablePath();
      } catch (e) {
        console.warn('[API /generate-receipt] Could not find local Chrome installation. Falling back to @sparticuz/chromium.');
      }

      if (!executablePath) {
        executablePath = await chromium.executablePath();
      }
    }

    if (!executablePath) {
      const errorMessage = '[API /generate-receipt] Chromium executable path could not be determined. Please check environment configuration.';
      console.error(errorMessage);
      event.node.res.statusCode = 500;
      return { error: 'Failed to configure PDF generator.', details: errorMessage };
    }
    console.log(`[API /generate-receipt] Using executable path: ${executablePath}`);

    console.log('[API /generate-receipt] Launching Puppeteer...');
    browser = await puppeteerCore.launch({
      args: [
        ...chromium.args,
        '--font-render-hinting=none', // Optional: Can improve font rendering on some Linux systems
        '--force-color-profile=srgb', // Force sRGB color profile for consistent colors
        '--disable-lcd-text', // Improve text sharpness in PDFs
        // '--disable-web-security', // Uncomment if you face issues loading local/cross-origin resources in HTML
        '--no-sandbox',
        '--disable-setuid-sandbox',
      ],
      defaultViewport: chromium.defaultViewport,
      executablePath: executablePath,
      headless: chromium.headless, // Uses the headless mode recommended by @sparticuz/chromium (usually 'new' or true)
      ignoreHTTPSErrors: true, // Good for development or if dealing with self-signed certs for resources
    });
    console.log('[API /generate-receipt] Puppeteer browser launched.');

    const page = await browser.newPage();
    console.log('[API /generate-receipt] Puppeteer page created.');

    console.log('[API /generate-receipt] Setting page content...');
    await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
    console.log('[API /generate-receipt] Page content set.');

    // Optional: Emulate print media type if your CSS has @media print styles
    await page.emulateMediaType('print');

    console.log('[API /generate-receipt] Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm',
      },
      // Consider adding displayHeaderFooter: false if you don't want default headers/footers
    });
    console.log('[API /generate-receipt] PDF generated. Buffer length:', pdfBuffer.length);
    // --- End Puppeteer Logic ---

    event.node.res.setHeader('Content-Type', 'application/pdf');
    const filename = `CBE-Receipt-${body.payment.referenceNo || Date.now()}.pdf`;
    event.node.res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    console.log(`[API /generate-receipt] Sending PDF: ${filename}`);

    return pdfBuffer;

  } catch (error: any) {
    console.error('[API /generate-receipt] Critical error during PDF generation:', error.message);
    if (error.stack) {
      console.error(error.stack);
    }
    // Log specific details if from Chromium launch failure
    if (error.message.includes('Failed to launch browser process') || error.message.includes('Could not find Chromium')) {
        console.error('[API /generate-receipt] This might be related to Chromium setup, missing dependencies on the server, or incorrect executablePath.');
    }

    if (!event.node.res.headersSent) {
      event.node.res.statusCode = 500;
      return {
        error: 'Failed to generate PDF.',
        details: error.message || String(error),
      };
    } else {
      console.error('[API /generate-receipt] Headers already sent, cannot send JSON error response.');
    }
    // Fallback for safety, though the above should handle it
    return { error: 'An unexpected server error occurred during PDF generation.' };

  } finally {
    if (browser) {
      console.log('[API /generate-receipt] Closing Puppeteer browser...');
      await browser.close();
      console.log('[API /generate-receipt] Puppeteer browser closed.');
    }
  }
});