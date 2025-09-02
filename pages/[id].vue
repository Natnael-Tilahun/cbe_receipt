<template>
  <div class="min-h-screen bg-gray-100 p-2 md:p-4 flex flex-col items-center">
    <!-- Loading State -->
    <!-- Loading state -->
    <div v-if="isLoading" class="flex items-center justify-center min-h-screen">
      <div class="animate-spin rounded-full h-14 w-14 border-b-8 border-[#83257a]"></div>
    </div>

    <!-- Error State -->
    <div v-if="error" class="fixed inset-0 flex items-center justify-center z-50">
      <div class="bg-white border-t-8 border-red-500 shadow-2xl rounded-xl px-8 py-10 max-w-md w-full text-center animate-fade-in">
        <div class="flex justify-center mb-4">
          <!-- Error Icon -->
          <svg class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <circle cx="12" cy="12" r="10" stroke-width="2" class="text-red-200" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 9l-6 6m0-6l6 6" />
          </svg>
        </div>
        <h2 class="md:text-2xl text-xl font-bold text-red-500 mb-2">Oops! Something went wrong</h2>
        <p class="text-gray-700 mb-6 text-sm md:text-base">{{ error }}</p>
        <Button
          @click="fetchReceiptData"
          :disabled="isLoading"
          class="w-full bg-[#83257a] hover:bg-[#6d2066] text-white font-semibold py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
        >
          <svg v-if="isLoading" class="h-5 w-5 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z"></path>
          </svg>
          <span v-if="isLoading">Retrying...</span>
          <span v-else>Try Again</span>
        </Button>
      </div>
    </div>

    <!-- Receipt Display -->
    <div v-if="receiptData && !isLoading"
      class="w-full max-w-3xl bg-white text-black shadow-lg rounded-lg overflow-hidden md:mb-20">
      <!-- Receipt Header -->
      <div class="bg-[#83257a] print:bg-[#83257a] text-white p-1 md:p-4 text-center flex items-center">
        <img v-if="company.logoBase64" class="rounded-lg md:w-[60px] md:h-[50px] w-[40px] h-[40px]" :src="company.logoBase64"
          alt="Company Logo" />
        <div v-else class="w-[60px] h-[50px] bg-gray-500 rounded-lg flex items-center justify-center text-xs">No Logo
        </div>
        <div class="w-full">
          <h1 class="md:text-2xl text-lg font-bold">{{ company.name }}</h1>
          <p class="md:text-lg text-sm">{{ company.receiptTitle }}</p>
        </div>
      </div>

      <div class="md:px-6 p-4">
        <div class="grid grid-cols-2 gap-x-5 md:gap-x-10 md:gap-y-6 mb-3 md:mb-6">
          <!-- Company Information -->
          <div>
            <h2 class="md:text-base text-[11px] font-semibold mb-1 md:mb-2 border-b md:pb-1">Company Address & Other Information</h2>
            <div class="grid gap-1 md:gap-2">
              <InfoItem label="Country:" :value="company.country" itemClass="text-[10px] md:text-sm space-x-2" />
              <InfoItem label="City:" :value="company.city" itemClass="text-[10px] md:text-sm" />
              <InfoItem label="Address:" :value="company.address" itemClass="text-[10px] md:text-sm" />
              <InfoItem label="Postal code:" :value="company.postalCode" itemClass="text-[10px] md:text-sm " />
              <InfoItem label="SWIFT Code:" :value="company.swiftCode" itemClass="text-[10px] md:text-sm " />
              <InfoItem label="Email:" :value="company.email" itemClass="text-[10px] md:text-sm " />
              <InfoItem label="Tel:" :value="company.tel" itemClass="text-[10px] md:text-sm " />
              <InfoItem label="Fax:" :value="company.fax" itemClass="text-[10px] md:text-sm " />
              <InfoItem label="Tin:" :value="company.tfn" itemClass="text-[10px] md:text-sm " />
              <InfoItem label="VAT Receipt No:" :value="company.vatReceiptNo" itemClass="text-[10px] md:text-sm " />
              <InfoItem label="VAT Registration No:" :value="company.vatRegNo" itemClass="text-[10px] md:text-sm " />
              <InfoItem label="VAT Registration Date:" :value="company.vatRegDate" itemClass=" text-[10px] md:text-sm " />
            </div>
          </div>
          <!-- Customer Information -->
          <div>
            <h2 class="md:text-base text-[11px] font-semibold mb-1 md:mb-2 border-b md:pb-1">Customer Information</h2>
            <div class="grid grid-cols-1 gap-1 md:gap-2">
              <InfoItem label="Customer Name:" :value="receiptData.customer.name" itemClass=" text-[10px] md:text-sm gap-0" />
              <InfoItem label="Region:" :value="receiptData.customer.region" itemClass="text-[10px] md:text-sm gap-0" />
              <InfoItem label="City:" :value="receiptData.customer.city" itemClass="text-[10px] md:text-sm gap-0" />
              <InfoItem label="Sub City:" :value="receiptData.customer.subCity" itemClass="text-[10px] md:text-sm gap-0" />
              <InfoItem label="Wereda/Kebele:" :value="receiptData.customer.weredaKebele"
                itemClass="text-[10px] md:text-sm gap-0" />
              <InfoItem label="VAT Registration No:" :value="receiptData.customer.vatRegNo"
                itemClass="text-[10px] md:text-sm gap-0" />
              <InfoItem label="VAT Registration Date:" :value="receiptData.customer.vatRegDate"
                itemClass="text-[10px] md:text-sm gap-0" />
              <InfoItem label="TIN (TAX ID):" :value="receiptData.customer.tin" itemClass="text-[10px] md:text-sm gap-0" />
              <InfoItem label="Branch:" :value="receiptData.customer.branch" itemClass="text-[10px] md:text-sm gap-0" />
            </div>
          </div>
        </div>

        <!-- Payment Information -->
        <div class="md:mb-4 mb-2 border rounded-md relative md:py-2">
          <h2 class="md:text-lg text-sm font-semibold py-1 md:py-2 px-4  text-center border-b m-0">Payment / Transaction
            Information</h2>
          <div class=" overflow-hidden flex flex-col md:gap-1">
            <InfoItem label="Payer:" :value="receiptData.payment.payer"
              itemClass="border-b text-[10px] md:text-base py-2 md:py-2 px-4" :fullWidth="true" />
            <InfoItem label="Account:" :value="receiptData.payment.payerAccount"
              itemClass="border-b text-[10px] md:text-base py-2 md:py-2 px-4" :fullWidth="true" />
            <InfoItem label="Receiver:" :value="receiptData.payment.receiver"
              itemClass="border-b text-[10px] md:text-base py-2 md:py-2 px-4" :fullWidth="true" />
            <InfoItem label="Account:" :value="receiptData.payment.receiverAccount"
              itemClass="border-b text-[10px] md:text-base py-2 md:py-2 px-4" :fullWidth="true" />
            <InfoItem label="Payment Date & Time:" :value="receiptData.payment.dateTime"
              itemClass="border-b text-[10px] md:text-base py-2 md:py-2 px-4" :fullWidth="true" />
            <InfoItem label="Reference No. (VAT Invoice No):" :value="receiptData.payment.referenceNo"
              itemClass="border-b text-[10px] md:text-base py-2 md:py-2 px-4" :fullWidth="true" />
            <InfoItem label="Reason / Type of service:" :value="receiptData.payment.reason"
              itemClass="border-b text-[10px] md:text-base py-2 md:py-2 px-4" :fullWidth="true" />
            <InfoItem label="Transferred Amount:" :value="receiptData.payment.amount"
              itemClass="border-b text-[10px] md:text-base py-2 md:py-2 px-4" :fullWidth="true" />
            <InfoItem label="Commission or Service Charge:" :value="receiptData.payment.commission"
              itemClass="border-b text-[10px] md:text-base py-2 md:py-2 px-4" :fullWidth="true" />
            <InfoItem label="15% VAT on Commission:" :value="receiptData.payment.vatOnCommission"
              itemClass="border-b text-[10px] md:text-base py-2 md:py-2 px-4" :fullWidth="true" />
            <div class="md:pt-2">
              <InfoItem label="Total amount debited from customer's account:" :value="receiptData.payment.totalDebited"
                itemClass="text-xs md:text-base font-semibold py-2 md:py-2 px-4" :fullWidth="true" />
            </div>
          </div>
          <img v-if="company.logoBase64" width="200" height="200"
            class="absolute md:top-[35%] md:left-[40%] top-[50%] left-[22%]  z-40" src="/cbestamp.png"
            alt="Company Stamp" />
        </div>

        <!-- Amount in Words -->
        <div class="flex flex-col md:flex-row items-center justify-between border md:p-0 md:px-4 md:gap-4 rounded-md">
          <div class="bg-gray-100 p-1 md:p-2 rounded-lg text-center h-fit w-full">
            <p class="font-semibold text-xs md:text-base">Amount in Word:</p>
            <p class="text-gray-800 text-xs md:text-sm">{{ receiptData.amountInWords }}</p>
          </div>
          <UiCard class="md:w-24 md:h-24 h-16 w-16 flex justify-center items-center place-self-center my-2 bg-gray-50 dark:bg-white"
            v-if="qrCodeUrl">
            <img :src="qrCodeUrl" alt="QR Code" />
          </UiCard>
        </div>


        <!-- Footer -->
        <div class="text-center text-gray-600 md:pt-4 pt-2 border-t">
          <p class="font-semibold text-[#83257a] text-xs md:text-base">The Bank you can always rely on.</p>
          <p class="md:text-sm text-[10px]">© {{ new Date().getFullYear() }} {{ company.name }}. All rights reserved.</p>
        </div>
      </div>
    </div>

    <!-- Action Buttons -->
    <div class="flex gap-4 fixed bottom-5 z-10">
      <Button class="bg-[#83257a] text-white " v-if="!error && !isLoading" @click="downloadGeneratedPDF" :disabled="isDownloadingPDF || !receiptData || isLoading">
        <span v-if="isDownloadingPDF">Generating PDF...</span>
        <span v-else class="z-50">Download PDF</span>
      </Button>
    </div>
    <!-- <p v-if="error && !isLoading" class="text-red-500 mt-4 fixed bottom-20">{{ error }}</p> -->
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router'; // Or from 'nuxt/app' if using Nuxt 3

