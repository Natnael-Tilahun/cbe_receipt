// server/utils/receiptHtmlTemplate.ts

// Keep generateReceiptHtml function from previous step, we'll modify its content later.


  
 // server/api/generate-receipt.post.ts
import puppeteer, { type Browser } from 'puppeteer'; // Import Browser type for clarity
import { defineEventHandler, readBody, H3Event } from 'h3';

// Ensure this path is correct and the file is error-free
import { generateReceiptHtml } from '../utils/receiptHtmlTemplate';
import { CBEReceiptData } from '~/types';

export default defineEventHandler(async (event: H3Event) => {
  console.log('[API /generate-receipt] Request received.');

  let browser: Browser | null = null; // Declare browser outside try so it can be closed in finally

  try {
    const body = await readBody<CBEReceiptData>(event);
    // More detailed validation
    if (!body) {
      console.error('[API /generate-receipt] No body received');
      event.node.res.statusCode = 400;
      return { error: 'No data provided.' };
    }

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

    const htmlContent = generateReceiptHtml(body);
    console.log('[API /generate-receipt] HTML content generated. Length:', htmlContent.length);

    // --- Puppeteer Logic ---
    console.log('[API /generate-receipt] Launching Puppeteer...');
    // For production/CI, you might need to specify executablePath if Chromium isn't found:
    // const executablePath = process.env.CHROME_BIN || undefined;
    // browser = await puppeteer.launch({
    //   executablePath,
    //   headless: "new",
    //   args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage']
    // });
    browser = await puppeteer.launch({
      headless: "new", // Modern headless mode
      args: [
        '--no-sandbox', // Essential for running in many server/container environments
        '--disable-setuid-sandbox',
        '--disable-dev-shm-usage', // Addresses issues in some Docker environments
        '--single-process', // Try if other args don't resolve launch issues
        '--no-zygote' // Try if other args don't resolve launch issues
      ]
    });
    console.log('[API /generate-receipt] Puppeteer browser launched.');

    const page = await browser.newPage();
    console.log('[API /generate-receipt] Puppeteer page created.');

    // Optional: Set viewport for consistent rendering if your CSS relies on it
    // await page.setViewport({ width: 1200, height: 800 }); // Example viewport

    console.log('[API /generate-receipt] Setting page content...');
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' }); // Waits for network activity to cease (e.g., CDN CSS)
    console.log('[API /generate-receipt] Page content set.');

    console.log('[API /generate-receipt] Generating PDF...');
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true, // Important for Tailwind background colors
      margin: {
        top: '15mm',
        right: '15mm',
        bottom: '15mm',
        left: '15mm',
      },
    });
    console.log('[API /generate-receipt] PDF generated. Buffer length:', pdfBuffer.length);
    // --- End Puppeteer Logic ---


    // Set headers for PDF download
    event.node.res.setHeader('Content-Type', 'application/pdf');
    const filename = `CBE-Receipt-${body.payment.referenceNo || Date.now()}.pdf`;
    event.node.res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    console.log(`[API /generate-receipt] Sending PDF: ${filename}`);

    return pdfBuffer; // Nuxt 3/h3 will handle sending the buffer

  } catch (error: any) {
    console.error('[API /generate-receipt] Critical error during PDF generation:', error);
    // Log more details if available
    if (error.stack) {
      console.error(error.stack);
    }

    // Ensure the response indicates an error to the client
    if (!event.node.res.headersSent) {
        event.node.res.statusCode = 500;
        return {
          error: 'Failed to generate PDF.',
          details: error.message || String(error),
        };
    } else {
        // If headers already sent, we can't send a new JSON error body,
        // but the error is logged, and the connection might be cut.
        console.error('[API /generate-receipt] Headers already sent, cannot send JSON error response.');
    }
    // Fallback in case the return inside the if block isn't reached (should not happen)
    return { error: "An unexpected server error occurred." };

  } finally {
    if (browser) {
      console.log('[API /generate-receipt] Closing Puppeteer browser...');
      await browser.close();
      console.log('[API /generate-receipt] Puppeteer browser closed.');
    }
  }
});