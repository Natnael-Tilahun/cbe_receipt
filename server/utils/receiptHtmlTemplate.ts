// server/utils/receiptHtmlTemplate.ts
// ... (keep CBEReceiptData interface from above)

import { CBEReceiptData } from "../api/generate-receipt.post";

// Helper function to generate HTML for InfoItem-like structure
function generateInfoItemHtml(label: string, value: string | undefined | null, itemClass: string = "", _fullWidth: boolean = false): string {
    // _fullWidth is not directly used in this simple HTML representation,
    // but the itemClass can control styling like borders.
    // If value is undefined or null, display 'N/A' or an empty string.
    const displayValue = value ?? 'N/A';
    return `
      <div class="flex justify-between items-center text-xs md:text-sm py-1 text-black ${itemClass}">
        <span>${label}</span>
        <span class=" text-right text-black">${displayValue}</span>
      </div>
    `;
  }
  
  
  export function generateReceiptHtml(data: CBEReceiptData): string {
    const { company, customer, payment, amountInWords } = data;
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${company.receiptTitle} - ${company.name}</title>
        <script src="https://cdn.tailwindcss.com"></script>
        <style>
           body {
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            color: black;
          }
        </style>
      </head>
      <body>
        <div class="w-full max-w-5xl mx-auto bg-white border border-black rounded-md text-black overflow-hidden">
          <!-- Receipt Header -->
          <div class="bg-[#83257a] print:bg-[#83257a] text-white px-4 py-2 text-center flex items-center">
            ${company.logoBase64 ? `<img width="60" height="50" class="rounded-lg" src="${company.logoBase64}" />` : '<div class="w-[60px] h-[50px]"></div>'}
            <div class="ml-4 mr-auto w-full">
              <h1 class="text-xl font-bold">${company.name}</h1>
              <p class="text-base">${company.receiptTitle}</p>
            </div>
          </div>
  
          <div class="px-6 py-4">
            <div class="grid grid-cols-2 gap-x-10 gap-y-6 mb-4">
              <!-- Company Information -->
              <div>
                <h2 class="md:text-base text-sm font-medium mb-2 border-b pb-1">Company Address & Other Information</h2>
                <div class="grid gap-0"> <!-- Reduced gap for tighter packing -->
                  ${generateInfoItemHtml("Country:", company.country,"text-xs md:text-sm py-1")}
                  ${generateInfoItemHtml("City:", company.city, "text-xs md:text-sm py-1")}
                  ${generateInfoItemHtml("Address:", company.address, "text-xs md:text-sm py-1")}
                  ${generateInfoItemHtml("Postal code:", company.postalCode)}
                  ${generateInfoItemHtml("SWIFT Code:", company.swiftCode)}
                  ${generateInfoItemHtml("Email:", company.email)}
                  ${generateInfoItemHtml("Tel:", company.tel)}
                  ${generateInfoItemHtml("Fax:", company.fax)}
                  ${generateInfoItemHtml("Tfn:", company.tfn)}
                  ${generateInfoItemHtml("VAT Receipt No:", company.vatReceiptNo)}
                  ${generateInfoItemHtml("VAT Registration No:", company.vatRegNo)}
                  ${generateInfoItemHtml("VAT Registration Date:", company.vatRegDate)}
                </div>
              </div>
  
              <!-- Customer Information -->
              <div>
                <h2 class="md:text-base text-sm font-medium mb-2 border-b pb-1">Customer Information</h2>
                <div class="grid grid-cols-1 gap-0">
                  ${generateInfoItemHtml("Customer Name:", customer.name)}
                  ${generateInfoItemHtml("Region:", customer.region)}
                  ${generateInfoItemHtml("City:", customer.city)}
                  ${generateInfoItemHtml("Sub City:", customer.subCity)}
                  ${generateInfoItemHtml("Wereda/Kebele:", customer.weredaKebele)}
                  ${generateInfoItemHtml("VAT Registration No:", customer.vatRegNo)}
                  ${generateInfoItemHtml("VAT Registration Date:", customer.vatRegDate)}
                  ${generateInfoItemHtml("TIN (TAX ID):", customer.tin)}
                  ${generateInfoItemHtml("Branch:", customer.branch)}
                </div>
              </div>
            </div>
  
            <!-- Payment Information -->
            <div class="mb-4 border-t">
              <h2 class="md:text-base text-sm font-medium py-2 text-center">Payment / Transaction Information</h2>
              <div class="border rounded-md overflow-hidden p-4 flex flex-col gap-1"> <!-- Reduced gap -->
                ${generateInfoItemHtml("Payer:", payment.payer, "border-b text-sm md:text-base py-1", true)}
                ${generateInfoItemHtml("Account:", payment.payerAccount, "border-b text-sm md:text-base py-1", true)}
                ${generateInfoItemHtml("Receiver:", payment.receiver, "border-b text-sm md:text-base py-1", true)}
                ${generateInfoItemHtml("Account:", payment.receiverAccount, "border-b text-sm md:text-base py-1", true)}
                ${generateInfoItemHtml("Payment Date & Time:", payment.dateTime, "border-b text-sm md:text-base py-1", true)}
                ${generateInfoItemHtml("Reference No. (VAT Invoice No):", payment.referenceNo, "border-b text-sm md:text-base py-1", true)}
                ${generateInfoItemHtml("Reason / Type of service:", payment.reason, "border-b text-sm md:text-base py-1", true)}
                ${generateInfoItemHtml("Transferred Amount:", payment.amount, "border-b text-sm md:text-base py-1", true)}
                ${generateInfoItemHtml("Commission or Service Charge:", payment.commission, "border-b text-sm md:text-base py-1", true)}
                ${generateInfoItemHtml("15% VAT on Commission:", payment.vatOnCommission, "border-b text-sm md:text-base py-1", true)}
                <div class="pt-1">
                  ${generateInfoItemHtml("Total amount debited from customer's account:", payment.totalDebited, "text-sm md:text-base font-semibold", true)}
                </div>
              </div>
            </div>
  
            <!-- Amount in Words -->
            <div class="bg-gray-100 p-3 rounded-lg text-center mb-4">
              <p class="font-semibold text-gray-700 text-sm">Amount in Word:</p>
              <p class="text-black text-xs">${amountInWords}</p>
            </div>
  
            <!-- Footer -->
            <div class="text-center text-gray-600 pt-4 border-t text-sm">
              <p class="font-semibold text-[#83257a]">The Bank you can always rely on.</p> <!-- Using a standard blue -->
              <p> © ${new Date().getFullYear()} ${company.name}. All rights reserved.</p>
            </div>
          </div>
        </div>
      </body>
      </html>
    `;
  }