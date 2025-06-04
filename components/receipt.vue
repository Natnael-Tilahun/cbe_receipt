<template>
    <div class="min-h-screen bg-gray-100 p-4 flex flex-col items-center relative">
        <div class="w-full max-w-3xl bg-white text-black shadow-sm rounded-lg overflow-hidden">
            <!-- Receipt Header -->
            <div class="bg-primary print:bg-black text-white p-4 text-center flex items-center">
                <img width="60" height="50" class="rounded-lg" src="/public/cbelogo1.jpeg" />
                <div class="mr-auto w-full">
                    <h1 class="text-2xl font-bold">Commercial Bank of Ethiopia</h1>
                    <p class="text-lg">VAT Invoice / Customer Receipt</p>
                </div>
            </div>

            <div class="p-6 grid grid-cols-1 gap-8">
                <div class="grid grid-cols-2 gap-10">
                    <!-- Company Information -->
                    <div class="mb-">
                        <h2 class="md:text-base text-sm font-medium mb-2 border-b pb-1">Company Address & Other Information</h2>
                        <div class="grid gap-1">
                            <InfoItem label="Country:" :value="company.country" />
                            <InfoItem label="City:" :value="company.city" />
                            <InfoItem label="Address:" :value="company.address" />
                            <InfoItem label="Postal code:" :value="company.postalCode" />
                            <InfoItem label="SWIFT Code:" :value="company.swiftCode" />
                            <InfoItem label="Email:" :value="company.email" />
                            <InfoItem label="Tel:" :value="company.tel" />
                            <InfoItem label="Fax:" :value="company.fax" />
                            <InfoItem label="Tfn:" :value="company.tfn" />
                            <InfoItem label="VAT Receipt No:" :value="company.vatReceiptNo" />
                            <InfoItem label="VAT Registration No:" :value="company.vatRegNo" />
                            <InfoItem label="VAT Registration Date:" :value="company.vatRegDate" />
                        </div>
                    </div>

                    <!-- Customer Information -->
                    <div class="mb-">
                        <h2 class="md:text-base text-sm font-medium mb-2 border-b pb-1">Customer Information</h2>
                        <div class="grid grid-cols-1 gap-1">
                            <InfoItem label="Customer Name:" :value="customer.name" />
                            <InfoItem label="Region:" :value="customer.region" />
                            <InfoItem label="City:" :value="customer.city" />
                            <InfoItem label="Sub City:" :value="customer.subCity" />
                            <InfoItem label="Wereda/Kebele:" :value="customer.weredaKebele" />
                            <InfoItem label="VAT Registration No:" :value="customer.vatRegNo" />
                            <InfoItem label="VAT Registration Date:" :value="customer.vatRegDate" />
                            <InfoItem label="TIN (TAX ID):" :value="customer.tin" />
                            <InfoItem label="Branch:" :value="customer.branch" />
                        </div>
                    </div>
                </div>

                <!-- Divider -->
                <!-- <div class="border-t border-gray-300 col-span-full"></div> -->

                <!-- Payment Information -->
                <div class="mb-4 col-span-full rounded-md relative py-2">
                    <h2 class="text-lg font-medium py-2 text-center">Payment / Transaction Information</h2>
                    <div class="border rounded-lg overflow-hidden p-4 flex flex-col gap-3">
                        <InfoItem label="Payer:" class="border-b text-sm md:text-base" :value="payment.payer" :fullWidth="true" />
                        <InfoItem label="Account:" class="border-b text-sm md:text-base" :value="payment.payerAccount"
                            :fullWidth="true" />
                        <InfoItem label="Receiver:" class="border-b text-sm md:text-base" :value="payment.receiver"
                            :fullWidth="true" />
                        <InfoItem label="Account:" class="border-b text-sm md:text-base" :value="payment.receiverAccount"
                            :fullWidth="true" />
                        <InfoItem label="Payment Date & Time:" class="border-b text-sm md:text-base" :value="payment.dateTime"
                            :fullWidth="true" />
                        <InfoItem label="Reference No. (VAT Invoice No):" class="border-b text-sm md:text-base"
                            :value="payment.referenceNo" :fullWidth="true" />
                        <InfoItem label="Reason / Type of service:" class="border-b text-sm md:text-base" :value="payment.reason"
                            :fullWidth="true" />
                        <InfoItem label="Transferred Amount:" class="border-b text-sm md:text-base" :value="payment.amount"
                            :fullWidth="true" />
                        <InfoItem label="Commission or Service Charge:" class="border-b text-sm md:text-base"
                            :value="payment.commission" :fullWidth="true" />
                        <InfoItem label="15% VAT on Commission:" class="border-b text-sm md:text-base"
                            :value="payment.vatOnCommission" :fullWidth="true" />
                        <div class=" border-gray-300 font-semibold pt-2">
                            <InfoItem label="Total amount debited from customers account:" class="md:text-base text-sm" :value="payment.totalDebited"
                                :fullWidth="true" />
                        </div>
                    </div>
                    <img
            v-if="receiptData.company.logoBase64"
            width="200"
            height="200"
            class="absolute md:top-[35%] md:left-[35%] top-[35%] left-[25%] z-50"
            src="/cbestamp.png"
            alt="Company Logo"
          />
                </div>

                <!-- Amount in Words -->
                <div class="flex flex-col md:flex-row items-center justify-between border p-2 md:p-0 md:px-4 md:gap-4">
                <div class="bg-gray-100 p-3 rounded-lg text-center mb-4 text-sm h-fit w-full">
                    <p class="font-semibold">Amount in Word:</p>
                    <p>{{ amountInWords }}</p>
                </div>
                <UiCard
              class="w-24 h-24 flex justify-center items-center  place-self-center my-2 bg-gray-50 dark:bg-white"
              v-if="receiptData"
            >
              <img
                :src="`https://api.qrserver.com/v1/create-qr-code/?data=https://cbe-receipt.vercel.app/receipt-generator?id=FT21343Z9J67-150744672`"
                alt="QR Code"
              />
            </UiCard>
           </div>

                <!-- Footer -->
                <div class="text-center text-sm">
                    <p class="font-semibold text-primary">The Bank you can always rely on.</p>
                    <p class="text-xs">© {{ new Date().getFullYear() }} Commercial Bank of Ethiopia. All rights
                        reserved.</p>
                </div>
            </div>
        </div>

        <div class="flex gap-4 fixed bottom-5 ">
            <Button @click="printReceipt" class="bg-green-700 hover:bg-green-800 text-white">
                Print Receipt
            </button>
            <Button @click="downloadPDF">
                Download PDF
            </Button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import InfoItem from './infoItem.vue';