// Assuming these components are in ~/components/ or similar accessible path
import InfoItem from '~/components/infoItem.vue';
import Button from '~/components/ui/button/Button.vue';
import { amountToWords } from '~/server/utils/currencyFormatter';
import type { CBEReceiptData } from '~/types';
import { qrCodeUrl } from '~/server/utils/qrCodeUrlGenerator';
import { getQRCodeBase64 } from '~/server/utils/getQRCodeBase64';
import { maskAccountNumber } from '~/server/utils/maskAccountNumber';

const qrCodeBase64 = ref<any>('');
const mappedData = ref<CBEReceiptData>()

// Static company data - can be moved to a separate config file if needed
const company = {
  name: "Commercial Bank of Ethiopia",
  receiptTitle: "Customer Receipt",
  logoBase64: "/cbe.png", // Ensure this path is correct (e.g., in public folder)
  country: "Ethiopia",
  city: "Addis Ababa",
  address: "P.O. Box 255, Churchill Road",
  postalCode: "1000",
  swiftCode: "CBETETAA",
  email: "info@cbe.com.et",
  tel: "+251-11-551-5004",
  fax: "+251-11-551-4522",
  tfn: "000123456",
  vatReceiptNo: `VRN-${Math.floor(Math.random() * 100000)}`, // Consider if this should be static or from API
  vatRegNo: "001234567-8",
  vatRegDate: "2010-01-15",
};

