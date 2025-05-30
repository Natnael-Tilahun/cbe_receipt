<script setup lang="ts">
import { ref } from "vue";
// import type { OtpDTO } from "~/types";

// const { requestTwoFactorAuth, isLoading } = useAuth();
// const { toast } = useToast();

const receiptData = {
    companyInfo: {
        country: "Ethiopia",
        city: "Addis Abeba",
        postalCode: "255",
        swiftCode: "CBETETAA",
        email: "info@cbe.com.et",
        tel: "251-551-50-04",
        fax: "251-551-45-22",
        tin: "0000006966",
        vatReceiptNo: "FT251504L8SH",
        vatRegistrationNo: "011140",
        vatRegistrationData: "01/01/2003"
    },
    customerInfo: {
        customerName: "Natnael Tilahun Assefa",
        region: "Addis Abeba",
        city: "Addis Abeba",
        subCity: "Arada",
        woredaKebele: "04",
        vatRegistrationNo: "-",
        vatRegistrationDate: "-",
        tin: "-",
        branch: "SEMEN GEBEYA BRANCH"
    },
    transactionInfo: {
        payer: "Natnael Tilahun Assefa",
        payerAccount: "1****5596",
        receiver: "Abebe Kebede Chala",
        receiverAccount: "1*****9359",
        paymentDate: "5/30/2025",
        referenceNo: "FT2515004L8SH",
        reason: "gift",
        transferredAmount: "1000.00 ETB",
        commission: "0.00 ETB",
        vat: "0.00 ETB",
        totamAmountDebitedFromCustomersAccount: "1000.00 ETB"

    }
}

const loading = ref(false);
const isError = ref(false);
// const data = ref<OtpDTO>();
// Page Meta Configuration
// definePageMeta({
//   layout: false,
// });

// const generateNewOTP = async () => {
//   try {
//     loading.value = true;
//     const response = await requestTwoFactorAuth("email"); // Call your API function to fetch profile
//     data.value = response ? response : undefined;
//     console.log("New 2fa token; ", response);
//     toast({
//       title: "Two factor token Created",
//       description: "Two factor token created successfully",
//     });
//     navigateTo(`/validate-otp`);
//   } catch (err: any) {
//     console.error("Error creating two factor token:", err);
//     isError.value = true;
//   } finally {
//     loading.value = false;
//   }
// };
</script>

<template>
    <div class="container relative h-[800px] md:h-screen flex justify-center p-6">
        <div class="border md:w-[700px] h-full p-6 flex flex-col items-center">
            <!-- header -->
            <div class="flex gap bg-primary text-white w-full p-4">
                <div class="w-16 h-16 bg-cover bg-center contrast-75" style="background-image: url('/cbelogo1.jpeg')">
                </div>
                <div class="w-full">
                    <h1 class="text-lg font-medium">Commercial Bank of Ethiopia</h1>
                    <p>VAT Invoice / Customer Receipt</p>
                </div>
            </div>
        </div>

    </div>
</template>
