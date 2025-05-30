<template>
    <div class="min-h-screen bg-gray-100 p-4 flex flex-col items-center">
      <div v-if="receiptData" class="w-full max-w-3xl bg-white text-black shadow-lg rounded-lg overflow-hidden mb-20">
        <!-- Receipt Header -->
        <div class="bg-primary print:bg-primary text-white p-4 text-center flex items-center">
          <img
            v-if="receiptData.company.logoBase64"
            width="60"
            height="50"
            class="rounded-lg"
            :src="receiptData.company.logoBase64"
            alt="Company Logo"
          />
          <div v-else class="w-[60px] h-[50px] bg-gray-500 rounded-lg flex items-center justify-center text-xs">No Logo</div>
          <div class="ml-4 mr-auto w-full">
            <h1 class="text-2xl font-bold">{{ receiptData.company.name }}</h1>
            <p class="text-lg">{{ receiptData.company.receiptTitle }}</p>
          </div>
        </div>
  
        <div class="p-6">
          <div class="grid grid-cols-2 gap-x-10 gap-y-6 mb-6">
            <!-- Company Information -->
            <div>
              <h2 class="md:text-base text-sm font-semibold mb-2 border-b pb-1">Company Address & Other Information</h2>
              <div class="grid gap-1 md:gap-2">
                <InfoItem label="Country:" :value="receiptData.company.country" itemClass="text-xs md:text-sm py-1" />
                <InfoItem label="City:" :value="receiptData.company.city" itemClass="text-xs md:text-sm py-1"/>
                <InfoItem label="Address:" :value="receiptData.company.address" itemClass="text-xs md:text-sm py-1"/>
                <InfoItem label="Postal code:" :value="receiptData.company.postalCode" itemClass="text-xs md:text-sm py-1" />
                <InfoItem label="SWIFT Code:" :value="receiptData.company.swiftCode" itemClass="text-xs md:text-sm py-1" />
                <InfoItem label="Email:" :value="receiptData.company.email" itemClass="text-xs md:text-sm py-1" />
                <InfoItem label="Tel:" :value="receiptData.company.tel" itemClass="text-xs md:text-sm py-1" />
                <InfoItem label="Fax:" :value="receiptData.company.fax" itemClass="text-xs md:text-sm py-1" />
                <InfoItem label="Tfn:" :value="receiptData.company.tfn" itemClass="text-xs md:text-sm py-1"/>
                <InfoItem label="VAT Receipt No:" :value="receiptData.company.vatReceiptNo" itemClass="text-xs md:text-sm py-1"/>
                <InfoItem label="VAT Registration No:" :value="receiptData.company.vatRegNo" itemClass="text-xs md:text-sm py-1" />
                <InfoItem label="VAT Registration Date:" :value="receiptData.company.vatRegDate" itemClass=" text-xs md:text-sm py-1"/>
              </div>
            </div>  
            <!-- Customer Information -->
            <div>
              <h2 class="md:text-base text-sm font-semibold mb-2 border-b pb-1">Customer Information</h2>
              <div class="grid grid-cols-1 gap-1 md:gap-2">
                <InfoItem label="Customer Name:" :value="receiptData.customer.name" itemClass=" text-xs md:text-sm md:py-1"/>
                <InfoItem label="Region:" :value="receiptData.customer.region" itemClass="text-xs md:text-sm md:py-1"/>
                <InfoItem label="City:" :value="receiptData.customer.city" itemClass="text-xs md:text-sm md:py-1"/>
                <InfoItem label="Sub City:" :value="receiptData.customer.subCity" itemClass="text-xs md:text-sm md:py-1"/>
                <InfoItem label="Wereda/Kebele:" :value="receiptData.customer.weredaKebele" itemClass="text-xs md:text-sm md:py-1" />
                <InfoItem label="VAT Registration No:" :value="receiptData.customer.vatRegNo" itemClass="text-xs md:text-sm md:py-1"/>
                <InfoItem label="VAT Registration Date:" :value="receiptData.customer.vatRegDate" itemClass="text-xs md:text-sm md:py-1" />
                <InfoItem label="TIN (TAX ID):" :value="receiptData.customer.tin" itemClass="text-xs md:text-sm md:py-1" />
                <InfoItem label="Branch:" :value="receiptData.customer.branch" itemClass="text-xs md:text-sm md:py-1"/>
              </div>
            </div>
          </div>
  
          <!-- Payment Information -->
          <div class="mb-6 border-t pt-4">
            <h2 class="md:text-lg text-base font-semibold py-2 text-center ">Payment / Transaction Information</h2>
            <div class="border rounded-lg overflow-hidden p-4 flex flex-col gap-1">
              <InfoItem label="Payer:" :value="receiptData.payment.payer" itemClass="border-b text-sm md:text-base py-2" :fullWidth="true" />
              <InfoItem label="Account:" :value="receiptData.payment.payerAccount" itemClass="border-b text-sm md:text-base py-2" :fullWidth="true" />
              <InfoItem label="Receiver:" :value="receiptData.payment.receiver" itemClass="border-b text-sm md:text-base py-2" :fullWidth="true" />
              <InfoItem label="Account:" :value="receiptData.payment.receiverAccount" itemClass="border-b text-sm md:text-base py-2" :fullWidth="true" />
              <InfoItem label="Payment Date & Time:" :value="receiptData.payment.dateTime" itemClass="border-b text-sm md:text-base py-2" :fullWidth="true" />
              <InfoItem label="Reference No. (VAT Invoice No):" :value="receiptData.payment.referenceNo" itemClass="border-b text-sm md:text-base py-2" :fullWidth="true" />
              <InfoItem label="Reason / Type of service:" :value="receiptData.payment.reason" itemClass="border-b text-sm md:text-base py-2" :fullWidth="true" />
              <InfoItem label="Transferred Amount:" :value="receiptData.payment.amount" itemClass="border-b text-sm md:text-base py-2" :fullWidth="true" />
              <InfoItem label="Commission or Service Charge:" :value="receiptData.payment.commission" itemClass="border-b text-sm md:text-base py-2" :fullWidth="true" />
              <InfoItem label="15% VAT on Commission:" :value="receiptData.payment.vatOnCommission" itemClass="border-b text-sm md:text-base py-2" :fullWidth="true" />
              <div class="pt-2">
                  <InfoItem label="Total amount debited from customer's account:" :value="receiptData.payment.totalDebited" itemClass="text-sm md:text-base font-semibold" :fullWidth="true" />
              </div>
            </div>
          </div>
  
          <!-- Amount in Words -->
          <div class="bg-gray-100 p-3 rounded-lg text-center mb-6">
            <p class="font-semibold ">Amount in Word:</p>
            <p class="text-gray-800 text-sm">{{ receiptData.amountInWords }}</p>
          </div>
  
          <!-- Footer -->
          <div class="text-center text-xs text-gray-600 pt-4 border-t">
            <p class="font-semibold text-primary">The Bank you can always rely on.</p>
            <p>© {{ new Date().getFullYear() }} {{ receiptData.company.name }}. All rights reserved.</p>
          </div>
        </div>
      </div>
  
      <!-- Action Buttons -->
      <div class="flex gap-4 fixed bottom-5 z-10">
        <Button
          @click="downloadGeneratedPDF"
          :disabled="isLoading"
        >
          <span v-if="isLoading">Generating PDF...</span>
          <span v-else>Download PDF</span>
        </Button>
      </div>
      <p v-if="error" class="text-red-500 mt-4 fixed bottom-20">{{ error }}</p>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref } from 'vue';