const receiptData = ref<CBEReceiptData | null>(null);
const isLoading = ref(true); // True initially for fetching data
const error = ref<string | null>(null);
const isDownloadingPDF = ref(false); // Separate state for PDF download

const route = useRoute();

// --- Helper Functions for API Data Mapping ---
const formatAmount = (amount?: number | string, currency: string = "ETB"): string => {
  if (amount === undefined || amount === null || amount === '') return "0.00 " + currency; // Or "N/A"
  const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
  if (isNaN(numAmount)) return "0.00 " + currency; // Or "N/A"
  return `${numAmount.toFixed(2)} ${currency}`;
};

const formatDate = (isoString?: string): string => {
  if (!isoString) return "N/A";
  try {
    const date = new Date(isoString);
    // Example: "Dec 9, 2021, 11:18 AM"
    return date.toLocaleString('en-US', { // Consider 'am-ET' for Amharic locale if dates are localized
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    });
  } catch (e) {
    console.warn("Invalid date string for formatting:", isoString, e);
    return isoString; // Return original if formatting fails
  }
};

// --- API Data Mapping Function ---
const mapApiResponseToReceiptData = async(apiResponse: any): Promise<CBEReceiptData> => {
  // Extract the transaction data
  const txData = apiResponse;

  let idForQr = "";
  if (route.params.id as string) {
    idForQr = route.params.id as string;
  }
  if (idForQr){
  qrCodeBase64.value = await getQRCodeBase64(idForQr);
  }

  if (!txData) {
    throw new Error("API response data is missing or malformed.");
  }

  // Format the date from YYYYMMDD format
  const formatTransactionDate = (dateStr: string) => {
    if (!dateStr) return "N/A";
    try {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const date = new Date(`${year}-${month}-${day}`);
      return date.toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch (e) {
      console.warn("Invalid date string for formatting:", dateStr, e);
      return "N/A";
    }
  };

  // Format the time from HHMMSS format
  const formatTransactionTime = (timeStr: string) => {
    if (!timeStr) return "N/A";
    try {
      const hour = timeStr.substring(0, 2);
      const minute = timeStr.substring(2, 4);
      const second = timeStr.substring(4, 6);
      return `${hour}:${minute}:${second}`;
    } catch (e) {
      return "N/A";
    }
  };

  // Combine date and time
  const transactionDateTime = txData.dateTimes?.[0]
    ? `${formatTransactionDate(txData.processingDate)} ${formatTransactionTime(txData.dateTimes[0])}`
    : formatTransactionDate(txData.processingDate);

  let numericAmountForWords: number | undefined;
  if (txData.amountDebited !== undefined) {
    numericAmountForWords = parseFloat(txData.amountDebited);
  }

  mappedData.value = {
    company: company,
    customer: {
      name: txData.debitAccountHolder || "N/A",
      // These fields are not available in the API response, so we'll set them to undefined
      region: undefined,
      city: undefined,
      subCity: undefined,
      weredaKebele: undefined,
      vatRegNo: undefined,
      vatRegDate: undefined,
      tin: undefined,
      branch: undefined,
    },
    payment: {
      payer: txData.debitAccountHolder || "N/A",
      payerAccount: maskAccountNumber(txData.debitAccountNo),
      receiver: txData.creditAccountHolder || "N/A",
      receiverAccount: maskAccountNumber(txData.creditAccountNo),
      dateTime: transactionDateTime,
      referenceNo: txData.id || "N/A",
      reason: txData.paymentDetails?.[0] || "N/A",
      amount: formatAmount(txData.amountDebited, txData.debitCurrency),
      commission: formatAmount(txData.totalChargeAmount, txData.debitCurrency),
      vatOnCommission: formatAmount(txData.totalTaxAmount, txData.debitCurrency),
      totalDebited: formatAmount(txData.amountDebited, txData.debitCurrency),
    },
    amountInWords: numericAmountForWords !== undefined && !isNaN(numericAmountForWords)
      ? amountToWords(numericAmountForWords, "ETB", "cents")
      : "N/A", // This field is not available in the API response
    qrCodeBase64: qrCodeBase64.value
  };

  return mappedData.value;
};

// --- Fetch Receipt Data ---
async function fetchReceiptData() {
  isLoading.value = true;
  error.value = null;
  receiptData.value = null; // Clear previous data
  // IMPORTANT: Ensure 'id' is the correct route parameter name for the transaction ID
  const transactionId = route.params.id as string;
  if (!transactionId) {
    error.value = "Transaction ID is missing from the URL (route.params.id).";
    isLoading.value = false;
    return;
  }

  const apiUrl = `${__API_BASE_URL__}/api/v1/transactions/public/transaction-detail/${transactionId}`;
  const headers: Record<string, string> = {
    'X-App-ID': __X_APP_ID__,
    'X-App-Version': __X_APP_VERSION__,
  };

  try {
    const responseData = await $fetch(apiUrl, {
      method: 'GET',
      headers: headers,
    });

    // Map the API response to the CBEReceiptData structure
    receiptData.value = await mapApiResponseToReceiptData(responseData);

  } catch (err: any) {
    console.error('Error fetching receipt data:', err);
    console.log("error: ", err.message)
    let errorMessage = 'Failed to fetch receipt details. Please try again.';
    if (err.data && err.data.detail) { // Specific to $fetch errors
      errorMessage = `${err.data.detail}`;
    } else if (err.data && err.data.message) {
      errorMessage = err.data.message;
    }
    // else if(err.message){
    //   errorMessage = err.message
    // }
    error.value = errorMessage;
  } finally {
    isLoading.value = false;
  }
}

onMounted(async() => {
  await fetchReceiptData();
});



// --- PDF Download Function (mostly unchanged) ---
async function downloadGeneratedPDF() {
  if (!receiptData.value) {
    error.value = "No receipt data available to generate PDF.";
    return;
  }
  isDownloadingPDF.value = true;

  try {
    const response = await fetch('/api/generate-receipt', { // Your existing PDF generation API
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(receiptData.value),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred during PDF generation' }));
      throw new Error(`Failed to generate PDF: ${response.statusText} - ${errorData.message || errorData.error || ''}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CBE-Receipt-${receiptData.value.payment.referenceNo || Date.now()}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    a.remove();

  } catch (err: any) {
    console.error('Error downloading receipt PDF:', err);
    error.value = err.message || 'An unexpected error occurred while generating the PDF.'; // This will overwrite fetch errors
  } finally {
    isDownloadingPDF.value = false;
  }
}


</script>

<style scoped>
/* Add print-specific styles here if needed for the "Print Preview" button */
@media print {
  body {
    background-color: white !important;
    /* Ensure background is white for print */
  }

  .fixed.bottom-5 {
    /* Hide action buttons when printing */
    display: none !important;
  }

  .min-h-screen.bg-gray-100 {
    /* Remove page background and padding for print */
    background-color: transparent !important;
    padding: 0 !important;
    margin: 0 !important;
  }

  .shadow-lg {
    box-shadow: none !important;
  }

  /* Ensure the receipt itself takes full width */
  .w-full.max-w-3xl {
    max-width: 100% !important;
    width: 100% !important;
    margin: 0 !important;
  }
}

@keyframes fade-in {
  from { opacity: 0; transform: translateY(20px);}
  to { opacity: 1; transform: translateY(0);}
}
.animate-fade-in {
  animation: fade-in 0.4s cubic-bezier(0.4,0,0.2,1);
}
</style> 