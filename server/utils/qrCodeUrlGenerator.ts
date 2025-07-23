import { computed } from "vue";
import { useRoute } from "vue-router"; // Or from 'nuxt/app' if using Nuxt 3

// Dynamic QR code URL
export const qrCodeUrl = computed(() => {
  const route = useRoute();
  let idForQr = "";

  const transactionIdFromRoute = route.params.id as string;
  if (transactionIdFromRoute) {
    idForQr = transactionIdFromRoute;
  }

  if (!idForQr) return ""; // No ID available for QR code

  // Ensure the base URL for your receipt viewer is correct
  const receiptViewerUrl = `${__HOME_URL__}/${idForQr}`;
  return `https://api.qrserver.com/v1/create-qr-code/?data=${receiptViewerUrl}`;
  
});