import Button from './ui/button/Button.vue';


// Sample data structure
const company = ref({
    country: 'Ethiopia',
    city: 'Addis Ababa',
    address: 'Ras Desta Damtew St, 01, Kirkos',
    postalCode: '255',
    swiftCode: 'CBETE TAA',
    email: 'info@cbe.com.et',
    tel: '251-551-50-04',
    fax: '251-551-45-22',
    tfn: '0000006966',
    vatReceiptNo: 'FT251504L8SH',
    vatRegNo: '011140',
    vatRegDate: '01/01/2003'
});

const customer = ref({
    name: 'NATNAEL TILAHUN ASSEFA',
    region: '',
    city: 'ARADAWOREDA.8',
    subCity: '',
    weredaKebele: '',
    vatRegNo: '',
    vatRegDate: '20191212',
    tin: '',
    branch: 'SEMEN GEBEYA BRANCH'
});

const payment = ref({
    payer: 'NATNAEL TILAHUN ASSEFA',
    payerAccount: '1****5596',
    receiver: 'SAMUEL ZEBIB ABREHA',
    receiverAccount: '1****9359',
    dateTime: '5/30/2025, 1:46:00 PM',
    referenceNo: 'FT251504L8SH',
    reason: 'lunch done via Mobile',
    amount: '100.00 ETB',
    commission: '0.00 ETB',
    vatOnCommission: '0.00 ETB',
    totalDebited: '100.00 ETB'
});

const amountInWords = ref('ETB One Hundred & Zero cents');

// Print function
const printReceipt = () => {
    window.print();
};

// PDF download function (placeholder)
const downloadPDF = () => {
    alert('PDF download functionality would be implemented here');
};
</script>

<style scoped>
@media print {
    body {
        background: white;
        margin: 0;
        padding: 0;
        color: black;
    }

    .max-w-2xl {
        max-width: 100% !important;
        box-shadow: none !important;
        margin: 0 !important;
        padding: 0 !important;
    }

    button {
        display: none !important;
    }
}
</style>