import InfoItem from '~/components/infoItem.vue';
import Button from '~/components/ui/button/Button.vue';
import type { CBEReceiptData } from '~/server/api/generate-receipt.post';
  // Import the actual CBEReceiptData type for type safety with your static data
  // import type { CBEReceiptData } from '~/server/utils/receiptHtmlTemplate'; // Adjust path if needed
  // import InfoItem from '~/components/InfoItem.vue'; // Your InfoItem component
  
  // Ensure your logo base64 string is correctly formatted (starts with data:image/[type];base64,...)
  // const sampleLogoBase64 = "url(data:image/jpeg;base64,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)"; // Replace with YOUR actual short base64 string for testing, or leave undefined
  
  const receiptData = ref<CBEReceiptData>({
    company: {
      name: "Commercial Bank of Ethiopia",
      receiptTitle: "VAT Invoice / Customer Receipt",
      logoBase64: "/cbelogo1.jpeg", // Or your actual base64 string
      country: "Ethiopia",
      city: "Addis Ababa",
      address: "P.O. Box 255, Churchill Road",
      postalCode: "1000",
      swiftCode: "CBETETAA",
      email: "info@cbe.com.et",
      tel: "+251-11-551-5004",
      fax: "+251-11-551-4522",
      tfn: "000123456",
      vatReceiptNo: `VRN-${Math.floor(Math.random() * 10000)}`,
      vatRegNo: "001234567-8",
      vatRegDate: "2010-01-15",
    },
    customer: {
      name: "Abebe Kebede PLC",
      region: "Addis Ababa",
      city: "Addis Ababa",
      subCity: "Bole",
      weredaKebele: "Woreda 03, Kebele 05",
      vatRegNo: "987654321-0",
      vatRegDate: "2015-06-20",
      tin: "1000987654",
      branch: "Bole Medhanialem Branch",
    },
    payment: {
      payer: "Abebe Kebede PLC",
      payerAccount: "1000012345678",
      receiver: "Ethiopian Electric Utility",
      receiverAccount: "1000087654321",
      dateTime: new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' }),
      referenceNo: `INV-${new Date().getFullYear()}-${Math.floor(Math.random() * 100000)}`,
      reason: "Electricity Bill Payment",
      amount: "2,500.00 ETB",
      commission: "15.00 ETB",
      vatOnCommission: "2.25 ETB", // 15% of 15.00
      totalDebited: "2,517.25 ETB",
    },
    amountInWords: "Two Thousand Five Hundred Seventeen Ethiopian Birr and Twenty-Five Cents Only",
  });
  
  const isLoading = ref(false);
  const error = ref<string | null>(null);
  
  async function downloadGeneratedPDF() {
    isLoading.value = true;
    error.value = null;
  
    try {
      const response = await fetch('/api/generate-receipt', { // Your existing API endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(receiptData.value), // Send the new data structure
      });
  
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error occurred' }));
        throw new Error(`Failed to generate PDF: ${response.statusText} - ${errorData.message || errorData.error || ''}`);
      }
  
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      // Use a dynamic filename, e.g., from referenceNo or a timestamp
      a.download = `CBE-Receipt-${receiptData.value.payment.referenceNo || Date.now()}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();
  
    } catch (err: any) {
      console.error('Error downloading receipt:', err);
      error.value = err.message || 'An unexpected error occurred.';
    } finally {
      isLoading.value = false;
    }
  }
  
  function printPreview() {
    // This will print the current HTML page content (the preview)
    // You might want to add print-specific styles using @media print {} in your <style> or global CSS
    // to hide buttons or other non-receipt elements.
    window.print();
  }
  
  // TODO: Implement API fetching for receiptData if it's not static
  // onMounted(async () => {
  //   const fetchedData = await $fetch('/api/your-receipt-data-endpoint');
  //   if (fetchedData) receiptData.value = fetchedData;
  // });
  </script>
  
  <style scoped>
  /* Add print-specific styles here if needed for the "Print Preview" button */
  @media print {
    body {
      background-color: white; /* Ensure background is white for print */
    }
    .fixed.bottom-5 { /* Hide action buttons when printing */
      display: none !important;
    }
    .min-h-screen.bg-gray-100 { /* Remove page background and padding for print */
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
  </style>